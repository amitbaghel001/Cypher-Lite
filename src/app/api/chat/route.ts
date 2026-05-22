// =============================================================
// src/app/api/chat/route.ts — Groq Streaming Chat API Route
// =============================================================

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import groqClient, { GROQ_TEXT_MODEL, GROQ_VISION_MODEL } from "@/lib/groq";
import { getSystemPromptWithRAG, getToolPrompt } from "@/lib/system-prompt";
import { buildRAGContext } from "@/lib/rag";

export const runtime = "nodejs";

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, imageData, imageType, toolAction, sessionId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Build RAG context if we have uploaded documents for this session
    const lastUserContent: string =
      messages[messages.length - 1]?.content || "";
    const ragContext = sessionId
      ? buildRAGContext(sessionId, lastUserContent)
      : undefined;
    const systemPrompt = getSystemPromptWithRAG(ragContext);

    // Choose model — use vision model when image is present
    const useVision = Boolean(imageData);
    const model = useVision ? GROQ_VISION_MODEL : GROQ_TEXT_MODEL;

    // Build the last user message content (text + optional image)
    let finalUserContent: string | ContentPart[];
    if (imageData && useVision) {
      finalUserContent = [
        {
          type: "text",
          text: lastUserContent || "Please analyze this image.",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${imageType || "image/jpeg"};base64,${imageData}`,
          },
        },
      ] as ContentPart[];
    } else if (toolAction) {
      // Tool action: override user message with a tool-specific prompt
      finalUserContent = getToolPrompt(toolAction, lastUserContent);
    } else {
      finalUserContent = lastUserContent;
    }

    // Build complete messages array for Groq
    const historyMessages = messages
      .slice(0, -1) // all except last
      .slice(-18) // keep last 18 messages for context window
      .map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const groqMessages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: finalUserContent as string | ContentPart[] },
    ];

    // Create streaming completion
    const stream = await groqClient.chat.completions.create({
      model,
      messages: groqMessages,
      stream: true,
      max_tokens: 2048,
      temperature: 0.7,
    });

    // Stream SSE response back to client
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const data = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("[Chat API] Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[Chat API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Check GROQ_API_KEY in .env.local" },
      { status: 500 }
    );
  }
}
