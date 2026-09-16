import httpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IRequestUser } from "../auth/auth.interface";

interface ICreateDonationPayload {
	amount: number;
	requestId: string;
}

const createDonation = async (
	payload: ICreateDonationPayload,
	user: IRequestUser,
) => {
	// Check authenticated user
	const donorUser = await prisma.user.findUnique({
		where: {
			id: user.userId,
		},
	});

	if (!donorUser) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	// Only DONOR can create donation
	if (donorUser.role !== "DONOR") {
		throw new AppError(httpStatus.FORBIDDEN, "Only donors can make donations");
	}

	// Check blocked or deleted user
	if (
		donorUser.isDeleted ||
		donorUser.status === "DELETED" ||
		donorUser.status === "BLOCKED"
	) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Your account is not allowed to make donations",
		);
	}

	// Validate donation amount
	if (payload.amount <= 0) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Donation amount must be greater than 0",
		);
	}

	// Check donation request
	const donationRequest = await prisma.donationRequest.findUnique({
		where: {
			id: payload.requestId,
		},
	});

	if (!donationRequest) {
		throw new AppError(httpStatus.NOT_FOUND, "Donation request not found");
	}

	// Donor can only donate to verified requests
	if (donationRequest.status !== "VERIFIED") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Donation can only be made to a verified request",
		);
	}

	// Create donation
	const donation = await prisma.donation.create({
		data: {
			amount: payload.amount,
			donorId: user.userId,
			requestId: payload.requestId,
			status: "PENDING",
			paymentStatus: "PENDING",
		},
	});

	return donation;
};

export const DonationService = {
	createDonation,
};
