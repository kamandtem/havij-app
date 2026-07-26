import React, { useState } from 'react';
import { Bell, Target, Smile, Moon, Timer, PartyPopper } from 'lucide-react';
import { DailyGoal, DailyLog, SleepLog } from '../types';
import { getTodayDateString } from '../utils/storage';
import { useBellHint } from '../utils/hint';

interface ReminderItem {
  id: string;
  icon: React.ElementType;
  text: string;
  tab: string;
}

interface NotificationBellProps {
  dailyGoals: DailyGoal[];
  dailyLogs: DailyLog[];
  sleepLogs: SleepLog[];
  focusIsRunning: boolean;
  focusTimeLeftSeconds: number;
  focusTaskTitle: string;
  setActiveTab: (tab: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  dailyGoals,
  dailyLogs,
  sleepLogs,
  focusIsRunning,
  focusTimeLeftSeconds,
  focusTaskTitle,
  setActiveTab
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = getTodayDateString();
  const { showHint, markSeen } = useBellHint();

  // Same logic as the Dashboard: completing all 3 golden goals always
  // means 100%, regardless of total points earned.
  const completedGoalsCount = dailyGoals.filter((g) => g.completed).length;
  const todayProgressPercent = Math.min(100, Math.round((completedGoalsCount / 3) * 100));

  const reminders: ReminderItem[] = [];

  // Focus / Pomodoro status — always shown first when a session is live
  if (focusIsRunning) {
    const mm = String(Math.floor(focusTimeLeftSeconds / 60)).padStart(2, '0');
    const ss = String(focusTimeLeftSeconds % 60).padStart(2, '0');
    reminders.push({
      id: 'focus',
      icon: Timer,
      text: `تایمر تمرکز روشنه${focusTaskTitle ? ` (${focusTaskTitle})` : ''} — ${mm}:${ss} باقی مانده`,
      tab: 'focus'
    });
  }

  // Goals
  if (dailyGoals.length === 0) {
    reminders.push({
      id: 'goals-empty',
      icon: Target,
      text: 'هنوز ۳ هدف طلایی امروزت رو تنظیم نکردی',
      tab: 'goals'
    });
  } else {
    const nextGoal = dailyGoals.find((g) => !g.completed);
    if (nextGoal) {
      reminders.push({
        id: 'goals-next',
        icon: Target,
        text: `هدف بعدی‌ت: ${nextGoal.title}`,
        tab: 'goals'
      });
    }
  }

  // Mood / daily log
  const hasMoodToday = dailyLogs.some((l) => l.date === today);
  if (!hasMoodToday) {
    reminders.push({
      id: 'mood',
      icon: Smile,
      text: 'خلق‌وخوی امروزت رو ثبت نکردی',
      tab: 'dailylog'
    });
  }

  // Sleep log
  const hasSleepToday = sleepLogs.some((l) => l.date === today);
  if (!hasSleepToday) {
    reminders.push({
      id: 'sleep',
      icon: Moon,
      text: 'خواب دیشبت رو ثبت نکردی',
      tab: 'sleep'
    });
  }

  const handleItemClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen((v) => !v);
          // Once opened, the hint is dismissed for good — the user won't
          // need to reopen it on a future visit just to make it stop.
          markSeen();
        }}
        className="relative p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700 transition-colors"
        title="یادآوری‌ها"
      >
        <Bell className={`w-5 h-5 ${showHint ? 'animate-bell-hint' : ''}`} />
        {reminders.length > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900">
            {reminders.length > 9 ? '9+' : reminders.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Invisible backdrop to catch outside taps and close the panel */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div
            dir="rtl"
            className="absolute left-0 top-[calc(100%+10px)] z-50 w-72 max-w-[85vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[22px] border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in duration-150"
          >
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black text-slate-700 dark:text-slate-200">یادآوری‌های امروز</span>
            </div>

            {/* Today's progress — same 3-golden-goals logic as the Dashboard */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <span>پیشرفت امروز</span>
                <span className="text-orange-600 dark:text-orange-400">{todayProgressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${todayProgressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="p-2 max-h-80 overflow-y-auto">
              {reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-center">
                  <PartyPopper className="w-6 h-6 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    فعلاً یادآوری‌ای نداری، عالیه!
                  </span>
                </div>
              ) : (
                reminders.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.tab)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-right hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="shrink-0 w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-orange-500" />
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-5">
                        {item.text}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
