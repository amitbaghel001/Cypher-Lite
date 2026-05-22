# Cypher Lite — AI Agent Guidelines

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Project Overview

**Cypher Lite** is an AI-powered educational chatbot built on the "Human First, AI Next" philosophy.
It uses Socratic teaching — guiding students toward answers rather than giving them directly.

## Tech Stack

- **Framework**: Next.js 16 App Router (`src/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` — NOT `@tailwind base/components/utilities`)
- **AI**: Groq SDK with `meta-llama/llama-4-scout-17b-16e-instruct` (text + vision)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PDF Parsing**: pdf-parse **v1.1.1** (NOT v2 — different API, v2 breaks)

## Critical Rules for AI Agents

### Directory Structure
- All source code lives in `src/` — NEVER write to root-level `app/`, `components/`, etc.
- API routes: `src/app/api/*/route.ts`
- Components: `src/components/<category>/<Name>.tsx`
- All client components must have `"use client"` at top

### Tailwind CSS v4
- Import: `@import "tailwindcss"` in globals.css (NOT the old `@tailwind` directives)
- Do NOT add `@import url(...)` for fonts in CSS — use `<link>` in layout.tsx instead
- PostCSS plugin: `@tailwindcss/postcss` (NOT `tailwindcss` directly)

### pdf-parse
- Always use **v1.1.1** — `require("pdf-parse")` returns a function directly
- v2 changed to a class-based API and is incompatible — do NOT upgrade

### Environment Variables
- `GROQ_API_KEY` — required, never commit `.env.local`
- `.env.local` is gitignored — provide `.env.example` for new developers

### RAG System
- In-memory only (server restarts wipe it)
- Keyed by `sessionId` (generated per browser session in `useChat.ts`)
- The same `sessionId` must be passed to both `/api/upload` and `/api/chat`

### Streaming
- `/api/chat` returns SSE (`text/event-stream`)
- Client reads with `ReadableStream` + `TextDecoder` in `useChat.ts`
- Parse lines starting with `data: ` and ignore `[DONE]`

## File Map

```
src/
  app/
    layout.tsx          # Root layout + Google Fonts via <link>
    page.tsx            # Landing page
    globals.css         # Global styles (Tailwind v4 + custom CSS)
    chat/page.tsx       # Chat interface
    api/chat/route.ts   # Groq streaming endpoint
    api/upload/route.ts # PDF/text RAG indexing
  components/
    chat/               # ChatInterface, MessageBubble, ChatInput, EmptyState, TypingIndicator
    sidebar/            # Sidebar (collapsible, file upload, conversation list)
    generative/         # QuizCard, FlashCard, SummaryCard, ToolBar
    upload/             # FileUploadZone
    layout/             # Header
  lib/
    groq.ts             # Groq client singleton
    rag.ts              # In-memory TF-IDF RAG store
    system-prompt.ts    # Socratic teaching system prompt
  hooks/
    useChat.ts          # Chat state + streaming + sessionId
  utils/
    format.ts           # Tool output parser, formatters
    text-chunker.ts     # RAG chunking (400 words, 50 overlap)
    pdf-parser.ts       # pdf-parse v1 wrapper
  types/
    index.ts            # Shared TypeScript types
```
