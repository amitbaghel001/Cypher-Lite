<div align="center">

# ⚡ Cypher Lite

### *Learn by Thinking, Not Copying.*

An AI-powered educational chatbot built on the **"Human First, AI Next"** philosophy.  
Powered by **Groq**, **Next.js 14**, **Vercel AI SDK**, and in-memory **RAG**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/cypher-lite)

</div>

---

## 🎯 What is Cypher Lite?

Cypher Lite is a **startup-quality AI EdTech MVP** that acts as a Socratic tutor — it guides students toward understanding instead of simply giving answers. Unlike ChatGPT or generic AI assistants, Cypher Lite:

- 🧠 **Asks questions back** — "What do you think happens next?"
- 📝 **Breaks problems down** — step-by-step guidance
- 💡 **Uses analogies** — makes complex concepts relatable
- 🎯 **Checks understanding** — reflective follow-ups
- 🔒 **Refuses to spoon-feed** — encourages critical thinking

> **Tagline**: *Learn by Thinking, Not Copying.*

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Teaching Mode** | Socratic AI tutor — guides, doesn't just answer |
| 🖼️ **Vision AI** | Upload homework photos, diagrams, handwritten notes |
| 📄 **Smart RAG** | Upload PDFs/text, ask questions about your own materials |
| ❓ **Quiz Generator** | Interactive multiple-choice quizzes with scoring |
| 📚 **Flashcard Deck** | 3D flip flashcards with shuffle and navigation |
| 📋 **Summarizer** | Condense topics into clear summaries |
| ✨ **Simplify Mode** | Re-explain complex concepts in simple language |
| 💬 **Streaming Chat** | Real-time token streaming from Groq |
| 🌑 **Dark Futuristic UI** | Glassmorphism, gradients, animations |
| 📱 **Responsive** | Works on desktop and mobile |

---

## 🏗️ Architecture

```
cypher-lite/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + SEO metadata
│   │   ├── page.tsx            # Landing page
│   │   ├── globals.css         # Global styles (Tailwind v4 + custom)
│   │   ├── chat/
│   │   │   └── page.tsx        # Chat interface page
│   │   └── api/
│   │       ├── chat/route.ts   # Groq streaming API
│   │       └── upload/route.ts # File upload + RAG indexing
│   │
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx   # Main chat container
│   │   │   ├── MessageBubble.tsx   # Animated message bubbles
│   │   │   ├── ChatInput.tsx       # Input bar + image upload
│   │   │   ├── EmptyState.tsx      # Beautiful empty state
│   │   │   └── TypingIndicator.tsx # Animated thinking dots
│   │   ├── sidebar/
│   │   │   └── Sidebar.tsx         # Collapsible sidebar
│   │   ├── generative/
│   │   │   ├── QuizCard.tsx        # Interactive quiz UI
│   │   │   ├── FlashCard.tsx       # 3D flip flashcards
│   │   │   ├── SummaryCard.tsx     # Summary display
│   │   │   └── ToolBar.tsx         # Quick tool buttons
│   │   ├── upload/
│   │   │   └── FileUploadZone.tsx  # Drag-and-drop uploader
│   │   └── layout/
│   │       └── Header.tsx          # Top navigation bar
│   │
│   ├── lib/
│   │   ├── groq.ts             # Groq client singleton
│   │   ├── rag.ts              # In-memory RAG (TF-IDF)
│   │   └── system-prompt.ts    # Teaching mode prompt
│   │
│   ├── hooks/
│   │   └── useChat.ts          # Chat state + streaming hook
│   │
│   ├── utils/
│   │   ├── format.ts           # Tool output parser + formatters
│   │   ├── text-chunker.ts     # RAG text chunking
│   │   └── pdf-parser.ts       # PDF text extraction
│   │
│   └── types/
│       └── index.ts            # TypeScript types
```

### RAG Pipeline

```
Upload PDF/TXT → Extract Text → Chunk (400 words, 50 overlap)
     ↓
Store chunks in server-side Map (in-memory)
     ↓
On query: TF-IDF cosine similarity → top-3 chunks
     ↓
Inject context into system prompt → Groq LLM → Stream response
```

### Generative UI Pipeline

```
AI Response → Parse for [QUIZ]...[/QUIZ] markers
     ↓
Extract JSON → Render <QuizCard> / <FlashCardDeck> / <SummaryCard>
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/cypher-lite.git
cd cypher-lite
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> Get your free API key at [console.groq.com/keys](https://console.groq.com/keys)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the landing page.

Click **"Start Learning Free"** to open the chat interface.

---

## 🔑 Getting a Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free)
3. Navigate to **API Keys**
4. Create a new key
5. Copy it into your `.env.local`

**Free tier**: 30 requests/minute — more than enough for development.

---

## 🌐 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/cypher-lite)

### Manual Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

When prompted, add your environment variable:
- `GROQ_API_KEY` = your Groq API key

### Vercel Environment Variables

In your Vercel project dashboard → **Settings → Environment Variables**:

| Variable | Value |
|---|---|
| `GROQ_API_KEY` | `gsk_...your_key...` |

---

## 🛠️ How Tool Actions Work

Tool buttons (Quiz, Summarize, Flashcards, Simplify) send a special prompt prefix to the AI:

```
User clicks "Generate Quiz" → Sends:
"Based on our conversation about [topic], generate a quiz..."
```

The AI responds with structured JSON wrapped in `[QUIZ]...[/QUIZ]` markers.  
The frontend parser (`utils/format.ts`) extracts the JSON and renders `<QuizCard>`.

---

## 📸 Screenshots

> *Add screenshots here after first run*

| Landing Page | Chat Interface | Quiz Card |
|---|---|---|
| ![Landing](./screenshots/landing.png) | ![Chat](./screenshots/chat.png) | ![Quiz](./screenshots/quiz.png) |

---

## 🔮 Future Improvements

- [ ] **Authentication** (NextAuth.js or Clerk)
- [ ] **Persistent conversations** (database storage)
- [ ] **Voice input** (Web Speech API)
- [ ] **Multi-language support**
- [ ] **Student progress tracking** (learning streaks)
- [ ] **Custom subject modes** (Math, Science, History)
- [ ] **Collaborative study rooms**
- [ ] **Pinecone/Weaviate** for persistent RAG at scale
- [ ] **Teacher dashboard** to assign topics
- [ ] **LangChain agents** for multi-step reasoning

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** | App Router, SSR, API Routes |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS v4** | Utility-first styling |
| **Groq SDK** | Ultra-fast LLM inference |
| **Framer Motion** | Animations and transitions |
| **Lucide React** | Icon system |
| **react-markdown** | Markdown rendering in chat |
| **pdf-parse** | Server-side PDF text extraction |
| **TF-IDF** | In-memory vector similarity for RAG |

---

## 📄 License

MIT License — free to use, modify, and deploy.

---

<div align="center">
  <strong>Built with ❤️ for learners who think.</strong>
  <br/>
  <em>Multimodal AI · RAG · Educational AI · Tool Calling · Vercel AI SDK · Groq · AI Tutor</em>
</div>
