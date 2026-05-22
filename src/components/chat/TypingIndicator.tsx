// =============================================================
// components/chat/TypingIndicator.tsx — Animated Thinking Dots
// =============================================================

"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="px-4 py-3 rounded-2xl border border-slate-800/60 flex items-center gap-1"
      style={{ background: "rgba(15, 15, 30, 0.8)" }}
    >
      <div className="flex items-center gap-1.5 px-1">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
      <span className="text-xs text-slate-600 ml-1">Cypher Lite is thinking...</span>
    </motion.div>
  );
}
