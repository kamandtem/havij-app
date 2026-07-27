import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface DonateModalProps {
  onClose: () => void;
}

const CARD_NUMBER = '6063731145936515';
const SHEBA_NUMBER = 'IR470600482070013358307001';

// Groups a card number into "6063 7311 4593 6515" for easier reading
// without making it feel like a big, shouty headline number.
const formatCard = (n: string) => n.replace(/(.{4})/g, '$1 ').trim();

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older WebViews without the async Clipboard API.
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.focus();
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
};

export const DonateModal: React.FC<DonateModalProps> = ({ onClose }) => {
  const [toast, setToast] = useState<string | null>(null);

  const handleCopy = async (label: string, value: string) => {
    const ok = await copyToClipboard(value);
    setToast(ok ? `${label} کپی شد` : 'کپی نشد، لطفاً دستی کپی کن');
    window.setTimeout(() => setToast(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-[90] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
      {/* Toast — appears at the top of the SCREEN, not inside the card */}
      {toast && (
        <div className="fixed top-[max(1rem,env(safe-area-inset-top))] inset-x-0 flex justify-center z-[95] px-4">
          <div className="flex items-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-4 py-2 rounded-full shadow-xl animate-in fade-in duration-150">
            <Check className="w-3.5 h-3.5" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800">
        <div className="p-5 pb-3 text-center relative">
          <button
            onClick={onClose}
            className="absolute left-3 top-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
          <span className="text-3xl">🥕</span>
          <p className="text-[13px] leading-6 text-slate-600 dark:text-slate-300 font-bold mt-2 px-1">
            هویج کاملاً رایگانه و همیشه همین‌طور می‌مونه 🧡
            <br />
            اگه دوست داری از توسعه‌ش حمایت کنی، هر مبلغی که خواستی رو می‌تونی به این شماره واریز کنی — کاملاً اختیاریه و روی امکانات برنامه هیچ تأثیری نداره. این مبلغ صرف سرور و توسعه‌ی قابلیت‌های جدید می‌شه. پیشاپیش ممنون از حمایتت 🌱
          </p>
        </div>

        <div className="px-5 pb-5 space-y-2">
          <button
            onClick={() => handleCopy('شماره کارت', CARD_NUMBER)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/15 transition-colors text-right"
          >
            <span className="shrink-0 w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-orange-500 shadow-xs">
              <Copy className="w-3.5 h-3.5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[10px] font-bold text-orange-500/80">شماره کارت</span>
              <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 tracking-wide truncate">
                {formatCard(CARD_NUMBER)}
              </span>
            </span>
          </button>

          <button
            onClick={() => handleCopy('شماره شبا', SHEBA_NUMBER)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/15 transition-colors text-right"
          >
            <span className="shrink-0 w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-orange-500 shadow-xs">
              <Copy className="w-3.5 h-3.5" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[10px] font-bold text-orange-500/80">شماره شبا</span>
              <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 tracking-wide truncate">
                {SHEBA_NUMBER}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
