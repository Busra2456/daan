import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
const createDonationRequest = async (payload, user) => {
    // Check whether the authenticated user exists
    const needyUser = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
    });
    if (!needyUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    // Only NEEDY users can create donation requests
    if (needyUser.role !== "NEEDY") {
        throw new AppError(httpStatus.FORBIDDEN, "Only needy users can create donation requests");
    }
    // Check blocked or deleted user
    if (needyUser.isDeleted ||
        needyUser.status === "DELETED" ||
        needyUser.status === "BLOCKED") {
        throw new AppError(httpStatus.FORBIDDEN, "Your account is not allowed to create donation requests");
    }
    // Create donation request
    const donationRequest = await prisma.donationRequest.create({
        data: {
            title: payload.title,
            description: payload.description,
            requiredAmount: payload.requiredAmount,
            situationVideo: payload.situationVideo,
            situationAudio: payload.situationAudio,
            // The authenticated NEEDY user's ID
            needyId: user.userId,
        },
    });
    return donationRequest;
};
export const DonationRequestService = {
    createDonationRequest,
};
