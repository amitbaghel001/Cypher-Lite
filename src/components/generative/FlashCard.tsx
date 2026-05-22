// =============================================================
// components/generative/FlashCard.tsx — 3D Flip Flashcard Deck
// =============================================================

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";
import { FlashCard } from "@/types";

interface FlashCardDeckProps {
  cards: FlashCard[];
}

export function FlashCardDeck({ cards: initialCards }: FlashCardDeckProps) {
  const [cards, setCards] = useState(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const current = cards[currentIndex];

  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection("right");
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((i) => i + 1), 100);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection("left");
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((i) => i - 1), 100);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCards(initialCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(15, 15, 30, 0.9)",
        borderColor: "rgba(6, 182, 212, 0.25)",
        boxShadow: "0 4px 24px rgba(6, 182, 212, 0.1)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "rgba(6, 182, 212, 0.08)",
          borderColor: "rgba(6, 182, 212, 0.2)",
        }}
      >
        <div className="flex items-center gap-2">
          <BookMarked size={16} className="text-cyan-400" />
          <span
            className="text-sm font-semibold text-cyan-300"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Flashcards
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {currentIndex + 1} / {cards.length}
          </span>
          <button
            id="flashcard-shuffle-btn"
            onClick={handleShuffle}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-500 hover:text-cyan-400 transition-colors"
            title="Shuffle"
          >
            <Shuffle size={13} />
          </button>
          <button
            id="flashcard-reset-btn"
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-500 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Progress */}
        <div className="w-full bg-slate-800/50 rounded-full h-1 mb-5">
          <motion.div
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            className="h-1 rounded-full"
            style={{ background: "linear-gradient(90deg, #06b6d4, #3b82f6)" }}
          />
        </div>

        {/* Card */}
        <div
          className="flashcard-container cursor-pointer mb-5"
          style={{ height: 160 }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentIndex}-${isFlipped}`}
              initial={{ opacity: 0, rotateY: isFlipped ? -90 : 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: isFlipped ? 90 : -90 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-full flex items-center justify-center rounded-2xl p-6 text-center"
              style={
                !isFlipped
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.1))",
                      border: "1px solid rgba(6, 182, 212, 0.3)",
                    }
                  : {
                      background:
                        "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                    }
              }
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  {isFlipped ? "Answer" : "Question"}
                </p>
                <p className="text-slate-200 font-medium text-sm leading-relaxed">
                  {isFlipped ? current.back : current.front}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-slate-600 mb-4">
          Click card to flip
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <button
            id="flashcard-prev-btn"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-slate-700/50 hover:border-slate-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
          >
            <ChevronLeft size={15} />
            Prev
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {cards.slice(0, Math.min(cards.length, 8)).map((_, i) => (
              <button
                key={i}
                id={`flashcard-dot-${i}`}
                onClick={() => { setCurrentIndex(i); setIsFlipped(false); }}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{
                  background: i === currentIndex ? "#06b6d4" : "rgba(100,100,120,0.4)",
                  transform: i === currentIndex ? "scale(1.4)" : "scale(1)",
                }}
              />
            ))}
          </div>

          <button
            id="flashcard-next-btn"
            onClick={goNext}
            disabled={currentIndex === cards.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white border border-cyan-500/30 hover:border-cyan-500/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            style={{ background: "rgba(6, 182, 212, 0.15)" }}
          >
            Next
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
