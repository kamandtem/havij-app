import React from 'react';
import { Menu, Sparkles, User, Sun, Moon } from 'lucide-react';
import { UserProfile, GamificationData } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile | null;
  gamification: GamificationData;
  onOpenDrawer: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  gamification,
  onOpenDrawer,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3 shadow-xs transition-colors font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Side: Hamburger Drawer Menu Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            className="p-2.5 rounded-2xl bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-slate-700 transition-all border border-orange-200 dark:border-slate-700 flex items-center justify-center shadow-xs"
            title="منوی برنامه‌ریز هویج"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* App Branding */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/80 border-2 border-orange-300 dark:border-orange-500 rounded-2xl flex items-center justify-center shadow-xs text-xl">
              🥕
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                هویج
              </h1>
              <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hidden sm:block">
                دستیار تمرکز و برنامه‌ریز ADHD
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Theme Switch & Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-slate-700 transition-colors"
            title="تغییر حالت شب و روز"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Profile Avatar button */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-bold text-sm flex items-center justify-center overflow-hidden">
              {userProfile?.avatar ? (
                userProfile.avatar.startsWith('data:') ? (
                  <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{userProfile.avatar}</span>
                )
              ) : (
                <span>🥕</span>
              )}
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">
              {userProfile?.name || 'کاربر'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
