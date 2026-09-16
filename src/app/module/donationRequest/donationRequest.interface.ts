import type { DonationRequestStatus } from "../../../../prisma/src/generated/prisma/enums";

export interface ICreateDonationRequestPayload {
	title: string;
	description: string;
	requiredAmount: number;
	situationVideo?: string;
	situationAudio?: string;
}

export interface IUpdateDonationRequestPayload {
	title?: string;
	description?: string;
	requiredAmount?: number;
	situationVideo?: string;
	situationAudio?: string;
}

export interface IReviewDonationRequestPayload {
	status: DonationRequestStatus;
	rejectionReason?: string;
}
