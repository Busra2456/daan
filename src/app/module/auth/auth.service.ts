import crypto from "node:crypto";
import path from "node:path";
import bcrypt from "bcryptjs";
import ejs from "ejs";
import httpStatus from "http-status";
import type { JwtPayload, SignOptions } from "jsonwebtoken";

import {
	AuthProvider,
	Role,
	UserStatus,
} from "../../../../prisma/src/generated/prisma/enums";

import config from "../../config";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";

import type {
	IForgotPasswordPayload,
	ILoginUserPayload,
	IRegisterUserPayload,
	IRequestUser,
	IResetPasswordPayload,
	IVerifyEmailPayload,
} from "./auth.interface";

const registerUser = async (payload: IRegisterUserPayload) => {
	const {
		name,
		email,
		password,
		phone,
		address,
		imageUrl,
		role = Role.NEEDY,
	} = payload;

	const normalizedEmail = email.trim().toLowerCase();

	// Admin cannot register from public registration API
	if (role === Role.ADMIN) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Admin cannot be registered from this API",
		);
	}

	// Check existing user
	const isUserExists = await prisma.user.findUnique({
		where: {
			email: normalizedEmail,
		},
	});

	if (isUserExists) {
		throw new AppError(
			httpStatus.CONFLICT,
			"User with this email already exists",
		);
	}

	// Hash password
	const hashedPassword = await bcrypt.hash(
		password,
		Number(config.bcrypt_salt_rounds) || 10,
	);

	// OTP will expire after 5 minutes
	const expirationSeconds = 5 * 60;

	// Generate 6 digit OTP
	const otpValue = crypto.randomInt(100000, 1000000).toString();

	const otpKey = `daan-registration-otp:${normalizedEmail}`;

	await redisClient.set(otpKey, otpValue, {
		expiration: {
			type: "EX",
			value: expirationSeconds,
		},
	});

	// ========================================
	// SAVE REGISTRATION DATA IN REDIS
	// ========================================

	const registrationKey = `daan-registration-data:${normalizedEmail}`;

	const registrationData = {
		name,
		email: normalizedEmail,
		password: hashedPassword,
		phone,
		address,
		imageUrl,
		role,
	};

	await redisClient.set(registrationKey, JSON.stringify(registrationData), {
		expiration: {
			type: "EX",
			value: expirationSeconds,
		},
	});

	// ========================================
	// SEND OTP EMAIL
	// ========================================

	const templatePath = path.join(
		process.cwd(),
		"src/app/templates/registration-user-otp.ejs",
	);

	const templateData = {
		name,
		email: normalizedEmail,
		otp: otpValue,
		expirationMinutes: expirationSeconds / 60,
	};

	const html = await ejs.renderFile(templatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: normalizedEmail,
		subject: "Daan - Email Verification",
		html,
	});
};

const verifyEmail = async (payload: IVerifyEmailPayload) => {
	const { otp } = payload;

	const email = payload.email.trim().toLowerCase();

	// ========================================
	// GET OTP FROM REDIS
	// ========================================

	const otpKey = `daan-registration-otp:${email}`;

	const redisOtp = await redisClient.get(otpKey);

	if (!redisOtp) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
	}

	if (redisOtp !== otp) {
		throw new AppError(httpStatus.BAD_REQUEST, "OTP does not match");
	}

	// ========================================
	// GET REGISTRATION DATA FROM REDIS
	// ========================================

	const registrationKey = `daan-registration-data:${email}`;

	const redisRegistrationData = await redisClient.get(registrationKey);

	if (!redisRegistrationData) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Registration data not found or expired",
		);
	}

	const registrationData = JSON.parse(
		redisRegistrationData,
	) as IRegisterUserPayload;

	// ========================================
	// CREATE USER + PROFILE
	// ========================================

	const result = await prisma.$transaction(async (tx) => {
		const user = await tx.user.create({
			data: {
				name: registrationData.name,
				email: registrationData.email,
				password: registrationData.password,
				phone: registrationData.phone,
				address: registrationData.address,
				imageUrl: registrationData.imageUrl,

				role: registrationData.role ?? Role.NEEDY,

				status: UserStatus.ACTIVE,

				authProvider: AuthProvider.CREDENTIAL,

				emailVerified: true,
			},
		});

		// ========================================
		// NEEDY PROFILE
		// ========================================

		if (user.role === Role.NEEDY) {
			await tx.needy.create({
				data: {
					name: registrationData.name,
					phone: registrationData.phone,
					address: registrationData.address,
					userId: user.id,
				},
			});
		}

		// ========================================
		// DONOR PROFILE
		// ========================================

		if (user.role === Role.DONOR) {
			await tx.donor.create({
				data: {
					name: registrationData.name,
					phone: registrationData.phone,
					address: registrationData.address,
					userId: user.id,
				},
			});
		}

		return user;
	});

	// ========================================
	// DELETE REDIS DATA
	// ========================================

	await redisClient.del([otpKey, registrationKey]);

	// ========================================
	// CREATE JWT
	// ========================================

	const jwtPayload = {
		userId: result.id,
		name: result.name,
		email: result.email,
		role: result.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		user: {
			id: result.id,
			name: result.name,
			email: result.email,
			phone: result.phone,
			address: result.address,
			imageUrl: result.imageUrl,
			role: result.role,
			status: result.status,
			authProvider: result.authProvider,
			emailVerified: result.emailVerified,
		},

		accessToken,
		refreshToken,
	};
};

