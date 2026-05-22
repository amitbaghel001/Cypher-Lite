// =============================================================
// lib/groq.ts — Groq Client Configuration
// =============================================================

import Groq from "groq-sdk";

/**
 * Singleton Groq client instance.
 * Uses GROQ_API_KEY from environment variables.
 */
export const groqClient = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

/** Primary text model — fast and capable */
export const GROQ_TEXT_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

/** Vision model for image analysis */
export const GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

/** Fallback model */
export const GROQ_FALLBACK_MODEL = "llama3-8b-8192";

export default groqClient;
