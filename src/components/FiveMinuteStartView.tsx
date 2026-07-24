import React, { useState, useEffect, useRef } from 'react';
import { Zap, Play, Pause, RotateCcw, CheckCircle2, Sparkles, HeartHandshake } from 'lucide-react';
import { playCompletionChime, playMicroChime } from '../utils/audio';

interface FiveMinuteStartViewProps {
  onCompleteMicroStart: (taskTitle: string) => void;
}

export const FiveMinuteStartView: React.FC<FiveMinuteStartViewProps> = ({
  onCompleteMicroStart
}) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 300 seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const [msg, setMsg] = useState<string | null>(null);

  const showMsg = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 4000);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playCompletionChime();
            onCompleteMicroStart(taskTitle || 'شروع ۵ دقیقه‌ای');
            showMsg('🌟 آفرین! ۵ دقیقه تمام شد. مغزت طلسم شروع رو شکست!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, taskTitle, onCompleteMicroStart]);

  const handleStart = () => {
    if (!taskTitle.trim()) {
      showMsg('لطفاً عنوان کاری که می‌خواهی فقط ۵ دقیقه انجام دهی را وارد کن.');
      return;
    }
    playMicroChime();
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(5 * 60);
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Notification banner */}
      {msg && (
        <div className="p-4 bg-amber-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-between text-xs animate-bounce">
          <span>{msg}</span>
        </div>
      )}
      <div className="bg-amber-50 rounded-[28px] border border-amber-200/80 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>تکنیک ۵ دقيقه طلایی (Micro-Start Strategy)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-amber-950">
            ابزار اختصاصی شکستن اهمال‌کاری
          </h2>
          <p className="text-amber-800 text-sm mt-1">
            با خودتان پیمان ببندید: «من فقط و فقط ۵ دقیقه روی این کار وقت می‌گذارم. اگر بعد از ۵ دقیقه نخواستم، حق دارم کار را رها کنم!»
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-[28px] border border-slate-200/80 p-8 shadow-xs space-y-6 text-center">
        {/* Task Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            کاری که از شروع آن طفره می‌روی چیست؟
          </label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="مثلاً: فقط ۵ دقیقه پاسخ به یک ایمیل..."
            className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 text-center font-bold text-base focus:outline-none focus:border-amber-500 text-slate-800"
          />
        </div>

        {/* Big 5-Minute Timer Display */}
        <div className="py-8 bg-amber-50/50 rounded-3xl border border-amber-100 flex flex-col items-center justify-center">
          <span className="text-7xl font-light text-amber-900 font-mono tracking-tight">
            {minutes}:{seconds}
          </span>
          <p className="text-xs font-bold text-amber-700 mt-3 flex items-center gap-1">
            <HeartHandshake className="w-4 h-4" />
            <span>پیمان ۵ دقیقه‌ای: هیچ فشاری برای ادامه دادن وجود ندارد!</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="p-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={isRunning ? () => setIsRunning(false) : handleStart}
            className={`py-4 px-10 rounded-2xl font-extrabold text-base text-white shadow-lg transition-all flex items-center gap-2 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
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
                <span>شروع فقط ۵ دقیقه!</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
          تحقیقات نشان می‌دهد ۹۰٪ افراد بعد از گذشت ۵ دقیقه اول، احساس آرامش کرده و کار را ادامه می‌دهند.
        </div>
      </div>
    </div>
  );
};
