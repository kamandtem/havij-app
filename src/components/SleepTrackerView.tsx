import React, { useState } from 'react';
import { useAccordionHint } from '../utils/hint';
import { Moon, Sun, Plus, Star, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import { SleepLog } from '../types';
import { getTodayDateString } from '../utils/storage';

interface SleepTrackerViewProps {
  sleepLogs: SleepLog[];
  onSaveSleepLog: (log: Omit<SleepLog, 'id'>) => void;
}

export const SleepTrackerView: React.FC<SleepTrackerViewProps> = ({
  sleepLogs,
  onSaveSleepLog
}) => {
  const today = getTodayDateString();
  const [bedTime, setBedTime] = useState('23:30');
  const [wakeTime, setWakeTime] = useState('07:30');
  const [qualityRating, setQualityRating] = useState(4);
  const [notes, setNotes] = useState('');

  const [savedMsg, setSavedMsg] = useState(false);
  // Header starts collapsed to just its small label — tapping the chevron
  // slides it open to show the full heading/description.
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const showHint = useAccordionHint();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSleepLog({
      date: today,
      bedTime,
      wakeTime,
      qualityRating,
      notes: notes.trim()
    });
    setNotes('');
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const sleepTips = [
    { title: 'نور طبیعی صبحگاهی', text: 'در ۱۰ دقیقه اول پس از بیداری جلوی آفتاب بروید تا تولید ملاتونین تنظیم شود.' },
    { title: 'قطع نور آبی', text: '۱ ساعت قبل از خواب، حالت Night Light گوشی را روشن کرده و ترجیحاً صفحه نمایش را خاموش کنید.' },
    { title: 'دما و تاریکی اتاق', text: 'اتاق خواب باید کاملاً تاریک و دمای آن خنک (حدود ۱۹ تا ۲۱ درجه) باشد.' },
    { title: 'تکنیک تنفس ۴-۷-۸', text: '۴ ثانیه دم، ۷ ثانیه حبس نفس، و ۸ ثانیه بازدم عمیق برای آرام‌سازی دستگاه عصبی.' }
  ];

  // Sleep trend chart: shows quality rating across all logged nights (not
  // just last night), so the user can actually evaluate their own pattern
  // over time. Fills in with each new night logged on a different date.
  const recentSleepLogs = [...sleepLogs].slice(0, 30).reverse();

  const parseHoursSlept = (log: SleepLog): number => {
    const [bh, bm] = log.bedTime.split(':').map((v) => parseInt(v, 10));
    const [wh, wm] = log.wakeTime.split(':').map((v) => parseInt(v, 10));
    let bedMinutes = bh * 60 + bm;
    let wakeMinutes = wh * 60 + wm;
    if (wakeMinutes <= bedMinutes) wakeMinutes += 24 * 60; // crossed midnight
    return Math.round(((wakeMinutes - bedMinutes) / 60) * 10) / 10;
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {savedMsg && (
        <div className="p-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg text-xs">
          اطلاعات خواب با موفقیت ثبت شد! 🌙
        </div>
      )}
      {/* Header — collapsed to just the small label by default; tap the
          chevron to reveal the full title + description. */}
      <div className="bg-slate-900 rounded-[28px] border border-slate-800 text-white shadow-md overflow-hidden">
        <button
          onClick={() => setIsHeaderOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 p-6 text-right"
        >
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Moon className="w-4 h-4 shrink-0" />
            <span>تنظیم ریتم شبانه‌روزی</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
              isHeaderOpen ? 'rotate-180' : showHint ? 'animate-chevron-hint' : ''
            }`}
          />
        </button>

        {isHeaderOpen && (
          <div className="px-6 pb-6 -mt-1">
            <h2 className="text-2xl font-extrabold text-white">
              مدیریت و ردیابی خواب ADHD
            </h2>
            <p className="text-slate-300 text-sm mt-1">
              خواب باکیفیت مستقیم‌ترین تاثیر را روی قدرت تمرکز و کنترل تکانه فردا دارد.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Logger Form */}
        <div className="lg:col-span-5 bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            <span>ثبت خواب دیشب</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>زمان خوابیدن</span>
                </label>
                <input
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>زمان بیداری</span>
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                کیفیت خواب (۱ تا ۵ ستاره)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setQualityRating(star)}
                    className={`p-2 rounded-xl border text-base transition-all ${
                      qualityRating >= star
                        ? 'bg-amber-100 text-amber-600 border-amber-300'
                        : 'bg-slate-50 text-slate-300 border-slate-200'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                یادداشت کیفیت یا بیداری‌های شبانه (اختیاری)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="مثلاً: بیداری در ساعت ۳ صبح..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all"
            >
              ذخیره اطلاعات خواب
            </button>
          </form>
        </div>

        {/* Offline Recommendations & Tips */}
        <div className="lg:col-span-7 bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>توصیه‌های علمی بهداشت خواب ADHD (آفلاین)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sleepTips.map((tip, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>{tip.title}</span>
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {tip.text}
                </p>
              </div>
            ))}
          </div>

          {/* Sleep Trend Chart (across all logged nights, not just last night) */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 mb-3">روند کیفیت و مدت خواب در طول زمان</h4>
            {recentSleepLogs.length === 0 ? (
              <div className="h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center text-slate-400 space-y-1">
                <p className="text-xs font-bold text-slate-600">هنوز شبی ثبت نشده است</p>
                <p className="text-[11px]">با ثبت چند شب پشت‌سرهم، این نمودار روند خوابت را نشان می‌دهد.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1 text-blue-600">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span> ساعات خواب
                  </span>
                  <span className="flex items-center gap-1 text-amber-600">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span> کیفیت (از ۵)
                  </span>
                </div>
                <div className="h-44 bg-slate-50 rounded-2xl p-4 flex items-end justify-around gap-2 border border-slate-100">
                  {recentSleepLogs.map((log) => (
                    <div key={log.id} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                      <div className="w-full flex justify-center items-end gap-1 h-32">
                        <div
                          className="w-2 bg-blue-500 rounded-t-md transition-all"
                          style={{ height: `${Math.min(100, (parseHoursSlept(log) / 10) * 100)}%` }}
                          title={`${parseHoursSlept(log)} ساعت خواب`}
                        ></div>
                        <div
                          className="w-2 bg-amber-400 rounded-t-md transition-all"
                          style={{ height: `${(log.qualityRating / 5) * 100}%` }}
                          title={`کیفیت: ${log.qualityRating} از ۵`}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 truncate w-full text-center">
                        {log.date.substring(5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sleep Logs List */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 mb-3">تاریخچه خواب‌های ثبت‌شده</h4>
            {sleepLogs.length === 0 ? (
              <p className="text-xs text-slate-400 italic">هنوز سابقه خوابی ثبت نشده است.</p>
            ) : (
              <div className="space-y-2">
                {sleepLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{log.date}</span>
                      <span className="text-slate-400 mr-2">
                        ({log.bedTime} تا {log.wakeTime})
                      </span>
                    </div>
                    <div className="text-amber-500 font-bold">
                      {'★'.repeat(log.qualityRating)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
