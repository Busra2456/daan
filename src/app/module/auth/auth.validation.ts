import z from "zod";

const UserRegistrationZodSchema = z.object({
	name: z
		.string("Name must be a string")
		.min(3, "Name must be at least 3 characters long"),

	email: z.email("Invalid email"),

	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
		.regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
		.regex(/[0-9]/, "Password must contain at least 1 number")
		.regex(
			/[^A-Za-z0-9]/,
			"Password must contain at least 1 special character",
		),

	phone: z.string().optional(),

	address: z.string().optional(),

	imageUrl: z.string().optional(),

	role: z.enum(["NEEDY", "DONOR"]).optional(),
});

const EmailVerifyZodSchema = z.object({
	email: z.email("Invalid email"),

	otp: z
		.string()
		.length(6, "OTP must be 6 digits")
		.regex(/^\d+$/, "OTP must contain only numbers"),
});

const LoginZodSchema = z.object({
	email: z.email("Invalid email"),

	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
		.regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
		.regex(/[0-9]/, "Password must contain at least 1 number")
		.regex(
			/[^A-Za-z0-9]/,
			"Password must contain at least 1 special character",
		),
});

const ForgotPasswordZodSchema = z.object({
	email: z.email("Invalid email"),
});

const ResetPasswordZodSchema = z.object({
	email: z.email("Invalid email"),

	newPassword: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
		.regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
		.regex(/[0-9]/, "Password must contain at least 1 number")
		.regex(
			/[^A-Za-z0-9]/,
			"Password must contain at least 1 special character",
		),

	otp: z
		.string()
		.length(6, "OTP must be 6 digits")
		.regex(/^\d+$/, "OTP must contain only numbers"),
});

export const UserValidation = {
	UserRegistrationZodSchema,
	EmailVerifyZodSchema,
	LoginZodSchema,
	ForgotPasswordZodSchema,
	ResetPasswordZodSchema,
};
