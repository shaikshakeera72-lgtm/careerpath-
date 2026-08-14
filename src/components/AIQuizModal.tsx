import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, ArrowRight, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';

interface AIQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: string;
  roleTitle?: string;
}

export const AIQuizModal: React.FC<AIQuizModalProps> = ({
  isOpen,
  onClose,
  topic = 'Data Structures & Machine Learning',
  roleTitle = 'Data Scientist',
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, role: roleTitle }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch (err) {
      console.warn('Failed to load quiz:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen, topic]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 min-h-[460px] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-white/95 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              AI Readiness Quiz
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-indigo-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Generating adaptive AI questions for {topic}...</p>
            </div>
          ) : isCompleted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Quiz Completed!
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  You scored <span className="font-bold text-indigo-600">{score}</span> out of {questions.length}
                </p>
              </div>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed bg-indigo-50/70 p-3 rounded-2xl border border-indigo-100">
                {score === questions.length
                  ? '🎉 Outstanding! You demonstrate solid conceptual mastery of this milestone.'
                  : '💡 Great effort! Review the flashcard breakdown to solidify key gotchas.'}
              </p>
              <div className="pt-3 flex gap-2">
                <button
                  onClick={fetchQuestions}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : currentQ ? (
            <div className="space-y-4">
              {/* Question Count & Progress */}
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span>QUESTION {currentIndex + 1} OF {questions.length}</span>
                <span>Score: {score}</span>
              </div>

              {/* Question Headline */}
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {currentQ.options.map((opt, idx) => {
                  const isCorrect = idx === currentQ.correctIndex;
                  const isSelected = selectedAnswer === idx;

                  let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-300';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-3 rounded-2xl border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box when answered */}
              {isAnswered && (
                <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-xs text-indigo-950 space-y-1 animate-fadeIn">
                  <p className="font-bold text-indigo-900">Explanation:</p>
                  <p className="text-[11px] leading-relaxed text-indigo-800">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Next Button */}
          {!isLoading && !isCompleted && (
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
