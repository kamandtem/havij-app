import React, { useState } from 'react';
import { useAccordionHint } from '../utils/hint';
import { Target, Plus, CheckCircle2, Trash2, Clock, AlertCircle, Sparkles, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyGoal } from '../types';

interface DailyGoalsViewProps {
  goals: DailyGoal[];
  onAddGoal: (goal: Omit<DailyGoal, 'id' | 'completed' | 'date'>) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export const DailyGoalsView: React.FC<DailyGoalsViewProps> = ({
  goals,
  onAddGoal,
  onToggleGoal,
  onDeleteGoal
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [approxTimeMinutes, setApproxTimeMinutes] = useState(25);
  const [importance, setImportance] = useState<'high' | 'medium' | 'low'>('medium');
  const [praiseMessage, setPraiseMessage] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Header starts collapsed to just its small label — tapping the chevron
  // slides it open to show the full heading/description.
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const showHint = useAccordionHint();

  // Goals that were just ticked stay visible briefly (for the celebration),
  // then get removed from the panel per the "cleared once completed" rule.
  const [recentlyCompletedIds, setRecentlyCompletedIds] = useState<Set<string>>(new Set());
  const visibleGoals = goals.filter(g => !g.completed || recentlyCompletedIds.has(g.id));

  // The first 3 are the "main" daily goals; the 4th and 5th spill over into
  // two separate side-goal slots, kept visually distinct from the main 3.
  const MAIN_CAPACITY = 3;
  const SIDE_CAPACITY = 2;
  const TOTAL_CAPACITY = MAIN_CAPACITY + SIDE_CAPACITY;
  const visibleMainGoals = visibleGoals.slice(0, MAIN_CAPACITY);
  const visibleSideGoals = visibleGoals.slice(MAIN_CAPACITY, TOTAL_CAPACITY);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (goals.length >= TOTAL_CAPACITY) {
      setErrorMessage('شما قبلاً ۳ هدف اصلی و ۲ هدف جانبی امروز را ثبت کرده‌اید. برای حفظ تمرکز، بیشتر از این مجاز نیست.');
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }
    onAddGoal({
      title: title.trim(),
      approxTimeMinutes: Number(approxTimeMinutes) || 15,
      importance
    });
    setTitle('');
    setApproxTimeMinutes(25);
    setImportance('medium');
    setShowModal(false);
    setErrorMessage(null);
  };

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    onToggleGoal(id);
    if (!currentlyCompleted) {
      // Celebrate!
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
      const praises = [
        'فوق‌العاده بود! یک قدم بزرگ به سمت هدف هات برداشتی 👏',
        'عالی انجامش دادی! مغزت همین الان دوپامین آزاد کرد 🚀',
        'تبریک! تمرکزت داره روز به روز قوی‌تر میشه 💪',
        'آفرین! غول اهمال‌کاری رو شکست دادی 🔥'
      ];
      const randomPraise = praises[Math.floor(Math.random() * praises.length)];
      setPraiseMessage(randomPraise);
      setTimeout(() => setPraiseMessage(null), 5000);

      // Keep the card visible for the celebration, then clear it from the panel.
      setRecentlyCompletedIds((prev) => new Set(prev).add(id));
      setTimeout(() => {
        setRecentlyCompletedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 1600);
    } else {
      // Un-checking a goal (e.g. via undo) should show it again immediately.
      setRecentlyCompletedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Top Banner — collapsed to just the small label by default; tap the
          chevron to reveal the full title + description. */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
          <button
            onClick={() => setIsHeaderOpen((o) => !o)}
            className="flex-1 w-full sm:w-auto flex items-center justify-between gap-3 text-right"
          >
            <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
              <Target className="w-4 h-4 shrink-0" />
              <span>قانون ۳ هدف اصلی + ۲ هدف جانبی</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                isHeaderOpen ? 'rotate-180' : showHint ? 'animate-chevron-hint' : ''
              }`}
            />
          </button>

          {goals.length < TOTAL_CAPACITY ? (
            <button
              onClick={() => setShowModal(true)}
              className="py-3 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span>افزودن هدف جديد ({TOTAL_CAPACITY - goals.length} ظرفیت)</span>
            </button>
          ) : (
            <div className="px-4 py-2 bg-amber-50 text-amber-800 rounded-2xl text-xs font-bold border border-amber-200/80 shrink-0">
              ظرفیت امروز (۳ اصلی + ۲ جانبی) تکمیل شد ✨
            </div>
          )}
        </div>

        {isHeaderOpen && (
          <div className="px-6 pb-6 -mt-1">
            <h2 className="text-2xl font-extrabold text-slate-800">
              سه هدف مهم امروز، به‌علاوه دو هدف جانبی
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              مغز افراد ADHD در مواجهه با فهرست‌های طولانی فلج می‌شود. ۳ کار کلیدی انتخاب کنید؛ در صورت نیاز، ۲ هدف جانبی هم می‌توانید اضافه کنید.
            </p>
          </div>
        )}
      </div>

      {/* Praise Notification Banner */}
      {praiseMessage && (
        <div className="p-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg flex items-center gap-3 animate-bounce">
          <Sparkles className="w-6 h-6 text-yellow-300 shrink-0" />
          <p className="text-sm">{praiseMessage}</p>
        </div>
      )}

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="p-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg flex items-center gap-3">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Goals List / Empty State / All-Done State (completed goals disappear from view shortly after being ticked) */}
      {visibleGoals.length === 0 && goals.length > 0 ? (
        <div className="bg-emerald-50/60 rounded-[28px] border-2 border-dashed border-emerald-200 p-12 text-center flex flex-col items-center justify-center space-y-2">
          <span className="text-4xl">🎉</span>
          <h3 className="text-lg font-bold text-emerald-800">همه‌ی اهداف امروزت رو کامل کردی!</h3>
          <p className="text-emerald-700 text-xs">فردا با اهداف جدید ادامه میدیم.</p>
        </div>
      ) : visibleGoals.length === 0 ? (
        <div className="bg-white rounded-[28px] border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shadow-inner">
            <Target className="w-8 h-8" />
          </div>
          <div className="max-w-md">
            <h3 className="text-lg font-bold text-slate-800">هیچ هدفی برای امروز ثبت نشده است</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              صفحه کاملاً خالی است. برای شروع روز، اولین هدف کوچک خود را اضافه کنید. پیشنهاد: از کارهای ساده ۵ تا ۱۵ دقیقه‌ای شروع کنید.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>ایجاد اولین هدف روز</span>
          </button>
        </div>
      ) : (
        <>
          {/* Main 3 goals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleMainGoals.map((goal, idx) => (
              <div
                key={goal.id}
                className={`rounded-[28px] p-6 border transition-all flex flex-col justify-between relative ${
                  goal.completed
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 shadow-xs'
                    : 'bg-white border-slate-200/80 shadow-xs hover:border-orange-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-extrabold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${
                      goal.importance === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : goal.importance === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {goal.importance === 'high' ? 'ضروری' : goal.importance === 'medium' ? 'اهمیت متوسط' : 'عادی'}
                    </span>
                  </div>

                  <h3 className={`text-base font-bold mb-2 ${goal.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {goal.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-6">
                    <Clock className="w-3.5 h-3.5" />
                    <span>تخمین زمان: {goal.approxTimeMinutes} دقیقه</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100/80 flex items-center justify-between">
                  <button
                    onClick={() => handleToggle(goal.id, goal.completed)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      goal.completed
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{goal.completed ? 'انجام شد ✓' : 'علامت به عنوان انجام‌شده'}</span>
                  </button>

                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                    title="حذف هدف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Placeholder slots for the main 3 */}
            {Array.from({ length: MAIN_CAPACITY - Math.min(goals.length, MAIN_CAPACITY) }).map((_, i) => (
              <div
                key={i}
                onClick={() => setShowModal(true)}
                className="rounded-[28px] border-2 border-dashed border-slate-200/80 p-6 flex flex-col items-center justify-center text-center space-y-2 cursor-pointer hover:border-orange-300 hover:bg-orange-50/20 transition-all min-h-[200px]"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold">
                  +
                </div>
                <p className="text-xs font-bold text-slate-500">ظرفیت خالی هدف #{Math.min(goals.length, MAIN_CAPACITY) + i + 1}</p>
                <p className="text-[11px] text-slate-400">برای افزودن کلیک کنید</p>
              </div>
            ))}
          </div>

          {/* Side goals — only available once the 3 main goals are set, kept
              visually distinct (smaller, dashed indigo accent) from the main 3. */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-[11px] uppercase tracking-wider px-1">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>دو هدف جانبی (اختیاری)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {visibleSideGoals.map((goal, idx) => (
                <div
                  key={goal.id}
                  className={`rounded-2xl p-4 border transition-all flex items-center justify-between gap-3 ${
                    goal.completed
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : 'bg-indigo-50/40 border-indigo-100 hover:border-indigo-300'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-indigo-500">دسته جانبی {idx + 1}</span>
                    <h4 className={`text-sm font-bold truncate ${goal.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {goal.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">{goal.approxTimeMinutes} دقیقه</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggle(goal.id, goal.completed)}
                      className={`p-2 rounded-xl transition-all ${
                        goal.completed ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                      title="علامت به عنوان انجام‌شده"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
                      title="حذف هدف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Side placeholders — only offered once all 3 main goals exist */}
              {Array.from({ length: SIDE_CAPACITY - Math.max(0, Math.min(goals.length, TOTAL_CAPACITY) - MAIN_CAPACITY) }).map((_, i) => {
                const mainFull = goals.length >= MAIN_CAPACITY;
                const slotNumber = Math.max(0, goals.length - MAIN_CAPACITY) + i + 1;
                return (
                  <div
                    key={i}
                    onClick={() => mainFull && setShowModal(true)}
                    className={`rounded-2xl border-2 border-dashed p-4 flex items-center gap-3 min-h-[64px] transition-all ${
                      mainFull
                        ? 'border-indigo-200 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30'
                        : 'border-slate-100 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                      +
                    </div>
                    <p className="text-xs font-bold text-slate-500">
                      {mainFull ? `دسته جانبی ${slotNumber} خالی است` : 'ابتدا ۳ هدف اصلی را تکمیل کنید'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Add Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-800">افزودن هدف جدید برای امروز</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  عنوان هدف (شفاف و کوچک)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثلاً: خواندن ۱۰ صفحه کتاب"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  زمان تقریبی مورد نیاز (دقیقه)
                </label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={approxTimeMinutes}
                  onChange={(e) => setApproxTimeMinutes(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  سطح اهمیت
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setImportance('high')}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      importance === 'high'
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    ضروری
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportance('medium')}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      importance === 'medium'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    متوسط
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportance('low')}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      importance === 'low'
                        ? 'bg-slate-700 text-white border-slate-700'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    عادی
                  </button>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
                >
                  ثبت هدف
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
