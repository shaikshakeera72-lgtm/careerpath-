import React from 'react';
import { X, Bell, Check, Flame, Sparkles, BookOpen, Clock } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-white/95 border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Notifications & Study Alerts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-indigo-700" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1 hide-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                !n.read
                  ? 'bg-indigo-50/50 border-indigo-100 shadow-2xs'
                  : 'bg-white border-slate-100 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {n.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {n.time}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                {n.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
