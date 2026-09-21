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
const getDonationRequestById = async (requestId, user) => {
    const donationRequest = await prisma.donationRequest.findUnique({
        where: {
            id: requestId,
        },
        include: {
            needy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    imageUrl: true,
                },
            },
        },
    });
    if (!donationRequest) {
        throw new AppError(httpStatus.NOT_FOUND, "Donation request not found");
    }
    if (user.role === "ADMIN") {
        return donationRequest;
    }
    if (user.role === "DONOR") {
        if (donationRequest.status !== "VERIFIED") {
            throw new AppError(httpStatus.FORBIDDEN, "Only verified donation requests can be viewed by donors");
        }
        return donationRequest;
    }
    if (user.role === "NEEDY") {
        if (donationRequest.needyId !== user.userId) {
            throw new AppError(httpStatus.FORBIDDEN, "You can only view your own donation requests");
        }
        return donationRequest;
    }
    throw new AppError(httpStatus.FORBIDDEN, "You don't have permission to view this donation request");
};
const updateDonationRequest = async (requestId, payload, user) => {
    const donationRequest = await prisma.donationRequest.findUnique({
        where: {
            id: requestId,
        },
    });
    if (!donationRequest) {
        throw new AppError(httpStatus.NOT_FOUND, "Donation request not found");
    }
    if (donationRequest.needyId !== user.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only update your own donation requests");
    }
    if (donationRequest.status !== "PENDING") {
        throw new AppError(httpStatus.FORBIDDEN, "Only pending donation requests can be updated");
    }
    const updatedDonationRequest = await prisma.donationRequest.update({
        where: {
            id: requestId,
        },
        data: payload,
    });
    return updatedDonationRequest;
};
const deleteDonationRequest = async (requestId, user) => {
    const donationRequest = await prisma.donationRequest.findUnique({
        where: {
            id: requestId,
        },
    });
    if (!donationRequest) {
        throw new AppError(httpStatus.NOT_FOUND, "Donation request not found");
    }
    if (donationRequest.needyId !== user.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You can only delete your own donation requests");
    }
    if (donationRequest.status !== "PENDING") {
        throw new AppError(httpStatus.FORBIDDEN, "Only pending donation requests can be deleted");
    }
    await prisma.donationRequest.delete({
        where: {
            id: requestId,
        },
    });
    return null;
};
export const DonationRequestService = {
    createDonationRequest,
    getDonationRequestById,
    updateDonationRequest,
    deleteDonationRequest
};
