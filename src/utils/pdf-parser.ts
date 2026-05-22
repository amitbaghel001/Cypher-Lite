// =============================================================
// utils/pdf-parser.ts — PDF Text Extraction (Server-side only)
// =============================================================
// Uses pdf-parse v1 — simple function API: pdfParse(buffer) => { text }
// Must only run in Node.js server context (API routes), never client-side.
// =============================================================

/**
 * Extracts plain text from a PDF buffer.
 * @param buffer - PDF file as Buffer or ArrayBuffer
 * @returns Extracted plain text string
 */
export async function extractTextFromPDF(
  buffer: Buffer | ArrayBuffer
): Promise<string> {
  try {
    // pdf-parse v1 exports a plain async function
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    const data = await pdfParse(buf);
    return (data.text || "").trim();
  } catch (error) {
    console.error("[PDF Parser] Error:", error);
    throw new Error(
      "Failed to parse PDF. Make sure it is a text-based PDF (not a scanned image)."
    );
  }
}

/**
 * Extracts text from a plain text or markdown file buffer.
 */
export function extractTextFromTextFile(
  buffer: Buffer | ArrayBuffer
): string {
  const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  return buf.toString("utf-8").trim();
}
