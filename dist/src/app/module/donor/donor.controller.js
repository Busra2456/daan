import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DonorService } from "./donor.service";
const getVerifiedDonationRequests = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await DonorService.getVerifiedDonationRequests(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Verified donation requests retrieved successfully",
        data: result,
    });
});
export const DonorController = {
    getVerifiedDonationRequests,
};
