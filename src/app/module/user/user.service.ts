
import httpStatus from "http-status";

import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { IRequestUser } from "../auth/auth.interface.js";

const getAllUsers = async (user: IRequestUser) => {
	if (user.role !== "ADMIN") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only admin can view users",
		);
	}

const users = await prisma.user.findMany({
		where: {
			isDeleted: false,
			email: {
				not: process.env.ADMIN_EMAIL!,
			},
		},
		select: {
			id: true,
			name: true,
			email: true,
			imageUrl: true,
			phone: true,
			address: true,
			role: true,
			status: true,
			authProvider: true,
			emailVerified: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return users;
};

const getUserById = async (
	userId: string,
	user: IRequestUser,
) => {
	if (user.role !== "ADMIN") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only admin can view user details",
		);
	}

	const foundUser = await prisma.user.findFirst({
		where: {
			id: userId,
			isDeleted: false,
		},
		select: {
			id: true,
			name: true,
			email: true,
			imageUrl: true,
			phone: true,
			address: true,
			role: true,
			status: true,
			authProvider: true,
			emailVerified: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!foundUser) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"User not found",
		);
	}

	return foundUser;
};

const updateUserStatus = async (
	userId: string,
	status: "ACTIVE" | "BLOCKED",
	user: IRequestUser,
) => {
	if (user.role !== "ADMIN") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only admin can update user status",
		);
	}

	if (user.userId === userId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Admin cannot change their own status",
		);
	}

	const foundUser = await prisma.user.findFirst({
		where: {
			id: userId,
			isDeleted: false,
		},
	});

	if (!foundUser) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"User not found",
		);
	}

	if (foundUser.role === "ADMIN") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Admin user status cannot be changed",
		);
	}

	const updatedUser = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			status,
		},
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			status: true,
			updatedAt: true,
		},
	});

	return updatedUser;
};

export const UserService = {
	getAllUsers,
	getUserById,
	updateUserStatus,
};
