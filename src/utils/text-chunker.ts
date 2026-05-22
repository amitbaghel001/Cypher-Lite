// =============================================================
// utils/text-chunker.ts — Text Chunking Utility
// =============================================================

/**
 * Splits text into overlapping chunks for RAG indexing.
 * @param text - Full document text
 * @param chunkSize - Target words per chunk (default 400)
 * @param overlap - Words to overlap between consecutive chunks (default 50)
 */
export function chunkText(
  text: string,
  chunkSize: number = 400,
  overlap: number = 50
): string[] {
  // Clean up whitespace
  const cleaned = text.replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ");

  if (words.length <= chunkSize) {
    return [cleaned];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunk = words.slice(start, end).join(" ");
    chunks.push(chunk);

    if (end >= words.length) break;
    start += chunkSize - overlap;
  }

  return chunks.filter((c) => c.trim().length > 20);
}

/**
 * Estimates token count (rough approximation: 1 token ≈ 0.75 words)
 */
export function estimateTokenCount(text: string): number {
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / 0.75);
}
