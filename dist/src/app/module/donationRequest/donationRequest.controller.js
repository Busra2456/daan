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
export const DonationRequestController = {
    createDonationRequest,
};
