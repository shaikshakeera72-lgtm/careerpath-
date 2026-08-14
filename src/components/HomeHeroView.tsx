import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';
import { CircularProgress } from './CircularProgress';
import { RoadmapData } from '../types';

interface HomeHeroViewProps {
  onStartOnboarding: () => void;
  onExploreCareers: () => void;
  onGoToRoadmap: () => void;
  currentRoadmap: RoadmapData;
}

export const HomeHeroView: React.FC<HomeHeroViewProps> = ({
  onStartOnboarding,
  onExploreCareers,
  onGoToRoadmap,
  currentRoadmap,
}) => {
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({
    'Python Basics': true,
    'Data Structures': false,
  });

  const toggleCheck = (name: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // Compute demo readiness based on checkboxes
  const demoPercentage =
    checkedItems['Python Basics'] && checkedItems['Data Structures']
      ? 64
      : checkedItems['Python Basics'] || checkedItems['Data Structures']
      ? 42
      : 20;

  return (
    <div className="w-full max-w-md mx-auto px-5 pt-4 pb-24 bg-radial-glow">
      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 shadow-xs"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>AI-Powered Career Guidance</span>
      </motion.div>

      {/* Hero Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-[34px] sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4 font-['Plus_Jakarta_Sans',sans-serif]"
      >
        Your Career.<br />
        <span className="text-indigo-600">Your Roadmap.</span><br />
        Powered by AI.
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-slate-600 text-sm sm:text-base leading-relaxed mb-7 font-normal"
      >
        Discover the skills you need, what to learn next, and which projects can take you from beginner to job-ready.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="space-y-3 mb-8"
      >
        <button
          onClick={onStartOnboarding}
          className="w-full py-3.5 px-5 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          <span>Create My Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onExploreCareers}
          className="w-full py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition-all flex items-center justify-center cursor-pointer active:scale-[0.99]"
        >
          <span>Explore Careers</span>
        </button>
      </motion.div>

      {/* Career Readiness Preview Card (Matching Screenshot Image 3) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/90 relative overflow-hidden"
      >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Career Readiness
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentRoadmap.roleTitle || 'Software Engineer'} Role
            </p>
          </div>
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <BrainCircuit className="w-5 h-5" />
          </div>
        </div>

        {/* Circular Meter */}
        <div className="my-3 flex justify-center">
          <CircularProgress percentage={demoPercentage} size={170} strokeWidth={13} />
        </div>

        {/* Encouraging Subtext */}
        <p className="text-center text-xs font-medium text-slate-600 mb-5">
          You are on your way! Let's close the gap.
        </p>

        {/* Interactive Checkbox Items */}
        <div className="space-y-2.5">
          <div
            onClick={() => toggleCheck('Python Basics')}
            className="flex items-center gap-3 p-3 rounded-xl border border-indigo-100 bg-indigo-50/40 cursor-pointer hover:bg-indigo-50/70 transition-colors select-none"
          >
            {checkedItems['Python Basics'] ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 shrink-0" />
            )}
            <span className="text-xs font-semibold text-slate-800">
              Python Basics
            </span>
          </div>

          <div
            onClick={() => toggleCheck('Data Structures')}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors select-none"
          >
            {checkedItems['Data Structures'] ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50 shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 shrink-0" />
            )}
            <span className="text-xs font-semibold text-slate-800">
              Data Structures
            </span>
          </div>
        </div>

        {/* Quick jump to full roadmap */}
        <button
          onClick={onGoToRoadmap}
          className="mt-4 w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 py-1 transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          View Full Interactive Roadmap
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
};
