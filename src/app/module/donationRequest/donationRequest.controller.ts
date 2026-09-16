import type { Request, Response } from "express";
import httpStatus from "http-status";

import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import type { IRequestUser } from "../auth/auth.interface";
import { DonationRequestService } from "./donationRequest.service";
import { DonationRequestValidation } from "./donationRequest.validation";

const createDonationRequest = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;

		if (!user) {
			throw new AppError(
				httpStatus.UNAUTHORIZED,
				"User information is missing in the request",
			);
		}

		const payload =
			DonationRequestValidation.createDonationRequestZodSchema.parse(req.body);

		const result = await DonationRequestService.createDonationRequest(
			payload,
			user,
		);

		sendResponse(res, {
			statusCode: httpStatus.CREATED,
			success: true,
			message: "Donation request created successfully",
			data: result,
		});
	},
);
const getDonationRequestById = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;

		const result = await DonationRequestService.getDonationRequestById(
			req.params.requestId as string,
			user,
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Donation request retrieved successfully",
			data: result,
		});
	},
);

export const DonationRequestController = {
	createDonationRequest,
	getDonationRequestById,
};
