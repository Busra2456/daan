import { Router } from "express";

import { auth } from "../../middleware/checkAuth";
import { DonationController } from "./donation.controller";

const router = Router();

router.post("/", auth("DONOR"), DonationController.createDonation);

export const DonationRoutes = router;
