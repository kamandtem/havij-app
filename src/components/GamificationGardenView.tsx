import React from 'react';
import { Sprout, Trophy, Award, Sparkles, Flame, Coins } from 'lucide-react';
import { GamificationData } from '../types';

interface GamificationGardenViewProps {
  gamification: GamificationData;
}

export const GamificationGardenView: React.FC<GamificationGardenViewProps> = ({
  gamification
}) => {
  const treeStages = [
    { stage: 0, label: 'جوانه کوچک', emoji: '🌱', minPoints: 0 },
    { stage: 1, label: 'ساقه تازه', emoji: '🌿', minPoints: 50 },
    { stage: 2, label: 'درختچه جوان', emoji: '🪴', minPoints: 100 },
    { stage: 3, label: 'درخت شکوفا', emoji: '🌸', minPoints: 200 },
    { stage: 4, label: 'درخت تنومند طلایی', emoji: '🌳', minPoints: 350 },
  ];

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
      {/* Header Banner */}
      <div className="bg-[#ecfdf5] rounded-[28px] border border-emerald-200/80 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>سیستم انگیزشی روانشناختی (Gamification)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-emerald-950">
            باغچه رشد و پاداش‌های شما
          </h2>
          <p className="text-emerald-800 text-sm mt-1">
            هر بار که کاری انجام می‌دهید، مغزتان دوپامین آزاد می‌کند و درخت شخصی‌تان بزرگ‌تر می‌شود.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            <span>نشان‌ها و مدال‌های افتخار (Badges)</span>
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
