import React, { useState } from 'react';
import { Brain, Plus, Trash2, Heart, Sparkles, ChevronDown } from 'lucide-react';
import { CBTEntry } from '../types';

interface CbtViewProps {
  entries: CBTEntry[];
  onAddEntry: (entry: Omit<CBTEntry, 'id' | 'date'>) => void;
  onDeleteEntry: (id: string) => void;
}

export const CbtView: React.FC<CbtViewProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry
}) => {
  const [thought, setThought] = useState('');
  const [emotion, setEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(70);
  const [evidenceFor, setEvidenceFor] = useState('');
  const [evidenceAgainst, setEvidenceAgainst] = useState('');
  const [alternativeThought, setAlternativeThought] = useState('');

  const [msg, setMsg] = useState<string | null>(null);
  // Header starts collapsed to just its small label — tapping the chevron
  // slides it open to show the full heading/description.
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim() || !alternativeThought.trim()) {
      setMsg('لطفاً حداقل فکر اولیه و فکر جایگزین را وارد کنید.');
      setTimeout(() => setMsg(null), 4000);
      return;
    }
    onAddEntry({
      thought: thought.trim(),
      emotion: emotion.trim() || 'اضطراب/کلافگی',
      emotionIntensity,
      evidenceFor: evidenceFor.trim(),
      evidenceAgainst: evidenceAgainst.trim(),
      alternativeThought: alternativeThought.trim()
    });
    setThought('');
    setEmotion('');
    setEmotionIntensity(70);
    setEvidenceFor('');
    setEvidenceAgainst('');
    setAlternativeThought('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {msg && (
        <div className="p-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg text-xs">
          {msg}
        </div>
      )}
      {/* Header — collapsed to just the small label by default; tap the
          chevron to reveal the full title + description. */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
        <button
          onClick={() => setIsHeaderOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 p-6 text-right"
        >
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4 shrink-0" />
            <span>بازسازی شناختی CBT</span>
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
              دفترچه ثبت افکار و آرام‌سازی اضطراب
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              افکار ناکارآمد ناشی از عقب‌ماندن کارها را ارزیابی کرده و افکار جایگزین منطقی بسازید.
            </p>
          </div>
        )}
      </div>

      {/* CBT Form */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-600" />
          <span>ثبت فکر جدید</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                فکر ناکارآمد/اتوماتیک اولیه
              </label>
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                placeholder="مثلاً: من هیچ‌وقت کارهایم را به موقع تمام نمی‌کنم..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نوع احساس و شدت آن (۰ تا ۱۰۰٪)
              </label>
              <input
                type="text"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                placeholder="مثلاً: اضطراب شدید، احساس گناه"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-medium mb-2"
              />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={emotionIntensity}
                  onChange={(e) => setEmotionIntensity(Number(e.target.value))}
                  className="flex-1 accent-indigo-600"
                />
                <span className="text-xs font-extrabold text-indigo-600 w-12 text-left">
                  {emotionIntensity}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                شواهد موافق این فکر
              </label>
              <textarea
                value={evidenceFor}
                onChange={(e) => setEvidenceFor(e.target.value)}
                placeholder="دلایلی که فکر می‌کنی این فکر درسته..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                شواهد مخالف این فکر (واقعیت‌ها)
              </label>
              <textarea
                value={evidenceAgainst}
                onChange={(e) => setEvidenceAgainst(e.target.value)}
                placeholder="مثال‌هایی که قبلاً کارهات رو موفق انجام دادی..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              فکر جایگزین واقع‌بینانه و متعادل
            </label>
            <textarea
              value={alternativeThought}
              onChange={(e) => setAlternativeThought(e.target.value)}
              placeholder="مثلاً: مغز من نیاز به شروع از ۵ دقیقه داره و اگر خردش کنم حتماً می‌تونم انجامش بدم."
              rows={2}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-medium"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all"
          >
            ثبت تحلیل CBT
          </button>
        </form>
      </div>

      {/* Entries / Empty State */}
      {entries.length === 0 ? (
        <div className="bg-white rounded-[28px] border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-inner">
            <Brain className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">هیچ ارزیابی افکاری هنوز ثبت نشده است</h3>
          <p className="text-slate-400 text-xs max-w-sm">
            تمام فیلدها خالی است. هر زمان دچار احساس غرق‌شدگی یا اضطراب شدید، فرم بالا را پر کنید.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                    تاریخ: {entry.date}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-xl">
                    احساس: {entry.emotion} ({entry.emotionIntensity}%)
                  </span>
                </div>
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="font-bold text-slate-500 block mb-1">فکر اولیه:</span>
                  <p className="text-slate-800 font-medium">{entry.thought}</p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="font-bold text-emerald-700 block mb-1">فکر جایگزین متعادل:</span>
                  <p className="text-emerald-950 font-bold">{entry.alternativeThought}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
