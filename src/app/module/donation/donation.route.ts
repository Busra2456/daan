import { Router } from "express";

import { auth } from "../../middleware/checkAuth.js";
import { DonationController } from "./donation.controller.js";

const router = Router();

router.post("/", auth("DONOR"), DonationController.createDonation);
router.get(
  "/received",
  auth("NEEDY"),
  DonationController.getReceivedDonations,
);
router.get("/my-donations", auth("DONOR"), DonationController.getMyDonations);

export const DonationRoutes = router;
