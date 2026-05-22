// =============================================================
// components/chat/ChatInterface.tsx — Main Chat Container
// =============================================================

"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Message, ToolAction } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { EmptyState } from "./EmptyState";
import { TypingIndicator } from "./TypingIndicator";
import { ToolBar } from "@/components/generative/ToolBar";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (
    content: string,
    options?: {
      imageData?: string;
      imageType?: string;
      toolAction?: ToolAction;
    }
  ) => Promise<void>;
  onStopGeneration: () => void;
  sessionId: string;
}

export function ChatInterface({
  messages,
  isLoading,
  onSendMessage,
  onStopGeneration,
  sessionId,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  // Last user message (for tool actions context)
  const lastUserMessage =
    [...messages].reverse().find((m) => m.role === "user")?.content || "";

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="max-w-3xl mx-auto space-y-1">
          {!hasMessages ? (
            <EmptyState
              onSuggestedQuestion={(q) => onSendMessage(q)}
            />
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                />
              ))}
            </AnimatePresence>
          )}

          {/* Typing indicator */}
          <AnimatePresence>
            {isLoading && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content === "" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3 items-start"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
                >
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Tool Bar */}
      {hasMessages && (
        <div className="px-4 pb-1 max-w-3xl mx-auto w-full">
          <ToolBar
            onToolAction={(action) =>
              onSendMessage(lastUserMessage, { toolAction: action as ToolAction })
            }
          />
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 pb-6 max-w-3xl mx-auto w-full">
        <ChatInput
          onSendMessage={onSendMessage}
          onStopGeneration={onStopGeneration}
          isLoading={isLoading}
          sessionId={sessionId}
        />
      </div>
    </div>
  );
}
