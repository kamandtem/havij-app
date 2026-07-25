import React, { useState, useRef } from 'react';
import { User, Lock, Moon, Sun, Save, Bell, Camera, Check, ShieldCheck, Sparkles, Target, RotateCcw, Award } from 'lucide-react';
import { UserProfile, NotificationSettings, PinSettings } from '../types';

interface ProfileSettingsViewProps {
  userProfile: UserProfile | null;
  pinSettings: PinSettings;
  notificationSettings: NotificationSettings;
  theme: 'light' | 'dark';
  onSaveProfile: (profile: UserProfile) => void;
  onSavePinSettings: (pinSettings: PinSettings) => void;
  onSaveNotifications: (settings: NotificationSettings) => void;
  onToggleTheme: () => void;
  onResetGamification: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  userProfile,
  pinSettings,
  notificationSettings,
  theme,
  onSaveProfile,
  onSavePinSettings,
  onSaveNotifications,
  onToggleTheme,
  onResetGamification
}) => {
  const [name, setName] = useState(userProfile?.name || '');
  const [age, setAge] = useState(userProfile?.age || '');
  const [avatar, setAvatar] = useState<string>(userProfile?.avatar || '🥕');
  const [challenges, setChallenges] = useState<string[]>(userProfile?.primaryChallenges || []);

  // PIN settings state
  const [pinEnabled, setPinEnabled] = useState(pinSettings.enabled);
  const [newPin, setNewPin] = useState(pinSettings.pin);

  // Sleep reminder state
  const [sleepReminderEnabled, setSleepReminderEnabled] = useState(notificationSettings.sleepReminderEnabled ?? true);
  const [sleepReminderTime, setSleepReminderTime] = useState(notificationSettings.sleepReminderTime || '22:30');

  // Goals reminder state
  const [goalsReminderEnabled, setGoalsReminderEnabled] = useState(notificationSettings.goalsReminderEnabled ?? true);
  const [goalsReminderTime, setGoalsReminderTime] = useState(notificationSettings.goalsReminderTime || '09:00');

  // Wake-up reminder state (sleep tracker)
  const [wakeReminderEnabled, setWakeReminderEnabled] = useState(notificationSettings.wakeReminderEnabled ?? false);
  const [wakeReminderTime, setWakeReminderTime] = useState(notificationSettings.wakeReminderTime || '07:30');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableChallenges = [
    'تمرکز',
    'مدیریت زمان',
    'اهمال کاری',
    'خواب و بیداری',
    'اضطراب و استرس',
    'مدیریت هیجان'
  ];

  const defaultAvatars = ['🥕', '🧠', '🌱', '🚀', '⭐', '⚡', '🦊', '🦉'];

  const handleToggleChallenge = (c: string) => {
    if (challenges.includes(c)) {
      setChallenges(challenges.filter(item => item !== c));
    } else {
      setChallenges([...challenges, c]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || 'کاربر هویج',
      age: age || '',
      avatar,
      onboarded: true,
      primaryChallenges: challenges,
      personalGoals: [],
      energyLevel: 'medium',
      focusLevel: 'medium',
      createdAt: userProfile?.createdAt || new Date().toISOString()
    });
    showToast('اطلاعات پروفایل با موفقیت بروزرسانی شد!');
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinEnabled && newPin.length !== 4) {
      showToast('لطفاً یک رمز ۴ رقمی وارد کنید.');
      return;
    }
    onSavePinSettings({
      enabled: pinEnabled,
      pin: newPin
    });
    showToast('تنظیمات قفل پین ذخیره شد.');
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNotifications({
      ...notificationSettings,
      sleepReminderEnabled,
      sleepReminderTime,
      goalsReminderEnabled,
      goalsReminderTime,
      wakeReminderEnabled,
      wakeReminderTime
    });
    showToast('تنظیمات یادآوری با موفقیت ذخیره شد.');
  };

  const handleExecuteResetGamification = () => {
    onResetGamification();
    setShowResetConfirm(false);
    showToast('تمامی امتیازات، سکه‌ها و سطح کاربر با موفقیت صفر شد.');
  };

  return (
    <div className="space-y-6 pb-28 lg:pb-12 font-sans relative">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider mb-1">
            <User className="w-4 h-4" />
            <span>پروفایل و تنظیمات هویج</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">
            مدیریت حساب کاربری و تنظیمات برنامه
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            اطلاعات شما کاملاً محلی و آفلاین روی دستگاهتان باقی می‌ماند.
          </p>
        </div>

        {/* Theme Quick Switcher */}
        <button
          onClick={onToggleTheme}
          className="py-3 px-5 bg-slate-100 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-2xl flex items-center gap-2 shadow-xs transition-all text-xs border border-slate-200 dark:border-slate-700"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>حالت روز (Light Mode)</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span>حالت شب (Dark Mode)</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Information Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="w-5 h-5 text-orange-500" />
            <span>پروفایل و عکس کاربر</span>
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Avatar Selector */}
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-950 border-4 border-orange-300 dark:border-orange-500 shadow-md flex items-center justify-center overflow-hidden text-4xl font-bold text-orange-600">
                  {avatar.startsWith('data:') ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{avatar}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 transition-colors"
                  title="بارگذاری عکس جدید"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Emoji Picker */}
              <div className="flex flex-wrap justify-center gap-2">
                {defaultAvatars.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setAvatar(e)}
                    className={`w-9 h-9 rounded-xl border text-lg flex items-center justify-center transition-all ${
                      avatar === e
                        ? 'bg-orange-500 text-white border-orange-600 scale-110 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام یا نام مستعار
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً: علی"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  سن (اختیاری)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="مثلاً: ۲۸"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                چالش‌های اصلی شما:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableChallenges.map((ch) => {
                  const isChecked = challenges.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => handleToggleChallenge(ch)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-right flex items-center justify-between ${
                        isChecked
                          ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>{ch}</span>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-orange-500 text-white' : 'border border-slate-300 dark:border-slate-600'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره تغییرات پروفایل</span>
            </button>
          </form>
        </div>

        {/* Right Side: Security, Reminders & Reset Gamification */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Daily Goals & Sleep Reminder Notification Settings */}
          <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>تنظیمات یادآوری و اعلان‌ها</span>
            </h3>

            <form onSubmit={handleNotificationsSubmit} className="space-y-4">
              
              {/* Daily Goals Reminder */}
              <div className="p-4 bg-orange-50/50 dark:bg-slate-800/60 rounded-2xl border border-orange-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      یادآوری تعیین ۳ هدف طلایی روز
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGoalsReminderEnabled(!goalsReminderEnabled)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${
                      goalsReminderEnabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      goalsReminderEnabled ? 'translate-x-0' : '-translate-x-5'
                    }`} />
                  </button>
                </div>

                {goalsReminderEnabled && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      ساعت یادآوری ثبت اهداف روزانه
                    </label>
                    <input
                      type="time"
                      value={goalsReminderTime}
                      onChange={(e) => setGoalsReminderTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs text-slate-800 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      در این زمان پیام یادآوری برای تعیین ۳ کار مهم روز برایتان ارسال می‌شود.
                    </p>
                  </div>
                )}
              </div>

              {/* Sleep Reminder */}
              <div className="p-4 bg-indigo-50/50 dark:bg-slate-800/60 rounded-2xl border border-indigo-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      یادآوری زمان خواب
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSleepReminderEnabled(!sleepReminderEnabled)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${
                      sleepReminderEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      sleepReminderEnabled ? 'translate-x-0' : '-translate-x-5'
                    }`} />
                  </button>
                </div>

                {sleepReminderEnabled && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      ساعت هدف خوابیدن
                    </label>
                    <input
                      type="time"
                      value={sleepReminderTime}
                      onChange={(e) => setSleepReminderTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* Wake-up Reminder */}
              <div className="p-4 bg-sky-50/50 dark:bg-slate-800/60 rounded-2xl border border-sky-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-sky-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      یادآوری زمان بیداری
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWakeReminderEnabled(!wakeReminderEnabled)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${
                      wakeReminderEnabled ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      wakeReminderEnabled ? 'translate-x-0' : '-translate-x-5'
                    }`} />
                  </button>
                </div>

                {wakeReminderEnabled && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      ساعت هدف بیدار شدن
                    </label>
                    <input
                      type="time"
                      value={wakeReminderTime}
                      onChange={(e) => setWakeReminderTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs text-slate-800 dark:text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs transition-all shadow-xs"
              >
                ذخیره تنظیمات یادآوری‌ها
              </button>
            </form>
          </div>

          {/* PIN Lock Security */}
          <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Lock className="w-5 h-5 text-orange-500" />
              <span>قفل رمز عبور (PIN) هنگام ورود</span>
            </h3>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  فعال‌سازی قفل پین ورود
                </span>
                <button
                  type="button"
                  onClick={() => setPinEnabled(!pinEnabled)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${
                    pinEnabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    pinEnabled ? 'translate-x-0' : '-translate-x-5'
                  }`} />
                </button>
              </div>

              {pinEnabled && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رمز ورود ۴ رقمی
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="مثلاً: ۱۲۳۴"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-mono font-bold text-lg text-slate-800 dark:text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-all"
              >
                ذخیره تنظیمات رمز ورود
              </button>
            </form>
          </div>

          {/* Reset Gamification / Points / Coins / Level Card */}
          <div className="bg-rose-50/60 dark:bg-rose-950/30 rounded-[28px] border border-rose-200 dark:border-rose-900/50 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <RotateCcw className="w-5 h-5" />
              <span>ریست کردن امتیازات، سکه‌ها و سطح</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              با زدن دکمه زیر، تمامی امتیازهای کسب‌شده، تعداد سکه‌ها و سطح شما به صفر بازنشانی می‌شود تا بتوانید دوباره از ابتدا رشد کنید.
            </p>

            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>صفر کردن تمامی امتیازات، سکه‌ها و سطح</span>
              </button>
            ) : (
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-rose-500 space-y-3 animate-in fade-in zoom-in-95">
                <p className="text-xs font-black text-rose-600 dark:text-rose-400 text-center">
                  آیا مطمئن هستید؟ تمامی امتیازها، سکه‌ها و سطح شما صفر خواهد شد!
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleExecuteResetGamification}
                    className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all"
                  >
                    بله، صفر کن
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
