import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

import type { IRequestUser } from "../auth/auth.interface.js";
import { DonorService } from "./donor.service.js";

const getVerifiedDonationRequests = catchAsync(
	async (req: Request, res: Response) => {
		const user = req.user as unknown as IRequestUser;

		const result = await DonorService.getVerifiedDonationRequests(user);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Verified donation requests retrieved successfully",
			data: result,
		});
	},
);

export const DonorController = {
	getVerifiedDonationRequests,
};
