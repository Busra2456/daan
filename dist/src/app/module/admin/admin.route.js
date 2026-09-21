import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { AdminController } from "./admin.controller";
const router = Router();
router.get("/donation-requests/pending", auth("ADMIN"), AdminController.getPendingDonationRequests);
router.patch("/donation-requests/:requestId/verify", auth("ADMIN"), AdminController.verifyDonationRequest);
router.patch("/donation-requests/:requestId/reject", auth("ADMIN"), AdminController.rejectDonationRequest);
export const AdminRoutes = router;
