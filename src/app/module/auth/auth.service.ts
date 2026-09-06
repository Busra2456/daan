import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import type { JwtPayload, SignOptions } from "jsonwebtoken";

import config from "../../config";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";

import type {
  ILoginUserPayload,
  IRegisterUserPayload,
  IRequestUser,
} from "./auth.interface";
import { AuthProvider, Role, UserStatus } from "../../../../prisma/src/generated/prisma/enums";

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

  // Create user + profile together
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        address,
        imageUrl,
        role,
        status: UserStatus.ACTIVE,
        authProvider: AuthProvider.CREDENTIAL,
        emailVerified: true,
      },
    });

    if (role === Role.NEEDY) {
      await tx.needy.create({
        data: {
          name,
          phone,
          address,
          userId: user.id,
        },
      });
    }

    if (role === Role.DONOR) {
      await tx.donor.create({
        data: {
          name,
          phone,
          address,
          userId: user.id,
        },
      });
    }

    return user;
  });

  // JWT payload
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
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found",
    );
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User is blocked",
    );
  }

  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User is deleted",
    );
  }

  if (!user.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This account does not have a password",
    );
  }

  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid credentials",
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
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      imageUrl: user.imageUrl,
      role: user.role,
      status: user.status,
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
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found",
    );
  }

  if (
    isUserExists.isDeleted ||
    isUserExists.status === UserStatus.DELETED
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User is deleted",
    );
  }

  if (isUserExists.status === UserStatus.BLOCKED) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "User is blocked",
    );
  }

  const { password, ...userData } = isUserExists;

  return userData;
};

const refreshToken = async (token: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config.jwt_refresh_secret,
  );

  if (
    !verifiedRefreshToken.success ||
    !verifiedRefreshToken.data
  ) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Invalid refresh token",
    );
  }

  const data = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUnique({
    where: {
      id: data.userId,
    },
  });

  if (
    !user ||
    user.isDeleted ||
    user.status !== UserStatus.ACTIVE
  ) {
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
  loginUser,
  getMe,
  refreshToken,
};