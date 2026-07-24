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
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'zehnaram_user_profile',
  DAILY_GOALS: 'zehnaram_daily_goals',
  TASKS_DECOMPOSED: 'zehnaram_tasks_decomposed',
  FOCUS_LOGS: 'zehnaram_focus_logs',
  TIMELINE_EVENTS: 'zehnaram_timeline_events',
  CBT_ENTRIES: 'zehnaram_cbt_entries',
  DAILY_LOGS: 'zehnaram_daily_logs',
  SLEEP_LOGS: 'zehnaram_sleep_logs',
  GAMIFICATION: 'zehnaram_gamification',
  NOTIFICATIONS: 'zehnaram_notifications',
  PIN_SETTINGS: 'havij_pin_settings',
  THEME: 'havij_theme'
};

export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// Effective Goal Date: Resets at 02:00 AM (02:00 Midnight/Early morning)
export function getEffectiveGoalDate(): string {
  const d = new Date();
  // If current hour is before 02:00 AM, consider it part of previous day's cycle
  if (d.getHours() < 2) {
    d.setDate(d.getDate() - 1);
  }
  return d.toISOString().split('T')[0];
}

// User Profile
export function getStoredUserProfile(): UserProfile | null {
  const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  if (!raw) {
    const defaultProfile: UserProfile = {
      name: 'کاربر هویج',
      age: 25,
      avatar: '🥕',
      onboarded: true,
      primaryChallenges: ['تمرکز', 'مدیریت زمان'],
      personalGoals: ['افزایش تمرکز و بهره‌وری'],
      energyLevel: 'medium',
      focusLevel: 'medium',
      createdAt: new Date().toISOString()
    };
    saveUserProfile(defaultProfile);
    return defaultProfile;
  }
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      if (parsed.onboarded === undefined) parsed.onboarded = true;
      if (!parsed.avatar) parsed.avatar = '🥕';
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

// Daily Goals (Top 3) - ALWAYS empty initially for a new day, resets at 02:00 AM
export function getStoredDailyGoals(): DailyGoal[] {
  const raw = localStorage.getItem(STORAGE_KEYS.DAILY_GOALS);
  if (!raw) return [];
  try {
    const goals: DailyGoal[] = JSON.parse(raw);
    const effectiveDate = getEffectiveGoalDate();
    // Filter only goals belonging to current effective day (after 02:00 AM reset)
    return goals.filter(g => g.date === effectiveDate);
  } catch {
    return [];
  }
}

export function saveDailyGoals(goals: DailyGoal[]): void {
  localStorage.setItem(STORAGE_KEYS.DAILY_GOALS, JSON.stringify(goals));
}

// PIN Settings
export function getStoredPinSettings(): PinSettings {
  const raw = localStorage.getItem(STORAGE_KEYS.PIN_SETTINGS);
  return raw ? JSON.parse(raw) : { enabled: false, pin: '' };
}

export function savePinSettings(settings: PinSettings): void {
  localStorage.setItem(STORAGE_KEYS.PIN_SETTINGS, JSON.stringify(settings));
}

// Theme Settings ('light' | 'dark')
export function getStoredTheme(): 'light' | 'dark' {
  const raw = localStorage.getItem(STORAGE_KEYS.THEME);
  return (raw === 'dark' || raw === 'light') ? raw : 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

// Task Decomposer
export function getStoredTaskDecomposed(): TaskDecomposed[] {
  const raw = localStorage.getItem(STORAGE_KEYS.TASKS_DECOMPOSED);
  return raw ? JSON.parse(raw) : [];
}

export function saveTaskDecomposed(tasks: TaskDecomposed[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS_DECOMPOSED, JSON.stringify(tasks));
}

// Focus Logs
export function getStoredFocusLogs(): FocusSessionLog[] {
  const raw = localStorage.getItem(STORAGE_KEYS.FOCUS_LOGS);
  return raw ? JSON.parse(raw) : [];
}

export function saveFocusLog(log: FocusSessionLog): void {
  const current = getStoredFocusLogs();
  current.unshift(log);
  localStorage.setItem(STORAGE_KEYS.FOCUS_LOGS, JSON.stringify(current));
  addPointsAndCoins(25, 10); // Reward focus completion
}

// Timeline
export function getStoredTimelineEvents(): TimelineEvent[] {
  const raw = localStorage.getItem(STORAGE_KEYS.TIMELINE_EVENTS);
  return raw ? JSON.parse(raw) : [];
}

export function saveTimelineEvents(events: TimelineEvent[]): void {
  localStorage.setItem(STORAGE_KEYS.TIMELINE_EVENTS, JSON.stringify(events));
}

// CBT Entries
export function getStoredCBTEntries(): CBTEntry[] {
  const raw = localStorage.getItem(STORAGE_KEYS.CBT_ENTRIES);
  return raw ? JSON.parse(raw) : [];
}

export function saveCBTEntry(entry: CBTEntry): void {
  const current = getStoredCBTEntries();
  current.unshift(entry);
  localStorage.setItem(STORAGE_KEYS.CBT_ENTRIES, JSON.stringify(current));
  addPointsAndCoins(15, 5);
}

// Daily Logs
export function getStoredDailyLogs(): DailyLog[] {
  const raw = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
  return raw ? JSON.parse(raw) : [];
}

export function saveDailyLog(log: DailyLog): void {
  const current = getStoredDailyLogs();
  const existingIndex = current.findIndex(l => l.date === log.date);
  if (existingIndex >= 0) {
    current[existingIndex] = log;
  } else {
    current.unshift(log);
  }
  localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(current));
  addPointsAndCoins(10, 5);
}

// Sleep Logs
export function getStoredSleepLogs(): SleepLog[] {
  const raw = localStorage.getItem(STORAGE_KEYS.SLEEP_LOGS);
  return raw ? JSON.parse(raw) : [];
}

export function saveSleepLog(log: SleepLog): void {
  const current = getStoredSleepLogs();
  const existingIndex = current.findIndex(l => l.date === log.date);
  if (existingIndex >= 0) {
    current[existingIndex] = log;
  } else {
    current.unshift(log);
  }
  localStorage.setItem(STORAGE_KEYS.SLEEP_LOGS, JSON.stringify(current));
  addPointsAndCoins(10, 5);
}

// Gamification
export function getStoredGamification(): GamificationData {
  const raw = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
  if (raw) return JSON.parse(raw);
  return {
    points: 0,
    coins: 0,
    level: 1,
    treeGrowthStage: 0,
    unlockedBadges: []
  };
}

export function saveGamification(data: GamificationData): void {
  localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(data));
}

