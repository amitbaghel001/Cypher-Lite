// =============================================================
// types/index.ts — Cypher Lite Shared Type Definitions
// =============================================================

export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  /** Optional: base64 image attached by user */
  imageData?: string;
  imageType?: string;
  /** Parsed tool output type for generative UI */
  toolOutput?: ToolOutput;
}

export type ToolOutputType = "quiz" | "flashcards" | "summary" | "simplify";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FlashCard {
  front: string;
  back: string;
}

export interface ToolOutput {
  type: ToolOutputType;
  quiz?: QuizQuestion[];
  flashcards?: FlashCard[];
  summary?: string;
  simplifiedExplanation?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RAGChunk {
  id: string;
  content: string;
  sourceFile: string;
  chunkIndex: number;
  embedding?: number[];
}

export interface UploadedFile {
  name: string;
  type: "pdf" | "image" | "text";
  content: string;
  uploadedAt: Date;
}

export type ToolAction = "quiz" | "summarize" | "flashcards" | "simplify";

export interface ChatRequest {
  messages: { role: Role; content: string }[];
  imageData?: string;
  imageType?: string;
  ragContext?: string;
  toolAction?: ToolAction;
}
