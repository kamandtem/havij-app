import React, { useState } from 'react';
import { Home, Target, Timer, Scissors, PenLine } from 'lucide-react';
import { NotesJournalView } from './NotesJournalView';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  // The pen button doesn't navigate to a tab — it opens a standalone,
  // full-screen notes/journal screen on top of everything else.
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Rendered inside a dir="ltr" bar (see below), so the LAST item here ends
  // up closest to the pen button on the right. Ordered so that reading from
  // the right edge of the screen you get: پن ، خانه ، اهداف روز ، تمرکز ، خردکننده کارها
  const navItems = [
    { id: 'decomposer', label: 'خردکننده کارها', icon: Scissors },
    { id: 'focus', label: 'تمرکز', icon: Timer },
    { id: 'goals', label: 'اهداف روز', icon: Target },
    { id: 'dashboard', label: 'خانه', icon: Home },
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
          <div className="pointer-events-auto flex-1 flex items-center justify-between gap-0.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg rounded-full border border-slate-200/80 dark:border-slate-800 shadow-2xl px-1.5 py-2 min-w-0 overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 rounded-full transition-all min-w-0 ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white px-3.5 py-3'
                      : 'text-slate-400 dark:text-slate-500 px-3 py-3'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                  {isActive && (
                    <span className="text-xs font-bold whitespace-nowrap truncate max-w-[84px]">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Floating pen button, orange, opens the daily notes/journal screen */}
          <button
            onClick={() => setIsNotesOpen(true)}
            className="pointer-events-auto shrink-0 w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-orange-500/30 transition-all"
            title="یادداشت جدید"
          >
            <PenLine className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>
      </nav>

      {isNotesOpen && <NotesJournalView onClose={() => setIsNotesOpen(false)} />}
    </>
  );
};
