import React, { useEffect, useState } from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { Article } from '../types';

interface ArticleStoryViewProps {
  article: Article;
  onClose: () => void;
}

// A full-screen, Instagram-story-style presentation of a single random
// education article — tapped open from the small circular "story" bubble
// on the dashboard. Auto-fills a progress bar across the top like a real
// story, and can be closed at any time.
export const ArticleStoryView: React.FC<ArticleStoryViewProps> = ({ article, onClose }) => {
  const [progress, setProgress] = useState(0);
  const DURATION_MS = 15000;

  useEffect(() => {
    const start = Date.now();
    const interval = window.setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / DURATION_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(interval);
        onClose();
      }
    }, 100);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-gradient-to-b from-orange-600 via-orange-500 to-amber-600 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-sm max-h-[92vh] flex flex-col rounded-[32px] overflow-hidden shadow-2xl bg-gradient-to-b from-orange-500/95 to-amber-600/95 backdrop-blur-md relative">
        {/* Story progress bar */}
        <div className="px-3 pt-3 shrink-0">
          <div className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${progress}%`, transition: 'width 100ms linear' }}
            />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-white leading-none">آموزش هویج</p>
              <p className="text-[10px] font-bold text-white/70 mt-1">{article.readTime} مطالعه</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-4 text-white">
          <span className="inline-block text-[11px] font-bold bg-white/15 px-2.5 py-1 rounded-full">
            {article.category}
          </span>
          <h2 className="text-xl font-extrabold leading-snug">{article.title}</h2>
          <p className="text-sm font-medium leading-relaxed text-white/90">
            {article.summary}
          </p>

          {article.fullContent.actionableTips.length > 0 && (
            <div className="bg-white/10 rounded-2xl p-4 space-y-2.5 mt-2">
              <span className="flex items-center gap-1.5 text-xs font-extrabold">
                <Sparkles className="w-4 h-4" />
                <span>یک راهکار کاربردی</span>
              </span>
              <p className="text-xs font-bold leading-relaxed text-white/90">
                {article.fullContent.actionableTips[0]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