export function addPointsAndCoins(earnedPoints: number, earnedCoins: number): GamificationData {
  const current = getStoredGamification();
  const newPoints = current.points + earnedPoints;
  const newCoins = current.coins + earnedCoins;
  const newLevel = Math.floor(newPoints / 100) + 1;
  const newStage = Math.min(4, Math.floor(newPoints / 50));

  const updated: GamificationData = {
    ...current,
    points: newPoints,
    coins: newCoins,
    level: newLevel,
    treeGrowthStage: newStage
  };
  saveGamification(updated);
  return updated;
}

export function resetGamification(): GamificationData {
  const initialData: GamificationData = {
    points: 0,
    coins: 0,
    level: 1,
    treeGrowthStage: 0,
    unlockedBadges: []
  };
  saveGamification(initialData);
  return initialData;
}

// Notifications
export function getStoredNotifications(): NotificationSettings {
  const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  if (!raw) {
    return {
      enabled: true,
      sound: true,
      studyReminderTime: '10:00',
      sleepReminderTime: '22:30',
      sleepReminderEnabled: true,
      goalsReminderTime: '09:00',
      goalsReminderEnabled: true
    };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      enabled: parsed.enabled ?? true,
      sound: parsed.sound ?? true,
      studyReminderTime: parsed.studyReminderTime || '10:00',
      sleepReminderTime: parsed.sleepReminderTime || '22:30',
      sleepReminderEnabled: parsed.sleepReminderEnabled ?? true,
      goalsReminderTime: parsed.goalsReminderTime || '09:00',
      goalsReminderEnabled: parsed.goalsReminderEnabled ?? true
    };
  } catch {
    return {
      enabled: true,
      sound: true,
      studyReminderTime: '10:00',
      sleepReminderTime: '22:30',
      sleepReminderEnabled: true,
      goalsReminderTime: '09:00',
      goalsReminderEnabled: true
    };
  }
}

export function saveNotifications(settings: NotificationSettings): void {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(settings));
}
