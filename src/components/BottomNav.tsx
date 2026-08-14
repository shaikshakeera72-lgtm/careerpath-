import React from 'react';
import { LayoutGrid, TrendingUp, Brain, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'roadmap' as TabType,
      label: 'Roadmap',
      icon: TrendingUp,
    },
    {
      id: 'skills' as TabType,
      label: 'Skills',
      icon: Brain,
    },
    {
      id: 'profile' as TabType,
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 backdrop-blur-lg border-t border-slate-100 px-3 py-2 flex items-center justify-around shadow-lg sm:max-w-lg md:max-w-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[12px] tracking-tight mt-0.5">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
