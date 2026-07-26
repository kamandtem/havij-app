import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Plus, CheckCircle2, Trash2, Clock, ChevronDown } from 'lucide-react';
import { TimelineEvent } from '../types';

interface TimelineViewProps {
  events: TimelineEvent[];
  onAddEvent: (title: string, timeSlot: string, category: 'work' | 'rest' | 'health' | 'routine') => void;
  onToggleEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

const CATEGORY_OPTIONS: { value: 'work' | 'rest' | 'health' | 'routine'; label: string }[] = [
  { value: 'work', label: 'کاری / تحصیلی' },
  { value: 'rest', label: 'استراحت' },
  { value: 'health', label: 'سلامت / ورزش' },
  { value: 'routine', label: 'روتین شخصی' }
];

export const TimelineView: React.FC<TimelineViewProps> = ({
  events,
  onAddEvent,
  onToggleEvent,
  onDeleteEvent
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<'work' | 'rest' | 'health' | 'routine'>('work');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  // Header starts collapsed to just its small label — tapping the chevron
  // slides it open to show the full heading/description.
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddEvent(title.trim(), `${startTime} - ${endTime}`, category);
    setTitle('');
  };

  const selectedCategoryLabel = CATEGORY_OPTIONS.find((c) => c.value === category)?.label ?? '';

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header — collapsed to just the small label by default; tap the
          chevron to reveal the full title + description. */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
        <button
          onClick={() => setIsHeaderOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 p-6 text-right"
        >
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>مدیریت زمان دیداری</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
              isHeaderOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isHeaderOpen && (
          <div className="px-6 pb-6 -mt-1">
            <h2 className="text-2xl font-extrabold text-slate-800">
              برنامه زمانی روزانه
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              زمان‌های کاری و استراحت خود را در بلوک‌های مشخص قرار دهید تا از سردرگمی جلوگیری شود.
            </p>
          </div>
        )}
      </div>

      {/* Add Time Block Form */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
          <Plus className="w-5 h-5 text-orange-500" />
          <span>یک برنامه‌ی جدید به تایم‌لاین امروز اضافه کن</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          مثلاً «مطالعه‌ی درس ریاضی» از ساعت ۹ تا ۱۰ صبح. این بلوک بعداً پایین همین صفحه نشان داده می‌شود.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">این بلوک زمانی برای چه کاری است؟</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: مطالعه، پیاده‌روی، جلسه..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">از ساعت</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">تا ساعت</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Custom rounded dropdown replacing the native <select>, whose
              option list can't be styled with rounded corners consistently
              across devices, and whose selected-value color was unclear. */}
          <div className="md:col-span-2 relative" ref={categoryRef}>
            <label className="block text-xs font-bold text-slate-700 mb-1">دسته‌بندی</label>
            <button
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white flex items-center justify-between focus:outline-none focus:border-orange-500"
            >
              <span>{selectedCategoryLabel}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute z-20 top-full mt-1.5 w-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setCategory(opt.value);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-right px-4 py-2.5 text-xs font-bold transition-colors ${
                      category === opt.value
                        ? 'bg-orange-500 text-white'
                        : 'bg-white text-slate-700 hover:bg-orange-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
            >
              + ثبت بلوک
            </button>
          </div>
        </form>
      </div>

      {/* Events List / Empty State */}
      {events.length === 0 ? (
        <div className="bg-white rounded-[28px] border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shadow-inner">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">هیچ برنامه زمانی ثبت نشده است</h3>
          <p className="text-slate-400 text-xs max-w-sm">
            تمام فیلدها خالی است. برای سازماندهی روز خود، بلوک‌های زمانی کوتاه ثبت کنید.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div
              key={ev.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                ev.completed
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-white border-slate-200/80 shadow-xs hover:border-orange-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleEvent(ev.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    ev.completed ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 bg-white'
                  }`}
                >
                  {ev.completed && '✓'}
                </button>

                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-xl">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ev.timeSlot}</span>
                </div>

                <div>
                  <p className={`text-sm font-bold ${ev.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {ev.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  {ev.category === 'work' ? 'کاری' : ev.category === 'rest' ? 'استراحت' : ev.category === 'health' ? 'سلامت' : 'روتین'}
                </span>
                <button
                  onClick={() => onDeleteEvent(ev.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
