import z from "zod";

const RegisterUserZodSchema = z.object({
  name: z
    .string("Name must be a string")
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name cannot exceed 50 characters"),

  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /[a-z]/,
      "Password must contain at least 1 lowercase letter",
    )
    .regex(
      /[A-Z]/,
      "Password must contain at least 1 uppercase letter",
    )
    .regex(
      /[0-9]/,
      "Password must contain at least 1 number",
    )
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character",
    ),

  phone: z
    .string()
    .optional(),

  address: z
    .string()
    .optional(),

  imageUrl: z
    .string()
    .url("Invalid image URL")
    .optional(),

  role: z
    .enum(["NEEDY", "DONOR"])
    .optional(),
});

const LoginZodSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /[a-z]/,
      "Password must contain at least 1 lowercase letter",
    )
    .regex(
      /[A-Z]/,
      "Password must contain at least 1 uppercase letter",
    )
    .regex(
      /[0-9]/,
      "Password must contain at least 1 number",
    )
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character",
    ),
});

export const UserValidation = {
  RegisterUserZodSchema,
  LoginZodSchema,
};