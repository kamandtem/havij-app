import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Plus, Trash2, StickyNote, Heart, BookOpen, Pin, Star } from 'lucide-react';
import { JournalNote } from '../types';
import { getStoredJournalNotes, saveJournalNotes } from '../utils/storage';

interface NotesJournalViewProps {
  onClose: () => void;
}

// Soft, muted color themes cycled across notes so the archive reads as
// colorful/organized without ever feeling loud or harsh.
const PALETTES = [
  {
    key: 'orange',
    icon: StickyNote,
    pill: 'bg-orange-300 dark:bg-orange-500/70',
    card: 'bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/15',
    title: 'text-orange-900 dark:text-orange-200',
    date: 'text-orange-500/80 dark:text-orange-300/70',
    preview: 'text-orange-800/60 dark:text-orange-200/50',
    swatch: 'bg-orange-300',
    editorBg: 'bg-orange-50/50 dark:bg-orange-500/5'
  },
  {
    key: 'rose',
    icon: Heart,
    pill: 'bg-rose-300 dark:bg-rose-500/70',
    card: 'bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/15',
    title: 'text-rose-900 dark:text-rose-200',
    date: 'text-rose-500/80 dark:text-rose-300/70',
    preview: 'text-rose-800/60 dark:text-rose-200/50',
    swatch: 'bg-rose-300',
    editorBg: 'bg-rose-50/50 dark:bg-rose-500/5'
  },
  {
    key: 'amber',
    icon: BookOpen,
    pill: 'bg-amber-300 dark:bg-amber-500/70',
    card: 'bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/15',
    title: 'text-amber-900 dark:text-amber-200',
    date: 'text-amber-600/80 dark:text-amber-300/70',
    preview: 'text-amber-800/60 dark:text-amber-200/50',
    swatch: 'bg-amber-300',
    editorBg: 'bg-amber-50/50 dark:bg-amber-500/5'
  },
  {
    key: 'teal',
    icon: Pin,
    pill: 'bg-teal-300 dark:bg-teal-500/70',
    card: 'bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/15',
    title: 'text-teal-900 dark:text-teal-200',
    date: 'text-teal-600/80 dark:text-teal-300/70',
    preview: 'text-teal-800/60 dark:text-teal-200/50',
    swatch: 'bg-teal-300',
    editorBg: 'bg-teal-50/50 dark:bg-teal-500/5'
  },
  {
    key: 'indigo',
    icon: Star,
    pill: 'bg-indigo-300 dark:bg-indigo-500/70',
    card: 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/15',
    title: 'text-indigo-900 dark:text-indigo-200',
    date: 'text-indigo-600/80 dark:text-indigo-300/70',
    preview: 'text-indigo-800/60 dark:text-indigo-200/50',
    swatch: 'bg-indigo-300',
    editorBg: 'bg-indigo-50/50 dark:bg-indigo-500/5'
  }
];

// Notes saved before the color picker existed have no `color` — fall back
// to cycling by position in the list, exactly like before.
const getPalette = (note: JournalNote, idx: number) => {
  const byKey = note.color && PALETTES.find((p) => p.key === note.color);
  return byKey || PALETTES[idx % PALETTES.length];
};

const MOODS = ['😊', '😔', '😡', '😴', '🤩', '😐'];

// Formats a note's timestamp the way iOS Notes shows it in the list
// (e.g. "۲۵ تیر"، ساعت هم برای امروز).
const formatNoteDate = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' });
};

const truncate = (s: string, n: number) => (s.length > n ? s.slice(0, n) + '…' : s);

// Explicit title wins; otherwise fall back to the first line of the body,
// exactly like the plain-text notes people already have saved.
const noteTitle = (note: JournalNote) => {
  const explicit = note.title?.trim();
  if (explicit) return truncate(explicit, 40);
  const firstLine = note.content.split('\n')[0].trim();
  return firstLine ? truncate(firstLine, 40) : 'یادداشت خالی';
};

const notePreview = (note: JournalNote) => {
  const hasExplicitTitle = !!note.title?.trim();
  const lines = note.content.split('\n');
  const body = hasExplicitTitle ? note.content.trim() : lines.slice(1).join(' ').trim();
  return truncate(body.replace(/\s+/g, ' '), 70);
};

