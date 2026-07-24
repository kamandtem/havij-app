import React, { useRef } from 'react';
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
  X,
  Sun,
  Camera,
  CheckCircle,
  Sparkles
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
  theme,
  onToggleTheme,
  onUpdateAvatar
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const mainItems = [
    { id: 'dashboard', label: 'داشبورد اصلی', icon: LayoutDashboard },
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
    { id: 'articles', label: 'آموزش ADHD', icon: BookOpen },
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

  return (
    <div className="fixed inset-0 z-50 flex" dir="rtl">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Container (Sliding out from Left side) */}
      <div className="relative left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-left duration-300 overflow-y-auto font-sans">
        
        {/* Drawer Header with Close button & Theme Toggle */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50 hover:text-orange-600 transition-colors text-xs font-bold flex items-center gap-1.5"
              title="تغییر تم شب/روز"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              <span>{theme === 'dark' ? 'روز' : 'شب'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card (Reference Image Style) */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center gap-3">
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
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 p-4 space-y-5">
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all text-right ${
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all text-right ${
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all text-right ${
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

        {/* Footer: Settings Item */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
          <button
            onClick={() => handleItemClick('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all text-right ${
              activeTab === 'profile'
                ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 text-orange-500" />
            <span>تنظیمات و پروفایل کاربر</span>
          </button>
        </div>
      </div>
    </div>
  );
};
