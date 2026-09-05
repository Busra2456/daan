import cors from "cors";
import express from "express";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).json({
		success: true,
		message: "Daan Backend is running!",
	});
});

export default app;
