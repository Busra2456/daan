import httpStatus from "http-status";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IRequestUser } from "../auth/auth.interface";

const getVerifiedDonationRequests = async (user: IRequestUser) => {
	// Check authenticated user
	const donorUser = await prisma.user.findUnique({
		where: {
			id: user.userId,
		},
	});

	if (!donorUser) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	// Only DONOR users can see verified donation requests
	if (donorUser.role !== "DONOR") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only donors can view verified donation requests",
		);
	}

	// Check blocked or deleted user
	if (
		donorUser.isDeleted ||
		donorUser.status === "DELETED" ||
		donorUser.status === "BLOCKED"
	) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Your account is not allowed to view donation requests",
		);
	}

	// Get only ADMIN-verified donation requests
	const donationRequests = await prisma.donationRequest.findMany({
		where: {
			status: "VERIFIED",
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

	return donationRequests;
};

export const DonorService = {
	getVerifiedDonationRequests,
};
