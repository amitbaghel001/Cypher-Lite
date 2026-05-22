// =============================================================
// app/chat/page.tsx — Main Chat Interface Page
// =============================================================

"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/layout/Header";

export default function ChatPage() {
  const chatHook = useChat();

  // Auto-create first conversation on load
  useEffect(() => {
    if (chatHook.conversations.length === 0) {
      chatHook.createNewConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen overflow-hidden relative z-10">
      {/* Sidebar */}
      <Sidebar
        conversations={chatHook.conversations}
        activeConversationId={chatHook.activeConversationId}
        onNewChat={chatHook.createNewConversation}
        onSwitchConversation={chatHook.switchConversation}
        onDeleteConversation={chatHook.deleteConversation}
        sessionId={chatHook.sessionId}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <ChatInterface
          messages={chatHook.messages}
          isLoading={chatHook.isLoading}
          onSendMessage={chatHook.sendMessage}
          onStopGeneration={chatHook.stopGeneration}
          sessionId={chatHook.sessionId}
        />
      </div>
    </div>
  );
}
