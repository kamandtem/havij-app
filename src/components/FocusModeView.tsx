import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle2, Sparkles, Target, ChevronDown } from 'lucide-react';
import { startAmbientNoise, stopAmbientNoise, playMicroChime } from '../utils/audio';

interface FocusModeViewProps {
  selectedMinutes: number;
  timeLeftSeconds: number;
  isRunning: boolean;
  currentTaskTitle: string;
  onSelectMinutes: (mins: number) => void;
  onChangeTaskTitle: (title: string) => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onQuickComplete: () => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  selectedMinutes,
  timeLeftSeconds,
  isRunning,
  currentTaskTitle,
  onSelectMinutes,
  onChangeTaskTitle,
  onTogglePlay,
  onReset,
  onQuickComplete
}) => {
  const [ambientSound, setAmbientSound] = useState<'off' | 'white' | 'brown' | 'rain'>('off');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  // Header starts collapsed to just its small label — tapping the chevron
  // slides it open to show the full heading/description.
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleAmbientChange = (type: 'off' | 'white' | 'brown' | 'rain') => {
    setAmbientSound(type);
    startAmbientNoise(type);
  };

  // Play the same short chime used on the 5-minute-start button whenever
  // the user taps this Pomodoro timer's play/pause control.
  const handleTogglePlay = () => {
    playMicroChime();
    onTogglePlay();
  };

  useEffect(() => {
    return () => {
      stopAmbientNoise();
    };
  }, []);

  const totalSeconds = selectedMinutes * 60;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeftSeconds) / totalSeconds) * 100 : 0;

  const minutesDisplay = String(Math.floor(timeLeftSeconds / 60)).padStart(2, '0');
  const secondsDisplay = String(timeLeftSeconds % 60).padStart(2, '0');

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {toastMsg && (
        <div className="p-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg text-xs">
          {toastMsg}
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
            <Timer className="w-4 h-4 shrink-0" />
            <span>حالت تمرکز عمیق</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
              isHeaderOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isHeaderOpen && (
          <div className="px-6 pb-6 -mt-1">
            <h2 className="text-2xl font-extrabold text-slate-800">
              تایمر و محیط تمرکز بدون حواس‌پرتی
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              یک کار را انتخاب کنید، تایمر را روشن کنید و صداهای نویز سفید/قهوه‌ای را برای حذف صداهای محیطی بگذارید. این تایمر با ویجت پومودورو در داشبورد هماهنگ است و حتی با تغییر تب هم ادامه می‌یابد.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Countdown Display Card */}
        <div className="lg:col-span-8 bg-white/90 backdrop-blur-md rounded-[28px] border border-slate-200/80 p-8 shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          {/* Current Focus Task Input */}
          <div className="w-full max-w-md mb-6">
            <label className="block text-xs font-bold text-slate-400 mb-1 flex items-center justify-center gap-1">
              <Target className="w-3.5 h-3.5 text-orange-500" />
              <span>هم‌اکنون روی چه کاری تمرکز داری؟</span>
            </label>
            <input
              type="text"
              value={currentTaskTitle}
              onChange={(e) => onChangeTaskTitle(e.target.value)}
              placeholder="مثلاً: نوشتن ۳ پاراگراف از گزارش"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-center font-bold text-sm text-slate-800 focus:outline-none focus:border-orange-500 bg-slate-50/50"
            />
          </div>

          {/* SVG Countdown Circle */}
          <div className="relative w-64 h-64 my-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-slate-100"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-orange-500 transition-all duration-300"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={(2 * Math.PI * 44) * (1 - progressPercent / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-extralight text-slate-800 tracking-tight font-mono">
                {minutesDisplay}:{secondsDisplay}
              </span>
              <span className="text-xs font-bold text-slate-400 mt-2">
                {isRunning ? 'در حال تمرکز...' : 'متوقف‌شده'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={onReset}
              className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all"
              title="بازنشانی"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className={`py-4 px-10 rounded-2xl font-extrabold text-base text-white shadow-lg transition-all flex items-center gap-2 ${
                isRunning
                  ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-600/20'
                  : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>توقف موقت</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>شروع تمرکز</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onQuickComplete();
                triggerToast('ثبت موفق جلسه تمرکز!');
              }}
              className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 font-bold transition-all"
              title="تکمیل سریع جلسه"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings & Ambient Noise Generator */}
        <div className="lg:col-span-4 space-y-6">
          {/* Preset Durations */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              انتخاب زمان تمرکز
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => onSelectMinutes(mins)}
                  className={`py-3 px-4 rounded-2xl font-bold text-xs border transition-all ${
                    selectedMinutes === mins
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-orange-200'
                  }`}
                >
                  {mins} دقیقه {mins === 25 ? '(پومودورو)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Ambient Offline Audio Generator */}
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                صداهای حذف نویز محیط (سنتز آفلاین)
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              تولید نویز صوتی مستقیماً درون مرورگر بدون نیاز به دانلود یا اینترنت.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleAmbientChange('off')}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-right border transition-all flex items-center justify-between ${
                  ambientSound === 'off'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <span>خاموش</span>
                <VolumeX className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleAmbientChange('white')}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-right border transition-all flex items-center justify-between ${
                  ambientSound === 'white'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-200'
                }`}
              >
                <span>نویز سفید (White Noise - پوشش صداهای اطراف)</span>
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleAmbientChange('brown')}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-right border transition-all flex items-center justify-between ${
                  ambientSound === 'brown'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-200'
                }`}
              >
                <span>نویز قهوه‌ای (Brown Noise - آرامش عمیق مغز)</span>
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleAmbientChange('rain')}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-right border transition-all flex items-center justify-between ${
                  ambientSound === 'rain'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-200'
                }`}
              >
                <span>صدای باران ملایم</span>
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
