import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";
const getPendingDonationRequests = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await AdminService.getPendingDonationRequests(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Pending donation requests retrieved successfully",
        data: result,
    });
});
const verifyDonationRequest = catchAsync(async (req, res) => {
    const user = req.user;
    const requestId = req.params.requestId;
    const result = await AdminService.verifyDonationRequest(requestId, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Donation request verified successfully",
        data: result,
    });
});
const rejectDonationRequest = catchAsync(async (req, res) => {
    const user = req.user;
    const requestId = req.params.requestId;
    const { rejectionReason } = req.body;
    const result = await AdminService.rejectDonationRequest(requestId, rejectionReason, user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Donation request rejected successfully",
        data: result,
    });
});
export const AdminController = {
    getPendingDonationRequests,
    verifyDonationRequest,
    rejectDonationRequest,
};
