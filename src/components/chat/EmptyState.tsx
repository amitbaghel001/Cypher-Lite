// =============================================================
// components/chat/EmptyState.tsx — Beautiful Empty Chat State
// =============================================================

"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Zap, HelpCircle, Camera, BookOpen } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  {
    icon: Brain,
    text: "Explain quantum entanglement like I'm 15",
    color: "from-purple-500/20 to-violet-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Zap,
    text: "Help me understand recursion in programming",
    color: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: HelpCircle,
    text: "What's the difference between mitosis and meiosis?",
    color: "from-cyan-500/20 to-teal-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: BookOpen,
    text: "Quiz me on the French Revolution",
    color: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/20",
  },
];

interface EmptyStateProps {
  onSuggestedQuestion: (question: string) => void;
}

export function EmptyState({ onSuggestedQuestion }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
    >
      {/* Animated Logo */}
      <motion.div
        animate={{
          boxShadow: [
            "0 0 20px rgba(139,92,246,0.2)",
            "0 0 40px rgba(139,92,246,0.4)",
            "0 0 20px rgba(139,92,246,0.2)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
      >
        <Sparkles size={36} className="text-white" />
      </motion.div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-3 gradient-text"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Start Learning
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-slate-400 text-base max-w-sm mb-2"
      >
        Ask me anything. I&apos;ll guide you to the answer — not just give it.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-600 text-sm mb-10 flex items-center gap-1"
      >
        <Camera size={13} />
        You can also upload images or PDFs via the sidebar
      </motion.p>

      {/* Suggested Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl"
      >
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <motion.button
            key={q.text}
            id={`suggested-q-${i}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            onClick={() => onSuggestedQuestion(q.text)}
            className={`flex items-start gap-3 p-4 rounded-2xl text-left transition-all duration-200 bg-gradient-to-br ${q.color} border ${q.border} hover:scale-[1.02] hover:border-purple-500/40 group`}
          >
            <div className="p-2 rounded-xl bg-white/5 flex-shrink-0 group-hover:bg-white/10 transition-colors">
              <q.icon size={15} className="text-slate-400 group-hover:text-white transition-colors" />
            </div>
            <span className="text-slate-400 text-sm group-hover:text-slate-200 transition-colors leading-snug">
              {q.text}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
