import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import type { IRequestUser } from "../auth/auth.interface";
import { DonorService } from "./donor.service";

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
