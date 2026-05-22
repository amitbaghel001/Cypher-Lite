// =============================================================
// app/api/upload/route.ts — File Upload Handler (PDF/Text)
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import { addDocumentToRAG, getRAGChunkCount } from "@/lib/rag";
import { extractTextFromPDF, extractTextFromTextFile } from "@/utils/pdf-parser";

export const runtime = "nodejs";

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("sessionId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ error: "No session ID" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name;
    const fileType = file.type;

    let extractedText = "";

    // Extract text based on file type
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      extractedText = await extractTextFromPDF(buffer);
    } else if (
      fileType.startsWith("text/") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".md")
    ) {
      extractedText = extractTextFromTextFile(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF or text files." },
        { status: 415 }
      );
    }

    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json(
        { error: "Could not extract text from file. File may be empty or image-based." },
        { status: 422 }
      );
    }

    // Add to RAG store
    const chunksAdded = addDocumentToRAG(sessionId, extractedText, fileName);
    const totalChunks = getRAGChunkCount(sessionId);

    return NextResponse.json({
      success: true,
      fileName,
      chunksAdded,
      totalChunks,
      message: `Successfully indexed "${fileName}" (${chunksAdded} chunks)`,
    });
  } catch (error) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