export const NotesJournalView: React.FC<NotesJournalViewProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<JournalNote[]>(getStoredJournalNotes());
  // The "+" in the bottom nav should drop the user straight into writing,
  // so the editor for a brand-new note is the default screen on mount.
  // 'new' = composing a brand new note, a note id = editing that note, null = showing the archive.
  const [activeNoteId, setActiveNoteId] = useState<string | null>('new');
  const [draftTitle, setDraftTitle] = useState('');
  const [draft, setDraft] = useState('');
  const [draftColor, setDraftColor] = useState<string | undefined>(undefined);
  const [draftMood, setDraftMood] = useState<string | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEditing = activeNoteId !== null;

  // Hardware/browser "back" (Android back button, browser back gesture)
  // isn't tied to our in-app screens by default, so pressing it could fall
  // straight through to exiting the app. We push one history entry while
  // this panel is open and route every back-navigation — hardware back AND
  // the in-app "بازگشت" button — through the same popstate handler: from
  // the editor it steps back to the archive (re-arming itself), and from
  // the archive it hands control back to the home panel.
  const isEditingRef = useRef(isEditing);
  isEditingRef.current = isEditing;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const closeEditorRef = useRef<() => void>(() => {});

  useEffect(() => {
    window.history.pushState({ havijNotesPanel: true }, '');
    const handlePopState = () => {
      if (isEditingRef.current) {
        closeEditorRef.current();
        window.history.pushState({ havijNotesPanel: true }, '');
      } else {
        onCloseRef.current();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Both the editor's and the archive's "بازگشت" buttons go through this so
  // hardware back and the in-app button always behave identically.
  const goBack = () => {
    window.history.back();
  };

  const persist = (next: JournalNote[]) => {
    setNotes(next);
    saveJournalNotes(next);
  };

  const openNewNote = () => {
    setActiveNoteId('new');
    setDraftTitle('');
    setDraft('');
    setDraftColor(undefined);
    setDraftMood(undefined);
  };

  const openNote = (note: JournalNote) => {
    setActiveNoteId(note.id);
    setDraftTitle(note.title ?? '');
    setDraft(note.content);
    setDraftColor(note.color);
    setDraftMood(note.mood);
  };

  // Back-button flow:
  //  - from the editor: save (if there's anything to save) and land on the
  //    colorful archive screen below — never straight back to the home tab.
  //  - from the archive: hand control back to the caller (the home panel).
  const closeEditor = () => {
    const trimmedContent = draft.trim();
    const trimmedTitle = draftTitle.trim();

    if (activeNoteId === 'new') {
      if (trimmedContent || trimmedTitle) {
        const now = new Date().toISOString();
        const newNote: JournalNote = {
          id: `note_${Date.now()}`,
          title: trimmedTitle || undefined,
          content: trimmedContent,
          color: draftColor,
          mood: draftMood,
          createdAt: now,
          updatedAt: now
        };
        persist([newNote, ...notes]);
      }
    } else if (activeNoteId) {
      if (trimmedContent || trimmedTitle) {
        persist(
          notes.map((n) =>
            n.id === activeNoteId
              ? { ...n, title: trimmedTitle || undefined, content: trimmedContent, color: draftColor, mood: draftMood, updatedAt: new Date().toISOString() }
              : n
          )
        );
      } else {
        // The user cleared out an existing note entirely — drop it, same as Notes does.
        persist(notes.filter((n) => n.id !== activeNoteId));
      }
    }

    setActiveNoteId(null);
    setDraftTitle('');
    setDraft('');
    setDraftColor(undefined);
    setDraftMood(undefined);
  };
  closeEditorRef.current = closeEditor;

  // Inserts a quick-format snippet (bullet, checkbox, divider) at the
  // cursor position, then puts the cursor right after it.
  const insertAtCursor = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      setDraft((d) => d + snippet);
      return;
    }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    const next = draft.slice(0, start) + snippet + draft.slice(end);
    setDraft(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + snippet.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    persist(notes.filter((n) => n.id !== id));
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-[#fbf6ea] dark:bg-slate-950 flex flex-col font-sans"
      dir="rtl"
    >
      {isEditing ? (
        // ----- Editor screen -----
        <>
          <div className="flex items-center justify-between px-3 pt-[max(1rem,env(safe-area-inset-top))] pb-2 shrink-0">
            <button
              onClick={goBack}
              className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-bold text-sm px-2 py-1.5 -mx-2 rounded-xl active:bg-orange-50 dark:active:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
              <span>بازگشت</span>
            </button>
            <span className="text-[11px] font-bold text-slate-400">
              {new Date().toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* Color tag + mood picker */}
          <div className="flex items-center justify-between gap-3 px-5 pb-1 shrink-0">
            <div className="flex items-center gap-2">
              {PALETTES.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setDraftColor(p.key)}
                  className={`w-6 h-6 rounded-full ${p.swatch} transition-all ${
                    draftColor === p.key
                      ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-950 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title="رنگ یادداشت"
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setDraftMood(draftMood === m ? undefined : m)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-base transition-all ${
                    draftMood === m ? 'bg-slate-200 dark:bg-slate-700 scale-110' : 'opacity-50 hover:opacity-90'
                  }`}
                  title="حال‌وهوای یادداشت"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <input
            autoFocus
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="عنوان یادداشت"
            className="mx-5 mt-2 mb-2 bg-transparent outline-none text-[19px] font-black text-slate-800 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 shrink-0"
          />
          <div className="mx-5 h-px bg-slate-200/80 dark:bg-slate-800 mb-1 shrink-0" />

          {/* Quick-format toolbar */}
          <div className="flex items-center gap-2 px-5 py-1.5 shrink-0">
            <button
              onClick={() => insertAtCursor('• ')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              title="افزودن نقطه فهرست"
            >
              • فهرست
            </button>
            <button
              onClick={() => insertAtCursor('☐ ')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              title="افزودن چک‌لیست"
            >
              ☐ چک‌لیست
            </button>
            <button
              onClick={() => insertAtCursor('\n──────\n')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
              title="افزودن خط جداکننده"
            >
              — جدا‌کننده
            </button>
          </div>

          {/* Faint lined-paper texture behind the writing area, tinted to
              match the chosen color — purely visual, keeps the space from
              feeling like a bare, feature-less textbox. */}
          <div
            className={`flex-1 min-h-0 ${draftColor ? PALETTES.find((p) => p.key === draftColor)?.editorBg : ''}`}
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(148,163,184,0.18) 31px, rgba(148,163,184,0.18) 32px)'
            }}
          >
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="بنویس... هرچی تو ذهنته"
              className="w-full h-full bg-transparent outline-none resize-none px-5 pb-8 text-[16px] leading-8 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          {/* Live word/character count */}
          <div className="px-5 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-600 shrink-0 text-left">
            {draft.trim() ? draft.trim().split(/\s+/).length : 0} کلمه · {draft.length} نویسه
          </div>
        </>
      ) : (
        // ----- Archive / list screen -----
        <>
          <div className="flex items-center px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 shrink-0">
            <button
              onClick={goBack}
              className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-bold text-sm px-2 py-1.5 -mx-2 rounded-xl active:bg-orange-50 dark:active:bg-slate-800 shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
              <span>بازگشت</span>
            </button>
            <h2 className="flex-1 text-center text-[15px] font-black text-slate-800 dark:text-white">
              یادداشت روزانه
            </h2>
            <span className="w-[64px] shrink-0" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-32">
            {notes.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-6">
                <StickyNote className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                  هنوز یادداشتی ننوشتی
                </p>
                <p className="text-xs text-slate-400 leading-6">
                  هر اتفاق یا فکر امروزت رو همین‌جا بنویس؛ نوشتن برای ذهن‌های شلوغ خیلی آرامش‌بخشه.
                </p>
                <button
                  onClick={openNewNote}
                  className="mt-2 px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
                >
                  نوشتن اولین یادداشت
                </button>
              </div>
            ) : (
              <div className="flex flex-col pt-1">
                {notes.map((note, idx) => {
                  const palette = getPalette(note, idx);
                  const Icon = palette.icon;
                  const preview = notePreview(note);
                  return (
                    <div key={note.id} className="flex items-stretch gap-3">
                      <div className="flex flex-col items-center shrink-0 pt-0.5">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${palette.pill}`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        {idx < notes.length - 1 && (
                          <div className="flex-1 w-0 border-r-2 border-dashed border-slate-300/70 dark:border-slate-700 my-1.5" />
                        )}
                      </div>

                      <div className={`relative flex-1 rounded-2xl p-4 mb-4 ${palette.card}`}>
                        <button onClick={() => openNote(note)} className="w-full text-right block">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className={`text-sm font-black truncate flex items-center gap-1 ${palette.title}`}>
                              {note.mood && <span className="shrink-0">{note.mood}</span>}
                              <span className="truncate">{noteTitle(note)}</span>
                            </h3>
                            <span className={`text-[11px] font-bold shrink-0 ${palette.date}`}>
                              {formatNoteDate(note.updatedAt)}
                            </span>
                          </div>
                          {preview && (
                            <p className={`text-xs leading-5 line-clamp-2 ${palette.preview}`}>{preview}</p>
                          )}
                        </button>
                        <button
                          onClick={(e) => deleteNote(note.id, e)}
                          className="absolute bottom-2 left-2 p-1.5 rounded-lg text-black/25 dark:text-white/25 active:bg-black/5 dark:active:bg-white/10 active:text-rose-500 dark:active:text-rose-400 transition-colors"
                          title="حذف یادداشت"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {notes.length > 0 && (
            <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-5 pointer-events-none">
              <button
                onClick={openNewNote}
                className="pointer-events-auto w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-orange-500/30 transition-all"
                title="یادداشت جدید"
              >
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
