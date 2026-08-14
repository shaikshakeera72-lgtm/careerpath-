import React from 'react';
import { Menu, Bell, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  onStartOnboarding: () => void;
  showHomeHero?: boolean;
  onToggleHero?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenNotifications,
  unreadNotificationsCount = 2,
  onStartOnboarding,
  showHomeHero,
  onToggleHero,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3.5 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          aria-label="Open Navigation Drawer"
          className="p-1.5 -ml-1 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6 text-indigo-700" />
        </button>
        <div 
          onClick={onToggleHero}
          className="cursor-pointer flex items-center gap-1.5 select-none"
        >
          <span className="text-xl font-bold tracking-tight text-indigo-700 font-['Plus_Jakarta_Sans',sans-serif]">
            CareerPath AI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5 text-indigo-700" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    </header>
  );
};
