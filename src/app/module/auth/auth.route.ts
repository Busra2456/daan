import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { UserValidation } from "./auth.validation";

const router = Router();

console.log("registerUser:", typeof AuthController.registerUser);
console.log("verifyEmail:", typeof AuthController.verifyEmail);
console.log("loginUser:", typeof AuthController.loginUser);
console.log("getMe:", typeof AuthController.getMe);
console.log("refreshToken:", typeof AuthController.refreshToken);
console.log("forgotPassword:", typeof AuthController.forgotPassword);
console.log("resetPassword:", typeof AuthController.resetPassword);
console.log("googleLogin:", typeof AuthController.googleLogin);
console.log(
	"ForgotPasswordZodSchema:",
	typeof UserValidation.ForgotPasswordZodSchema,
);

console.log(
	"ResetPasswordZodSchema:",
	typeof UserValidation.ResetPasswordZodSchema,
);

router.post(
	"/register",
	validateRequest(UserValidation.UserRegistrationZodSchema),
	AuthController.registerUser,
);

router.post(
	"/verify-email",
	validateRequest(UserValidation.EmailVerifyZodSchema),
	AuthController.verifyEmail,
);

router.post(
	"/login",
	validateRequest(UserValidation.LoginZodSchema),
	AuthController.loginUser,
);

router.post(
	"/google-login",
	validateRequest(UserValidation.GoogleLoginZodSchema),
	AuthController.googleLogin,
);
router.get(
	"/me",
	auth(Role.ADMIN, Role.NEEDY, Role.DONOR),
	AuthController.getMe,
);

router.post(
	"/forgot-password",
	validateRequest(UserValidation.ForgotPasswordZodSchema),
	AuthController.forgotPassword,
);

router.post(
	"/reset-password",
	validateRequest(UserValidation.ResetPasswordZodSchema),
	AuthController.resetPassword,
);

router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
