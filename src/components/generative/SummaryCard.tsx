// =============================================================
// components/generative/SummaryCard.tsx — Summary / Simplify Display
// =============================================================

"use client";

import { motion } from "framer-motion";
import { FileText, Copy, Check, Lightbulb } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SummaryCardProps {
  summary: string;
  title?: string;
  color?: "purple" | "blue" | "cyan";
}

const COLOR_MAP = {
  purple: {
    header: "rgba(139, 92, 246, 0.1)",
    headerBorder: "rgba(139, 92, 246, 0.2)",
    border: "rgba(139, 92, 246, 0.25)",
    glow: "rgba(139, 92, 246, 0.1)",
    iconColor: "text-purple-400",
    titleColor: "text-purple-300",
    icon: FileText,
  },
  blue: {
    header: "rgba(59, 130, 246, 0.1)",
    headerBorder: "rgba(59, 130, 246, 0.2)",
    border: "rgba(59, 130, 246, 0.25)",
    glow: "rgba(59, 130, 246, 0.1)",
    iconColor: "text-blue-400",
    titleColor: "text-blue-300",
    icon: Lightbulb,
  },
  cyan: {
    header: "rgba(6, 182, 212, 0.1)",
    headerBorder: "rgba(6, 182, 212, 0.2)",
    border: "rgba(6, 182, 212, 0.25)",
    glow: "rgba(6, 182, 212, 0.1)",
    iconColor: "text-cyan-400",
    titleColor: "text-cyan-300",
    icon: FileText,
  },
};

export function SummaryCard({
  summary,
  title = "📋 Summary",
  color = "purple",
}: SummaryCardProps) {
  const [copied, setCopied] = useState(false);
  const theme = COLOR_MAP[color];
  const Icon = theme.icon;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(15, 15, 30, 0.9)",
        borderColor: theme.border,
        boxShadow: `0 4px 24px ${theme.glow}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: theme.header,
          borderColor: theme.headerBorder,
        }}
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className={theme.iconColor} />
          <span
            className={`text-sm font-semibold ${theme.titleColor}`}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}
          </span>
        </div>
        <button
          id="summary-copy-btn"
          onClick={handleCopy}
          className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-500 hover:text-white transition-colors text-xs"
        >
          {copied ? (
            <Check size={13} className="text-green-400" />
          ) : (
            <Copy size={13} />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="markdown-body text-sm text-slate-300 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
