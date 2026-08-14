import React from 'react';
import { X, ArrowRight, TrendingUp, DollarSign, Check, Sparkles } from 'lucide-react';
import { defaultRoadmaps } from '../data/initialData';
import { RoadmapData } from '../types';

interface ExploreCareersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: string;
  onSelectRole: (roadmap: RoadmapData) => void;
  onStartCustomOnboarding: () => void;
}

export const ExploreCareersModal: React.FC<ExploreCareersModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onStartCustomOnboarding,
}) => {
  if (!isOpen) return null;

  const roles = Object.values(defaultRoadmaps);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-white/95 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600">
              EXPLORE PATHS
            </span>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Career Catalog
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-indigo-700" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 space-y-3.5 overflow-y-auto flex-1 hide-scrollbar">
          {roles.map((item) => {
            const isCurrent = currentRole === item.roleTitle;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-indigo-50/60 border-indigo-600 ring-1 ring-indigo-500 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100">
                      {item.roleCategory}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {item.roleTitle}
                    </h4>
                  </div>
                  {isCurrent && (
                    <span className="text-[11px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                      <Check className="w-3 h-3 text-indigo-600" />
                      Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.salaryRange}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{item.demandGrowth}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    {item.phases.length} Phases • {item.totalRequiredSkillsCount} Skills
                  </span>

                  {!isCurrent ? (
                    <button
                      onClick={() => {
                        onSelectRole(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Switch Path</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Current Focus
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Custom Role Generator Promo */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-slate-900 to-indigo-950 text-white space-y-2">
            <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Looking for another role?</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Take the 5-step AI assessment to generate a custom curriculum for Cybersecurity, DevOps, Mobile Dev, or any niche specialty.
            </p>
            <button
              onClick={() => {
                onClose();
                onStartCustomOnboarding();
              }}
              className="w-full py-2 bg-white text-slate-950 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Start Custom Career Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
