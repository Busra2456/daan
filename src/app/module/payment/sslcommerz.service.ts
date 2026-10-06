import httpStatus from "http-status";
import SSLCommerzPayment from "sslcommerz-lts";

import config from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";
import type { IRequestUser } from "../auth/auth.interface.js";

const createSSLCommerzPayment = async (
	donationId: string,
	user: IRequestUser,
) => {
	const donation = await prisma.donation.findUnique({
		where: {
			id: donationId,
		},
		include: {
			request: true,
			donor: true,
		},
	});

	if (!donation) {
		throw new AppError(httpStatus.NOT_FOUND, "Donation not found");
	}

	if (donation.donorId !== user.userId) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You are not allowed to pay for this donation",
		);
	}

	if (donation.status !== "PENDING") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"This donation is not available for payment",
		);
	}

	if (donation.request.status !== "VERIFIED") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Donation request is not verified",
		);
	}

	const storeId = config.sslcommerz_store_id;
	const storePassword = config.sslcommerz_store_password;
	const isLive = config.sslcommerz_is_live;

	if (!storeId || !storePassword) {
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"SSLCommerz credentials are not configured",
		);
	}

	const tranId = `DAAN-${donation.id}-${Date.now()}`;

	const sslcz = new SSLCommerzPayment(
		storeId,
		storePassword,
		isLive,
	);

	const paymentData = {
		total_amount: Number(donation.amount),
		currency: "BDT",
		tran_id: tranId,

		success_url: config.sslcommerz_success_url,
		fail_url: config.sslcommerz_fail_url,
		cancel_url: config.sslcommerz_cancel_url,
		ipn_url: config.sslcommerz_ipn_url,

		shipping_method: "NO",
		product_name: "Daan Donation",
		product_category: "Donation",
		product_profile: "general",

		cus_name: donation.donor.name,
		cus_email: donation.donor.email,
		cus_add1: "Dhaka",
		cus_city: "Dhaka",
		cus_state: "Dhaka",
		cus_postcode: "1000",
		cus_country: "Bangladesh",
		cus_phone: donation.donor.phone || "01700000000",

		ship_name: donation.donor.name,
		ship_add1: "Dhaka",
		ship_city: "Dhaka",
		ship_state: "Dhaka",
		ship_postcode: "1000",
		ship_country: "Bangladesh",
	};

	try {
		const response = await sslcz.init(paymentData);

		if (!response?.GatewayPageURL) {
			throw new AppError(
				httpStatus.BAD_GATEWAY,
				"Failed to create SSLCommerz payment",
			);
		}

		await prisma.donation.update({
			where: {
				id: donation.id,
			},
			data: {
				paymentId: tranId,
				paymentStatus: "INITIATED",
			},
		});

		return {
			donationId: donation.id,
			paymentId: tranId,
			sslcommerzURL: response.GatewayPageURL,
		};
	} catch (error) {
		if (error instanceof AppError) {
			throw error;
		}

		console.error("SSLCommerz payment creation error:", error);

		throw new AppError(
			httpStatus.BAD_GATEWAY,
			"SSLCommerz payment creation failed",
		);
	}
};

const validateSSLCommerzPayment = async (paymentData: {
	val_id?: string;
	tran_id?: string;
	status?: string;
	amount?: string;
	currency?: string;
}) => {
	const tranId = paymentData.tran_id;

	if (!tranId) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Transaction ID is missing",
		);
	}

	const donation = await prisma.donation.findFirst({
		where: {
			paymentId: tranId,
		},
	});

	if (!donation) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Donation not found",
		);
	}

	if (donation.status === "COMPLETED") {
		return donation;
	}

	if (!paymentData.val_id) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"SSLCommerz validation ID is missing",
		);
	}

	const storeId = config.sslcommerz_store_id;
	const storePassword = config.sslcommerz_store_password;
	const isLive = config.sslcommerz_is_live;

	if (!storeId || !storePassword) {
		throw new AppError(
			httpStatus.INTERNAL_SERVER_ERROR,
			"SSLCommerz credentials are not configured",
		);
	}

	const sslcz = new SSLCommerzPayment(
		storeId,
		storePassword,
		isLive,
	);

	const validation = await sslcz.validate({
		val_id: paymentData.val_id,
	});

	if (
		validation.status !== "VALID" &&
		validation.status !== "VALIDATED"
	) {
		await prisma.donation.update({
			where: {
				id: donation.id,
			},
			data: {
				paymentStatus: "FAILED",
			},
		});

		throw new AppError(
			httpStatus.BAD_REQUEST,
			"SSLCommerz payment validation failed",
		);
	}

	if (
		validation.tran_id !== donation.paymentId
	) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Transaction ID mismatch",
		);
	}

	const updatedDonation = await prisma.donation.update({
		where: {
			id: donation.id,
		},
		data: {
			status: "COMPLETED",
			paymentStatus: "COMPLETED",
			paymentId: validation.tran_id,
		},
	});

	return updatedDonation;
};

const markPaymentAsFailed = async (tranId?: string) => {
	if (!tranId) {
		return null;
	}

	const donation = await prisma.donation.findFirst({
		where: {
			paymentId: tranId,
		},
	});

	if (!donation) {
		return null;
	}

	if (donation.status === "COMPLETED") {
		return donation;
	}

	return prisma.donation.update({
		where: {
			id: donation.id,
		},
		data: {
			paymentStatus: "FAILED",
		},
	});
};

export const SSLCommerzService = {
	createSSLCommerzPayment,
	validateSSLCommerzPayment,
	markPaymentAsFailed,
};