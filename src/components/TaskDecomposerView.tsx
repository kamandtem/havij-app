import React, { useState } from 'react';
import { Scissors, Plus, CheckCircle2, Trash2, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { TaskDecomposed } from '../types';

interface TaskDecomposerViewProps {
  tasks: TaskDecomposed[];
  onAddTask: (title: string, initialSubtasks: string[]) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddSubtaskToTask: (taskId: string, title: string) => void;
}

export const TaskDecomposerView: React.FC<TaskDecomposerViewProps> = ({
  tasks,
  onAddTask,
  onToggleSubtask,
  onDeleteTask,
  onAddSubtaskToTask
}) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [subtaskInputs, setSubtaskInputs] = useState<string[]>(['', '']);
  const [newSubtaskTextMap, setNewSubtaskTextMap] = useState<Record<string, string>>({});
  // Header starts collapsed to just its small label — tapping the chevron
  // slides it open to show the full heading/description.
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  const handleAddSubtaskInput = () => {
    setSubtaskInputs([...subtaskInputs, '']);
  };

  const handleSubtaskChange = (index: number, val: string) => {
    const updated = [...subtaskInputs];
    updated[index] = val;
    setSubtaskInputs(updated);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    const filteredSubtasks = subtaskInputs.filter(s => s.trim().length > 0);
    onAddTask(taskTitle.trim(), filteredSubtasks);
    setTaskTitle('');
    setSubtaskInputs(['', '']);
  };

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
            <Scissors className="w-4 h-4 shrink-0" />
            <span>ابزار ضد فلج تحریکی</span>
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
              خردکننده کارهای بزرگ
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              کارهای بزرگ مغز ADHD را وحشت‌زده می‌کنند. آن‌ها را به قدم‌های کوچک ۵ دقیقه‌ای خرد کنید.
            </p>
          </div>
        )}
      </div>

      {/* New Task Creator Form */}
      <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-orange-500" />
          <span>خرد کردن یک کار جدید</span>
        </h3>

        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              عنوان کار بزرگ اصلی
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="مثلاً: مرتب کردن اتاق یا آماده کردن گزارش مالی"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-orange-500 text-sm font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              مراحل و قدم‌های کوچک (مرحله‌به‌مرحله)
            </label>
            <div className="space-y-2">
              {subtaskInputs.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 text-center text-xs font-bold text-slate-400">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={sub}
                    onChange={(e) => handleSubtaskChange(idx, e.target.value)}
                    placeholder={`مرحله ${idx + 1} (مثلاً: برداشتن لباس‌ها از روی تخت)`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 text-xs font-medium"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddSubtaskInput}
              className="mt-3 text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              + افزودن یک مرحله دیگر
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
          >
            ایجاد کار خردشده
          </button>
        </form>
      </div>

      {/* Decomposed Tasks List / Empty State */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-[28px] border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shadow-inner">
            <Scissors className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">هیچ کار خردشده‌ای هنوز ثبت نشده است</h3>
          <p className="text-slate-400 text-xs max-w-sm">
            تمام فیلدها خالی است. هر زمان احساس کردید کاری سنگین است، فرم بالا را پر کنید تا آن را خرد کنیم.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {tasks.map((task) => {
            const completedCount = task.subtasks.filter(s => s.completed).length;
            const totalCount = task.subtasks.length;
            const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={task.id}
                className="bg-white rounded-[28px] border border-slate-200/80 p-6 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    {/* SVG Progress Ring */}
                    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-orange-500 transition-all duration-500"
                          strokeDasharray={`${percent}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-xs font-extrabold text-slate-800">
                        {percent}%
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{task.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {completedCount} از {totalCount} مرحله تکمیل شده
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="self-end sm:self-center px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف کامل</span>
                  </button>
                </div>

                {/* Subtasks checklist */}
                <div className="space-y-2.5">
                  {task.subtasks.map((sub, sIdx) => (
                    <div
                      key={sub.id}
                      onClick={() => onToggleSubtask(task.id, sub.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        sub.completed
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                          : 'bg-slate-50/80 border-slate-200/80 hover:border-orange-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                        sub.completed ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 bg-white'
                      }`}>
                        {sub.completed && '✓'}
                      </div>
                      <span className="text-xs font-extrabold text-slate-400">
                        قدم {sIdx + 1}:
                      </span>
                      <span className={`text-xs font-bold flex-1 ${sub.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick Add Subtask to Existing */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="افزودن یک مرحله جدید به این کار..."
                    value={newSubtaskTextMap[task.id] || ''}
                    onChange={(e) => setNewSubtaskTextMap({ ...newSubtaskTextMap, [task.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSubtaskTextMap[task.id]?.trim()) {
                        onAddSubtaskToTask(task.id, newSubtaskTextMap[task.id].trim());
                        setNewSubtaskTextMap({ ...newSubtaskTextMap, [task.id]: '' });
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                  />
                  <button
                    onClick={() => {
                      if (newSubtaskTextMap[task.id]?.trim()) {
                        onAddSubtaskToTask(task.id, newSubtaskTextMap[task.id].trim());
                        setNewSubtaskTextMap({ ...newSubtaskTextMap, [task.id]: '' });
                      }
                    }}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    + افزودن
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
