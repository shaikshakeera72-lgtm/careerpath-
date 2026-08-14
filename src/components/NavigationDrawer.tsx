import React from 'react';
import { X, LayoutGrid, TrendingUp, Brain, User, Sparkles, Compass, HelpCircle, Shield, RotateCcw } from 'lucide-react';
import { TabType, UserProfile, RoadmapData } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  userProfile: UserProfile;
  roadmapData: RoadmapData;
  onStartOnboarding: () => void;
  onExploreCareers: () => void;
  onShowHeroView: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onChangeTab,
  userProfile,
  roadmapData,
  onStartOnboarding,
  onExploreCareers,
  onShowHeroView,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
      {/* Backdrop click */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-72 sm:w-80 bg-white h-full shadow-2xl flex flex-col justify-between border-r border-slate-100 animate-slideIn">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight text-indigo-700 font-['Plus_Jakarta_Sans',sans-serif]">
              CareerPath AI
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 text-indigo-700" />
            </button>
          </div>

          {/* User Mini Card */}
          <div className="p-4 mx-4 my-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {userProfile.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{userProfile.name}</p>
              <p className="text-[11px] text-indigo-700 font-semibold truncate">{roadmapData.roleTitle}</p>
              <p className="text-[10px] text-slate-500">{roadmapData.readinessScore}% Career Readiness</p>
            </div>
          </div>

          {/* Primary Navigation Links */}
          <div className="px-3 py-2 space-y-1">
            {[
              { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutGrid },
              { id: 'roadmap' as TabType, label: 'Roadmap', icon: TrendingUp },
              { id: 'skills' as TabType, label: 'Skills & Competencies', icon: Brain },
              { id: 'profile' as TabType, label: 'Profile & Education', icon: User },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onChangeTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Tools & Shortcuts */}
          <div className="px-3 pt-3 border-t border-slate-100 mt-2 space-y-1">
            <span className="px-3 text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
              Quick Actions
            </span>

            <button
              onClick={() => {
                onShowHeroView();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Landing Hero Showcase</span>
            </button>

            <button
              onClick={() => {
                onStartOnboarding();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>5-Step Assessment Wizard</span>
            </button>

            <button
              onClick={() => {
                onExploreCareers();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Explore All Career Paths</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
          CareerPath AI • v2.4
        </div>
      </div>
    </div>
  );
};
