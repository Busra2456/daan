import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DonationService } from "./donation.service";
const createDonation = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await DonationService.createDonation(req.body, user);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Donation created successfully",
        data: result,
    });
});
const getMyDonations = catchAsync(async (req, res) => {
    const user = req.user;
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
