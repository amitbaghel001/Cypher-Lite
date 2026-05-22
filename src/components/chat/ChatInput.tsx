// =============================================================
// components/chat/ChatInput.tsx — Chat Input Bar
// Handles: text input, image attach (base64), PDF drop-to-upload
// =============================================================

"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Square,
  ImagePlus,
  X,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { ToolAction } from "@/types";

interface ChatInputProps {
  onSendMessage: (
    content: string,
    options?: {
      imageData?: string;
      imageType?: string;
      toolAction?: ToolAction;
    }
  ) => Promise<void>;
  onStopGeneration: () => void;
  isLoading: boolean;
  sessionId: string;
}

type FileUploadStatus = "idle" | "uploading" | "success" | "error";

export function ChatInput({
  onSendMessage,
  onStopGeneration,
  isLoading,
  sessionId,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string>("image/jpeg");
  const [imageName, setImageName] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileUploadStatus, setFileUploadStatus] = useState<FileUploadStatus>("idle");
  const [fileUploadMsg, setFileUploadMsg] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // ---- Image handler (base64 for vision API) ----
  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(",")[1];
      setImageData(base64);
      setImageType(file.type);
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  }, []);

  // ---- PDF / Text handler (upload to RAG) ----
  const handleDocumentFile = useCallback(
    async (file: File) => {
      const isDoc =
        file.type === "application/pdf" ||
        file.type === "text/plain" ||
        file.type === "text/markdown" ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".md");

      if (!isDoc) {
        setFileUploadStatus("error");
        setFileUploadMsg("Unsupported file. Use images, PDF, or TXT.");
        setTimeout(() => setFileUploadStatus("idle"), 3000);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setFileUploadStatus("error");
        setFileUploadMsg("File too large (max 10MB).");
        setTimeout(() => setFileUploadStatus("idle"), 3000);
        return;
      }

      setFileUploadStatus("uploading");
      setFileUploadMsg(`Indexing ${file.name}...`);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sessionId", sessionId);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Upload failed");

        setFileUploadStatus("success");
        setFileUploadMsg(`✓ "${file.name}" indexed (${data.chunksAdded} chunks)`);
        setTimeout(() => {
          setFileUploadStatus("idle");
          setFileUploadMsg("");
        }, 4000);
      } catch (err: unknown) {
        setFileUploadStatus("error");
        setFileUploadMsg(err instanceof Error ? err.message : "Upload failed");
        setTimeout(() => {
          setFileUploadStatus("idle");
          setFileUploadMsg("");
        }, 4000);
      }
    },
    [sessionId]
  );

  // ---- Universal drop handler ----
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;

      if (file.type.startsWith("image/")) {
        handleImageFile(file);
      } else {
        handleDocumentFile(file);
      }
    },
    [handleImageFile, handleDocumentFile]
  );

  // ---- Send message ----
  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed && !imageData) return;
    if (isLoading) return;

    const content = trimmed || (imageData ? "Please analyze this image." : "");
    await onSendMessage(content, {
      imageData: imageData || undefined,
      imageType,
    });

    setText("");
    setImageData(null);
    setImageName("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [text, imageData, imageType, isLoading, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  };

  const canSend = (text.trim().length > 0 || imageData !== null) && !isLoading;

  return (
    <div className="space-y-2">
      {/* File upload status banner */}
      <AnimatePresence>
        {fileUploadStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs border ${
              fileUploadStatus === "uploading"
                ? "bg-purple-500/10 border-purple-500/20 text-purple-300"
                : fileUploadStatus === "success"
                ? "bg-green-500/10 border-green-500/20 text-green-300"
                : "bg-red-500/10 border-red-500/20 text-red-300"
            }`}
          >
            {fileUploadStatus === "uploading" && (
              <Loader2 size={13} className="animate-spin flex-shrink-0" />
            )}
            {fileUploadStatus === "success" && (
              <CheckCircle size={13} className="flex-shrink-0" />
            )}
            {fileUploadStatus === "error" && (
              <AlertCircle size={13} className="flex-shrink-0" />
            )}
            <span>{fileUploadMsg}</span>
            {fileUploadStatus === "success" && (
              <span className="ml-1 text-slate-500">
                — Now ask questions about it!
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview */}
      <AnimatePresence>
        {imageData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50"
          >
            <img
              src={`data:${imageType};base64,${imageData}`}
              alt="Preview"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300 truncate">{imageName}</p>
              <p className="text-xs text-slate-500">Image attached — send to analyze</p>
            </div>
            <button
              id="remove-image-btn"
              onClick={() => {
                setImageData(null);
                setImageName("");
              }}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Container */}
      <div
        className={`relative rounded-2xl border transition-all duration-200 ${
          isDragOver
            ? "border-purple-500/60 bg-purple-500/5"
            : "border-slate-700/50 hover:border-slate-600/70"
        }`}
        style={{ background: "rgba(15, 15, 30, 0.8)" }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-purple-500/10 backdrop-blur-sm z-10 gap-1">
            <FileText size={22} className="text-purple-400" />
            <p className="text-purple-300 text-sm font-medium">
              Drop image or PDF to attach
            </p>
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... (Shift+Enter for newline)"
          rows={1}
          className="w-full bg-transparent text-slate-200 placeholder-slate-600 text-sm resize-none outline-none px-4 pt-3.5 pb-3 leading-relaxed"
          style={{ maxHeight: 200, minHeight: 52 }}
          disabled={isLoading && !text}
        />

        {/* Bottom Controls */}
        <div className="flex items-center justify-between px-3 pb-3 gap-2">
          {/* Left: attach buttons */}
          <div className="flex items-center gap-1">
            {/* Image attach */}
            <button
              id="attach-image-btn"
              onClick={() => imageInputRef.current?.click()}
              className="p-2 rounded-xl hover:bg-slate-700/50 text-slate-500 hover:text-slate-300 transition-colors"
              title="Attach image (for AI vision analysis)"
            >
              <ImagePlus size={16} />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageFile(file);
                e.target.value = "";
              }}
            />

            {/* PDF / doc attach */}
            <button
              id="attach-doc-btn"
              onClick={() => pdfInputRef.current?.click()}
              className="p-2 rounded-xl hover:bg-slate-700/50 text-slate-500 hover:text-blue-400 transition-colors"
              title="Attach PDF or text file (indexes into RAG)"
            >
              <FileText size={16} />
            </button>
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleDocumentFile(file);
                e.target.value = "";
              }}
            />

            <span className="text-xs text-slate-700 hidden sm:block pl-1">
              Drop image or PDF here
            </span>
          </div>

          {/* Right: Send / Stop */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-700 hidden sm:block">
              {text.length > 0 ? `${text.length} chars` : "Enter to send"}
            </span>
            {isLoading ? (
              <button
                id="stop-generation-btn"
                onClick={onStopGeneration}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors text-xs font-medium"
              >
                <Square size={12} />
                Stop
              </button>
            ) : (
              <button
                id="send-message-btn"
                onClick={handleSend}
                disabled={!canSend}
                className="p-2.5 rounded-xl transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
                style={
                  canSend
                    ? {
                        background:
                          "linear-gradient(135deg, #8b5cf6, #3b82f6)",
                        boxShadow: "0 2px 10px rgba(139,92,246,0.4)",
                      }
                    : { background: "rgba(100,100,120,0.3)" }
                }
              >
                <Send size={15} className="text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-700">
        Cypher Lite guides learning. Always verify important facts.
      </p>
    </div>
  );
}
