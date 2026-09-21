import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
const getPendingDonationRequests = async (user) => {
    if (user.role !== "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "Only admin can view pending donation requests");
    }
    const requests = await prisma.donationRequest.findMany({
        where: {
            status: "PENDING",
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
        orderBy: {
            createdAt: "desc",
        },
    });
    return requests;
};
const verifyDonationRequest = async (requestId, user) => {
    if (user.role !== "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "Only admin can verify donation requests");
    }
    const donationRequest = await prisma.donationRequest.findUnique({
        where: {
            id: requestId,
        },
    });
    if (!donationRequest) {
        throw new AppError(httpStatus.NOT_FOUND, "Donation request not found");
    }
    if (donationRequest.status !== "PENDING") {
        throw new AppError(httpStatus.BAD_REQUEST, "Only pending donation requests can be verified");
    }
    const verifiedRequest = await prisma.donationRequest.update({
        where: {
            id: requestId,
        },
        data: {
            status: "VERIFIED",
            reviewedById: user.userId,
            reviewedAt: new Date(),
            rejectionReason: null,
        },
    });
    return verifiedRequest;
};
const rejectDonationRequest = async (requestId, rejectionReason, user) => {
    if (user.role !== "ADMIN") {
        throw new AppError(httpStatus.FORBIDDEN, "Only admin can reject donation requests");
    }
    const donationRequest = await prisma.donationRequest.findUnique({
        where: {
            id: requestId,
        },
    });
    if (!donationRequest) {
        throw new AppError(httpStatus.NOT_FOUND, "Donation request not found");
    }
    if (donationRequest.status !== "PENDING") {
        throw new AppError(httpStatus.BAD_REQUEST, "Only pending donation requests can be rejected");
    }
    const rejectedRequest = await prisma.donationRequest.update({
        where: {
            id: requestId,
        },
        data: {
            status: "REJECTED",
            rejectionReason,
            reviewedById: user.userId,
            reviewedAt: new Date(),
        },
    });
    return rejectedRequest;
};
export const AdminService = {
    getPendingDonationRequests,
    verifyDonationRequest,
    rejectDonationRequest,
};
