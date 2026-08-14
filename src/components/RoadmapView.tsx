import React, { useState } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Lock,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RoadmapData, PriorityLevel } from '../types';

interface RoadmapViewProps {
  roadmapData: RoadmapData;
  onOpenLearningModule: (phaseId: string) => void;
  onSkillGapClick?: (skillName: string) => void;
  onAddKnownSkill?: (skillName: string) => void;
  onSwitchRole?: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmapData,
  onOpenLearningModule,
  onSkillGapClick,
  onAddKnownSkill,
  onSwitchRole,
}) => {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    'phase-1': false,
    'phase-2': true,
    'phase-3': false,
  });

  const [showAddSkillInput, setShowAddSkillInput] = useState(false);
  const [newSkillText, setNewSkillText] = useState('');

  const togglePhase = (id: string) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillText.trim() && onAddKnownSkill) {
      onAddKnownSkill(newSkillText.trim());
      setNewSkillText('');
      setShowAddSkillInput(false);
    }
  };

  const acquiredPercent = Math.round(
    (roadmapData.acquiredSkillsCount / (roadmapData.totalRequiredSkillsCount || 20)) * 100
  );

  return (
    <div className="w-full max-w-md mx-auto px-5 pt-4 pb-28 space-y-4 bg-radial-glow">
      {/* Top Header (Matching Screenshot Image 7) */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-[26px] sm:text-[28px] font-extrabold text-slate-900 tracking-tight leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
            {roadmapData.roleTitle} Roadmap
          </h1>
          {onSwitchRole && (
            <button
              onClick={onSwitchRole}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
            >
              Switch Role
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Track your progress and bridge your skill gaps to land your dream role.
        </p>
      </motion.div>

      {/* 1. Required Skills Acquired Progress Card (Matching Screenshot Image 7) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3"
      >
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {roadmapData.acquiredSkillsCount} of {roadmapData.totalRequiredSkillsCount}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Required Skills Acquired
            </p>
          </div>
          <span className="text-lg font-bold text-indigo-600">
            {acquiredPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-indigo-50 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${acquiredPercent}%` }}
          />
        </div>
      </motion.div>

      {/* 2. "You Know" Card (Matching Screenshot Image 7) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.2]" />
            <h3 className="text-sm font-bold text-slate-900">
              You Know
            </h3>
          </div>
          <button
            onClick={() => setShowAddSkillInput(!showAddSkillInput)}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Skill
          </button>
        </div>

        {/* Add Skill Form */}
        {showAddSkillInput && (
          <form onSubmit={handleAddSkillSubmit} className="flex gap-2 pt-1 pb-1">
            <input
              type="text"
              value={newSkillText}
              onChange={(e) => setNewSkillText(e.target.value)}
              placeholder="e.g. Scikit-Learn, Git"
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 cursor-pointer"
            >
              Add
            </button>
          </form>
        )}

        {/* Chips List */}
        <div className="flex flex-wrap gap-2 pt-0.5">
          {roadmapData.knownSkills.map((skill) => (
            <span
              key={skill}
              className="px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-100 text-indigo-700 text-xs font-semibold select-none shadow-2xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 3. "Learning" Card (Matching Screenshot Image 7) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-600 stroke-[2.2]" />
          <h3 className="text-sm font-bold text-slate-900">
            Learning
          </h3>
        </div>

        <div className="space-y-3.5">
          {roadmapData.learningSkills.map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{item.name}</span>
                <span className="font-bold text-slate-600">{item.progress}%</span>
              </div>
              <div className="w-full bg-indigo-50 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4. "You Need" Card (Matching Screenshot Image 7) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3.5"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500 stroke-[2.2]" />
          <h3 className="text-sm font-bold text-slate-900">
            You Need
          </h3>
        </div>

        <div className="space-y-2.5">
          {roadmapData.neededSkills.map((item) => {
            const priorityBadge =
              item.priority === 'HIGH' ? (
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase tracking-wide border border-rose-100">
                  HIGH
                </span>
              ) : item.priority === 'MEDIUM' ? (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-extrabold uppercase tracking-wide border border-indigo-100">
                  MEDIUM
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-wide border border-slate-200">
                  LOW
                </span>
              );

            const priorityIcon =
              item.priority === 'HIGH' ? (
                <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                  <span className="text-xs font-bold">⌃</span>
                </div>
              ) : item.priority === 'MEDIUM' ? (
                <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                  <span className="text-xs font-bold">⌃</span>
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <span className="text-xs font-bold">-</span>
                </div>
              );

            return (
              <div
                key={item.name}
                onClick={() => onSkillGapClick && onSkillGapClick(item.name)}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {priorityIcon}
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </span>
                </div>
                {priorityBadge}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 5. "Your Journey" Phased Timeline (Matching Screenshot Image 7) */}
      <div className="pt-3">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-4">
          Your Journey
        </h2>

        <div className="relative pl-6 space-y-4">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[11px] top-4 bottom-8 w-0.5 bg-slate-200" />

          {roadmapData.phases.map((phase, idx) => {
            const isCompleted = phase.status === 'completed';
            const isInProgress = phase.status === 'in_progress';
            const isLocked = phase.status === 'locked';
            const isExpanded = expandedPhases[phase.id] ?? isInProgress;

            return (
              <div key={phase.id} className="relative">
                {/* Node Bullet on Timeline */}
                <div className="absolute -left-6 top-5">
                  {isCompleted && (
                    <div className="w-6 h-6 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    </div>
                  )}
                  {isInProgress && (
                    <div className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-indigo-600 flex items-center justify-center text-indigo-600 ring-4 ring-indigo-50">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                    </div>
                  )}
                  {isLocked && (
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    </div>
                  )}
                </div>

                {/* Phase Card */}
                <div
                  className={`rounded-3xl p-5 border transition-all ${
                    isInProgress
                      ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                      : isCompleted
                      ? 'bg-white border-slate-100 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200/80 opacity-80'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                        {phase.title}
                      </h4>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Completed
                        </span>
                      )}
                      {isInProgress && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100/80 text-indigo-700 text-[11px] font-bold">
                          <MessageSquare className="w-3 h-3" />
                          In Progress
                        </span>
                      )}
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {phase.description}
                  </p>

                  {/* Tags */}
                  {phase.tags && phase.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {phase.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* In Progress Action Details & Continue Button */}
                  {isInProgress && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                      {/* Active Progress Bar */}
                      <div className="w-full bg-indigo-50 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${phase.progress || 35}%` }}
                        />
                      </div>

                      {/* Interactive Continue Learning Button (Matching Screenshot) */}
                      <button
                        onClick={() => onOpenLearningModule(phase.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group"
                      >
                        <span>Continue Learning</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
