import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../utils/AppError.js";
import { UserService } from "./user.service.js";

const getCurrentUser = (req: Request) => {
	if (!req.user) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Unauthorized",
		);
	}

	return req.user;
};

const getUserId = (req: Request): string => {
	const userId = req.params.userId;

	if (typeof userId !== "string") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Invalid user ID",
		);
	}

	return userId;
};

const getAllUsers = catchAsync(
	async (req: Request, res: Response) => {
		const user = getCurrentUser(req);

		const result = await UserService.getAllUsers(user);

		res.status(httpStatus.OK).json({
			success: true,
			statusCode: httpStatus.OK,
			message: "Users retrieved successfully",
			data: result,
		});
	},
);

const getUserById = catchAsync(
	async (req: Request, res: Response) => {
		const user = getCurrentUser(req);
		const userId = getUserId(req);

		const result = await UserService.getUserById(
			userId,
			user,
		);

		res.status(httpStatus.OK).json({
			success: true,
			statusCode: httpStatus.OK,
			message: "User retrieved successfully",
			data: result,
		});
	},
);

const updateUserStatus = catchAsync(
	async (req: Request, res: Response) => {
		const user = getCurrentUser(req);
		const userId = getUserId(req);

		const result = await UserService.updateUserStatus(
			userId,
			req.body.status,
			user,
		);

		res.status(httpStatus.OK).json({
			success: true,
			statusCode: httpStatus.OK,
			message: "User status updated successfully",
			data: result,
		});
	},
);

export const UserController = {
	getAllUsers,
	getUserById,
	updateUserStatus,
};