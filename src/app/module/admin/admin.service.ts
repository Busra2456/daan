import httpStatus from "http-status";

import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { IRequestUser } from "../auth/auth.interface.js";

const getPendingDonationRequests = async (user: IRequestUser) => {
	if (user.role !== "ADMIN") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only admin can view pending donation requests",
		);
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

const verifyDonationRequest = async (requestId: string, user: IRequestUser) => {
	if (user.role !== "ADMIN") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only admin can verify donation requests",
		);
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
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Only pending donation requests can be verified",
		);
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

const rejectDonationRequest = async (
	requestId: string,
	rejectionReason: string,
	user: IRequestUser,
) => {
	if (user.role !== "ADMIN") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only admin can reject donation requests",
		);
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
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Only pending donation requests can be rejected",
		);
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

const getAllDonationRequests = async (user: IRequestUser) => {
	if (user.role !== "ADMIN") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only admin can view all donation requests",
		);
	}

	const requests = await prisma.donationRequest.findMany({
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
			reviewedBy: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return requests;
};

const getDonationRequestDetails = async (
	requestId: string,
	user: IRequestUser,
) => {
	if (user.role !== "ADMIN") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only admin can view donation request details",
		);
	}

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
			reviewedBy: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});

	if (!donationRequest) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Donation request not found",
		);
	}

	return donationRequest;
};

export const AdminService = {
	getPendingDonationRequests,
	verifyDonationRequest,
	rejectDonationRequest,
	getAllDonationRequests,
	getDonationRequestDetails
};
