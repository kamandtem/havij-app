import React, { useState, useEffect } from 'react';
import { Lock, Delete, Sparkles, KeyRound } from 'lucide-react';

interface PinLockViewProps {
  storedPin: string;
  onSuccess: () => void;
}

export const PinLockView: React.FC<PinLockViewProps> = ({
  storedPin,
  onSuccess
}) => {
  const [showSplash, setShowSplash] = useState(true);
  const [inputPin, setInputPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Show splash screen for 1.8s then switch to PIN keypad
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyPress = (num: string) => {
    if (inputPin.length < 4) {
      const next = inputPin + num;
      setInputPin(next);
      setErrorMsg('');

      if (next.length === 4) {
        if (next === storedPin) {
          onSuccess();
        } else {
          setErrorMsg('رمز ورود اشتباه است!');
          setTimeout(() => setInputPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setInputPin(inputPin.slice(0, -1));
    setErrorMsg('');
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex flex-col items-center justify-center p-6 text-white text-center font-sans">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-5xl shadow-2xl mb-6 animate-bounce">
          🥕
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2">
          هویج
        </h1>
        <p className="text-sm font-bold text-orange-100 max-w-xs">
          برنامه‌ریز و دستیار تمرکز ADHD
        </p>
        <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-white/80">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>در حال بارگذاری محیط امن...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-6 font-sans text-center" dir="rtl">
      <div className="w-full max-w-xs space-y-6 animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-orange-500/20 text-orange-400 rounded-3xl mx-auto flex items-center justify-center text-2xl border border-orange-500/30">
          <Lock className="w-8 h-8 text-orange-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">ورود به برنامه هویج</h2>
          <p className="text-xs text-slate-400 mt-1">رمز ۴ رقمی خود را وارد کنید</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-4 py-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                inputPin.length > idx
                  ? 'bg-orange-500 border-orange-400 scale-110 shadow-md shadow-orange-500/50'
                  : 'border-slate-700 bg-slate-800'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-rose-400 animate-shake">
            {errorMsg}
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 pt-2 max-w-[240px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="w-16 h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl flex items-center justify-center active:scale-95 transition-all border border-slate-700/50"
            >
              {num}
            </button>
          ))}

          <div />
          <button
            onClick={() => handleKeyPress('0')}
            className="w-16 h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl flex items-center justify-center active:scale-95 transition-all border border-slate-700/50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-16 h-16 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 flex items-center justify-center active:scale-95 transition-all border border-slate-700/50"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
