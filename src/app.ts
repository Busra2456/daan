import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { AdminRoutes } from "./app/module/admin/admin.route";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { DonationRoutes } from "./app/module/donation/donation.route";
import { DonationRequestRoutes } from "./app/module/donationRequest/donationRequest.route";
import { DonorRoutes } from "./app/module/donor/donor.route";
import { CommunicationRoutes } from "./app/module/communication/communication.route";

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

app.use("/api/auth", AuthRoutes);
app.use("/api/donation-requests", DonationRequestRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/donor", DonorRoutes);
app.use("/api/donations", DonationRoutes);
app.use("/api/communication", CommunicationRoutes);
app.use(globalErrorHandler);

export default app;
