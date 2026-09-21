import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { PaymentController } from "./payment.controller";
const router = Router();
router.post("/:donationId/create", auth("DONOR"), PaymentController.createPayment);
router.post("/:donationId/execute", auth("DONOR"), PaymentController.executePayment);
router.get("/bkash/callback", PaymentController.bkashCallback);
export const PaymentRoutes = router;
