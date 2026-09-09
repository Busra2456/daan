import crypto from "node:crypto";
import path from "node:path";
import bcrypt from "bcryptjs";
import ejs from "ejs";
import httpStatus from "http-status";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { googleClient } from "../../lib/googleAuth";
import {
	AuthProvider,
	Role,
	UserStatus,
} from "../../../generated/prisma/enums";

import config from "../../config";
import { transporter } from "../../lib/nodemailer";
import { redisClient } from "../../lib/redis";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";
import type {
	IForgotPasswordPayload,
	IGoogleLoginPayload,
	ILoginUserPayload,
	IRegisterUserPayload,
	IRequestUser,
	IResetPasswordPayload,
	IVerifyEmailPayload,
} from "./auth.interface";
import { prisma } from "../../lib/prisma";
import { TokenPayload } from "google-auth-library";

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

	const templatePath = path.join(
		process.cwd(),
		"src/app/templates/registration-otp.ejs",
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

	const otpKey = `daan-registration-otp:${email}`;

	const redisOtp = await redisClient.get(otpKey);

	if (!redisOtp) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
	}

	if (redisOtp !== otp) {
		throw new AppError(httpStatus.BAD_REQUEST, "OTP does not match");
	}

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

	await redisClient.del([otpKey, registrationKey]);

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
		"src/app/templates/password-reset-otp.ejs",
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

	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	if (user.status === UserStatus.BLOCKED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
	}

	if (!user.emailVerified) {
		throw new AppError(httpStatus.FORBIDDEN, "User is not verified");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
	}

	if (user.googleId && user.authProvider === AuthProvider.GOOGLE) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"User has an account with Google",
		);
	}

	const otpKey = `daan-forgot-password-otp:${email}`;

	const redisOtp = await redisClient.get(otpKey);

	if (!redisOtp) {
		throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired OTP");
	}

	if (redisOtp !== otp) {
		throw new AppError(httpStatus.BAD_REQUEST, "OTP does not match");
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

	await redisClient.del(otpKey);

	const templatePath = path.join(
		process.cwd(),
		"src/app/templates/reset-password-success.ejs",
	);

	const templateData = {
		name: user.name,
	};

	const html = await ejs.renderFile(templatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: user.email,
		subject: "Password Changed",
		html,
	});
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

const googleLogin = async (payload: IGoogleLoginPayload) => {
	let googleIdTokenPayload: TokenPayload | null | undefined = null;

	// Verify Google ID Token
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: payload.idToken,
			audience: config.google_client_id,
		});

		googleIdTokenPayload = ticket.getPayload();
	} catch (error) {
		console.log("Google ID Token Verification Failed", error);

		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid or expired Google ID token",
		);
	}

	if (!googleIdTokenPayload) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Invalid or expired Google ID token",
		);
	}

	if (!googleIdTokenPayload.email) {
		throw new AppError(httpStatus.BAD_REQUEST, "Google email not found");
	}

	if (!googleIdTokenPayload.name) {
		throw new AppError(httpStatus.BAD_REQUEST, "Google user name not found");
	}

	const email = googleIdTokenPayload.email.trim().toLowerCase();
	const googleId = googleIdTokenPayload.sub;

	// Find existing Google user
	let user = await prisma.user.findUnique({
		where: {
			googleId,
		},
	});

	// If Google user does not exist, find by email
	if (!user) {
		const existingUser = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		// Existing credential account
		if (existingUser) {
			if (!existingUser.emailVerified) {
				throw new AppError(httpStatus.FORBIDDEN, "Email is not verified");
			}

			if (existingUser.status === UserStatus.BLOCKED) {
				throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
			}

			if (
				existingUser.isDeleted ||
				existingUser.status === UserStatus.DELETED
			) {
				throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
			}

			// Link Google account with existing account
			user = await prisma.user.update({
				where: {
					id: existingUser.id,
				},
				data: {
					googleId,
					authProvider: AuthProvider.GOOGLE,
				},
			});
		} else {
			// Create new Google user
			user = await prisma.user.create({
				data: {
					name: googleIdTokenPayload.name,
					email,
					googleId,
					role: Role.NEEDY,
					authProvider: AuthProvider.GOOGLE,
					emailVerified: true,

					needy: {
						create: {
							name: googleIdTokenPayload.name,
						},
					},
				},
			});

			// Welcome email
			const templatePath = path.join(
				process.cwd(),
				"src/app/templates/needy-welcome-email.ejs",
			);

			const templateData = {
				name: user.name,
			};

			const html = await ejs.renderFile(templatePath, templateData);

			await transporter.sendMail({
				from: config.email_sender,
				to: user.email,
				subject: "Welcome To Daan - Donate With Trust",
				html,
			});
		}
	}

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	// Final status checks
	if (user.status === UserStatus.BLOCKED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is blocked");
	}

	if (user.isDeleted || user.status === UserStatus.DELETED) {
		throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
	}

	// Create JWT payload
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
	googleLogin,
};
