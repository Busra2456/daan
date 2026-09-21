import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

import type { IRequestUser } from "../auth/auth.interface.js";
import { AdminService } from "./admin.service.js";

const getPendingDonationRequests = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;

		const result = await AdminService.getPendingDonationRequests(user);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Pending donation requests retrieved successfully",
			data: result,
		});
	},
);

const verifyDonationRequest = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;

		const requestId = req.params.requestId as string;

		const result = await AdminService.verifyDonationRequest(requestId, user);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Donation request verified successfully",
			data: result,
		});
	},
);

const rejectDonationRequest = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;

		const requestId = req.params.requestId as string;

		const { rejectionReason } = req.body;

		const result = await AdminService.rejectDonationRequest(
			requestId,
			rejectionReason,
			user,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Donation request rejected successfully",
			data: result,
		});
	},
);

export const AdminController = {
	getPendingDonationRequests,
	verifyDonationRequest,
	rejectDonationRequest,
};
