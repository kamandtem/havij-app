import React from 'react';
import { Menu } from 'lucide-react';
import { DailyGoal, DailyLog, SleepLog } from '../types';
import { NotificationBell } from './NotificationBell';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDrawer: () => void;
  dailyGoals: DailyGoal[];
  dailyLogs: DailyLog[];
  sleepLogs: SleepLog[];
  focusIsRunning: boolean;
  focusTimeLeftSeconds: number;
  focusTaskTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDrawer,
  dailyGoals,
  dailyLogs,
  sleepLogs,
  focusIsRunning,
  focusTimeLeftSeconds,
  focusTaskTitle
}) => {
  return (
    // Soft gradient zone behind the floating header — it doesn't touch the
    // top of the screen and fades into the page background below it.
    <header className="sticky top-0 z-40 pt-3 pb-4 px-3 bg-gradient-to-b from-orange-100/70 via-orange-50/40 to-transparent dark:from-orange-950/30 dark:via-slate-900/30 dark:to-transparent transition-colors font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[24px] border border-slate-100/80 dark:border-slate-800 shadow-lg shadow-slate-200/70 dark:shadow-black/30 px-3 py-2.5 transition-colors">

        {/* Right Side (RTL start): Hamburger + Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            className="p-3 rounded-2xl bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-slate-700 transition-all border border-orange-200 dark:border-slate-700 flex items-center justify-center shadow-xs"
            title="منوی برنامه‌ریز هویج"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/80 border-2 border-orange-300 dark:border-orange-500 rounded-2xl flex items-center justify-center shadow-xs text-2xl">
              🥕
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                هویج
              </h1>
              <p className="text-xs font-bold text-orange-600 dark:text-orange-400 hidden sm:block">
                دستیار تمرکز و برنامه‌ریز ADHD
              </p>
            </div>
          </div>
        </div>

        {/* Left Side (RTL end): Reminders Bell */}
        <div className="flex items-center gap-2.5">
          {/* Reminders */}
          <NotificationBell
            dailyGoals={dailyGoals}
            dailyLogs={dailyLogs}
            sleepLogs={sleepLogs}
            focusIsRunning={focusIsRunning}
            focusTimeLeftSeconds={focusTimeLeftSeconds}
            focusTaskTitle={focusTaskTitle}
            setActiveTab={setActiveTab}
          />
        </div>

      </div>
    </header>
  );
};
