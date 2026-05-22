// =============================================================
// hooks/useChat.ts — Chat State Management Hook
// =============================================================

"use client";

import { useState, useCallback, useRef } from "react";
import { Message, Conversation, ToolAction } from "@/types";
import { generateId, generateConversationTitle, parseToolOutput } from "@/utils/format";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState<string>(() => generateId());
  const abortControllerRef = useRef<AbortController | null>(null);

  /** Gets the currently active conversation */
  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  ) || null;

  /** Active messages */
  const messages = activeConversation?.messages || [];

  /** Creates a new conversation */
  const createNewConversation = useCallback(() => {
    const id = generateId();
    const newConv: Conversation = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(id);
    return id;
  }, []);

  /** Switches to a different conversation */
  const switchConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  /** Deletes a conversation */
  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setActiveConversationId((prev) => (prev === id ? null : prev));
  }, []);

  /** Adds a message to the active conversation */
  const addMessage = useCallback(
    (message: Omit<Message, "id" | "timestamp">) => {
      const fullMessage: Message = {
        ...message,
        id: generateId(),
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeConversationId) return conv;
          const updatedMessages = [...conv.messages, fullMessage];
          const title =
            conv.messages.length === 0 && message.role === "user"
              ? generateConversationTitle(message.content)
              : conv.title;
          return {
            ...conv,
            messages: updatedMessages,
            title,
            updatedAt: new Date(),
          };
        })
      );

      return fullMessage.id;
    },
    [activeConversationId]
  );

  /** Updates the last assistant message (used for streaming) */
  const updateLastAssistantMessage = useCallback(
    (content: string) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeConversationId) return conv;
          const messages = [...conv.messages];
          const lastIdx = messages.length - 1;
          if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
            messages[lastIdx] = { ...messages[lastIdx], content };
          }
          return { ...conv, messages, updatedAt: new Date() };
        })
      );
    },
    [activeConversationId]
  );

  /** Finalizes assistant message with parsed tool output */
  const finalizeAssistantMessage = useCallback(
    (rawContent: string) => {
      const { cleanedContent, toolOutput } = parseToolOutput(rawContent);
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== activeConversationId) return conv;
          const messages = [...conv.messages];
          const lastIdx = messages.length - 1;
          if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
            messages[lastIdx] = {
              ...messages[lastIdx],
              content: cleanedContent || rawContent,
              toolOutput,
            };
          }
          return { ...conv, messages, updatedAt: new Date() };
        })
      );
    },
    [activeConversationId]
  );

  /**
   * Sends a message and streams the AI response.
   */
  const sendMessage = useCallback(
    async (
      userContent: string,
      options?: {
        imageData?: string;
        imageType?: string;
        toolAction?: ToolAction;
        ragSessionId?: string;
      }
    ) => {
      let convId = activeConversationId;
      if (!convId) {
        convId = createNewConversation();
      }

      // Add user message
      const userMessage: Omit<Message, "id" | "timestamp"> = {
        role: "user",
        content: userContent,
        imageData: options?.imageData,
        imageType: options?.imageType,
      };
      addMessage(userMessage);

      // Add placeholder assistant message
      const assistantMsg: Omit<Message, "id" | "timestamp"> = {
        role: "assistant",
        content: "",
      };
      addMessage(assistantMsg);

      setIsLoading(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        // Build messages for API
        const apiMessages = [
          ...(activeConversation?.messages || []),
          { role: "user" as const, content: userContent },
        ]
          .slice(-20) // last 20 messages for context window
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            imageData: options?.imageData,
            imageType: options?.imageType,
            toolAction: options?.toolAction,
            sessionId: sessionId,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content || "";
                if (delta) {
                  fullContent += delta;
                  updateLastAssistantMessage(fullContent);
                }
              } catch {
                // Non-JSON line, skip
              }
            }
          }
        }

        finalizeAssistantMessage(fullContent);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("[Chat] Error:", error);
        updateLastAssistantMessage(
          "I encountered an error. Please check your API key and try again."
        );
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [
      activeConversationId,
      activeConversation,
      createNewConversation,
      addMessage,
      updateLastAssistantMessage,
      finalizeAssistantMessage,
      sessionId,
    ]
  );

  /** Stops the current streaming response */
  const stopGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
  }, []);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    messages,
    isLoading,
    sessionId,
    createNewConversation,
    switchConversation,
    deleteConversation,
    sendMessage,
    stopGeneration,
  };
}
