import React, { useState } from 'react';
import { BookOpen, Search, Clock, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { ADHD_ARTICLES } from '../data/articles';
import { Article } from '../types';

export const EducationalHubView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const categories = ['همه', 'اصول اولیه', 'خودشناسی', 'روانشناسی', 'راهکارها', 'تکنیک‌ها', 'عادت‌سازی', 'تمرکز', 'سلامتی', 'سلامت روان', 'مهارت‌های مغزی'];

  const filteredArticles = ADHD_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'همه' || art.category === selectedCategory;
    const matchesSearch = art.title.includes(searchQuery) || art.summary.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>پایگاه دانش آفلاین (ADHD Psychoeducation)</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">
            آموزش‌ها و راهکارهای روانشناختی ADHD
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            ۱۰ مقاله کامل و تخصصی آفلاین برای درک عمیق‌تر عملکرد مغز و راهکارهای غلبه بر چالش‌ها.
          </p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در بین مقالات و راهکارها..."
            className="w-full pr-11 pl-4 py-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
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
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="bg-white hover:bg-slate-50/80 rounded-[28px] border border-slate-200/80 p-6 shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group hover:border-orange-300"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{article.category}</span>
                </span>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>زمان مطالعه: {article.readTime}</span>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-800 group-hover:text-orange-600 transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                {article.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600">
              <span>مطالعه مقاله کامل</span>
              <ArrowRight className="w-4 h-4 transform rotate-180 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Modal Reader */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60 mb-2 inline-block">
                  {activeArticle.category} • {activeArticle.readTime} مطالعه
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-snug">
                  {activeArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 text-slate-400 hover:text-slate-600 font-bold text-xl rounded-full hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
              <p className="p-4 bg-orange-50/60 rounded-2xl border border-orange-100 font-medium text-slate-800 leading-relaxed">
                {activeArticle.fullContent.introduction}
              </p>

              {activeArticle.fullContent.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-base font-bold text-slate-900 border-r-4 border-orange-500 pr-3">
                    {sec.heading}
                  </h3>
                  <p className="whitespace-pre-line text-slate-600">
                    {sec.body}
                  </p>

                  {sec.bulletPoints && (
                    <ul className="space-y-2 pr-4 my-2">
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-xs font-bold text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-1">
                <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>توصیه طلایی و کاربردی:</span>
                </span>
                <p className="text-xs font-bold text-emerald-950 leading-relaxed">
                  {activeArticle.actionableTip}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
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
