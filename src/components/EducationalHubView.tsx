import React, { useState } from 'react';
import { BookOpen, Search, Clock, ArrowRight, Sparkles, Tag, ChevronDown } from 'lucide-react';
import { ADHD_ARTICLES } from '../data/articles';
import { Article } from '../types';

export const EducationalHubView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  // The title + description card starts collapsed to just its small label —
  // tapping the chevron slides it open to show the full heading/description.
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  const categories = ['همه', 'اصول اولیه', 'خودشناسی', 'روانشناسی', 'راهکارها', 'تکنیک‌ها', 'عادت‌سازی', 'تمرکز', 'سلامتی', 'سلامت روان', 'مهارت‌های مغزی'];

  const filteredArticles = ADHD_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'همه' || art.category === selectedCategory;
    const matchesSearch = art.title.includes(searchQuery) || art.summary.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // The timeline only makes sense as a "path" (article N is the foundation
  // for article N+1) when nothing is filtered out — once a category/search
  // narrows the list, we fall back to plain numbered cards without implying
  // a broken chain of dashes between unrelated articles.
  const isTimelineOrder = selectedCategory === 'همه' && searchQuery.trim() === '';

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header — collapsed to just the small label by default; tap the
          chevron to reveal the full title + description. */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <button
          onClick={() => setIsHeaderOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 p-6 text-right"
        >
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>پایگاه دانش آفلاین</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
              isHeaderOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isHeaderOpen && (
          <div className="px-6 pb-6 -mt-1">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              آموزش‌ها و راهکارهای روانشناختی ADHD
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              ۱۳ مقاله کامل و تخصصی آفلاین برای درک عمیق‌تر عملکرد مغز و راهکارهای غلبه بر چالش‌ها — از ابتدا تا پیشرفته.
            </p>
          </div>
        )}
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در بین مقالات و راهکارها..."
            className="w-full pr-11 pl-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-xs font-medium focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Timeline: a "path" of small orange nodes connected by
          dashed lines — the article at the top is the foundation the ones
          below it build on. */}
      <div className="relative">
        {isTimelineOrder && (
          <div className="absolute top-2 bottom-2 right-[27px] w-0 border-r-2 border-dashed border-orange-200 dark:border-orange-900/70" />
        )}

        <div className="space-y-4">
          {filteredArticles.map((article, idx) => (
            <div key={article.id} className="relative flex items-stretch gap-3">
              {/* Timeline node */}
              {isTimelineOrder && (
                <div className="relative z-10 shrink-0 w-14 flex justify-center pt-5">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-black shadow-md shadow-orange-500/30 ring-[6px] ring-orange-50 dark:ring-slate-950">
                    {idx + 1}
                  </div>
                </div>
              )}

              {/* Card (kept as short/summarized as before — just restyled to sit on the timeline) */}
              <div
                onClick={() => setActiveArticle(article)}
                className="flex-1 min-w-0 bg-white dark:bg-slate-900 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 rounded-[24px] border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs transition-all cursor-pointer space-y-3 group hover:border-orange-300 dark:hover:border-orange-800"
              >
                <div className="flex justify-between items-center text-xs flex-wrap gap-2">
                  <span className="font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200/60 dark:border-orange-900 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{article.category}</span>
                  </span>
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>زمان مطالعه: {article.readTime}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {article.summary}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-orange-600 dark:text-orange-400">
                  <span>مطالعه مقاله کامل</span>
                  <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}

          {filteredArticles.length === 0 && (
            <div className="text-center text-slate-400 text-sm py-10">
              مقاله‌ای با این مشخصات پیدا نشد.
            </div>
          )}
        </div>
      </div>

      {/* Full Article Modal Reader */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-3 py-1 rounded-full border border-orange-200/60 dark:border-orange-900 mb-2 inline-block">
                  {activeArticle.category} • {activeArticle.readTime} مطالعه
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white leading-snug">
                  {activeArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xl rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-6">
              <p className="p-4 bg-orange-50/60 dark:bg-orange-950/30 rounded-2xl border border-orange-100 dark:border-orange-900 font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                {activeArticle.fullContent.introduction}
              </p>

              {activeArticle.fullContent.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-3">
                    {sec.heading}
                  </h3>
                  <p className="whitespace-pre-line text-slate-600 dark:text-slate-300">
                    {sec.body}
                  </p>

                  {sec.bulletPoints && (
                    <ul className="space-y-2 pr-4 my-2">
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/80 dark:border-emerald-900 space-y-3">
                <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>راهکارهای کلیدی، علمی و کاربردی:</span>
                </span>
                <ul className="space-y-2">
                  {activeArticle.fullContent.actionableTips.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2 text-xs font-bold text-emerald-950 dark:text-emerald-100 leading-relaxed">
                      <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center text-[10px] mt-0.5">
                        {tIdx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="py-2.5 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs shadow-xs transition-colors"
              >
                بستن مقاله
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
