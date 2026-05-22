// =============================================================
// utils/format.ts — Message & Content Formatters
// =============================================================

import { ToolOutput, QuizQuestion, FlashCard } from "@/types";

/**
 * Parses AI response text to detect and extract tool outputs.
 * Looks for [QUIZ]...[/QUIZ], [FLASHCARDS]...[/FLASHCARDS], etc.
 */
export function parseToolOutput(content: string): {
  cleanedContent: string;
  toolOutput?: ToolOutput;
} {
  // Check for QUIZ
  const quizMatch = content.match(/\[QUIZ\]([\s\S]*?)\[\/QUIZ\]/);
  if (quizMatch) {
    try {
      const quiz: QuizQuestion[] = JSON.parse(quizMatch[1].trim());
      return {
        cleanedContent: content.replace(/\[QUIZ\][\s\S]*?\[\/QUIZ\]/, "").trim(),
        toolOutput: { type: "quiz", quiz },
      };
    } catch {
      /* parse error — treat as plain text */
    }
  }

  // Check for FLASHCARDS
  const flashMatch = content.match(/\[FLASHCARDS\]([\s\S]*?)\[\/FLASHCARDS\]/);
  if (flashMatch) {
    try {
      const flashcards: FlashCard[] = JSON.parse(flashMatch[1].trim());
      return {
        cleanedContent: content
          .replace(/\[FLASHCARDS\][\s\S]*?\[\/FLASHCARDS\]/, "")
          .trim(),
        toolOutput: { type: "flashcards", flashcards },
      };
    } catch {
      /* parse error */
    }
  }

  // Check for SUMMARY
  const summaryMatch = content.match(/\[SUMMARY\]([\s\S]*?)\[\/SUMMARY\]/);
  if (summaryMatch) {
    return {
      cleanedContent: content
        .replace(/\[SUMMARY\][\s\S]*?\[\/SUMMARY\]/, "")
        .trim(),
      toolOutput: { type: "summary", summary: summaryMatch[1].trim() },
    };
  }

  // Check for SIMPLIFY
  const simplifyMatch = content.match(/\[SIMPLIFY\]([\s\S]*?)\[\/SIMPLIFY\]/);
  if (simplifyMatch) {
    return {
      cleanedContent: content
        .replace(/\[SIMPLIFY\][\s\S]*?\[\/SIMPLIFY\]/, "")
        .trim(),
      toolOutput: {
        type: "simplify",
        simplifiedExplanation: simplifyMatch[1].trim(),
      },
    };
  }

  return { cleanedContent: content };
}

/**
 * Generates a short title for a conversation based on the first user message.
 */
export function generateConversationTitle(firstMessage: string): string {
  const cleaned = firstMessage.replace(/[^a-zA-Z0-9\s]/g, "").trim();
  const words = cleaned.split(" ").slice(0, 5);
  return words.join(" ") || "New Conversation";
}

/**
 * Formats a date as a relative time string.
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}

/**
 * Generates a unique ID.
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
