import React from 'react';
import { User, GraduationCap, Calendar, Target, Flame, Trophy, Download, RotateCcw, Sparkles, ChevronRight, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, RoadmapData } from '../types';

interface ProfileViewProps {
  userProfile: UserProfile;
  roadmapData: RoadmapData;
  onRetakeAssessment: () => void;
  onSwitchRole: () => void;
  onResetAll: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  roadmapData,
  onRetakeAssessment,
  onSwitchRole,
  onResetAll,
}) => {
  const handleExportRoadmap = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ userProfile, roadmapData }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${userProfile.name.toLowerCase()}_${roadmapData.roleTitle.toLowerCase()}_roadmap.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-md mx-auto px-5 pt-4 pb-28 space-y-5 bg-radial-glow">
      {/* Header Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center gap-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-md shrink-0">
          {userProfile.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight truncate">
            {userProfile.name}
          </h2>
          <p className="text-xs text-indigo-600 font-semibold truncate">
            Targeting {userProfile.targetRole}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              {userProfile.streakDays} Days
            </span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              {roadmapData.readinessScore}% Ready
            </span>
          </div>
        </div>
      </motion.div>

      {/* Academic Background Details (From Onboarding Step 1) */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3.5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Academic & Education Profile
        </h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">College / University</p>
              <p className="text-xs font-bold text-slate-800">{userProfile.university}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Degree</p>
              <p className="text-xs font-bold text-slate-800">{userProfile.degree}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Graduation Year</p>
              <p className="text-xs font-bold text-slate-800">{userProfile.gradYear}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onRetakeAssessment}
          className="w-full mt-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Edit Profile & Education
        </button>
      </div>

      {/* Target Role & Roadmap Actions */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          Career Roadmap Management
        </h3>

        <div className="space-y-2">
          <button
            onClick={onSwitchRole}
            className="w-full p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 text-left transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-indigo-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">Switch Target Role</p>
                <p className="text-[10px] text-slate-400">Currently: {roadmapData.roleTitle}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleExportRoadmap}
            className="w-full p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 text-left transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="text-xs font-bold text-slate-800">Export Roadmap JSON</p>
                <p className="text-[10px] text-slate-400">Save your progress offline</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={onResetAll}
            className="w-full p-3 rounded-2xl border border-rose-100 hover:bg-rose-50/50 text-left transition-all flex items-center justify-between cursor-pointer group text-rose-600"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <div>
                <p className="text-xs font-bold text-rose-700">Reset All Data to Demo</p>
                <p className="text-[10px] text-rose-400">Restore original Stanford / Data Scientist baseline</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-300 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