const loginUser = async (payload: ILoginUserPayload) => {
	const { password } = payload;

	const email = payload.email.trim().toLowerCase();

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	// Check blocked user
	if (user.status === UserStatus.BLOCKED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
	}

	// Check deleted user
	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
	}

	// Check email verification
	if (!user.emailVerified) {
		throw new AppError(httpStatus.FORBIDDEN, "Please verify your email first");
	}

	// Google account cannot login with password
	if (!user.password) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"This account does not have a password",
		);
	}

	// Compare password
	const isPasswordMatched = await bcrypt.compare(password, user.password);

	if (!isPasswordMatched) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Invalid credentials");
	}

	// JWT payload
	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			address: user.address,
			imageUrl: user.imageUrl,
			role: user.role,
			status: user.status,
			authProvider: user.authProvider,
			emailVerified: user.emailVerified,
		},

		accessToken,
		refreshToken,
	};
};

const getMe = async (user: IRequestUser) => {
	const isUserExists = await prisma.user.findUnique({
		where: {
			id: user.userId,
		},

		include: {
			needy: true,
			donor: true,
			admin: true,
		},
	});

	if (!isUserExists) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	// Check deleted user
	if (isUserExists.isDeleted || isUserExists.status === UserStatus.DELETED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
	}

	// Check blocked user
	if (isUserExists.status === UserStatus.BLOCKED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
	}

	// Remove password
	const { password, ...userData } = isUserExists;

	return userData;
};

const forgotPassword = async (payload: IForgotPasswordPayload) => {
	const email = payload.email.trim().toLowerCase();

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
	}

	if (!user.emailVerified) {
		throw new AppError(httpStatus.FORBIDDEN, "Please verify your email first");
	}

	if (!user.password) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Google account cannot reset password this way",
		);
	}

	// Generate 6 digit OTP
	const otpValue = crypto.randomInt(100000, 1000000).toString();

	// OTP expires after 5 minutes
	const expirationSeconds = 5 * 60;

	const otpKey = `daan-forgot-password-otp:${email}`;

	await redisClient.set(otpKey, otpValue, {
		expiration: {
			type: "EX",
			value: expirationSeconds,
		},
	});

	const templatePath = path.join(
		process.cwd(),
		"src/app/templates/registration-user-otp.ejs",
	);

	const templateData = {
		name: user.name,
		email,
		otp: otpValue,
		expirationMinutes: expirationSeconds / 60,
	};

	const html = await ejs.renderFile(templatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: email,
		subject: "Daan - Password Reset OTP",
		html,
	});
};

const resetPassword = async (payload: IResetPasswordPayload) => {
	const email = payload.email.trim().toLowerCase();
	const { otp, newPassword } = payload;

	const otpKey = `daan-forgot-password-otp:${email}`;

	const redisOtp = await redisClient.get(otpKey);

	if (!redisOtp) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
	}

	if (redisOtp !== otp) {
		throw new AppError(httpStatus.BAD_REQUEST, "OTP does not match");
	}

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
	}

	const hashedPassword = await bcrypt.hash(
		newPassword,
		Number(config.bcrypt_salt_rounds) || 10,
	);

	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			password: hashedPassword,
			authProvider: AuthProvider.CREDENTIAL,
		},
	});

	// Delete OTP after successful password reset
	await redisClient.del(otpKey);
};

const refreshToken = async (token: string) => {
	const verifiedRefreshToken = jwtUtils.verifyToken(
		token,
		config.jwt_refresh_secret,
	);

	if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
	}

	const data = verifiedRefreshToken.data as JwtPayload;

	const user = await prisma.user.findUnique({
		where: {
			id: data.userId,
		},
	});

	if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"User is inactive or not found",
		);
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

export const AuthService = {
	registerUser,
	verifyEmail,
	loginUser,
	getMe,
	refreshToken,
	forgotPassword,
	resetPassword,
};
