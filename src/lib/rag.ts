// =============================================================
// lib/rag.ts — In-Memory RAG Implementation (Simple & Fast)
// =============================================================
// Strategy: TF-IDF cosine similarity (no external API needed).
// Chunks are stored in a server-side in-memory Map.
// In production, replace with a vector DB like Pinecone or Weaviate.
// =============================================================

import { RAGChunk } from "@/types";
import { chunkText } from "@/utils/text-chunker";

/** In-memory store: sessionId → RAGChunk[] */
const ragStore = new Map<string, RAGChunk[]>();

// --------------- Utility: Simple TF-IDF Similarity ---------------

/**
 * Tokenizes text into lowercase word array.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

/**
 * Builds a term-frequency map for a list of tokens.
 */
function termFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

/**
 * Computes cosine similarity between two TF maps.
 */
function cosineSimilarity(
  a: Map<string, number>,
  b: Map<string, number>
): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const [term, freqA] of a) {
    dotProduct += freqA * (b.get(term) || 0);
    normA += freqA * freqA;
  }
  for (const [, freqB] of b) {
    normB += freqB * freqB;
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// --------------- RAG Core Functions ---------------

/**
 * Adds a document to the RAG store for a given session.
 * Chunks the text and indexes it.
 */
export function addDocumentToRAG(
  sessionId: string,
  text: string,
  sourceFile: string
): number {
  const chunks = chunkText(text, 400, 50); // 400 tokens, 50 overlap
  const existingChunks = ragStore.get(sessionId) || [];

  const newChunks: RAGChunk[] = chunks.map((content, index) => ({
    id: `${sourceFile}-${index}-${Date.now()}`,
    content,
    sourceFile,
    chunkIndex: index,
  }));

  ragStore.set(sessionId, [...existingChunks, ...newChunks]);
  console.log(
    `[RAG] Added ${newChunks.length} chunks for session ${sessionId}`
  );
  return newChunks.length;
}

/**
 * Retrieves the top-K most relevant chunks for a query.
 */
export function retrieveRelevantChunks(
  sessionId: string,
  query: string,
  topK: number = 3
): RAGChunk[] {
  const chunks = ragStore.get(sessionId);
  if (!chunks || chunks.length === 0) return [];

  const queryTokens = tokenize(query);
  const queryTF = termFrequency(queryTokens);

  // Score each chunk
  const scored = chunks.map((chunk) => {
    const chunkTF = termFrequency(tokenize(chunk.content));
    const score = cosineSimilarity(queryTF, chunkTF);
    return { chunk, score };
  });

  // Sort by score descending, return top-K
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

/**
 * Builds a RAG context string from relevant chunks to inject into the prompt.
 */
export function buildRAGContext(
  sessionId: string,
  query: string
): string | undefined {
  const chunks = retrieveRelevantChunks(sessionId, query);
  if (chunks.length === 0) return undefined;

  return chunks
    .map(
      (c, i) =>
        `[Source: ${c.sourceFile}, Chunk ${c.chunkIndex + 1}]\n${c.content}`
    )
    .join("\n\n---\n\n");
}

/**
 * Clears all RAG data for a session.
 */
export function clearRAGSession(sessionId: string): void {
  ragStore.delete(sessionId);
}

/**
 * Returns the number of chunks stored for a session.
 */
export function getRAGChunkCount(sessionId: string): number {
  return ragStore.get(sessionId)?.length || 0;
}

/**
 * Lists uploaded files for a session.
 */
export function getUploadedFiles(sessionId: string): string[] {
  const chunks = ragStore.get(sessionId) || [];
  return [...new Set(chunks.map((c) => c.sourceFile))];
}
