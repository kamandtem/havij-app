import React, { useState, useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { syncScheduledNotifications, ensureReminderChannel, REMINDER_CHANNEL_ID } from './utils/notifications';
import { playCompletionChime } from './utils/audio';
import { Navbar } from './components/Navbar';
import { MotivationalBanner } from './components/MotivationalBanner';
import { DrawerMenu } from './components/DrawerMenu';
import { BottomNav } from './components/BottomNav';
import { OnboardingView } from './components/OnboardingView';
import { PinLockView } from './components/PinLockView';
import { SplashScreen } from './components/SplashScreen';

import { DashboardView } from './components/DashboardView';
import { DailyGoalsView } from './components/DailyGoalsView';
import { TaskDecomposerView } from './components/TaskDecomposerView';
import { FocusModeView } from './components/FocusModeView';
import { FiveMinuteStartView } from './components/FiveMinuteStartView';
import { TimelineView } from './components/TimelineView';
import { CbtView } from './components/CbtView';
import { DailyLogView } from './components/DailyLogView';
import { SleepTrackerView } from './components/SleepTrackerView';
import { GamificationGardenView } from './components/GamificationGardenView';
import { EducationalHubView } from './components/EducationalHubView';
import { ProfileSettingsView } from './components/ProfileSettingsView';

import {
  UserProfile,
  DailyGoal,
  TaskDecomposed,
  FocusSessionLog,
  TimelineEvent,
  CBTEntry,
  DailyLog,
  SleepLog,
  GamificationData,
  NotificationSettings,
  PinSettings
} from './types';

import {
  getStoredUserProfile,
  saveUserProfile,
  getStoredDailyGoals,
  saveDailyGoals,
  getStoredTaskDecomposed,
  saveTaskDecomposed,
  getStoredFocusLogs,
  saveFocusLog,
  getStoredTimelineEvents,
  saveTimelineEvents,
  getStoredCBTEntries,
  saveCBTEntry,
  getStoredDailyLogs,
  saveDailyLog,
  getStoredSleepLogs,
  saveSleepLog,
  getStoredGamification,
  recordToolUsage,
  addPointsAndCoinsOnly,
  incrementToolBadgeProgress,
  resetGamification,
  getStoredNotifications,
  saveNotifications,
  getStoredPinSettings,
  savePinSettings,
  getStoredTheme,
  saveTheme,
  getTodayDateString,
  getEffectiveGoalDate
} from './utils/storage';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // App States from LocalStorage
  const [userProfile, setUserProfile] = useState<UserProfile | null>(getStoredUserProfile());
  const [pinSettings, setPinSettingsState] = useState<PinSettings>(getStoredPinSettings());
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(!pinSettings.enabled);
  const [theme, setThemeState] = useState<'light' | 'dark'>(getStoredTheme());

  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>(getStoredDailyGoals());
  const [decomposedTasks, setDecomposedTasks] = useState<TaskDecomposed[]>(getStoredTaskDecomposed());
  // Briefly highlights whichever task the user just fully completed, so the
  // Task Decomposer panel can show a positive on-screen reaction alongside
  // the completion sound.
  const [celebratingTaskId, setCelebratingTaskId] = useState<string | null>(null);
  const [focusLogs, setFocusLogs] = useState<FocusSessionLog[]>(getStoredFocusLogs());
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(getStoredTimelineEvents());
  const [cbtEntries, setCbtEntries] = useState<CBTEntry[]>(getStoredCBTEntries());
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(getStoredDailyLogs());
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(getStoredSleepLogs());
  const [gamification, setGamification] = useState<GamificationData>(getStoredGamification());
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(getStoredNotifications());

  // Handle dark mode DOM class
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    saveTheme(nextTheme);
  };

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
  };

  // Hardware Back Button (Android):
  // 1) close drawer if open
  // 2) single press: always go straight to the Home tab (not to whichever
  //    panel was visited before it — that was the old, confusing behavior)
  // 3) pressed again while already on Home: ask for confirmation (Yes/No)
  //    before exiting, instead of leaving the app immediately.
  useEffect(() => {
    const listenerPromise = CapacitorApp.addListener('backButton', () => {
      if (showExitConfirm) {
        // Dialog already open; ignore extra back presses.
        return;
      }

      if (isDrawerOpen) {
        setIsDrawerOpen(false);
        return;
      }

      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
        return;
      }

      setShowExitConfirm(true);
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
  }, [isDrawerOpen, showExitConfirm, activeTab]);

  // Re-lock the PIN screen whenever the app returns from the background,
  // so the PIN lock actually protects the app instead of only applying
  // once at cold start.
  useEffect(() => {
    const listenerPromise = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive && pinSettings.enabled) {
        setIsPinUnlocked(false);
      }
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
  }, [pinSettings.enabled]);

  // Request notification permission and (re)schedule daily reminders
  // whenever the saved notification settings change.
  useEffect(() => {
    syncScheduledNotifications(notificationSettings);
  }, [notificationSettings]);

  // Focus / Pomodoro timer state lives here (not inside FocusModeView) so the
  // countdown keeps running when the user switches to another tab or the
  // Dashboard's Pomodoro widget, instead of resetting every time the view unmounts.
  const FOCUS_NOTIF_ID = 9001;
  const [focusSelectedMinutes, setFocusSelectedMinutes] = useState<number>(25);
  const [focusTimeLeftSeconds, setFocusTimeLeftSeconds] = useState<number>(25 * 60);
  const [focusIsRunning, setFocusIsRunning] = useState<boolean>(false);
  const [focusTaskTitle, setFocusTaskTitle] = useState<string>('');
  const focusTimerIntervalRef = useRef<number | null>(null);
  const focusMinutesRef = useRef(focusSelectedMinutes);
  const focusTaskRef = useRef(focusTaskTitle);

  useEffect(() => { focusMinutesRef.current = focusSelectedMinutes; }, [focusSelectedMinutes]);
  useEffect(() => { focusTaskRef.current = focusTaskTitle; }, [focusTaskTitle]);

  const cancelFocusNotification = async () => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await LocalNotifications.cancel({ notifications: [{ id: FOCUS_NOTIF_ID }] });
    } catch {
      // ignore
    }
  };

  const scheduleFocusNotification = async (secondsLeft: number) => {
    if (!Capacitor.isNativePlatform()) return;
    try {
      await ensureReminderChannel();
      await LocalNotifications.cancel({ notifications: [{ id: FOCUS_NOTIF_ID }] });
      await LocalNotifications.schedule({
        notifications: [{
          id: FOCUS_NOTIF_ID,
          title: 'هویج 🥕',
          body: 'جلسه تمرکزت تموم شد! وقت یک استراحت کوتاهه.',
          schedule: { at: new Date(Date.now() + secondsLeft * 1000) },
          channelId: REMINDER_CHANNEL_ID,
          sound: notificationSettings.sound ? 'default' : undefined
        }]
      });
    } catch {
      // ignore scheduling errors on unsupported devices
    }
  };

  // The interval itself only depends on isRunning, so switching tabs (which
  // unmounts FocusModeView / re-renders the Dashboard) never recreates or
  // resets it — the countdown keeps ticking wherever the user is in the app.
  useEffect(() => {
    if (!focusIsRunning) {
      if (focusTimerIntervalRef.current) clearInterval(focusTimerIntervalRef.current);
      return;
    }
    focusTimerIntervalRef.current = window.setInterval(() => {
      setFocusTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          if (focusTimerIntervalRef.current) clearInterval(focusTimerIntervalRef.current);
          setFocusIsRunning(false);
          playCompletionChime();
          handleCompleteFocusSession(
            focusMinutesRef.current,
            focusTaskRef.current || 'جلسه تمرکز',
            focusMinutesRef.current === 25 ? 'pomodoro' : 'custom'
          );
          cancelFocusNotification();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (focusTimerIntervalRef.current) clearInterval(focusTimerIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIsRunning]);

  const handleSelectFocusMinutes = (mins: number) => {
    setFocusSelectedMinutes(mins);
    setFocusTimeLeftSeconds(mins * 60);
    setFocusIsRunning(false);
    cancelFocusNotification();
  };

  const handleToggleFocusTimer = () => {
    setFocusIsRunning((prev) => {
      const next = !prev;
      if (next) {
        scheduleFocusNotification(focusTimeLeftSeconds);
      } else {
        cancelFocusNotification();
      }
      return next;
    });
  };

  const handleResetFocusTimer = () => {
    setFocusIsRunning(false);
    setFocusTimeLeftSeconds(focusSelectedMinutes * 60);
    cancelFocusNotification();
  };

  const handleQuickCompleteFocus = () => {
    playCompletionChime();
    handleCompleteFocusSession(
      focusSelectedMinutes,
      focusTaskTitle || 'جلسه تمرکز',
      focusSelectedMinutes === 25 ? 'pomodoro' : 'custom'
    );
    handleResetFocusTimer();
  };

  // Goal Actions
  const handleAddGoal = (goalData: Omit<DailyGoal, 'id' | 'completed' | 'date'>) => {
    const newGoal: DailyGoal = {
      id: Date.now().toString(),
      title: goalData.title,
      approxTimeMinutes: goalData.approxTimeMinutes,
      importance: goalData.importance,
      completed: false,
      date: getEffectiveGoalDate()
    };
    const updated = [newGoal, ...dailyGoals];
    setDailyGoals(updated);
    saveDailyGoals(updated);
  };

  const handleToggleGoal = (id: string) => {
    const updated = dailyGoals.map((g) => {
      if (g.id === id) {
        const nextState = !g.completed;
        if (nextState) {
          // Grows the tree and counts toward the "اولین هدف" badge (3 goals).
          const updatedGam = recordToolUsage('goals', 15, 5);
          setGamification(updatedGam);
        }
        return {
          ...g,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined
        };
      }
      return g;
    });
    setDailyGoals(updated);
    saveDailyGoals(updated);
  };

  const handleDeleteGoal = (id: string) => {
    const updated = dailyGoals.filter(g => g.id !== id);
    setDailyGoals(updated);
    saveDailyGoals(updated);
  };

  // Task Decomposer Actions
  const handleAddTaskDecomposed = (title: string, initialSubtasks: string[]) => {
    const newTask: TaskDecomposed = {
      id: Date.now().toString(),
      title,
      subtasks: initialSubtasks.map((sTitle, idx) => ({
        id: `${Date.now()}-${idx}`,
        title: sTitle,
        completed: false
      })),
      createdAt: new Date().toISOString()
    };
    const updated = [newTask, ...decomposedTasks];
    setDecomposedTasks(updated);
    saveTaskDecomposed(updated);
    // Creating a decomposed task still grows the tree and earns coins (the
    // Task Decomposer is the only coin source) — but the "غول‌کش کارهای
    // بزرگ" badge only counts once this task is fully completed, not at
    // creation, so it doesn't touch that counter here.
    const updatedGam = addPointsAndCoinsOnly(20, 5);
    setGamification(updatedGam);
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    let justCompletedTask = false;
    const updated = decomposedTasks.map((t) => {
      if (t.id === taskId) {
        const nextSubtasks = t.subtasks.map((st) => {
          if (st.id === subtaskId) {
            const nextVal = !st.completed;
            if (nextVal) {
              // Every step still grows the tree and earns coins — but not
              // the completion badge; see below.
              const updatedGam = addPointsAndCoinsOnly(5, 2);
              setGamification(updatedGam);
            }
            return { ...st, completed: nextVal };
          }
          return st;
        });
        // Did THIS toggle just finish the last remaining step?
        if (nextSubtasks.length > 0 && nextSubtasks.every((st) => st.completed)) {
          justCompletedTask = true;
        }
        return { ...t, subtasks: nextSubtasks };
      }
      return t;
    });
    setDecomposedTasks(updated);
    saveTaskDecomposed(updated);

    if (justCompletedTask) {
      // A positive, unmistakable reaction for finishing an entire
      // decomposed task — sound plus a brief on-screen celebration — and
      // ONLY here does the "غول‌کش کارهای بزرگ" badge progress, since it's
      // meant for tasks that were both decomposed AND fully completed.
      playCompletionChime();
      setCelebratingTaskId(taskId);
      window.setTimeout(() => setCelebratingTaskId((id) => (id === taskId ? null : id)), 2600);
      const updatedGam = incrementToolBadgeProgress('decomposer');
      setGamification(updatedGam);
    }
  };

  const handleDeleteTaskDecomposed = (taskId: string) => {
    const updated = decomposedTasks.filter(t => t.id !== taskId);
    setDecomposedTasks(updated);
    saveTaskDecomposed(updated);
  };

  const handleAddSubtaskToTask = (taskId: string, title: string) => {
    const updated = decomposedTasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [
            ...t.subtasks,
            { id: Date.now().toString(), title, completed: false }
          ]
        };
      }
      return t;
    });
    setDecomposedTasks(updated);
    saveTaskDecomposed(updated);
  };

  // Focus Session
  const handleCompleteFocusSession = (durationMinutes: number, taskTitle: string, mode: 'pomodoro' | 'custom' | 'micro5') => {
    const newLog: FocusSessionLog = {
      id: Date.now().toString(),
      durationMinutes,
      taskTitle,
      completedAt: new Date().toISOString(),
      mode
    };
    saveFocusLog(newLog);
    setFocusLogs([newLog, ...focusLogs]);
    const updatedGam = getStoredGamification();
    setGamification(updatedGam);
  };

  // Micro-Start 5 Min
  const handleCompleteMicroStart = (taskTitle: string) => {
    handleCompleteFocusSession(5, taskTitle, 'micro5');
  };

  // Timeline
  const handleAddTimelineEvent = (title: string, timeSlot: string, category: 'work' | 'rest' | 'health' | 'routine') => {
    const newEv: TimelineEvent = {
      id: Date.now().toString(),
      title,
      timeSlot,
      category,
      completed: false,
      date: getTodayDateString()
    };
    const updated = [...timelineEvents, newEv];
    setTimelineEvents(updated);
    saveTimelineEvents(updated);
  };

  const handleToggleTimelineEvent = (id: string) => {
    const updated = timelineEvents.map((ev) => {
      if (ev.id === id) {
        return { ...ev, completed: !ev.completed };
      }
      return ev;
    });
    setTimelineEvents(updated);
    saveTimelineEvents(updated);
  };

  const handleDeleteTimelineEvent = (id: string) => {
    const updated = timelineEvents.filter(ev => ev.id !== id);
    setTimelineEvents(updated);
    saveTimelineEvents(updated);
  };

  // CBT
  const handleAddCbtEntry = (entry: Omit<CBTEntry, 'id' | 'date'>) => {
    const newEntry: CBTEntry = {
      ...entry,
      id: Date.now().toString(),
      date: getTodayDateString()
    };
    saveCBTEntry(newEntry);
    setCbtEntries([newEntry, ...cbtEntries]);
    setGamification(getStoredGamification());
  };

  const handleDeleteCbtEntry = (id: string) => {
    const updated = cbtEntries.filter(e => e.id !== id);
    setCbtEntries(updated);
    localStorage.setItem('zehnaram_cbt_entries', JSON.stringify(updated));
  };

  // Daily Log
  const handleSaveDailyLog = (logData: Omit<DailyLog, 'id'>) => {
    const newLog: DailyLog = {
      ...logData,
      id: Date.now().toString()
    };
    saveDailyLog(newLog);
    setDailyLogs(getStoredDailyLogs());
    setGamification(getStoredGamification());
  };

  // Sleep Log
  const handleSaveSleepLog = (logData: Omit<SleepLog, 'id'>) => {
    const newLog: SleepLog = {
      ...logData,
      id: Date.now().toString()
    };
    saveSleepLog(newLog);
    setSleepLogs(getStoredSleepLogs());
    setGamification(getStoredGamification());
  };

  // Profile Save
  const handleSaveProfile = (profile: UserProfile) => {
    saveUserProfile(profile);
    setUserProfile(profile);
  };

  const handleUpdateAvatar = (newAvatar: string) => {
    if (userProfile) {
      const updated = { ...userProfile, avatar: newAvatar };
      saveUserProfile(updated);
      setUserProfile(updated);
    }
  };

  // Pin Settings Save
  const handleSavePinSettings = (pSettings: PinSettings) => {
    savePinSettings(pSettings);
    setPinSettingsState(pSettings);
    // If the user just turned PIN lock on, lock the app immediately so the
    // setting visibly takes effect instead of waiting for a full restart.
    if (pSettings.enabled) {
      setIsPinUnlocked(false);
    } else {
      setIsPinUnlocked(true);
    }
  };

  // Notifications Save
  const handleSaveNotifications = (settings: NotificationSettings) => {
    saveNotifications(settings);
    setNotificationSettings(settings);
  };

  // Reset Gamification
  const handleResetGamification = () => {
    const freshData = resetGamification();
    setGamification(freshData);
  };

  // Render Splash Screen on initial app launch
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Render Onboarding Screen if user not onboarded
  if (!userProfile || !userProfile.onboarded) {
    return (
      <OnboardingView
        onCompleteOnboarding={(prof) => {
          saveUserProfile(prof);
          setUserProfile(prof);
        }}
      />
    );
  }

  // Render PIN Lock Screen if pin enabled and not unlocked yet
  if (pinSettings.enabled && !isPinUnlocked) {
    return (
      <PinLockView
        storedPin={pinSettings.pin}
        onSuccess={() => setIsPinUnlocked(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors" dir="rtl">

      {/* Exit confirmation dialog (shown when back is pressed with no previous panel) */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] max-w-xs w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 text-center space-y-5">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              آیا از برنامه خارج می‌شوید؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all"
              >
                خیر
              </button>
              <button
                onClick={() => CapacitorApp.exitApp()}
                className="flex-1 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition-all"
              >
                بله
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTo}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        dailyGoals={dailyGoals}
        dailyLogs={dailyLogs}
        sleepLogs={sleepLogs}
        focusIsRunning={focusIsRunning}
        focusTimeLeftSeconds={focusTimeLeftSeconds}
        focusTaskTitle={focusTaskTitle}
      />

      {/* Daily motivational message, right under the header */}
      <div className="-mt-2 mb-2">
        <MotivationalBanner />
      </div>

      {/* Drawer Menu Modal (Sliding from Left) */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        setActiveTab={navigateTo}
        userProfile={userProfile}
        gamification={gamification}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onUpdateAvatar={handleUpdateAvatar}
      />

      {/* Main View Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            dailyGoals={dailyGoals}
            gamification={gamification}
            setActiveTab={navigateTo}
            onToggleGoal={handleToggleGoal}
            focusSelectedMinutes={focusSelectedMinutes}
            focusTimeLeftSeconds={focusTimeLeftSeconds}
            focusIsRunning={focusIsRunning}
            onToggleFocusTimer={handleToggleFocusTimer}
          />
        )}

        {activeTab === 'goals' && (
          <DailyGoalsView
            goals={dailyGoals}
            onAddGoal={handleAddGoal}
            onToggleGoal={handleToggleGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {activeTab === 'decomposer' && (
          <TaskDecomposerView
            tasks={decomposedTasks}
            onAddTask={handleAddTaskDecomposed}
            onToggleSubtask={handleToggleSubtask}
            onDeleteTask={handleDeleteTaskDecomposed}
            onAddSubtaskToTask={handleAddSubtaskToTask}
            celebratingTaskId={celebratingTaskId}
          />
        )}

        {activeTab === 'focus' && (
          <FocusModeView
            selectedMinutes={focusSelectedMinutes}
            timeLeftSeconds={focusTimeLeftSeconds}
            isRunning={focusIsRunning}
            currentTaskTitle={focusTaskTitle}
            onSelectMinutes={handleSelectFocusMinutes}
            onChangeTaskTitle={setFocusTaskTitle}
            onTogglePlay={handleToggleFocusTimer}
            onReset={handleResetFocusTimer}
            onQuickComplete={handleQuickCompleteFocus}
          />
        )}

        {activeTab === 'micro5' && (
          <FiveMinuteStartView
            onCompleteMicroStart={handleCompleteMicroStart}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            events={timelineEvents}
            onAddEvent={handleAddTimelineEvent}
            onToggleEvent={handleToggleTimelineEvent}
            onDeleteEvent={handleDeleteTimelineEvent}
          />
        )}

        {activeTab === 'cbt' && (
          <CbtView
            entries={cbtEntries}
            onAddEntry={handleAddCbtEntry}
            onDeleteEntry={handleDeleteCbtEntry}
          />
        )}

        {activeTab === 'dailylog' && (
          <DailyLogView
            dailyLogs={dailyLogs}
            onSaveDailyLog={handleSaveDailyLog}
          />
        )}

        {activeTab === 'sleep' && (
          <SleepTrackerView
            sleepLogs={sleepLogs}
            onSaveSleepLog={handleSaveSleepLog}
          />
        )}

        {activeTab === 'garden' && (
          <GamificationGardenView
            gamification={gamification}
          />
        )}

        {activeTab === 'articles' && (
          <EducationalHubView />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsView
            userProfile={userProfile}
            pinSettings={pinSettings}
            notificationSettings={notificationSettings}
            theme={theme}
            onSaveProfile={handleSaveProfile}
            onSavePinSettings={handleSavePinSettings}
            onSaveNotifications={handleSaveNotifications}
            onToggleTheme={handleToggleTheme}
            onResetGamification={handleResetGamification}
          />
        )}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={navigateTo} />
    </div>
  );
}
