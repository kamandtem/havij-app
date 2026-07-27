import React, { useState } from 'react';
import { useAccordionHint } from '../utils/hint';
import { BarChart3, Plus, Trash2, Zap, Target, Smile, ChevronDown, Bell } from 'lucide-react';
import { DailyLog } from '../types';
import { getTodayDateString, formatDateShamsiShort } from '../utils/storage';

interface DailyLogViewProps {
  dailyLogs: DailyLog[];
  onSaveDailyLog: (log: Omit<DailyLog, 'id'>) => void;
}

export const DailyLogView: React.FC<DailyLogViewProps> = ({
  dailyLogs,
  onSaveDailyLog
}) => {
  const today = getTodayDateString();
  const hasLoggedToday = dailyLogs.some((l) => l.date === today);
  const [energyRating, setEnergyRating] = useState(3);
  const [focusRating, setFocusRating] = useState(3);
  const [moodRating, setMoodRating] = useState(3);
  const [notes, setNotes] = useState('');

  const [savedMsg, setSavedMsg] = useState(false);
  // Header starts collapsed to just its small label — tapping the chevron
  // slides it open to show the full heading/description.
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const showHint = useAccordionHint();

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

  // Changes chart: hidden by default, revealed via the button below the
  // first trend chart. Shows energy + mood as a real broken-line chart,
  // aggregated either weekly or monthly (not per-day), so the user can see
  // the bigger-picture direction rather than daily noise.
  const [showChangeChart, setShowChangeChart] = useState(false);
  const [changePeriod, setChangePeriod] = useState<'weekly' | 'monthly'>('weekly');

  const allLogsChrono = [...dailyLogs].reverse(); // oldest -> newest

  const groupKey = (dateStr: string, period: 'weekly' | 'monthly'): string => {
    if (period === 'monthly') return dateStr.substring(0, 7); // "YYYY-MM"
    const d = new Date(dateStr);
    const daysSinceEpoch = Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
    const weekIndex = Math.floor(daysSinceEpoch / 7);
    return `w${weekIndex}`;
  };

  const buildAggregatedSeries = (period: 'weekly' | 'monthly') => {
    const groups = new Map<string, { energySum: number; moodSum: number; count: number; lastDate: string }>();
    for (const log of allLogsChrono) {
      const key = groupKey(log.date, period);
      const g = groups.get(key) || { energySum: 0, moodSum: 0, count: 0, lastDate: log.date };
      g.energySum += log.energyRating;
      g.moodSum += log.moodRating;
      g.count += 1;
      g.lastDate = log.date;
      groups.set(key, g);
    }
    const points = Array.from(groups.entries()).map(([key, g]) => ({
      key,
      avgEnergy: g.energySum / g.count,
      avgMood: g.moodSum / g.count,
      lastDate: g.lastDate
    }));
    // Groups.entries() preserves insertion order, and we inserted chronologically.
    return points.slice(-8); // last 8 weeks/months, to keep the chart legible
  };

  const changeSeries = buildAggregatedSeries(changePeriod);

  const formatGroupLabel = (point: { key: string; lastDate: string }) => {
    if (changePeriod === 'monthly') {
      return new Date(point.lastDate).toLocaleDateString('fa-IR', { month: 'short' });
    }
    return formatDateShamsiShort(point.lastDate);
  };

  // Builds an SVG polyline path (as "x1,y1 x2,y2 ...") for a 0..5 rated
  // series, mapped into the given chart height.
  const buildPolylinePoints = (values: number[], width: number, height: number, padding: number) => {
    if (values.length === 0) return '';
    const usableWidth = width - padding * 2;
    const step = values.length > 1 ? usableWidth / (values.length - 1) : 0;
    return values
      .map((v, i) => {
        const x = padding + step * i;
        const y = height - padding - ((v - 1) / 4) * (height - padding * 2); // rating 1..5 mapped to chart
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {savedMsg && (
        <div className="p-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg text-xs">
          ثبت روزانه با موفقیت ذخیره شد! ✨
        </div>
      )}
      {!hasLoggedToday && !savedMsg && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
          <Bell className="w-4 h-4 text-amber-500 shrink-0 animate-bell-hint" />
          <span className="text-xs font-bold text-amber-800">
            یادآوری: هنوز انرژی، تمرکز و خلق‌وخوی امروزت رو ثبت نکردی — همین پایین ثبتش کن.
          </span>
        </div>
      )}
      {/* Header — collapsed to just the small label by default; tap the
          chevron to reveal the full title + description. */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
        <button
          onClick={() => setIsHeaderOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 p-6 text-right"
        >
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>پیگیری وضعیت روزانه</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
              isHeaderOpen ? 'rotate-180' : showHint ? 'animate-chevron-hint' : ''
            }`}
          />
        </button>

        {isHeaderOpen && (
          <div className="px-6 pb-6 -mt-1">
            <h2 className="text-2xl font-extrabold text-slate-800">
              ثبت روزانه و آمار نموداری آفلاین
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              با ردیابی روزانه انرژی و تمرکز، الگوهای روزهای پربازده خود را کشف کنید.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rating Form */}
        <div className="lg:col-span-5 bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Plus className="w-5 h-5 text-orange-500" />
            <span>ثبت ارزیابی امروز ({new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })})</span>
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
                      {formatDateShamsiShort(log.date)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Toggle button for the weekly/monthly changes chart */}
              <button
                onClick={() => setShowChangeChart((v) => !v)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>{showChangeChart ? 'بستن نمودار تغییرات' : 'نمودار تغییرات'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Changes Chart: weekly/monthly line (broken-line) chart for energy + mood */}
      {showChangeChart && (
        <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-800">نمودار تغییرات انرژی و خلق‌وخو</h3>
              <p className="text-xs text-slate-400 mt-1">
                میانگین هر {changePeriod === 'weekly' ? 'هفته' : 'ماه'} را نشان می‌دهد تا روند کلی، نه نوسان روزانه، دیده شود.
              </p>
            </div>
            <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setChangePeriod('weekly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  changePeriod === 'weekly' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                }`}
              >
                هفتگی
              </button>
              <button
                onClick={() => setChangePeriod('monthly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  changePeriod === 'monthly' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                }`}
              >
                ماهانه
              </button>
            </div>
          </div>

          <div className="flex gap-4 text-xs font-bold">
            <span className="flex items-center gap-1 text-amber-600">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span> انرژی
            </span>
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span> خلق‌وخو
            </span>
          </div>

          {changeSeries.length < 2 ? (
            <div className="h-56 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
              <BarChart3 className="w-10 h-10 text-slate-300" />
              <p className="text-xs font-bold text-slate-600">
                برای رسم نمودار {changePeriod === 'weekly' ? 'هفتگی' : 'ماهانه'} حداقل باید دو {changePeriod === 'weekly' ? 'هفته' : 'ماه'} داده ثبت شده باشد
              </p>
              <p className="text-[11px]">با ادامه‌ی ثبت روزانه، این نمودار خودش کامل می‌شود.</p>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <svg viewBox="0 0 400 220" className="w-full h-56">
                {/* Baseline grid (ratings 1..5) */}
                {[1, 2, 3, 4, 5].map((r) => {
                  const y = 200 - ((r - 1) / 4) * 180;
                  return (
                    <line key={r} x1="20" y1={y} x2="380" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                  );
                })}
                <polyline
                  points={buildPolylinePoints(changeSeries.map((p) => p.avgEnergy), 400, 200, 20)}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points={buildPolylinePoints(changeSeries.map((p) => p.avgMood), 400, 200, 20)}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {changeSeries.map((p, i) => {
                  const usableWidth = 400 - 40;
                  const step = changeSeries.length > 1 ? usableWidth / (changeSeries.length - 1) : 0;
                  const x = 20 + step * i;
                  const yEnergy = 200 - ((p.avgEnergy - 1) / 4) * 180;
                  const yMood = 200 - ((p.avgMood - 1) / 4) * 180;
                  return (
                    <React.Fragment key={p.key}>
                      <circle cx={x} cy={yEnergy} r="3.5" fill="#f59e0b" />
                      <circle cx={x} cy={yMood} r="3.5" fill="#10b981" />
                    </React.Fragment>
                  );
                })}
              </svg>
              <div className="flex justify-around mt-1">
                {changeSeries.map((p) => (
                  <span key={p.key} className="text-[10px] font-bold text-slate-500 flex-1 text-center truncate">
                    {formatGroupLabel(p)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
