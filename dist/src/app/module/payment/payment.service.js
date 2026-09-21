import httpStatus from "http-status";
import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
const createPayment = async (donationId, user) => {
    const donation = await prisma.donation.findUnique({
        where: {
            id: donationId,
        },
        include: {
            request: true,
        },
    });
    if (!donation) {
        throw new AppError(httpStatus.NOT_FOUND, "Donation not found");
    }
    if (donation.donorId !== user.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to pay for this donation");
    }
    if (donation.status !== "PENDING") {
        throw new AppError(httpStatus.BAD_REQUEST, "This donation is not available for payment");
    }
    if (donation.request.status !== "VERIFIED") {
        throw new AppError(httpStatus.BAD_REQUEST, "Donation request is not verified");
    }
    const bkashIdToken = await getBkashIdToken();
    if (!bkashIdToken) {
        throw new AppError(httpStatus.BAD_GATEWAY, "Failed to get bKash ID token");
    }
    const response = await fetch(`${config.bkash_base_url}/tokenized/checkout/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: bkashIdToken,
            "X-App-Key": config.bkash_app_key,
        },
        body: JSON.stringify({
            mode: "0011",
            payerReference: user.userId,
            callbackURL: config.bkash_callback_url,
            amount: donation.amount.toString(),
            currency: "BDT",
            intent: "sale",
            merchantInvoiceNumber: `DAAN-${donation.id}`,
        }),
    });
    const result = await response.json();
    if (!response.ok || result.statusCode !== "0000") {
        throw new AppError(httpStatus.BAD_GATEWAY, result.statusMessage || "bKash payment creation failed");
    }
    await prisma.donation.update({
        where: {
            id: donation.id,
        },
        data: {
            paymentId: result.paymentID,
            paymentStatus: "INITIATED",
        },
    });
    return {
        donationId: donation.id,
        paymentId: result.paymentID,
        bkashURL: result.bkashURL,
    };
};
const executePayment = async (donationId, user) => {
    const donation = await prisma.donation.findUnique({
        where: { id: donationId },
        include: { request: true },
    });
    if (!donation) {
        throw new AppError(httpStatus.NOT_FOUND, "Donation not found");
    }
    if (donation.donorId !== user.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are not allowed to execute this payment");
    }
    if (!donation.paymentId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment has not been created yet");
    }
    if (donation.status === "COMPLETED") {
        throw new AppError(httpStatus.BAD_REQUEST, "This donation has already been completed");
    }
    const bkashIdToken = await getBkashIdToken();
    if (!bkashIdToken) {
        throw new AppError(httpStatus.BAD_GATEWAY, "Failed to get bKash ID token");
    }
    const response = await fetch(`${config.bkash_base_url}/tokenized/checkout/execute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: bkashIdToken,
            "X-App-Key": config.bkash_app_key,
        },
        body: JSON.stringify({
            paymentID: donation.paymentId,
        }),
    });
    const result = await response.json();
    if (!response.ok || result.statusCode !== "0000") {
        throw new AppError(httpStatus.BAD_GATEWAY, result.statusMessage ||
            result.errorMessage ||
            "bKash payment execution failed");
    }
    const updatedDonation = await prisma.donation.update({
        where: { id: donation.id },
        data: {
            status: result.transactionStatus === "Completed" ? "COMPLETED" : "PENDING",
            paymentStatus: result.transactionStatus,
            paymentId: result.paymentID,
        },
    });
    return {
        donationId: updatedDonation.id,
        paymentId: result.paymentID,
        trxID: result.trxID,
        amount: result.amount,
        transactionStatus: result.transactionStatus,
        paymentStatus: updatedDonation.paymentStatus,
    };
};
const executePaymentByPaymentId = async (paymentId) => {
    const donation = await prisma.donation.findFirst({
        where: {
            paymentId,
        },
    });
    if (!donation) {
        throw new AppError(httpStatus.NOT_FOUND, "Donation not found");
    }
    if (donation.status === "COMPLETED") {
        return donation;
    }
    const bkashIdToken = await getBkashIdToken();
    if (!bkashIdToken) {
        throw new AppError(httpStatus.BAD_GATEWAY, "Failed to get bKash ID token");
    }
    const response = await fetch(`${config.bkash_base_url}/tokenized/checkout/execute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: bkashIdToken,
            "X-App-Key": config.bkash_app_key,
        },
        body: JSON.stringify({
            paymentID: paymentId,
        }),
    });
    const result = await response.json();
    if (!response.ok || result.statusCode !== "0000") {
        throw new AppError(httpStatus.BAD_GATEWAY, result.statusMessage ||
            result.errorMessage ||
            "bKash payment execution failed");
    }
    return prisma.donation.update({
        where: {
            id: donation.id,
        },
        data: {
            status: result.transactionStatus === "Completed" ? "COMPLETED" : "PENDING",
            paymentStatus: result.transactionStatus,
            paymentId: result.paymentID,
        },
    });
};
export const PaymentService = {
    createPayment,
    executePayment,
    executePaymentByPaymentId,
};
