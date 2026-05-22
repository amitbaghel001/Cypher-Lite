// =============================================================
// components/generative/ToolBar.tsx — AI Tool Action Buttons
// =============================================================

"use client";

import { motion } from "framer-motion";
import { HelpCircle, FileText, BookMarked, Lightbulb } from "lucide-react";

interface ToolBarProps {
  onToolAction: (action: string) => void;
}

const TOOLS = [
  {
    id: "quiz",
    label: "Generate Quiz",
    icon: HelpCircle,
    color: "from-purple-600/20 to-violet-600/10",
    borderColor: "rgba(139, 92, 246, 0.25)",
    hoverGlow: "rgba(139, 92, 246, 0.2)",
    iconColor: "text-purple-400",
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: FileText,
    color: "from-blue-600/20 to-cyan-600/10",
    borderColor: "rgba(59, 130, 246, 0.25)",
    hoverGlow: "rgba(59, 130, 246, 0.2)",
    iconColor: "text-blue-400",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    icon: BookMarked,
    color: "from-cyan-600/20 to-teal-600/10",
    borderColor: "rgba(6, 182, 212, 0.25)",
    hoverGlow: "rgba(6, 182, 212, 0.2)",
    iconColor: "text-cyan-400",
  },
  {
    id: "simplify",
    label: "Simplify",
    icon: Lightbulb,
    color: "from-pink-600/20 to-rose-600/10",
    borderColor: "rgba(236, 72, 153, 0.25)",
    hoverGlow: "rgba(236, 72, 153, 0.2)",
    iconColor: "text-pink-400",
  },
];

export function ToolBar({ onToolAction }: ToolBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-wrap gap-2 py-2"
    >
      <span className="text-xs text-slate-600 self-center mr-1 hidden sm:block">
        Quick tools:
      </span>
      {TOOLS.map((tool, i) => (
        <motion.button
          key={tool.id}
          id={`tool-${tool.id}-btn`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onToolAction(tool.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105 bg-gradient-to-r ${tool.color}`}
          style={{
            border: `1px solid ${tool.borderColor}`,
          }}
          whileHover={{
            boxShadow: `0 2px 12px ${tool.hoverGlow}`,
          }}
          whileTap={{ scale: 0.97 }}
        >
          <tool.icon size={13} className={tool.iconColor} />
          <span className="text-slate-300">{tool.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}
