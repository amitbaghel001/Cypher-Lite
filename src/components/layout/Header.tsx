// =============================================================
// components/layout/Header.tsx — Top Navigation Bar
// =============================================================

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, ExternalLink } from "lucide-react";

export function Header() {
  const router = useRouter();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between px-6 py-3 border-b border-slate-800/50 flex-shrink-0"
      style={{ background: "rgba(5, 5, 8, 0.8)", backdropFilter: "blur(20px)" }}
    >
      {/* Logo */}
      <button
        id="header-logo-btn"
        onClick={() => router.push("/")}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
        >
          <Sparkles size={16} className="text-white" />
        </div>
        <span
          className="font-bold text-lg gradient-text"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Cypher Lite
        </span>
      </button>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Teaching Mode Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Teaching Mode Active
        </div>

        {/* Model Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 text-xs">
          <Sparkles size={10} className="text-purple-400" />
          Llama 4 Scout
        </div>
      </div>
    </motion.header>
  );
}
