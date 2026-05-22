// =============================================================
// components/sidebar/Sidebar.tsx — Left Sidebar Navigation
// =============================================================

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MessageSquare,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Upload,
  X,
} from "lucide-react";
import { Conversation } from "@/types";
import { formatRelativeTime } from "@/utils/format";
import { FileUploadZone } from "@/components/upload/FileUploadZone";

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onNewChat: () => void;
  onSwitchConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  sessionId: string;
}

export function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSwitchConversation,
  onDeleteConversation,
  sessionId,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleUploadSuccess = (fileName: string) => {
    setUploadedFiles((prev) => [...prev, fileName]);
  };

  if (collapsed) {
    return (
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: 56 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col items-center py-4 gap-4 border-r border-slate-800/50 flex-shrink-0 overflow-hidden"
        style={{ background: "rgba(10, 10, 20, 0.9)" }}
      >
        <button
          id="sidebar-expand-btn"
          onClick={() => setCollapsed(false)}
          className="p-2 rounded-xl hover:bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
        <button
          id="sidebar-new-chat-collapsed"
          onClick={onNewChat}
          className="p-2 rounded-xl hover:bg-purple-500/20 text-slate-400 hover:text-purple-300 transition-colors"
        >
          <Plus size={18} />
        </button>
        <button
          id="sidebar-upload-collapsed"
          onClick={() => { setCollapsed(false); setShowUpload(true); }}
          className="p-2 rounded-xl hover:bg-blue-500/20 text-slate-400 hover:text-blue-300 transition-colors"
        >
          <Upload size={18} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ width: 56 }}
      animate={{ width: 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col border-r border-slate-800/50 flex-shrink-0 overflow-hidden"
      style={{ background: "rgba(10, 10, 20, 0.9)", width: 280 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
          >
            <Sparkles size={13} className="text-white" />
          </div>
          <span
            className="font-semibold text-white text-sm"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Cypher Lite
          </span>
        </div>
        <button
          id="sidebar-collapse-btn"
          onClick={() => setCollapsed(true)}
          className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-500 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4 space-y-2">
        <button
          id="new-chat-btn"
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))",
            border: "1px solid rgba(139,92,246,0.3)",
          }}
        >
          <Plus size={16} />
          New Conversation
        </button>

        {/* Upload Docs Button */}
        <button
          id="upload-docs-btn"
          onClick={() => setShowUpload(!showUpload)}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 text-sm transition-colors hover:text-white hover:bg-slate-800/50 border border-slate-800/50"
        >
          <Upload size={15} />
          Upload Study Material
          {uploadedFiles.length > 0 && (
            <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
              {uploadedFiles.length}
            </span>
          )}
        </button>
      </div>

      {/* Upload Zone */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mb-4 overflow-hidden"
          >
            <FileUploadZone
              sessionId={sessionId}
              onUploadSuccess={handleUploadSuccess}
            />
            {uploadedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {uploadedFiles.map((file) => (
                  <div
                    key={file}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20"
                  >
                    <BookOpen size={12} className="text-green-400 flex-shrink-0" />
                    <span className="text-green-300 text-xs truncate">{file}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-xs">
            <MessageSquare size={20} className="mx-auto mb-2 opacity-40" />
            No conversations yet
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-600 px-2 py-1 uppercase tracking-wider font-medium">
              Recent
            </p>
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                  activeConversationId === conv.id
                    ? "bg-purple-500/15 border border-purple-500/25"
                    : "hover:bg-slate-800/50 border border-transparent"
                }`}
                onClick={() => onSwitchConversation(conv.id)}
              >
                <MessageSquare
                  size={14}
                  className={
                    activeConversationId === conv.id
                      ? "text-purple-400 flex-shrink-0"
                      : "text-slate-600 flex-shrink-0"
                  }
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm truncate ${
                      activeConversationId === conv.id
                        ? "text-white"
                        : "text-slate-400"
                    }`}
                  >
                    {conv.title}
                  </p>
                  <p className="text-xs text-slate-600 truncate">
                    {formatRelativeTime(conv.updatedAt)}
                  </p>
                </div>
                <button
                  id={`delete-conv-${conv.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 hover:text-red-400 text-slate-600 transition-all flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Footer — Branding only */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
          >
            <Sparkles size={10} className="text-white" />
          </div>
          <span className="text-xs text-slate-600">Human First · AI Next</span>
        </div>
      </div>
    </motion.div>
  );
}
