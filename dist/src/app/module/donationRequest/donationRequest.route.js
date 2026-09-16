import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { DonationRequestController } from "./donationRequest.controller";
import { auth } from "../../middleware/checkAuth";
const router = Router();
router.post("/", auth(Role.NEEDY), DonationRequestController.createDonationRequest);
export const DonationRequestRoutes = router;
