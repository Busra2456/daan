import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DonationRequestService } from "./donationRequest.service";
import { DonationRequestValidation } from "./donationRequest.validation";
const createDonationRequest = catchAsync(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, "User information is missing in the request");
    }
    const payload = DonationRequestValidation.createDonationRequestZodSchema.parse(req.body);
    const result = await DonationRequestService.createDonationRequest(payload, user);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Donation request created successfully",
        data: result,
    });
});
const getDonationRequestById = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await DonationRequestService.getDonationRequestById(req.params.requestId, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Donation request retrieved successfully",
        data: result,
    });
});
const updateDonationRequest = catchAsync(async (req, res) => {
    const result = await DonationRequestService.updateDonationRequest(req.params.requestId, req.body, req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Donation request updated successfully",
        data: result,
    });
});
const deleteDonationRequest = catchAsync(async (req, res) => {
    await DonationRequestService.deleteDonationRequest(req.params.requestId, req.user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Donation request deleted successfully",
        data: null,
    });
});
export const DonationRequestController = {
    createDonationRequest,
    getDonationRequestById,
    updateDonationRequest,
    deleteDonationRequest
};
