import { Router } from "express";
import { auth } from "../../middleware/checkAuth.js";
import { AdminController } from "./admin.controller.js";

const router = Router();

router.get(
	"/donation-requests",
	auth("ADMIN"),
	AdminController.getAllDonationRequests,
);


router.get(
	"/donation-requests/pending",
	auth("ADMIN"),
	AdminController.getPendingDonationRequests,
);

router.get(
	"/donation-requests/:requestId",
	auth("ADMIN"),
	AdminController.getDonationRequestDetails,
);

router.patch(
	"/donation-requests/:requestId/verify",
	auth("ADMIN"),
	AdminController.verifyDonationRequest,
);

router.patch(
	"/donation-requests/:requestId/reject",
	auth("ADMIN"),
	AdminController.rejectDonationRequest,
);



export const AdminRoutes = router;
