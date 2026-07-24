import React, { useState } from 'react';
import { Moon, Sun, Plus, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { SleepLog } from '../types';

interface SleepTrackerViewProps {
  sleepLogs: SleepLog[];
  onSaveSleepLog: (log: Omit<SleepLog, 'id'>) => void;
}

export const SleepTrackerView: React.FC<SleepTrackerViewProps> = ({
  sleepLogs,
  onSaveSleepLog
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [bedTime, setBedTime] = useState('23:30');
  const [wakeTime, setWakeTime] = useState('07:30');
  const [qualityRating, setQualityRating] = useState(4);
  const [notes, setNotes] = useState('');

  const [savedMsg, setSavedMsg] = useState(false);

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

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {savedMsg && (
        <div className="p-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg text-xs">
          اطلاعات خواب با موفقیت ثبت شد! 🌙
        </div>
      )}
      {/* Header */}
      <div className="bg-slate-900 rounded-[28px] border border-slate-800 p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Moon className="w-4 h-4" />
            <span>تنظیم ریتم شبانه‌روزی (Circadian Rhythm)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            مدیریت و ردیابی خواب ADHD
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            خواب باکیفیت مستقیم‌ترین تاثیر را روی قدرت تمرکز و کنترل تکانه فردا دارد.
          </p>
        </div>
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
