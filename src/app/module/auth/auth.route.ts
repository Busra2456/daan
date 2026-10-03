import { Router } from "express";
import { Role } from "../../../generated/prisma/enums.js";
import { auth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { AuthController } from "./auth.controller.js";
import { UserValidation } from "./auth.validation.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hasna Hena
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *               role:
 *                 type: string
 *                 enum: [NEEDY, DONOR]
 *                 example: DONOR
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
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
router.post("/logout", AuthController.logout);

router.post("/google-login",
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
router.post(
	"/demo-login",
	validateRequest(UserValidation.DemoLoginZodSchema),
	AuthController.demoLogin,
);

router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
