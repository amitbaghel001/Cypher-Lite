// =============================================================
// components/chat/MessageBubble.tsx — Animated Message Bubbles
// =============================================================

"use client";

import { motion } from "framer-motion";
import { Sparkles, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Message } from "@/types";
import { QuizCard } from "@/components/generative/QuizCard";
import { FlashCardDeck } from "@/components/generative/FlashCard";
import { SummaryCard } from "@/components/generative/SummaryCard";
import { formatRelativeTime } from "@/utils/format";

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

export function MessageBubble({ message, isLast }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 py-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 2px 10px rgba(139, 92, 246, 0.3)",
            }}
          >
            <User size={14} className="text-white" />
          </div>
        ) : (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center pulse-ring"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              boxShadow: "0 2px 10px rgba(139, 92, 246, 0.4)",
            }}
          >
            <Sparkles size={14} className="text-white" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex flex-col gap-2 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}
      >
        {/* Image preview */}
        {message.imageData && (
          <div className="rounded-xl overflow-hidden border border-slate-700/50 max-w-xs">
            <img
              src={`data:${message.imageType || "image/jpeg"};base64,${message.imageData}`}
              alt="Uploaded content"
              className="w-full object-cover"
              style={{ maxHeight: 250 }}
            />
          </div>
        )}

        {/* Text Bubble */}
        {message.content && (
          <div
            className={`group relative rounded-2xl px-4 py-3 ${
              isUser
                ? "text-white"
                : "text-slate-200 border border-slate-800/60"
            }`}
            style={
              isUser
                ? {
                    background:
                      "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(59,130,246,0.3))",
                    border: "1px solid rgba(139,92,246,0.3)",
                    boxShadow: "0 2px 15px rgba(139,92,246,0.15)",
                  }
                : {
                    background: "rgba(15, 15, 30, 0.8)",
                  }
            }
          >
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            ) : (
              <div className="markdown-body text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Copy button — visible on hover */}
            {!isUser && (
              <button
                id={`copy-msg-${message.id}`}
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-700/50 text-slate-500 hover:text-slate-300"
              >
                {copied ? (
                  <Check size={12} className="text-green-400" />
                ) : (
                  <Copy size={12} />
                )}
              </button>
            )}
          </div>
        )}

        {/* Generative UI Components */}
        {message.toolOutput && !isUser && (
          <div className="w-full max-w-2xl mt-2">
            {message.toolOutput.type === "quiz" && message.toolOutput.quiz && (
              <QuizCard questions={message.toolOutput.quiz} />
            )}
            {message.toolOutput.type === "flashcards" &&
              message.toolOutput.flashcards && (
                <FlashCardDeck cards={message.toolOutput.flashcards} />
              )}
            {message.toolOutput.type === "summary" &&
              message.toolOutput.summary && (
                <SummaryCard summary={message.toolOutput.summary} />
              )}
            {message.toolOutput.type === "simplify" &&
              message.toolOutput.simplifiedExplanation && (
                <SummaryCard
                  summary={message.toolOutput.simplifiedExplanation}
                  title="✨ Simplified Explanation"
                  color="blue"
                />
              )}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-slate-700 px-1">
          {formatRelativeTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
}
