// =============================================================
// components/upload/FileUploadZone.tsx — PDF/Text Upload Component
// =============================================================

"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";

interface FileUploadZoneProps {
  sessionId: string;
  onUploadSuccess: (fileName: string) => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export function FileUploadZone({ sessionId, onUploadSuccess }: FileUploadZoneProps) {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [message, setMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const allowed = ["application/pdf", "text/plain", "text/markdown"];
      const isAllowed =
        allowed.includes(file.type) ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".md");

      if (!isAllowed) {
        setStatus("error");
        setMessage("Only PDF, TXT, or MD files supported.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setStatus("error");
        setMessage("File too large (max 10MB).");
        return;
      }

      setStatus("uploading");
      setMessage(`Uploading ${file.name}...`);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("sessionId", sessionId);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setStatus("success");
        setMessage(data.message || `Indexed ${data.chunksAdded} chunks`);
        onUploadSuccess(file.name);

        // Reset after 3s
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 3000);
      } catch (err: unknown) {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Upload failed");
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 4000);
      }
    },
    [sessionId, onUploadSuccess]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? "border-purple-500/60 bg-purple-500/10"
            : "border-slate-700/50 hover:border-slate-600"
        }`}
        onClick={() => status === "idle" && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,text/plain,text/markdown,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <Upload size={20} className="text-slate-600" />
              <p className="text-xs text-slate-500">
                Drop PDF or TXT file here
              </p>
              <p className="text-xs text-slate-700">Max 10MB</p>
            </motion.div>
          )}

          {status === "uploading" && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <Loader2 size={20} className="text-purple-400 animate-spin" />
              <p className="text-xs text-purple-300">{message}</p>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <CheckCircle size={20} className="text-green-400" />
              <p className="text-xs text-green-300">{message}</p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <AlertCircle size={20} className="text-red-400" />
              <p className="text-xs text-red-300">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
