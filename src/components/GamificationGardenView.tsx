import React, { useState } from 'react';
import { Sprout, Trophy, Award, Sparkles, Flame, Coins, X, HelpCircle, ChevronDown } from 'lucide-react';
import { GamificationData } from '../types';
import { getGardenGuideSeen, setGardenGuideSeen } from '../utils/storage';

interface GamificationGardenViewProps {
  gamification: GamificationData;
}

const treeStages = [
  { stage: 0, label: 'جوانه کوچک', emoji: '🌱', minPoints: 0 },
  { stage: 1, label: 'ساقه تازه', emoji: '🌿', minPoints: 50 },
  { stage: 2, label: 'درختچه جوان', emoji: '🪴', minPoints: 100 },
  { stage: 3, label: 'درخت شکوفا', emoji: '🌸', minPoints: 200 },
  { stage: 4, label: 'درخت تنومند طلایی', emoji: '🌳', minPoints: 350 },
];

// First-time onboarding guide: explains, in plain language and with a small
// hand-drawn-style diagram, what this whole section is for, how points and
// coins are earned, and how the tree grows — since a brand-new user has no
// way of guessing any of that just from the numbers on screen.
const GardenGuide: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="p-6 pb-4 text-center bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-950/30 rounded-t-[32px] relative">
          <button
            onClick={onDismiss}
            className="absolute left-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-5xl">🌱</span>
          <h2 className="text-lg font-black text-slate-800 dark:text-white mt-2">
            به باغچه انگیزه خوش اومدی!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed px-2">
            این بخش پیشرفت و انگیزه‌ات رو به شکل یه درخت زنده نشون می‌ده؛ هرچی توی برنامه فعال‌تر باشی، این درخت بزرگ‌تر می‌شه.
          </p>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* How points/coins are earned */}
          <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>امتیاز و سکه چطور به دست میاد؟</span>
            </h3>
            <ul className="space-y-1.5 text-[11px] font-bold text-amber-950/90 dark:text-amber-100">
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5">🎯</span>
                <span>تیک زدن هر هدف روزانه</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5">⏱️</span>
                <span>تمام کردن یک جلسه تمرکز (پومودورو)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5">✂️</span>
                <span>خرد کردن یک کار بزرگ به مراحل کوچک</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5">🧠</span>
                <span>تحلیل یک فکر در بخش CBT یا ثبت اطلاعات خواب</span>
              </li>
            </ul>
          </div>

          {/* Tree growth diagram */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>درختت چطور رشد می‌کنه؟</span>
            </h3>
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900 rounded-2xl p-4">
              <div className="flex items-center">
                {treeStages.map((s, i) => (
                  <React.Fragment key={s.stage}>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-xl shadow-xs">
                        {s.emoji}
                      </div>
                      <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400">
                        {s.minPoints}+
                      </span>
                    </div>
                    {i < treeStages.length - 1 && (
                      <div className="flex-1 h-0.5 bg-emerald-200 dark:bg-emerald-800 mx-1 rounded-full" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[10px] text-emerald-800/80 dark:text-emerald-300/80 font-bold text-center mt-3">
                عدد زیر هر مرحله، حداقل امتیازیه که برای رسیدن به اون لازم داری.
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 space-y-1">
            <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>نشان‌های افتخار</span>
            </h3>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
              با رسیدن به هر آستانه امتیاز، یک نشان جدید برایت باز می‌شود؛ همه‌ی نشان‌ها را می‌توانی همین‌جا، کنار درختت، ببینی.
            </p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-colors"
          >
            متوجه شدم، دیگر نشان نده
          </button>
        </div>
      </div>
    </div>
  );
};

export const GamificationGardenView: React.FC<GamificationGardenViewProps> = ({
  gamification
}) => {
  const [showGuide, setShowGuide] = useState<boolean>(() => !getGardenGuideSeen());
  // Header starts collapsed to just its small label — tapping the chevron
  // slides it open to show the full heading/description.
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  const dismissGuide = () => {
    setGardenGuideSeen();
    setShowGuide(false);
  };

  const badges = [
    { id: 'first_goal', title: 'اولین هدف', desc: 'انجام اولین هدف روزانه', emoji: '🎯', unlocked: gamification.points >= 10 },
    { id: 'focus_master', title: 'استاد تمرکز', desc: 'تکمیل اولین جلسه تمرکز ۲۵ دقیقه‌ای', emoji: '⏱️', unlocked: gamification.points >= 25 },
    { id: 'task_slayer', title: 'غول‌کش کارهای بزرگ', desc: 'خرد کردن اولین کار بزرگ به مراحل کوچک', emoji: '✂️', unlocked: gamification.points >= 40 },
    { id: 'cbt_champion', title: 'آرامش ذهنی', desc: 'تحلیل اولین فکر در بخش CBT', emoji: '🧠', unlocked: gamification.points >= 55 },
    { id: 'sleep_hero', title: 'قهرمان خواب منظم', desc: 'ثبت اطلاعات خواب و رعایت بهداشت خواب', emoji: '🌙', unlocked: gamification.points >= 70 },
    { id: 'golden_tree', title: 'باغبان طلایی', desc: 'رسیدن به بالاترین مرحله رشد درخت', emoji: '🌳', unlocked: gamification.points >= 350 },
  ];

  const currentStageInfo = treeStages[Math.min(gamification.treeGrowthStage, 4)];

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {showGuide && <GardenGuide onDismiss={dismissGuide} />}

      {/* Header Banner — collapsed to just the small label by default; tap
          the chevron to reveal the full title + description. */}
      <div className="bg-[#ecfdf5] rounded-[28px] border border-emerald-200/80 shadow-xs overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
          <button
            onClick={() => setIsHeaderOpen((o) => !o)}
            className="flex-1 w-full md:w-auto flex items-center justify-between gap-3 text-right"
          >
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>سیستم انگیزشی روانشناختی</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-emerald-500 shrink-0 transition-transform duration-300 ${
                isHeaderOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowGuide(true)}
              className="shrink-0 p-1.5 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors"
              title="راهنمای این بخش"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <div className="px-4 py-2.5 bg-white rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-2 font-extrabold text-emerald-800 text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{gamification.points} امتیاز</span>
            </div>
            <div className="px-4 py-2.5 bg-amber-500 text-white rounded-2xl shadow-xs flex items-center gap-2 font-extrabold text-sm">
              <Coins className="w-4 h-4" />
              <span>{gamification.coins} سکه</span>
            </div>
          </div>
        </div>

        {isHeaderOpen && (
          <div className="px-6 pb-6 -mt-1">
            <h2 className="text-2xl font-extrabold text-emerald-950">
              باغچه رشد و پاداش‌های شما
            </h2>
            <p className="text-emerald-800 text-sm mt-1">
              هر بار که کاری انجام می‌دهید، مغزتان دوپامین آزاد می‌کند و درخت شخصی‌تان بزرگ‌تر می‌شود.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Personal Tree Growth Interactive Card */}
        <div className="lg:col-span-6 bg-white rounded-[28px] border border-slate-200/80 p-8 shadow-xs flex flex-col items-center justify-center text-center space-y-6">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            مرحله فعلی: {currentStageInfo.label}
          </span>

          <div className="relative w-48 h-48 rounded-full bg-emerald-50/60 border-4 border-emerald-100 flex items-center justify-center shadow-inner">
            <span className="text-8xl animate-bounce">
              {currentStageInfo.emoji}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800">
              درخت هویج شما
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              با تکمیل اهداف، تمرکز، و خرد کردن کارها، درخت شما از جوانه کوچک به درخت طلایی تبدیل می‌شود.
            </p>
          </div>

          {/* Growth stages bar */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>روند رشد درخت</span>
              <span>مرحله {gamification.treeGrowthStage + 1} از ۵</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((gamification.treeGrowthStage + 1) / 5) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Badges and Achievements */}
        <div className="lg:col-span-6 bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>نشان‌ها و مدال‌های افتخار</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  badge.unlocked
                    ? 'bg-amber-50/70 border-amber-200/80 text-amber-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200/60 opacity-50 grayscale'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs shrink-0">
                  {badge.emoji}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>{badge.title}</span>
                    {badge.unlocked && <span className="text-[10px] text-emerald-600 font-extrabold">(آزادشده ✓)</span>}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
