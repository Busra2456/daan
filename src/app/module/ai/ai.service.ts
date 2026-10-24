
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

export type AIProvider = "openai" | "gemini";

const SYSTEM_INSTRUCTIONS = `
You are Daan AI, the assistant for Daan — Donate with Trust.

Help users understand:
- How Daan works.
- How needy people submit donation requests.
- How admins review requests.
- How donors can support verified requests.

Rules:
- Reply in the user's language, including Bangla and English.
- Keep answers short, clear, and friendly.
- Usually answer in 3–5 sentences.
- Never invent request statuses, user details, or donation amounts.
- Never guarantee donations.
- Never claim to submit requests or process payments.
- Never ask for passwords, OTPs, API keys, or payment credentials.
- Do not claim a request is verified unless the application confirms it.
`;

const getOpenAIResponse = async (
  message: string,
): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const openai = new OpenAI({ apiKey });

  const response = await openai.responses.create({
    model: "gpt-5.5",
    instructions: SYSTEM_INSTRUCTIONS,
    input: message,
    max_output_tokens: 180,
  });

  const answer = response.output_text?.trim();

  if (!answer) {
    throw new Error("OpenAI returned an empty response.");
  }

  return answer;
};

const getGeminiResponse = async (
  message: string,
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const genAI = new GoogleGenAI({ apiKey });

  const response = await genAI.models.generateContent({
    model: "gemini-3.8-flash",
    contents: message,
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS,
      maxOutputTokens: 180,
    },
  });

  const answer = response.text?.trim();

  if (!answer) {
    throw new Error("Gemini returned an empty response.");
  }

  return answer;
};

export const getDaanAIResponse = async (
  message: string,
  requestedProvider?: AIProvider,
): Promise<string> => {
  const configuredProvider = (
    process.env.AI_PROVIDER || "gemini"
  ).toLowerCase();

  const provider = requestedProvider ?? configuredProvider;

  switch (provider) {
    case "openai":
      return getOpenAIResponse(message);

    case "gemini":
      return getGeminiResponse(message);

    default:
      throw new Error(
        `Unsupported AI provider: ${provider}. Use "openai" or "gemini".`,
      );
  }
};
