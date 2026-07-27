import React, { useState } from 'react';
import {
  Target,
  Timer,
  Scissors,
  Zap,
  Calendar,
  Brain,
  BarChart3,
  Moon,
  Sprout,
  Plus,
  Play,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { UserProfile, DailyGoal, GamificationData, Article } from '../types';
import { playMicroChime } from '../utils/audio';
import { ADHD_ARTICLES } from '../data/articles';
import { ArticleStoryView } from './ArticleStoryView';
import { seededIndexForToday, isTodayStoryRead, markTodayStoryRead } from '../utils/storage';

interface DashboardViewProps {
  userProfile: UserProfile | null;
  dailyGoals: DailyGoal[];
  gamification: GamificationData;
  setActiveTab: (tab: string) => void;
  onToggleGoal: (id: string) => void;
  focusSelectedMinutes: number;
  focusTimeLeftSeconds: number;
  focusIsRunning: boolean;
  onToggleFocusTimer: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  dailyGoals,
  gamification,
  setActiveTab,
  onToggleGoal,
  focusSelectedMinutes,
  focusTimeLeftSeconds,
  focusIsRunning,
  onToggleFocusTimer
}) => {
  const completedGoalsCount = dailyGoals.filter(g => g.completed).length;
  const visibleGoals = dailyGoals.filter(g => !g.completed);

  // Today's progress is now driven purely by the 3 golden goals: finishing
  // all 3 always means 100%, regardless of total points earned.
  const todayProgressPercent = Math.min(100, Math.round((completedGoalsCount / 3) * 100));

  const focusMinutesDisplay = String(Math.floor(focusTimeLeftSeconds / 60)).padStart(2, '0');
  const focusSecondsDisplay = String(focusTimeLeftSeconds % 60).padStart(2, '0');

  // Header greeting accordion: collapsed by default to a short one-line
  // greeting; tapping the chevron reveals the level/points summary.
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [storyArticle, setStoryArticle] = useState<Article | null>(null);

  // The story bubble shows the SAME article all day (seeded by today's
  // date, like the quote-of-the-day banner) and rolls to a new one
  // tomorrow — no more picking a random one on every tap.
  const todaysArticle = ADHD_ARTICLES[seededIndexForToday(ADHD_ARTICLES.length)];
  const [isStoryRead, setIsStoryRead] = useState(isTodayStoryRead);

  const openTodaysStory = () => {
    setStoryArticle(todaysArticle);
    markTodayStoryRead();
    setIsStoryRead(true);
  };

  // Play the same short chime used on the 5-minute-start button whenever
  // the user taps the Pomodoro widget's play/pause control.
  const handlePomodoroToggle = () => {
    playMicroChime();
    onToggleFocusTimer();
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header Greeting — collapsed to a short line + story bubble by
          default; tapping the chevron opens level/points. */}
      <div className="bg-white/80 backdrop-blur-md rounded-[28px] border border-slate-200/70 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-5 sm:p-6">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Instagram-story-style circular bubble → today's education
                article; the colorful ring shows only until it's been read. */}
            <button
              onClick={openTodaysStory}
              className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[3px] hover:scale-105 active:scale-95 transition-transform ${
                isStoryRead
                  ? 'bg-slate-200 dark:bg-slate-700'
                  : 'bg-gradient-to-tr from-orange-400 via-rose-500 to-amber-400'
              }`}
              title={isStoryRead ? 'مقاله امروز رو خوندی' : 'مقاله آموزشی امروز رو ببین'}
            >
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-white">
                <BookOpen className="w-6 h-6 text-orange-500" />
              </div>
            </button>

            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-800 tracking-tight truncate">
                سلام {userProfile?.name ? `${userProfile.name}` : 'دوست عزیز'}
              </h2>
              <p className="text-slate-500 mt-0.5 text-xs sm:text-sm font-bold">
                تمرکز امروزمون روی سه هدفه
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHeaderOpen((o) => !o)}
            className="shrink-0 p-2.5 rounded-2xl bg-slate-50 hover:bg-orange-50 text-slate-400 hover:text-orange-600 border border-slate-200/80 transition-all"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHeaderOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isHeaderOpen && (
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1 flex flex-wrap items-center gap-2.5">
            <div className="px-3.5 py-2 bg-orange-50 rounded-2xl border border-orange-200/80 flex items-center gap-2 text-xs font-bold text-orange-600">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>سطح {gamification.level} ({gamification.points} امتیاز)</span>
            </div>
          </div>
        )}
      </div>

      {storyArticle && (
        <ArticleStoryView article={storyArticle} onClose={() => setStoryArticle(null)} />
      )}

      {/* Main Grid Layout matching Clean Minimalism theme */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Focus Timer Widget — live and synced with the Focus panel */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-[28px] border border-slate-200/80 p-6 flex flex-col items-center justify-center text-center shadow-xs relative">
          <div className="absolute top-5 right-5 text-xs font-extrabold text-slate-400 tracking-wider">
            تایمر پومودورو
          </div>

          <div className="my-6 relative w-48 h-48 rounded-full border-4 border-slate-100 flex flex-col items-center justify-center bg-slate-50/50">
            <div className={`absolute inset-0 rounded-full border-t-4 border-orange-500 ${focusIsRunning ? 'animate-pulse-ring' : ''}`}></div>
            <span className="text-5xl font-light text-slate-800 tracking-tight font-mono">
              {focusMinutesDisplay}:{focusSecondsDisplay}
            </span>
            <span className="text-xs font-bold text-slate-400 mt-2">
              {focusIsRunning ? 'در حال تمرکز...' : `${focusSelectedMinutes} دقیقه تمرکز خالص`}
            </span>
          </div>

          <div className="w-full max-w-xs flex flex-row gap-2.5">
            <button
              onClick={handlePomodoroToggle}
              className={`flex-1 py-3.5 px-3 rounded-2xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5 text-sm ${
                focusIsRunning
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
              }`}
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">{focusIsRunning ? 'توقف موقت' : 'شروع سریع'}</span>
            </button>
            <button
              onClick={() => setActiveTab('focus')}
              className="flex-1 py-3.5 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 rounded-2xl font-bold transition-all text-sm truncate"
            >
              ورود به حالت تمرکز
            </button>
          </div>
        </div>

        {/* Top 3 Golden Daily Goals Summary */}
        <div className="lg:col-span-7 bg-white rounded-[28px] shadow-xs border border-slate-200/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  <span>۳ هدف طلایی امروز</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {completedGoalsCount} از {dailyGoals.length} انجام شده
                </p>
              </div>

              {dailyGoals.length < 3 && (
                <button
                  onClick={() => setActiveTab('goals')}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن هدف</span>
                </button>
              )}
            </div>

            {/* Empty State vs All-Done State vs List (completed goals are hidden once ticked) */}
            {visibleGoals.length === 0 && dailyGoals.length > 0 ? (
              <div className="h-20 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/40 flex items-center justify-center text-emerald-700 text-xs font-bold">
                🎉 هر ۳ هدف امروزت را کامل کردی! آفرین
              </div>
            ) : visibleGoals.length === 0 ? (
              <div className="space-y-3">
                <div
                  onClick={() => setActiveTab('goals')}
                  className="h-20 rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 text-xs font-medium"
                >
                  <span>هنوز هدفی اضافه نکرده‌اید</span>
                  <span className="text-[11px] text-orange-500 font-bold mt-1">کلیک کنید برای ساخت هدف اول (+)</span>
                </div>
                <div className="h-16 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 text-xs">
                  هدف دوم
                </div>
                <div className="h-16 rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 text-xs">
                  هدف سوم
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {visibleGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      goal.completed
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                        : 'bg-slate-50 border-slate-200/80 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleGoal(goal.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                          goal.completed
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-slate-300 hover:border-orange-500 bg-white'
                        }`}
                      >
                        {goal.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div>
                        <p className={`text-sm font-bold ${goal.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {goal.title}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          تخمین: {goal.approxTimeMinutes} دقیقه
                        </p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      goal.importance === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : goal.importance === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {goal.importance === 'high' ? 'ضروری' : goal.importance === 'medium' ? 'متوسط' : 'عادی'}
                    </span>
                  </div>
                ))}

                {dailyGoals.length < 3 && (
                  <button
                    onClick={() => setActiveTab('goals')}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-300 transition-all text-xs font-bold"
                  >
                    + افزودن هدف بعدی ({3 - dailyGoals.length} ظرفیت باقی‌مانده)
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>کارهایتان را کوچک انتخاب کنید تا مغزتان تسلیم نشود.</span>
            <button
              onClick={() => setActiveTab('goals')}
              className="font-bold text-orange-600 hover:underline flex items-center gap-1"
            >
              <span>مدیریت اهداف</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Gamification Garden Card & Quick Tools & Executive Function */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* Garden Gamification Card */}
        <div
          onClick={() => setActiveTab('garden')}
          className="lg:col-span-4 bg-[#ecfdf5] rounded-[28px] p-6 border border-emerald-100 relative overflow-hidden cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-emerald-900 font-bold text-lg mb-1 flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  <span>باغچه انگیزه شما</span>
                </h3>
                <p className="text-xs text-emerald-700 font-medium">
                  با انجام هر کار، درختت رشد می‌کنه
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-200/70 text-emerald-800 rounded-full text-xs font-bold">
                مرحله {gamification.treeGrowthStage + 1}
              </span>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-emerald-200/80 rounded-full flex items-center justify-center text-4xl shadow-inner mb-2 animate-bounce">
                {gamification.treeGrowthStage === 0 && '🌱'}
                {gamification.treeGrowthStage === 1 && '🌿'}
                {gamification.treeGrowthStage === 2 && '🪴'}
                {gamification.treeGrowthStage === 3 && '🌸'}
                {gamification.treeGrowthStage === 4 && '🌳'}
              </div>
              <p className="text-xs font-bold text-emerald-800">
                {gamification.points} امتیاز کُسب‌شده
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 flex justify-between items-center text-xs font-bold text-emerald-700 relative z-10">
            <span>مشاهده باغچه و مدال‌ها</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>

        {/* Quick Tools Grid */}
        <div className="lg:col-span-5 bg-white rounded-[28px] shadow-xs border border-slate-200/80 p-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            ابزارهای ویژه ADHD
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveTab('decomposer')}
              className="bg-slate-50 hover:bg-orange-50 hover:border-orange-200 border border-slate-100 rounded-2xl p-3.5 flex flex-col items-center text-center gap-2 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">خردکننده کارها</p>
                <p className="text-[10px] text-slate-400 mt-0.5">تبدیل به قدم‌های کوچک</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('micro5')}
              className="bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-100 rounded-2xl p-3.5 flex flex-col items-center text-center gap-2 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">شروع ۵ دقیقه‌ای</p>
                <p className="text-[10px] text-slate-400 mt-0.5">ضد اهمال‌کاری</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('cbt')}
              className="bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-100 rounded-2xl p-3.5 flex flex-col items-center text-center gap-2 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">ثبت شناختی CBT</p>
                <p className="text-[10px] text-slate-400 mt-0.5">تحلیل افکار منفی</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('sleep')}
              className="bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-100 rounded-2xl p-3.5 flex flex-col items-center text-center gap-2 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">مدیریت خواب</p>
                <p className="text-[10px] text-slate-400 mt-0.5">ریتم شبانه‌روزی</p>
              </div>
            </button>
          </div>
        </div>

        {/* Executive Function Status Card */}
        <div className="lg:col-span-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-[28px] p-6 text-white flex flex-col justify-between shadow-md shadow-orange-500/20">
          <div>
            <span className="text-orange-100 text-xs font-medium bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs">
              عملکردهای اجرایی مغز
            </span>
            <h3 className="text-2xl font-extrabold mt-3">در مسیر بهبودی</h3>
            <p className="text-xs text-orange-100 mt-1 font-medium leading-relaxed">
              تمرکز روی یک کار در هر لحظه، قوی‌ترین ابزار تقویت مغز است.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-bold text-orange-100">
              <span>پیشرفت امروز</span>
              <span>{todayProgressPercent}%</span>
            </div>
            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5 backdrop-blur-xs">
              <div
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${todayProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
