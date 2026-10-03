import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { Role } from "../../generated/prisma/enums.js";
import config from "../config/index.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "./AppError.js";

const seedAdmin = async () => {
	try {
		const existingAdmin = await prisma.user.findUnique({
			where: {
				email: config.admin_email,
			},
		});

		if (existingAdmin) {
			console.log("Admin Already Exists!");
			return;
		}

		const name = config.admin_name;
		const email = config.admin_email;
		const password = config.admin_password;

		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Admin Name, Email, Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const admin = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: Role.ADMIN,
				status: "ACTIVE",
				emailVerified: true,
				isDeleted: false,
			},
		});

		console.log("Admin Created:", admin.email);
	} catch (error) {
		console.log("Error Seeding Admin:", error);
	}
};

const seedDemoUser = async ({
	name,
	email,
	password,
	role,
}: {
	name: string;
	email: string;
	password: string;
	role: Role;
}) => {
	const existingUser = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (existingUser) {
		console.log(`${role} Demo User Already Exists!`);
		return;
	}

	const hashedPassword = await bcrypt.hash(
		password,
		Number(config.bcrypt_salt_rounds),
	);

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
			role,
			status: "ACTIVE",
			emailVerified: true,
			isDeleted: false,
		},
	});

	console.log(`${role} Demo User Created:`, user.email);
};

const seedDemoUsers = async () => {
	const adminEmail = config.demo_admin_email;
	const adminPassword = config.demo_admin_password;

	const donorEmail = config.demo_donor_email;
	const donorPassword = config.demo_donor_password;

	const needyEmail = config.demo_needy_email;
	const needyPassword = config.demo_needy_password;

	if (!adminEmail || !adminPassword) {
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Demo Admin Email or Password Missing In Env File!!!",
		);
	}

	if (!donorEmail || !donorPassword) {
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Demo Donor Email or Password Missing In Env File!!!",
		);
	}

	if (!needyEmail || !needyPassword) {
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"Demo Needy Email or Password Missing In Env File!!!",
		);
	}

	await seedDemoUser({
		name: "Daan Demo Admin",
		email: adminEmail,
		password: adminPassword,
		role: Role.ADMIN,
	});

	await seedDemoUser({
		name: "Daan Demo Donor",
		email: donorEmail,
		password: donorPassword,
		role: Role.DONOR,
	});

	await seedDemoUser({
		name: "Daan Demo Needy",
		email: needyEmail,
		password: needyPassword,
		role: Role.NEEDY,
	});
};

const seed = async () => {
	await seedAdmin();
	await seedDemoUsers();
};

// Run seed
seed()
	.catch((error) => {
		console.error("Seed Error:", error);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});