import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { AuthRoutes } from "./app/module/auth/auth.route";

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
app.use(globalErrorHandler);

export default app;
