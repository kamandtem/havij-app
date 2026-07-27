import React, { useState } from 'react';
import { useAccordionHint } from '../utils/hint';
import { Sprout, Trophy, Sparkles, Coins, X, HelpCircle, ChevronDown, Lock } from 'lucide-react';
import { GamificationData } from '../types';
import {
  getGardenGuideSeen,
  setGardenGuideSeen,
  TREE_STAGE_THRESHOLDS,
  GARDEN_SIZE,
  BADGE_USES_REQUIRED,
  LEVEL_TREE_THRESHOLDS,
  SILVER_CARROT_LEVEL,
  GOLDEN_CARROT_LEVEL
} from '../utils/storage';

interface GamificationGardenViewProps {
  gamification: GamificationData;
}

const treeStages = [
  { stage: 0, label: 'جوانه کوچک', emoji: '🌱', minPoints: TREE_STAGE_THRESHOLDS[0] },
  { stage: 1, label: 'ساقه تازه', emoji: '🌿', minPoints: TREE_STAGE_THRESHOLDS[1] },
  { stage: 2, label: 'درختچه جوان', emoji: '🪴', minPoints: TREE_STAGE_THRESHOLDS[2] },
  { stage: 3, label: 'درخت شکوفا', emoji: '🌸', minPoints: TREE_STAGE_THRESHOLDS[3] },
  { stage: 4, label: 'درخت تنومند طلایی', emoji: '🌳', minPoints: TREE_STAGE_THRESHOLDS[4] },
];

type BadgeDef = {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  progress: number; // 0..required (or 0..GARDEN_SIZE for the golden one)
  required: number;
  unlocked: boolean;
};

