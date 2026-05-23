<div align="center">

# ⚡ Cypher Lite

### *Learn by Thinking, Not Copying.*

An AI-native educational platform using Socratic tutoring, Groq-powered LLMs, generative UI, and in-memory RAG for interactive learning.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs"/>
  <img src="https://img.shields.io/badge/Groq-LLM-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/RAG-In--Memory-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/AI-Education-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/License-MIT-red?style=for-the-badge"/>
</p>

</div>

---

# 🎯 What is Cypher Lite?

Cypher Lite is an AI-powered educational chatbot built around the philosophy:

> **"Human First, AI Next."**

Instead of simply giving answers, Cypher Lite acts like a Socratic tutor that helps students think critically and understand concepts deeply.

Unlike generic AI assistants, Cypher Lite:

- 🧠 Asks reflective questions back
- 📝 Breaks concepts into understandable steps
- 💡 Uses analogies for deeper understanding
- 🎯 Encourages active learning
- 🔒 Avoids spoon-feeding direct solutions

---

# ✨ Core Features

## 🧠 Socratic AI Tutor
Guides students toward understanding rather than directly providing answers.

---

## 📚 In-Memory RAG System
Upload PDFs or TXT files and chat with your study material using lightweight TF-IDF retrieval.

---

## 🎨 Generative UI Components
AI responses dynamically generate:
- Interactive quizzes
- Flashcards
- Summaries
- Educational UI blocks

---

## ⚡ Ultra-Fast LLM Inference
Powered by Groq for real-time low-latency AI interactions.

---

## 📄 File Upload & Contextual Learning
Students can upload learning materials and receive context-aware tutoring assistance.

---

## 🌙 Modern AI Chat Experience
Clean AI-native interface built using:
- Next.js
- Tailwind CSS
- Framer Motion
- Vercel AI SDK

---

# 🏗️ Architecture

```bash
cypher-lite/
├── src/
│   ├── app/              # App Router + API routes
│   ├── components/       # Chat UI & generative components
│   ├── lib/              # Groq client + RAG pipeline
│   ├── hooks/            # Streaming & chat hooks
│   ├── utils/            # Parsers & helper utilities
│   └── types/            # TypeScript types
```

---

# 🧠 RAG Pipeline

```text
Upload PDF/TXT
      ↓
Extract Text
      ↓
Chunk Documents
      ↓
TF-IDF Similarity Search
      ↓
Inject Context into Prompt
      ↓
Groq LLM Response
      ↓
Stream AI Output
```

---

# 🎨 Generative UI Workflow

```text
AI Response
      ↓
Structured Output Parsing
      ↓
Generate Quiz / Flashcards / Summaries
      ↓
Render Interactive Components
```

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend + API Routes |
| TypeScript | Type-safe development |
| Tailwind CSS | UI styling |
| Groq SDK | Ultra-fast LLM inference |
| Vercel AI SDK | AI streaming |
| Framer Motion | Animations |
| pdf-parse | PDF extraction |
| TF-IDF | Lightweight RAG retrieval |

---

# 🚀 Quick Start

## 1️⃣ Clone Repository

```bash
git clone https://github.com/amitbaghel001/Cypher-Lite.git
cd Cypher-Lite
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Create Environment Variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_api_key_here
```

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🔑 Getting a Groq API Key

1. Visit:
```text
https://console.groq.com
```

2. Create an account

3. Generate an API key

4. Add it to `.env.local`

---

# 🛠️ How Tool Actions Work

Tool buttons such as:
- Quiz
- Flashcards
- Summarize
- Simplify

send structured prompts to the LLM.

The AI responds with structured markers like:

```text
[QUIZ]...[/QUIZ]
```

which are parsed into interactive UI components dynamically.

---

# 🌟 Why This Project Matters

Most AI tutors simply provide answers.

Cypher Lite focuses on:
- active learning
- conceptual understanding
- guided reasoning
- educational interaction

making AI feel more like a mentor than a search engine.

---

# 🔮 Future Improvements

- Authentication & user accounts
- Persistent chat memory
- Voice-based tutoring
- Multilingual support
- Personalized learning analytics
- Collaborative study rooms
- Vector database integration
- Agentic tutoring workflows

---

# 👨‍💻 Author

## Amit Baghel

AI/ML Developer passionate about:
- Generative AI
- Educational AI
- AI Product Engineering
- Intelligent Learning Systems

- GitHub: https://github.com/amitbaghel001
- LinkedIn: https://linkedin.com/in/amit0baghel

---

<div align="center">

### ⭐ Built for learners who think, not copy.

*Generative AI · RAG · Educational AI · Groq · Next.js · AI Tutoring*

</div>
