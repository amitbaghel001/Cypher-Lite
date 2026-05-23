<div align="center">

# ⚡ Cypher Lite

### *Learn by Thinking, Not Copying.*

An AI-powered educational chatbot built on the **"Human First, AI Next"** philosophy.  
Powered by **Groq**, **Next.js 16**, **Vercel AI SDK**, and in-memory **RAG**.

</div>

---

## 🎯 What is Cypher Lite?

Cypher Lite is an AI EdTech MVP that acts as a Socratic tutor — guiding students toward understanding instead of simply giving answers. Unlike generic AI assistants, Cypher Lite:

- 🧠 **Asks questions back** — "What do you think happens next?"
- 📝 **Breaks problems down** — step-by-step guidance
- 💡 **Uses analogies** — makes complex concepts relatable
- 🎯 **Checks understanding** — reflective follow-ups
- 🔒 **Refuses to spoon-feed** — encourages critical thinking

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

- **Frontend**: Next.js 16 App Router, Tailwind CSS v4, Framer Motion
- **AI Model**: `meta-llama/llama-4-scout-17b-16e-instruct` via Groq
- **RAG System**: In-memory TF-IDF vector similarity for fast PDF/TXT indexing
- **Generative UI**: AI responses parsed for structured JSON markers (e.g. `[QUIZ]...[/QUIZ]`) rendered directly into interactive UI components

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/amitbaghel001/Cypher-Lite.git
cd Cypher-Lite
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

Open [http://localhost:3000](http://localhost:3000).

---

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

When prompted, add your environment variable `GROQ_API_KEY`.

---

## 🧰 Tech Stack

- **Next.js 16** (App Router, API Routes)
- **TypeScript**
- **Tailwind CSS v4**
- **Groq SDK**
- **Framer Motion** & **Lucide React**
- **pdf-parse v1.1.1** (Server-side PDF text extraction)

---

## 📄 License

MIT License — free to use, modify, and deploy.
