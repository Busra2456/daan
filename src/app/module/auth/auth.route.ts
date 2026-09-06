import { Router } from "express";

import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";

import { AuthController } from "./auth.controller";
import { UserValidation } from "./auth.validation";
import { Role } from "../../../../prisma/src/generated/prisma/enums";

const router = Router();

router.post(
  "/register",
  validateRequest(UserValidation.RegisterUserZodSchema),
  AuthController.registerUser,
);

router.post(
  "/login",
  validateRequest(UserValidation.LoginZodSchema),
  AuthController.loginUser,
);

router.get(
  "/me",
  auth(Role.NEEDY, Role.DONOR, Role.ADMIN),
  AuthController.getMe,
);

router.post(
  "/refresh-token",
  AuthController.refreshToken,
);

export const AuthRoutes = router;