import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
const createPayment = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await PaymentService.createPayment(req.params.donationId, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "bKash payment created successfully",
        data: result,
    });
});
const executePayment = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await PaymentService.executePayment(req.params.donationId, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "bKash payment executed successfully",
        data: result,
    });
});
const bkashCallback = catchAsync(async (req, res) => {
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
    const donation = await PaymentService.executePaymentByPaymentId(paymentID);
    return res.status(httpStatus.OK).json({
        success: true,
        message: "bKash payment callback received",
        paymentID,
        status,
        donationId: donation.id,
    });
});
export const PaymentController = {
    createPayment,
    executePayment,
    bkashCallback,
};
