import type { Request, Response } from "express";
import httpStatus from "http-status";

import config from "../../config/index.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import type { IRequestUser } from "../auth/auth.interface.js";
import { SSLCommerzService } from "./sslcommerz.service.js";

const createPayment = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;

	const result = await SSLCommerzService.createSSLCommerzPayment(
		req.params.donationId as string,
		user,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "SSLCommerz payment created successfully",
		data: result,
	});
});

const success = catchAsync(async (req: Request, res: Response) => {
	const donation = await SSLCommerzService.validateSSLCommerzPayment({
		val_id: req.body.val_id as string | undefined,
		tran_id: req.body.tran_id as string | undefined,
		status: req.body.status as string | undefined,
		amount: req.body.amount as string | undefined,
		currency: req.body.currency as string | undefined,
	});

	return res.redirect(
		`${config.frontend_url}/payment-success?donationId=${donation.id}`,
	);
});

const fail = catchAsync(async (req: Request, res: Response) => {
	await SSLCommerzService.markPaymentAsFailed(
		req.body.tran_id as string | undefined,
	);

	return res.redirect(
		`${config.frontend_url}/payment-failed`,
	);
});

const cancel = catchAsync(async (req: Request, res: Response) => {
	await SSLCommerzService.markPaymentAsFailed(
		req.body.tran_id as string | undefined,
	);

	return res.redirect(
		`${config.frontend_url}/payment-cancelled`,
	);
});

const ipn = catchAsync(async (req: Request, res: Response) => {
	const donation = await SSLCommerzService.validateSSLCommerzPayment({
		val_id: req.body.val_id as string | undefined,
		tran_id: req.body.tran_id as string | undefined,
		status: req.body.status as string | undefined,
		amount: req.body.amount as string | undefined,
		currency: req.body.currency as string | undefined,
	});

	return res.status(httpStatus.OK).json({
		success: true,
		message: "SSLCommerz IPN processed successfully",
		data: {
			donationId: donation.id,
		},
	});
});

export const SSLCommerzController = {
	createPayment,
	success,
	fail,
	cancel,
	ipn,
};