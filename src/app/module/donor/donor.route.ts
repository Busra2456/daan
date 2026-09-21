import { Router } from "express";
import { auth } from "../../middleware/checkAuth.js";
import { DonorController } from "./donor.controller.js";

const router = Router();

router.get(
	"/donation-requests",
	auth("DONOR"),
	DonorController.getVerifiedDonationRequests,
);

export const DonorRoutes = router;
