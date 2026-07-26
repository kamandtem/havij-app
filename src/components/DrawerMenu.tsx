import React, { useRef, useState } from 'react';
import {
  LayoutDashboard,
  Zap,
  Calendar,
  Brain,
  BarChart3,
  Moon,
  Sprout,
  BookOpen,
  Settings,
  Camera,
  Sun
} from 'lucide-react';
import { UserProfile, GamificationData } from '../types';
import { SILVER_CARROT_LEVEL, GOLDEN_CARROT_LEVEL } from '../utils/storage';

// Instagram and Telegram aren't part of lucide-react's icon set, so they're
// drawn as small inline brand glyphs to keep this file dependency-free.
const InstagramGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const TelegramGlyph: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M21.8 4.5 3.2 11.7c-1 .4-1 1 .1 1.3l4.7 1.5 1.8 5.7c.2.6.4.8.8.8.3 0 .5-.1.7-.3l2.5-2.4 4.9 3.6c.7.4 1.2.2 1.4-.6l3.1-14.4c.3-1-.4-1.5-1.4-1.4zM8.6 14.2l9.8-6.1c.5-.3.9-.1.5.2L10.5 15l-.3 3.4-1.6-4.2z" />
  </svg>
);

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile | null;
  gamification: GamificationData;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onUpdateAvatar?: (newAvatar: string) => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  userProfile,
  gamification,
  theme,
  onToggleTheme,
  onUpdateAvatar
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);

  // Swipe-to-close state: dragging the drawer toward its resting/closed
  // side visually slides it away, mimicking a real "close" gesture.
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  // اهداف روز، تمرکز و تایمر، و خردکننده کارها از منو حذف شدند چون حالا
  // مستقیماً در نوار پایین (Bottom Nav) در دسترس هستند.
  const mainItems = [
    { id: 'dashboard', label: 'داشبورد اصلی', icon: LayoutDashboard },
    { id: 'articles', label: 'آموزش ADHD', icon: BookOpen },
    { id: 'micro5', label: 'شروع ۵ دقیقه‌ای', icon: Zap },
  ];

  const planningItems = [
    { id: 'timeline', label: 'برنامه روزانه', icon: Calendar },
    { id: 'cbt', label: 'بخش CBT', icon: Brain },
    { id: 'dailylog', label: 'ثبت روزانه و آمار', icon: BarChart3 },
    { id: 'sleep', label: 'مدیریت خواب', icon: Moon },
  ];

  const learningItems = [
    { id: 'garden', label: 'باغچه انگیزه', icon: Sprout },
  ];

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateAvatar) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
    draggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;

    if (!draggingRef.current) {
      // Only start a drag once the gesture is clearly horizontal, so normal
      // taps on menu items are never intercepted.
      if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
        draggingRef.current = true;
        setIsDragging(true);
      } else {
        return;
      }
    }

    if (dx > 0) {
      setDragX(dx);
    }
  };

  const handleTouchEnd = () => {
    if (draggingRef.current) {
      const width = drawerRef.current?.offsetWidth || 320;
      if (dragX > width * 0.28) {
        onClose();
      }
    }
    setIsDragging(false);
    setDragX(0);
    touchStartRef.current = null;
    draggingRef.current = false;
  };

  const drawerWidth = drawerRef.current?.offsetWidth || 320;
  const backdropOpacity = Math.max(0, 1 - dragX / drawerWidth);

  return (
    <div className="fixed inset-0 z-50 flex" dir="rtl">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{ opacity: backdropOpacity }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Container: docked to its resting edge, with a small gap
          from the top and bottom of the screen, and generously rounded
          corners. Swiping it toward its resting side closes it. */}
      <div
        ref={drawerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
        className="relative w-80 max-w-[85vw] my-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-2xl flex flex-col z-10 animate-in fade-in duration-200 overflow-hidden font-sans"
      >
        {/* User Profile Row with Settings Gear (icon only) */}
        <div className="p-4 flex items-center gap-3">
          <div className="relative group shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950/60 border-2 border-orange-300 dark:border-orange-500 shadow-sm flex items-center justify-center text-2xl overflow-hidden font-bold text-orange-600">
              {userProfile?.avatar ? (
                userProfile.avatar.startsWith('data:') ? (
                  <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span>{userProfile.avatar}</span>
                )
              ) : (
                <span>🥕</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1 bg-orange-500 text-white rounded-full shadow-xs hover:bg-orange-600 transition-colors"
              title="تغییر عکس پروفایل"
            >
              <Camera className="w-3 h-3" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 flex items-center gap-1">
              <span>روز خوش</span>
              <span className="animate-bounce">👋</span>
            </span>
            <h3 className="text-base font-black text-slate-800 dark:text-white truncate flex items-center gap-1.5">
              <span>{userProfile?.name || 'کاربر هویج'}</span>
              {gamification.level >= GOLDEN_CARROT_LEVEL && (
                <span
                  className="shrink-0 text-sm"
                  title="نشان هویج طلایی — کاشت صدمین درخت"
                >
                  🥕✨
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px] rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span>سطح {gamification.level}</span>
                {gamification.level >= SILVER_CARROT_LEVEL && gamification.level < GOLDEN_CARROT_LEVEL && (
                  <span title="نشان هویج نقره‌ای — اولین درخت طلایی">🥕</span>
                )}
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {gamification.points} امتیاز
              </span>
            </div>
          </div>

          {/* Settings & Profile, and Day/Night theme toggle right below it */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <button
              onClick={() => handleItemClick('profile')}
              className={`p-2.5 rounded-2xl transition-colors ${
                activeTab === 'profile'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700'
              }`}
              title="تنظیمات و پروفایل"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-amber-500 dark:text-indigo-300 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors"
              title={theme === 'dark' ? 'حالت روز' : 'حالت شب'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 flex flex-col gap-5 border-t border-slate-100 dark:border-slate-800 pt-3">
          {/* Main Category */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-3 mb-1.5 block">
              بخش‌های اصلی
            </span>
            {mainItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all text-right ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Planning Category */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-3 mb-1.5 block">
              برنامه‌ریزی و ارزیابی
            </span>
            {planningItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all text-right ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Motivation & Learning Category */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-3 mb-1.5 block">
              انگیزه و روانشناسی
            </span>
            {learningItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all text-right ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Social media footer */}
        <div className="shrink-0 px-4 py-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.instagram.com/havij.adhd"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              title="اینستاگرام هویج"
            >
              <InstagramGlyph className="w-5 h-5" />
            </a>
            <a
              href="https://t.me/havij_adhd"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              title="تلگرام هویج"
            >
              <TelegramGlyph className="w-5 h-5" />
            </a>
          </div>
          <p className="text-center text-[11px] font-bold text-slate-400 dark:text-slate-500">
            ما را در شبکه‌های اجتماعی دنبال کنید
          </p>
        </div>
      </div>
    </div>
  );
};
