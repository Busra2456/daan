import { Router } from "express";

import { UserController } from "./user.controller.js";
import { updateUserStatusSchema } from "./user.validation.js";
import { auth } from "../../middleware/checkAuth.js";
import { validateRequest } from "../../middleware/validateRequest.js";

const router = Router();

router.get(
	"/",
	auth("ADMIN"),
	UserController.getAllUsers,
);

router.get(
	"/:userId",
	auth("ADMIN"),
	UserController.getUserById,
);

router.patch(
	"/:userId/status",
	auth("ADMIN"),
	validateRequest(updateUserStatusSchema),
	UserController.updateUserStatus,
);

export const UserRoutes = router;