// First-time onboarding guide: explains, in plain language and with a small
// hand-drawn-style diagram, what this whole section is for, how points and
// coins are earned, how badges now work (3 uses of a tool, shown as a dotted
// progress bar), and how finished trees move into a 10-slot garden bed that
// merges into a golden tree — since a brand-new user has no way of guessing
// any of that just from the numbers on screen.
const GardenGuide: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
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
          <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-extrabold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>امتیاز و سکه چطور به دست میاد؟</span>
            </h3>
            <ul className="space-y-1.5 text-[11px] font-bold text-amber-950/90 dark:text-amber-100">
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5">🎯</span>
                <span>تیک زدن هر هدف روزانه، امتیاز می‌دهد</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5">⏱️</span>
                <span>تمام کردن یک جلسه تمرکز (پومودورو)، امتیاز می‌دهد</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5">✂️</span>
                <span>خرد کردن یک کار بزرگ به مراحل کوچک، هم امتیاز و هم سکه می‌دهد</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="mt-0.5">🧠</span>
                <span>تحلیل یک فکر در بخش CBT یا ثبت اطلاعات خواب، امتیاز می‌دهد</span>
              </li>
            </ul>
            <p className="text-[10px] text-amber-900/70 dark:text-amber-200/70 font-bold pt-1 border-t border-amber-200/60 dark:border-amber-900/60 mt-2">
              سکه فقط از «خردکن کارها» به دست می‌آید؛ بقیه فعالیت‌ها فقط درختت را رشد می‌دهند.
            </p>
          </div>

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
                وقتی درخت به آخرین مرحله برسه، وارد باغچه‌ت می‌شه و یک نهال تازه از اول شروع به رشد می‌کنه.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900 rounded-2xl p-4 space-y-1">
            <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <span>🪴</span>
              <span>باغچه ۱۰ جایگاهی</span>
            </h3>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
              هر بار روی درخت در حال رشد بزنی، باغچه‌ت باز می‌شه و می‌تونی درخت‌های کامل‌شده رو ببینی. وقتی ۱۰ درخت جمع بشه، همه‌شون به یک درخت طلایی تبدیل می‌شن و باغچه دوباره از اول پر می‌شه.
            </p>
          </div>

          {/* Level tiers */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <span>🥕</span>
              <span>سطح شما چطور بالا می‌ره؟</span>
            </h3>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
              سطح شما به تعداد کل درخت‌هایی که تا حالا کاشته‌اید بستگی دارد، نه به امتیاز لحظه‌ای:
            </p>
            <ul className="space-y-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
              {LEVEL_TREE_THRESHOLDS.map((treeCount, idx) => {
                const levelNum = idx + 1;
                const isGoldenMilestone = treeCount % GARDEN_SIZE === 0;
                return (
                  <li key={levelNum} className="flex items-center gap-1.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-black flex items-center justify-center">
                      {levelNum}
                    </span>
                    <span>
                      سطح {levelNum}: کاشت {treeCount}اُمین درخت
                      {isGoldenMilestone ? ` (${treeCount / GARDEN_SIZE}اُمین درخت طلایی)` : ''}
                      {levelNum === SILVER_CARROT_LEVEL && ' 🥕 نشان هویج نقره‌ای'}
                      {levelNum === GOLDEN_CARROT_LEVEL && ' 🥕✨ نشان هویج طلایی'}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold pt-1 border-t border-slate-200/60 dark:border-slate-700/60 mt-1">
              نشان هویج نقره‌ای کنار سطحتان، و نشان هویج طلایی کنار نامتان، در همین منوی کناری دیده می‌شود.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 space-y-1">
            <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>نشان‌های افتخار</span>
            </h3>
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
              نشان‌ها با گرفتن امتیاز باز نمی‌شوند؛ هر نشان به یک ابزار خاص برنامه وصل است و وقتی همان ابزار را ۳ بار استفاده کنی، نشان برایت اعطا می‌شود. کنار هر نشان یک نوار نقطه‌ای می‌بینی که با هر استفاده، یک نقطه‌اش پر می‌شود. استثنا «غول‌کش کارهای بزرگ» است: فقط با خرد کردن کاری که به‌طور کامل هم تمامش کرده باشی، یک نقطه‌اش پر می‌شود؛ صرفِ خرد کردن یا تکمیل چند مرحله کافی نیست.
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

// The garden bed modal: shows the 10 planting slots. Opened by tapping the
// growing tree/sapling in the main panel — this is the "where's the garden?"
// space the grown trees actually move into.
const GardenBedModal: React.FC<{ gamification: GamificationData; onClose: () => void }> = ({
  gamification,
  onClose
}) => {
  const slots = Array.from({ length: GARDEN_SIZE }, (_, i) => gamification.gardenTrees[i] || null);

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="p-6 pb-4 text-center bg-gradient-to-b from-emerald-50 to-transparent dark:from-emerald-950/30 rounded-t-[32px] relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-4xl">🪴</span>
          <h2 className="text-lg font-black text-slate-800 dark:text-white mt-2">
            باغچه‌ی درخت‌های کامل‌شده
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed px-2">
            هر جایگاه، یک درخت کامل‌شده‌ست. با پر شدن هر ۱۰ جایگاه، همه‌شون یک درخت طلایی می‌شوند.
          </p>
        </div>

        <div className="px-6 pb-4">
          <div className="grid grid-cols-5 gap-3">
            {slots.map((tree, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 ${
                  tree
                    ? tree.golden
                      ? 'bg-amber-50 border-amber-300 shadow-xs'
                      : 'bg-emerald-50 border-emerald-200 shadow-xs'
                    : 'bg-slate-50 border-dashed border-slate-200 dark:bg-slate-800/40 dark:border-slate-700'
                }`}
              >
                <span className="text-2xl">{tree ? (tree.golden ? '✨' : '🌳') : '🪹'}</span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">{idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>پر شده: {gamification.gardenTrees.length} از {GARDEN_SIZE}</span>
            {gamification.goldenMerges > 0 && (
              <span className="text-amber-600 dark:text-amber-400">
                درخت‌های طلایی ساخته‌شده: {gamification.goldenMerges}
              </span>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

// A small dotted progress bar next to each badge — one dot per required use,
// filled left-to-right as the matching tool gets used.
const BadgeProgressDots: React.FC<{ progress: number; required: number; unlocked: boolean }> = ({
  progress,
  required,
  unlocked
}) => (
  <div className="flex items-center gap-1 mt-1.5">
    {Array.from({ length: required }, (_, i) => (
      <span
        key={i}
        className={`w-1.5 h-1.5 rounded-full ${
          i < progress
            ? unlocked
              ? 'bg-emerald-500'
              : 'bg-amber-400'
            : 'bg-slate-200 dark:bg-slate-700'
        }`}
      />
    ))}
  </div>
);

export const GamificationGardenView: React.FC<GamificationGardenViewProps> = ({
  gamification
}) => {
  const [showGuide, setShowGuide] = useState<boolean>(() => !getGardenGuideSeen());
  const [showGardenBed, setShowGardenBed] = useState(false);
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const showHint = useAccordionHint();

  const dismissGuide = () => {
    setGardenGuideSeen();
    setShowGuide(false);
  };

  const usage = gamification.toolUsage;

  const badges: BadgeDef[] = [
    {
      id: 'first_goal',
      title: 'اولین هدف',
      desc: 'تیک زدن هدف روزانه، ۳ بار',
      emoji: '🎯',
      progress: Math.min(BADGE_USES_REQUIRED, usage?.goals ?? 0),
      required: BADGE_USES_REQUIRED,
      unlocked: gamification.unlockedBadges.includes('first_goal')
    },
    {
      id: 'focus_master',
      title: 'استاد تمرکز',
      desc: 'تکمیل جلسه تمرکز، ۳ بار',
      emoji: '⏱️',
      progress: Math.min(BADGE_USES_REQUIRED, usage?.focus ?? 0),
      required: BADGE_USES_REQUIRED,
      unlocked: gamification.unlockedBadges.includes('focus_master')
    },
    {
      id: 'task_slayer',
      title: 'غول‌کش کارهای بزرگ',
      desc: 'تکمیل کامل ۳ کار خردشده',
      emoji: '✂️',
      progress: Math.min(BADGE_USES_REQUIRED, usage?.decomposer ?? 0),
      required: BADGE_USES_REQUIRED,
      unlocked: gamification.unlockedBadges.includes('task_slayer')
    },
    {
      id: 'cbt_champion',
      title: 'آرامش ذهنی',
      desc: 'تحلیل فکر در بخش CBT، ۳ بار',
      emoji: '🧠',
      progress: Math.min(BADGE_USES_REQUIRED, usage?.cbt ?? 0),
      required: BADGE_USES_REQUIRED,
      unlocked: gamification.unlockedBadges.includes('cbt_champion')
    },
    {
      id: 'sleep_hero',
      title: 'قهرمان خواب منظم',
      desc: 'ثبت اطلاعات خواب، ۳ بار',
      emoji: '🌙',
      progress: Math.min(BADGE_USES_REQUIRED, usage?.sleep ?? 0),
      required: BADGE_USES_REQUIRED,
      unlocked: gamification.unlockedBadges.includes('sleep_hero')
    },
    {
      id: 'golden_tree',
      title: 'باغبان طلایی',
      desc: 'پر کردن باغچه و ساخت درخت طلایی',
      emoji: '🌳',
      progress: Math.min(GARDEN_SIZE, gamification.gardenTrees.length),
      required: GARDEN_SIZE,
      unlocked: gamification.unlockedBadges.includes('golden_tree')
    }
  ];

  const currentStageInfo = treeStages[Math.min(gamification.treeGrowthStage, 4)];

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {showGuide && <GardenGuide onDismiss={dismissGuide} />}
      {showGardenBed && (
        <GardenBedModal gamification={gamification} onClose={() => setShowGardenBed(false)} />
      )}

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
                isHeaderOpen ? 'rotate-180' : showHint ? 'animate-chevron-hint' : ''
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
        <div className="lg:col-span-6 bg-white rounded-[28px] border border-slate-200/80 p-8 shadow-xs flex flex-col items-center justify-center text-center space-y-6">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            مرحله فعلی: {currentStageInfo.label}
          </span>

          <button
            onClick={() => setShowGardenBed(true)}
            className="relative w-48 h-48 rounded-full bg-emerald-50/60 border-4 border-emerald-100 flex items-center justify-center shadow-inner hover:border-emerald-200 active:scale-95 transition-all"
            title="باغچه‌ات را ببین"
          >
            <span className="text-8xl animate-bounce">
              {currentStageInfo.emoji}
            </span>
          </button>
          <button
            onClick={() => setShowGardenBed(true)}
            className="-mt-4 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>🪴</span>
            <span>رفتن به باغچه ({gamification.gardenTrees.length}/{GARDEN_SIZE})</span>
          </button>

          <div>
            <h3 className="text-xl font-bold text-slate-800">
              درخت هویج شما
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              با تکمیل اهداف، تمرکز، و خرد کردن کارها، درخت شما از جوانه کوچک به درخت طلایی تبدیل می‌شود. با تکمیل هر درخت، به باغچه‌ات منتقل می‌شود و نهال تازه‌ای شروع می‌شود.
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>روند رشد نهال فعلی</span>
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
                    : 'bg-slate-50 border-slate-200/60'
                }`}
              >
                <div
                  className={`relative w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs shrink-0 ${
                    badge.unlocked ? '' : 'grayscale opacity-60'
                  }`}
                >
                  {badge.emoji}
                  {!badge.unlocked && (
                    <span className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-slate-300 flex items-center justify-center">
                      <Lock className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>{badge.title}</span>
                    {badge.unlocked && <span className="text-[10px] text-emerald-600 font-extrabold">(آزادشده ✓)</span>}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                    {badge.desc}
                  </p>
                  <BadgeProgressDots progress={badge.progress} required={badge.required} unlocked={badge.unlocked} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
