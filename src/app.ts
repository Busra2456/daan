import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./app/docs/swagger.js";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler.js";
import { AdminRoutes } from "./app/module/admin/admin.route.js";
import { AuthRoutes } from "./app/module/auth/auth.route.js";
import { CommunicationRoutes } from "./app/module/communication/communication.route.js";
import { DonationRoutes } from "./app/module/donation/donation.route.js";
import { DonationRequestRoutes } from "./app/module/donationRequest/donationRequest.route.js";
import { DonorRoutes } from "./app/module/donor/donor.route.js";
import { PaymentRoutes } from "./app/module/payment/payment.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "Daan Backend is running!",
	});
});


app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, {
		explorer: true,
	}),
);
app.use("/api/auth", AuthRoutes);
app.use("/api/donation-requests", DonationRequestRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/donor", DonorRoutes);
app.use("/api/donations", DonationRoutes);
app.use("/api/communication", CommunicationRoutes);
app.use("/api/payments", PaymentRoutes);
app.use(globalErrorHandler);

export default app;
