import React, { useState } from 'react';
import { Home, Target, Timer, Calendar, Plus } from 'lucide-react';
import { NotesJournalView } from './NotesJournalView';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  // The "+" button doesn't navigate to a tab — it opens a standalone,
  // full-screen notes/journal screen on top of everything else.
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'خانه', icon: Home },
    { id: 'goals', label: 'اهداف روز', icon: Target },
    { id: 'focus', label: 'تمرکز', icon: Timer },
    { id: 'timeline', label: 'برنامه روز', icon: Calendar },
  ];

  return (
    <>
      <nav
        dir="ltr"
        className="fixed bottom-0 inset-x-0 z-40 px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-2 pointer-events-none font-sans"
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {/* Pill containing the 4 main sections. Inactive items show only
              their icon; the active one expands to show its icon + label,
              matching the reference navigation bar. */}
          <div className="pointer-events-auto flex-1 flex items-center justify-between gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-full border border-slate-200/80 dark:border-slate-800 shadow-2xl px-2 py-2 min-w-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 rounded-full transition-all shrink-0 ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-2.5'
                      : 'text-slate-400 dark:text-slate-500 px-3 py-2.5'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                  {isActive && (
                    <span className="text-xs font-bold whitespace-nowrap">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Floating "+" button, orange, opens the daily notes/journal screen */}
          <button
            onClick={() => setIsNotesOpen(true)}
            className="pointer-events-auto shrink-0 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-orange-500/30 transition-all"
            title="یادداشت جدید"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </nav>

      {isNotesOpen && <NotesJournalView onClose={() => setIsNotesOpen(false)} />}
    </>
  );
};
