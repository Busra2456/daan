import httpStatus from "http-status";
import config from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
export const auth = (...requiredRoles) => {
    return catchAsync(async (req, _res, next) => {
        const token = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization;
        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not logged in. Please log in to access this resource.");
        }
        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
        if (!verifiedToken.success) {
            throw new AppError(httpStatus.UNAUTHORIZED, verifiedToken.error);
        }
        const { email, name, userId, role } = verifiedToken.data;
        if (!email || !name || !userId || !role) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid authentication token.");
        }
        if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
            throw new AppError(httpStatus.FORBIDDEN, "Forbidden. You don't have permission to access this resource.");
        }
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new AppError(httpStatus.UNAUTHORIZED, "User not found. Please log in again.");
        }
        if (user.email !== email || user.role !== role) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid authentication token.");
        }
        if (user.status === "BLOCKED") {
            throw new AppError(httpStatus.FORBIDDEN, "Your account has been blocked. Please contact support.");
        }
        req.user = {
            email: user.email,
            name: user.name,
            userId: user.id,
            role: user.role,
        };
        next();
    });
};
