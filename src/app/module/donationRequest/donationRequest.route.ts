import { Router } from "express";

import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { DonationRequestController } from "./donationRequest.controller";

const router = Router();

router.post(
	"/",
	auth(Role.NEEDY),
	DonationRequestController.createDonationRequest,
);

router.get(
	"/:requestId",
	auth("ADMIN", "DONOR", "NEEDY"),
	DonationRequestController.getDonationRequestById,
);

router.patch(
	"/:requestId",
	auth(Role.NEEDY),
	DonationRequestController.updateDonationRequest,
);

router.delete(
	"/:requestId",
	auth(Role.NEEDY),
	DonationRequestController.deleteDonationRequest,
);

export const DonationRequestRoutes = router;
