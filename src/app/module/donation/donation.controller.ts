import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import type { IRequestUser } from "../auth/auth.interface";
import { DonationService } from "./donation.service";

const createDonation = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;

	const result = await DonationService.createDonation(req.body, user);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Donation created successfully",
		data: result,
	});
});

export const DonationController = {
	createDonation,
};
