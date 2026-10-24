
import type { Request, Response } from "express";
import { getDaanAIResponse } from "./ai.service.js";

type AIProvider = "openai" | "gemini";

interface ChatRequestBody {
  message?: unknown;
  provider?: unknown;
}

export const chatWithDaanAI = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { message, provider } = req.body as ChatRequestBody;

    // Validate message
    if (typeof message !== "string" || !message.trim()) {
      res.status(400).json({
        success: false,
        message: "Please enter a message.",
      });
      return;
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length > 2000) {
      res.status(400).json({
        success: false,
        message: "Message must be 2000 characters or fewer.",
      });
      return;
    }

    // Validate the selected AI provider
    if (
      provider !== undefined &&
      provider !== "openai" &&
      provider !== "gemini"
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid AI provider. Choose OpenAI or Gemini.",
      });
      return;
    }

    // Use the requested provider; the service handles the default.
    const answer = await getDaanAIResponse(
      trimmedMessage,
      provider as AIProvider | undefined,
    );

    res.status(200).json({
      success: true,
      message: answer,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown AI service error";

    console.error("Daan AI error:", errorMessage);

    // Missing API key/configuration
    if (
      errorMessage.includes("OPENAI_API_KEY is not configured") ||
      errorMessage.includes("GEMINI_API_KEY is not configured")
    ) {
      res.status(503).json({
        success: false,
        message:
          "The selected AI provider is not configured. Please check the backend environment variables.",
      });
      return;
    }

    // Provider quota/rate limit
    if (
      /\b429\b/.test(errorMessage) ||
      /RESOURCE_EXHAUSTED|quota exceeded|rate limit/i.test(errorMessage)
    ) {
      res.status(429).json({
        success: false,
        message:
          "The selected AI provider has reached its usage limit. Please try the other provider or try again later.",
      });
      return;
    }

    // Other provider/API errors
    res.status(502).json({
      success: false,
      message:
        "The AI service is temporarily unavailable. Please try again later.",
    });
  }
};
