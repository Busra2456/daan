import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { DonorController } from "./donor.controller";
const router = Router();
router.get("/donation-requests", auth("DONOR"), DonorController.getVerifiedDonationRequests);
export const DonorRoutes = router;
