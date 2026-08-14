import React, { useState } from 'react';
import { Sparkles, Flame, CheckCircle2, Circle, ArrowRight, BookOpen, BrainCircuit, Trophy, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { CircularProgress } from './CircularProgress';
import { UserProfile, RoadmapData, DailyFocusTask } from '../types';

interface DashboardViewProps {
  userProfile: UserProfile;
  roadmapData: RoadmapData;
  dailyTasks: DailyFocusTask[];
  onToggleDailyTask: (taskId: string) => void;
  onGoToRoadmap: () => void;
  onOpenLearningModule: (phaseId: string) => void;
  onStartQuiz: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  roadmapData,
  dailyTasks,
  onToggleDailyTask,
  onGoToRoadmap,
  onOpenLearningModule,
  onStartQuiz,
}) => {
  // Time-based greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const completedTasksCount = dailyTasks.filter((t) => t.completed).length;

  return (
    <div className="w-full max-w-md mx-auto px-5 pt-4 pb-24 space-y-5 bg-radial-glow">
      {/* Top Greeting (Matching Screenshot Image 5) */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-slate-900 tracking-tight leading-tight font-['Plus_Jakarta_Sans',sans-serif]">
          {getGreeting()},<br />
          <span className="text-slate-900">{userProfile.name}</span>{' '}
          <span className="inline-block animate-wave origin-bottom-right">👋</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Here is a quick overview of your progress today.
        </p>
      </motion.div>

      {/* Main Career Readiness Card (Matching Screenshot Image 5) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/90 text-center relative overflow-hidden"
      >
        {/* Large Circular Gauge */}
        <div className="my-2 flex justify-center">
          <CircularProgress percentage={roadmapData.readinessScore || 42} size={190} strokeWidth={15} />
        </div>

        {/* Career Readiness Label & Encouragement */}
        <h3 className="text-lg font-bold text-slate-900 mt-2 mb-1.5 tracking-tight">
          Career Readiness
        </h3>
        <p className="text-xs text-slate-600 font-normal leading-relaxed max-w-xs mx-auto mb-4">
          You are making steady progress. Keep up the momentum to reach your{' '}
          <span className="font-semibold text-slate-800">{roadmapData.roleTitle}</span> goal.
        </p>

        {/* 18 of 42 skills completed Badge (Exact Match to Screenshot) */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50/80 border border-indigo-100 text-indigo-800 text-xs font-semibold shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-indigo-700 stroke-[2.5]" />
          <span>{userProfile.completedSkillsCount} of {userProfile.totalSkillsCount} skills completed</span>
        </div>
      </motion.div>

      {/* TODAY'S FOCUS Section (Matching Screenshot Image 5 bottom) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100"
      >
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold tracking-wider uppercase text-indigo-600">
              TODAY'S FOCUS
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{userProfile.streakDays} Day Streak</span>
          </div>
        </div>

        {/* Daily Tasks List */}
        <div className="mt-3.5 space-y-2.5">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleDailyTask(task.id)}
              className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer select-none ${
                task.completed
                  ? 'bg-slate-50/80 border-slate-200/70 text-slate-400'
                  : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/20'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <div>
                  <p className={`text-xs font-semibold leading-snug ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {task.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ~{task.minutes} mins
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                +{task.xp} XP
              </span>
            </div>
          ))}
        </div>

        {/* Quick Study Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={onStartQuiz}
            className="p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs font-bold text-slate-900">AI Daily Quiz</p>
            <p className="text-[10px] text-slate-500">Test core DSA knowledge</p>
          </button>

          <button
            onClick={() => onOpenLearningModule('phase-2')}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-left transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs font-bold text-slate-900">Active Phase</p>
            <p className="text-[10px] text-slate-500">Resume Phase 2: DSA</p>
          </button>
        </div>
      </motion.div>

      {/* Target Role Mini Preview */}
      <div className="p-4 rounded-3xl bg-linear-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between shadow-md">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-300">
            Current Target
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            {roadmapData.roleTitle}
          </h4>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Expected Salary: {roadmapData.salaryRange || '$120k+'}
          </p>
        </div>
        <button
          onClick={onGoToRoadmap}
          className="px-3.5 py-2 bg-white text-slate-900 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
        >
          <span>Roadmap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
