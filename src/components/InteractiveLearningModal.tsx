import React, { useState } from 'react';
import { X, CheckCircle2, Circle, Sparkles, BookOpen, BrainCircuit, Code2, ArrowRight, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RoadmapPhase } from '../types';

interface InteractiveLearningModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase: RoadmapPhase | null;
  roleTitle: string;
  onToggleMilestone: (phaseId: string, milestoneId: string) => void;
  onOpenQuiz: (topic: string) => void;
}

export const InteractiveLearningModal: React.FC<InteractiveLearningModalProps> = ({
  isOpen,
  onClose,
  phase,
  roleTitle,
  onToggleMilestone,
  onOpenQuiz,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  if (!isOpen || !phase) return null;

  const handleAskAi = async (topicTitle: string) => {
    setSelectedTopic(topicTitle);
    setIsLoadingAi(true);
    setAiExplanation('');

    try {
      const res = await fetch('/api/ai/explain-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicTitle,
          role: roleTitle,
          context: phase.title,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiExplanation(data.explanation || '');
      }
    } catch (err) {
      console.warn('AI Explainer fetch failed:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const completedCount = phase.milestones?.filter((m) => m.completed).length || 0;
  const totalCount = phase.milestones?.length || 1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-white/95 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600">
              LEARNING MODULE
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {phase.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-indigo-700" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 hide-scrollbar">
          {/* Overview Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-indigo-900">
            <p className="text-xs font-medium leading-relaxed">
              {phase.description}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-700">
                Progress: {completedCount} of {totalCount} completed
              </span>
              <span className="font-extrabold text-indigo-600">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>

          {/* Milestones Checklist */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
              Phase Milestones & Practice Goals
            </h4>

            <div className="space-y-2.5">
              {phase.milestones && phase.milestones.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2 ${
                    m.completed
                      ? 'bg-slate-50 border-slate-200 text-slate-500'
                      : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      onClick={() => onToggleMilestone(phase.id, m.id)}
                      className="flex items-start gap-3 cursor-pointer flex-1 select-none"
                    >
                      <div className="mt-0.5 shrink-0">
                        {m.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${m.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {m.title}
                        </p>
                        {m.estimatedTime && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            Est: {m.estimatedTime}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAskAi(m.title)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-[11px] font-bold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>AI Tutor</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Explanation Area */}
          {(isLoadingAi || aiExplanation) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-slate-900 text-slate-100 shadow-md space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    AI Mentor Breakdown: {selectedTopic}
                  </span>
                </div>
              </div>

              {isLoadingAi ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                  <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>Consulting Gemini career knowledge graph...</span>
                </div>
              ) : (
                <div className="text-xs space-y-2.5 leading-relaxed text-slate-300 font-normal whitespace-pre-wrap font-sans">
                  {aiExplanation}
                </div>
              )}
            </motion.div>
          )}

          {/* Quick Quiz CTA */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-md">
            <div>
              <h5 className="text-sm font-bold text-white">
                Test Your Phase Readiness
              </h5>
              <p className="text-[11px] text-indigo-100">
                Take a 3-question adaptive quiz on {phase.title}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenQuiz(phase.title);
              }}
              className="px-3.5 py-2 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
