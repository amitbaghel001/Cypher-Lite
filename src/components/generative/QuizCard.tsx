// =============================================================
// components/generative/QuizCard.tsx — Interactive Quiz Component
// =============================================================

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Check, X, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { QuizQuestion } from "@/types";

interface QuizCardProps {
  questions: QuizQuestion[];
}

export function QuizCard({ questions }: QuizCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      setCompleted(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return {
        base: "border-slate-700/50 hover:border-purple-500/40 hover:bg-purple-500/5 cursor-pointer",
        text: "text-slate-300",
      };
    }
    if (index === currentQ.correctIndex) {
      return {
        base: "border-green-500/50 bg-green-500/10",
        text: "text-green-300",
      };
    }
    if (index === selectedAnswer && index !== currentQ.correctIndex) {
      return {
        base: "border-red-500/50 bg-red-500/10",
        text: "text-red-300",
      };
    }
    return {
      base: "border-slate-800/50 opacity-40",
      text: "text-slate-500",
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border overflow-hidden"
      style={{
        background: "rgba(15, 15, 30, 0.9)",
        borderColor: "rgba(139, 92, 246, 0.25)",
        boxShadow: "0 4px 24px rgba(139, 92, 246, 0.1)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "rgba(139, 92, 246, 0.1)",
          borderColor: "rgba(139, 92, 246, 0.2)",
        }}
      >
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-purple-400" />
          <span
            className="text-sm font-semibold text-purple-300"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Quiz Time
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {currentIndex + 1} / {questions.length}
          </span>
          <button
            id="quiz-reset-btn"
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-500 hover:text-white transition-colors"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      <div className="p-5">
        {completed ? (
          /* Score Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <Trophy size={40} className="mx-auto mb-3 text-yellow-400" />
            <h3
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Quiz Complete!
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              You scored{" "}
              <span className="text-purple-400 font-semibold">
                {score}/{questions.length}
              </span>{" "}
              ({Math.round((score / questions.length) * 100)}%)
            </p>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(score / questions.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-2 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
                }}
              />
            </div>
            <p className="text-slate-500 text-xs mb-4">
              {score === questions.length
                ? "🎉 Perfect score! Amazing work!"
                : score >= questions.length * 0.7
                ? "👍 Great job! Keep it up!"
                : "💪 Keep practicing — you'll get there!"}
            </p>
            <button
              id="quiz-retry-btn"
              onClick={handleReset}
              className="px-6 py-2 rounded-xl text-white text-sm font-medium transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="w-full bg-slate-800/50 rounded-full h-1 mb-4">
              <motion.div
                animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                className="h-1 rounded-full"
                style={{ background: "linear-gradient(90deg, #8b5cf6, #3b82f6)" }}
              />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-slate-200 font-medium mb-4 text-sm leading-relaxed">
                  {currentQ.question}
                </p>

                {/* Options */}
                <div className="space-y-2 mb-4">
                  {currentQ.options.map((option, index) => {
                    const style = getOptionStyle(index);
                    return (
                      <button
                        key={index}
                        id={`quiz-option-${index}`}
                        onClick={() => handleAnswer(index)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${style.base}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            showResult && index === currentQ.correctIndex
                              ? "border-green-500 bg-green-500/20 text-green-400"
                              : showResult && index === selectedAnswer
                              ? "border-red-500 bg-red-500/20 text-red-400"
                              : "border-slate-600 text-slate-500"
                          }`}
                        >
                          {showResult && index === currentQ.correctIndex ? (
                            <Check size={12} />
                          ) : showResult && index === selectedAnswer ? (
                            <X size={12} />
                          ) : (
                            ["A", "B", "C", "D"][index]
                          )}
                        </span>
                        <span className={`text-sm ${style.text}`}>{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50"
                    >
                      <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-purple-400 font-semibold">Explanation: </span>
                        {currentQ.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                {showResult && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="quiz-next-btn"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:scale-105 ml-auto"
                    style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
                  >
                    {isLast ? "See Results" : "Next Question"}
                    <ChevronRight size={15} />
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}
