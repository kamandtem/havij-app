import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        onFinish();
      }, 400); // fade duration
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white text-center font-sans transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir="rtl"
    >
      {/* Central Card / Logo */}
      <div className="relative mb-6">
        <div className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-[32px] border border-white/30 flex items-center justify-center text-6xl shadow-2xl animate-bounce">
          🥕
        </div>
        <div className="absolute -top-2 -right-2 bg-amber-300 text-orange-950 p-2 rounded-full shadow-lg animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* App Title */}
      <h1 className="text-4xl font-black tracking-tight mb-2 text-white drop-shadow-sm">
        هویج
      </h1>

      {/* Subtitle */}
      <p className="text-sm font-bold text-orange-100 max-w-xs leading-relaxed">
        برنامه‌ریز و دستیار هوشمند تمرکز ADHD
      </p>

      {/* Loading Progress Line */}
      <div className="mt-10 w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full animate-[pulse_1s_infinite] w-full origin-left scale-x-100 transition-all duration-1000" />
      </div>

      <p className="text-[11px] font-semibold text-white/80 mt-4">
        در حال آماده‌سازی محیط تمرکز...
      </p>

      {/* Developer Credit */}
      <p className="text-[11px] font-semibold text-white/70 absolute bottom-6">
        برنامه نویس: محمدرضا ارجمند
      </p>
    </div>
  );
};
