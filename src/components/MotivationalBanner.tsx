import React from 'react';
import { getTodayDateString } from '../utils/storage';

const MESSAGES: string[] = [
  'امروز عالیه! روی قدم‌های کوچک تمرکز کن',
  'لازم نیست کامل باشه، فقط شروع کن',
  'یک قدم کوچک هم یک قدمه؛ به خودت افتخار کن',
  'امروز رو با مهربونی با خودت شروع کن',
  'تمرکز روی «همین الان» کافیه، بقیه‌ش بمونه برای بعد',
  'هر کاری که تموم کنی، یه پیروزیه',
  'استراحت هم بخشی از پیشرفته، به خودت سخت نگیر',
  'امروز فقط کافیه بهتر از دیروز باشی',
  'یه نفس عمیق بکش و یکی‌یکی جلو برو',
  'کارهای بزرگ رو کوچیک کن، بعد شروع کن'
];

// Picks a message that stays the same all day and rotates to a new one
// the next day, based on the effective calendar date.
const getDailyMessage = (): string => {
  const dateStr = getTodayDateString(); // YYYY-MM-DD
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) % 100000;
  }
  return MESSAGES[seed % MESSAGES.length];
};

export const MotivationalBanner: React.FC = () => {
  const message = getDailyMessage();

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div
        dir="rtl"
        className="flex items-center gap-3 bg-gradient-to-l from-lime-50 to-emerald-50/60 dark:from-emerald-950/40 dark:to-slate-900/40 border border-emerald-100/80 dark:border-emerald-900/50 rounded-full px-4 py-3 shadow-xs"
      >
        <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
          {message}
        </p>
        <span className="shrink-0 w-9 h-9 rounded-full bg-white/80 dark:bg-slate-900/60 flex items-center justify-center text-lg">
          🌱
        </span>
      </div>
    </div>
  );
};
