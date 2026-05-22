// =============================================================
// app/page.tsx — Cypher Lite Landing Page
// =============================================================

"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Brain,
  BookOpen,
  Zap,
  ArrowRight,
  MessageSquare,
  Image,
  FileText,
  HelpCircle,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Socratic Teaching",
    description:
      "Never just gives answers. Guides you to discover solutions through questions and hints.",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: Image,
    title: "Vision AI",
    description:
      "Upload homework photos, diagrams, or handwritten notes for instant AI analysis.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Smart RAG",
    description:
      "Upload your PDFs and notes. Ask questions and get context-aware answers from your materials.",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Zap,
    title: "Learning Tools",
    description:
      "Generate quizzes, flashcards, and summaries from any topic or uploaded content.",
    color: "from-pink-500 to-rose-500",
  },
];

const stats = [
  { label: "Teaching Mode", value: "Socratic" },
  { label: "Response Time", value: "<1s" },
  { label: "Context Window", value: "128k" },
  { label: "File Support", value: "PDF + Images" },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start overflow-x-hidden">
      {/* ---- Hero Section ---- */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8"
        >
          <Sparkles size={14} className="text-purple-400" />
          AI-Powered Educational Companion
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tight mb-6"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="gradient-text">Cypher</span>
          <span className="text-white"> Lite</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-400 mb-4 font-light"
        >
          Learn by Thinking, Not Copying.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-slate-500 text-base max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Your AI tutor that asks the right questions, not just gives answers.
          Upload notes, photos, or PDFs — and learn through Socratic dialogue,
          quizzes, and flashcards.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            id="start-learning-btn"
            onClick={() => router.push("/chat")}
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
            }}
          >
            Start Learning Free
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>

          <button
            id="demo-btn"
            onClick={() => router.push("/chat")}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl text-slate-300 font-semibold text-lg border border-slate-700 hover:border-purple-500/50 hover:text-white transition-all duration-300 hover:bg-purple-500/5"
          >
            <MessageSquare size={20} />
            Try Demo
          </button>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-4 text-center hover:border-purple-500/30 transition-colors"
            >
              <div className="text-xl font-bold gradient-text">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ---- Features Grid ---- */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Built Different.
            <span className="gradient-text"> Teaches Different.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Designed on the "Human First, AI Next" philosophy — because
            understanding matters more than answers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card p-6 hover:border-purple-500/30 transition-all duration-300 group hover:scale-[1.02]"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 opacity-90 group-hover:opacity-100 transition-opacity`}
              >
                <feature.icon size={22} className="text-white" />
              </div>
              <h3
                className="text-lg font-semibold text-white mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            How Cypher Lite{" "}
            <span className="gradient-text">Teaches</span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {[
            {
              step: "01",
              title: "You ask a question",
              desc: "Type your question, or upload a photo of your homework.",
              icon: HelpCircle,
            },
            {
              step: "02",
              title: "Cypher Lite guides you",
              desc: "Instead of just answering, it breaks it down, asks what you think, and offers hints.",
              icon: Brain,
            },
            {
              step: "03",
              title: "You understand deeply",
              desc: "Generate quizzes and flashcards to cement your learning.",
              icon: BookOpen,
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="flex gap-6 items-start glass-card p-6 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {item.step}
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---- Bottom CTA ---- */}
      <section className="relative z-10 w-full max-w-2xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card-purple p-10"
        >
          <Sparkles className="mx-auto mb-4 text-purple-400" size={36} />
          <h2
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Ready to think deeper?
          </h2>
          <p className="text-slate-400 mb-8 text-sm">
            No sign-up required. Just add your Groq API key and start learning.
          </p>
          <button
            id="hero-cta-btn"
            onClick={() => router.push("/chat")}
            className="px-8 py-4 rounded-2xl text-white font-semibold text-lg w-full transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.5)",
            }}
          >
            Launch Cypher Lite →
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800/50 py-6 text-center text-slate-600 text-sm">
        <p>
          Cypher Lite · Powered by{" "}
          <span className="text-purple-500">Groq</span> ·{" "}
          <span className="text-blue-500">Next.js 14</span> ·{" "}
          <span className="text-cyan-500">Vercel AI SDK</span>
        </p>
      </footer>
    </main>
  );
}
