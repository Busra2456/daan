import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

import type { IRequestUser } from "../auth/auth.interface.js";
import { DonationService } from "./donation.service.js";

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

const getMyDonations = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;

	const result = await DonationService.getMyDonations(user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Donation history retrieved successfully",
		data: result,
	});
});

export const DonationController = {
	createDonation,
	getMyDonations,
};
