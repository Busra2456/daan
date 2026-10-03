import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import type { IRequestUser } from "../auth/auth.interface.js";
import { PaymentService } from "./payment.service.js";
import config from "../../config/index.js";

const createPayment = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;

	const result = await PaymentService.createPayment(
		req.params.donationId as string,
		user,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "bKash payment created successfully",
		data: result,
	});
});

const executePayment = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;

	const result = await PaymentService.executePayment(
		req.params.donationId as string,
		user,
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "bKash payment executed successfully",
		data: result,
	});
});

const bkashCallback = catchAsync(async (req: Request, res: Response) => {
  const { paymentID, status } = req.query;

  if (!paymentID) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Payment ID is missing",
    });
  }

  if (status === "cancel") {
    return res.status(httpStatus.OK).json({
      success: false,
      message: "Payment cancelled",
    });
  }

  if (status === "failure") {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Payment failed",
    });
  }

  const donation = await PaymentService.executePaymentByPaymentId(
    paymentID as string,
  );

  return res.redirect(
    `${config.frontend_url}/donor-dashboard/payment-success?donationId=${donation.id}`,
  );
});

export const PaymentController = {
	createPayment,
	executePayment,
	bkashCallback,
};
