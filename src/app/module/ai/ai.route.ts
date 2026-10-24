import { Router } from "express";
import { chatWithDaanAI } from "./ai.controller.js";

const router = Router();

// POST /api/ai/chat
router.post("/chat", chatWithDaanAI);

export const AIAssistantRoutes = router;
