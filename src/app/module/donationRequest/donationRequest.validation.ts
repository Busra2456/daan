import z from "zod";

const createDonationRequestZodSchema = z.object({
	title: z
		.string("Title must be a string")
		.min(3, "Title must be at least 3 characters long")
		.max(200, "Title cannot exceed 200 characters"),

	description: z
		.string("Description must be a string")
		.min(10, "Description must be at least 10 characters long"),

	requiredAmount: z
		.number("Required amount must be a number")
		.positive("Required amount must be greater than 0"),

	situationVideo: z
		.string("Situation video must be a string")
		.url("Situation video must be a valid URL")
		.optional(),

	situationAudio: z
		.string("Situation audio must be a string")
		.url("Situation audio must be a valid URL")
		.optional(),
});

export const DonationRequestValidation = {
	createDonationRequestZodSchema,
};
