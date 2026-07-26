import React, { useState } from 'react';
import { ChevronRight, Plus, Trash2, StickyNote } from 'lucide-react';
import { JournalNote } from '../types';
import { getStoredJournalNotes, saveJournalNotes } from '../utils/storage';

interface NotesJournalViewProps {
  onClose: () => void;
}

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

const firstLine = (content: string) => {
  const line = content.split('\n')[0].trim();
  if (!line) return 'یادداشت خالی';
  return line.length > 45 ? line.slice(0, 45) + '…' : line;
};

const restPreview = (content: string) => {
  const lines = content.split('\n');
  const rest = lines.slice(1).join(' ').trim();
  return rest.length > 60 ? rest.slice(0, 60) + '…' : rest;
};

export const NotesJournalView: React.FC<NotesJournalViewProps> = ({ onClose }) => {
  const [notes, setNotes] = useState<JournalNote[]>(getStoredJournalNotes());
  // 'new' = composing a brand new note, a note id = editing that note, null = showing the list
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const isEditing = activeNoteId !== null;

  const persist = (next: JournalNote[]) => {
    setNotes(next);
    saveJournalNotes(next);
  };

  const openNewNote = () => {
    setActiveNoteId('new');
    setDraft('');
  };

  const openNote = (note: JournalNote) => {
    setActiveNoteId(note.id);
    setDraft(note.content);
  };

  // Saving happens automatically when the user leaves the editor —
  // no separate "save" button, exactly like the Notes app.
  const closeEditor = () => {
    const trimmed = draft.trim();

    if (activeNoteId === 'new') {
      if (trimmed) {
        const now = new Date().toISOString();
        const newNote: JournalNote = {
          id: `note_${Date.now()}`,
          content: trimmed,
          createdAt: now,
          updatedAt: now
        };
        persist([newNote, ...notes]);
      }
    } else if (activeNoteId) {
      if (trimmed) {
        persist(
          notes.map((n) =>
            n.id === activeNoteId ? { ...n, content: trimmed, updatedAt: new Date().toISOString() } : n
          )
        );
      } else {
        // The user cleared out an existing note entirely — drop it, same as Notes does.
        persist(notes.filter((n) => n.id !== activeNoteId));
      }
    }

    setActiveNoteId(null);
    setDraft('');
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
              onClick={closeEditor}
              className="flex items-center gap-0.5 text-orange-600 dark:text-orange-400 font-bold text-sm px-2 py-1.5 rounded-xl active:bg-orange-50 dark:active:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
              <span>یادداشت‌ها</span>
            </button>
            <span className="text-[11px] font-bold text-slate-400">
              {new Date().toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' })}
            </span>
          </div>
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="بنویس... هرچی تو ذهنته"
            className="flex-1 bg-transparent outline-none resize-none px-5 pb-8 text-[16px] leading-8 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </>
      ) : (
        // ----- List screen -----
        <>
          <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 shrink-0">
            <button
              onClick={onClose}
              className="text-orange-600 dark:text-orange-400 font-bold text-sm px-2 py-1.5 -mx-2 rounded-xl active:bg-orange-50 dark:active:bg-slate-800"
            >
              بستن
            </button>
            <h2 className="text-[15px] font-black text-slate-800 dark:text-white">یادداشت‌های روزانه</h2>
            <button
              onClick={openNewNote}
              className="p-2 -m-2 text-orange-600 dark:text-orange-400"
              title="یادداشت جدید"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8">
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
              <ul className="divide-y divide-slate-200/70 dark:divide-slate-800">
                {notes.map((note) => (
                  <li key={note.id}>
                    <button
                      onClick={() => openNote(note)}
                      className="w-full text-right py-3.5 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold text-slate-400 mb-0.5">
                          {formatNoteDate(note.updatedAt)}
                        </p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                          {firstLine(note.content)}
                        </p>
                        {restPreview(note.content) && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {restPreview(note.content)}
                          </p>
                        )}
                      </div>
                      <span
                        onClick={(e) => deleteNote(note.id, e)}
                        className="shrink-0 p-2 rounded-xl text-slate-300 dark:text-slate-600 active:bg-rose-50 active:text-rose-500 dark:active:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};
