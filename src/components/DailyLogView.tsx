import React, { useState } from 'react';
import { BarChart3, Plus, Trash2, Zap, Target, Smile } from 'lucide-react';
import { DailyLog } from '../types';
import { getTodayDateString } from '../utils/storage';

interface DailyLogViewProps {
  dailyLogs: DailyLog[];
  onSaveDailyLog: (log: Omit<DailyLog, 'id'>) => void;
}

export const DailyLogView: React.FC<DailyLogViewProps> = ({
  dailyLogs,
  onSaveDailyLog
}) => {
  const today = getTodayDateString();
  const [energyRating, setEnergyRating] = useState(3);
  const [focusRating, setFocusRating] = useState(3);
  const [moodRating, setMoodRating] = useState(3);
  const [notes, setNotes] = useState('');

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDailyLog({
      date: today,
      energyRating,
      focusRating,
      moodRating,
      notes: notes.trim()
    });
    setNotes('');
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  // Trend chart: shows the change across all logged days, updating live
  // after every single entry (not gated behind a minimum count).
  const recentLogs = [...dailyLogs].slice(0, 30).reverse();

  // Second chart: day-over-day CHANGE in mood, not the raw value — shows
  // whether the user is improving, declining, or steady compared to the
  // previous day they logged, plus an overall trend across the period.
  const moodDeltas = recentLogs.slice(1).map((log, idx) => ({
    date: log.date,
    delta: log.moodRating - recentLogs[idx].moodRating
  }));

  const half = Math.floor(recentLogs.length / 2);
  const earlierHalf = recentLogs.slice(0, half);
  const recentHalf = recentLogs.slice(recentLogs.length - half);
  const avgMood = (logs: typeof recentLogs) =>
    logs.length ? logs.reduce((sum, l) => sum + l.moodRating, 0) / logs.length : 0;
  const overallTrend = recentLogs.length >= 2 ? avgMood(recentHalf) - avgMood(earlierHalf) : 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {savedMsg && (
        <div className="p-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg text-xs">
          ثبت روزانه با موفقیت ذخیره شد! ✨
        </div>
      )}
      {/* Header */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>پیگیری وضعیت روزانه (Daily Self-Monitoring)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">
            ثبت روزانه و آمار نموداری آفلاین
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            با ردیابی روزانه انرژی و تمرکز، الگوهای روزهای پربازده خود را کشف کنید.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rating Form */}
        <div className="lg:col-span-5 bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-500" />
            <span>ثبت ارزیابی امروز ({today})</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                <span>سطح انرژی امروز</span>
                <span className="text-orange-600 font-extrabold">{energyRating} از ۵</span>
              </label>
              <div className="flex justify-between gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setEnergyRating(val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      energyRating === val
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    ⚡ {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                <span>کیفیت تمرکز امروز</span>
                <span className="text-orange-600 font-extrabold">{focusRating} از ۵</span>
              </label>
              <div className="flex justify-between gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFocusRating(val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      focusRating === val
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    🎯 {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                <span>خلق و خو / حس عمومی</span>
                <span className="text-orange-600 font-extrabold">{moodRating} از ۵</span>
              </label>
              <div className="flex justify-between gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMoodRating(val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      moodRating === val
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    😊 {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                یادداشت کوتاه روزانه (اختیاری)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="چه چیزی امروز بیشترین کمک را به تمرکزت کرد؟"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
            >
              ذخیره ارزیابی امروز
            </button>
          </form>
        </div>

        {/* Offline SVG Trend Chart */}
        <div className="lg:col-span-7 bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800">
            نمودار روند تمرکز و انرژی (آفلاین)
          </h3>

          {recentLogs.length === 0 ? (
            <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
              <BarChart3 className="w-10 h-10 text-slate-300" />
              <p className="text-xs font-bold text-slate-600">هنوز داده‌ای برای رسم نمودار ثبت نشده است</p>
              <p className="text-[11px]">با ثبت ارزیابی در فرم سمت راست، اولین نقطه نمودار شکل می‌گیرد.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-4 text-xs font-bold">
                <span className="flex items-center gap-1 text-amber-600">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span> انرژی
                </span>
                <span className="flex items-center gap-1 text-orange-600">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span> تمرکز
                </span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> خلق‌وخو
                </span>
              </div>

              {/* Bar visualization */}
              <div className="h-56 bg-slate-50 rounded-2xl p-4 flex items-end justify-around gap-2 border border-slate-100">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full flex justify-center items-end gap-1 h-40">
                      {/* Energy bar */}
                      <div
                        className="w-2 bg-amber-400 rounded-t-md transition-all"
                        style={{ height: `${(log.energyRating / 5) * 100}%` }}
                        title={`انرژی: ${log.energyRating}`}
                      ></div>
                      {/* Focus bar */}
                      <div
                        className="w-2 bg-orange-500 rounded-t-md transition-all"
                        style={{ height: `${(log.focusRating / 5) * 100}%` }}
                        title={`تمرکز: ${log.focusRating}`}
                      ></div>
                      {/* Mood bar */}
                      <div
                        className="w-2 bg-emerald-500 rounded-t-md transition-all"
                        style={{ height: `${(log.moodRating / 5) * 100}%` }}
                        title={`خلق: ${log.moodRating}`}
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
      </div>

      {/* Second Chart: Change Over Time (not raw values — the delta) */}
      {recentLogs.length >= 2 && (
        <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">تغییرات خلق‌وخو نسبت به روز قبل</h3>
            <p className="text-xs text-slate-400 mt-1">
              این نمودار نشون میده هر روز نسبت به روز قبلش بهتر شدی، بدتر شدی، یا ثابت موندی — نه فقط عدد خام هر روز.
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
              overallTrend > 0.15
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : overallTrend < -0.15
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            {overallTrend > 0.15 ? (
              <span>📈 در این بازه، خلق‌وخوت نسبت به روزهای اول بهتر شده (به‌طور میانگین {overallTrend.toFixed(1)}+ از ۵)</span>
            ) : overallTrend < -0.15 ? (
              <span>📉 در این بازه، خلق‌وخوت نسبت به روزهای اول کمی افت داشته ({overallTrend.toFixed(1)} از ۵)</span>
            ) : (
              <span>➖ در این بازه، خلق‌وخوت تقریباً ثابت بوده، بدون تغییر محسوس</span>
            )}
          </div>

          <div className="h-40 bg-slate-50 rounded-2xl p-4 flex items-end justify-around gap-2 border border-slate-100">
            {moodDeltas.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-center relative">
                <div className="w-full flex justify-center h-full relative">
                  {/* Zero baseline in the middle of the bar area */}
                  <div className="absolute left-0 right-0 top-1/2 border-t border-slate-200"></div>
                  <div
                    className={`w-2.5 rounded-md transition-all absolute ${
                      d.delta > 0 ? 'bg-emerald-500' : d.delta < 0 ? 'bg-rose-400' : 'bg-slate-300'
                    }`}
                    style={{
                      height: `${Math.min(50, Math.abs(d.delta) * 25)}%`,
                      top: d.delta >= 0 ? `${50 - Math.min(50, Math.abs(d.delta) * 25)}%` : '50%'
                    }}
                    title={`تغییر: ${d.delta > 0 ? '+' : ''}${d.delta}`}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 truncate w-full text-center absolute -bottom-1">
                  {d.date.substring(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
