import React, { useRef, useState } from 'react';
import {
  LayoutDashboard,
  Target,
  Scissors,
  Timer,
  Zap,
  Calendar,
  Brain,
  BarChart3,
  Moon,
  Sprout,
  BookOpen,
  Settings,
  Camera
} from 'lucide-react';
import { UserProfile, GamificationData } from '../types';

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

  const mainItems = [
    { id: 'dashboard', label: 'داشبورد اصلی', icon: LayoutDashboard },
    { id: 'articles', label: 'آموزش ADHD', icon: BookOpen },
    { id: 'goals', label: '۳ هدف امروز', icon: Target },
    { id: 'decomposer', label: 'خردکننده کارها', icon: Scissors },
    { id: 'focus', label: 'تمرکز و تایمر', icon: Timer },
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
            <h3 className="text-base font-black text-slate-800 dark:text-white truncate">
              {userProfile?.name || 'کاربر هویج'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px] rounded-full border border-emerald-200 dark:border-emerald-800">
                سطح {gamification.level}
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {gamification.points} امتیاز
              </span>
            </div>
          </div>

          {/* Settings & Profile — icon only, opens the profile/settings view */}
          <button
            onClick={() => handleItemClick('profile')}
            className={`shrink-0 p-2.5 rounded-2xl transition-colors ${
              activeTab === 'profile'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700'
            }`}
            title="تنظیمات و پروفایل"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 min-h-0 overflow-hidden px-4 pb-4 flex flex-col justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
          {/* Main Category */}
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 mb-1 block">
              بخش‌های اصلی
            </span>
            {mainItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all text-right ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Planning Category */}
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 mb-1 block">
              برنامه‌ریزی و ارزیابی
            </span>
            {planningItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all text-right ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Motivation & Learning Category */}
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 mb-1 block">
              انگیزه و روانشناسی
            </span>
            {learningItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl font-bold text-xs transition-all text-right ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
