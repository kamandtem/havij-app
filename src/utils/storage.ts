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
  ToolUsageCounts,
  NotificationSettings,
  PinSettings,
  JournalNote
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
  THEME: 'havij_theme',
  JOURNAL_NOTES: 'havij_journal_notes',
  GARDEN_GUIDE_SEEN: 'havij_garden_guide_seen',
  STORY_READ: 'havij_story_read'
};

// Formats a Date using LOCAL (device) date components, not UTC.
// Using toISOString() here was the root cause of the "yesterday's tasks
// still showing tomorrow" bug: toISOString() converts to UTC, which for
// timezones ahead of UTC (like Iran, UTC+3:30) shifts the calendar day
// at UTC midnight instead of local midnight, causing inconsistent date
// strings depending on the time of day.
function formatLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return formatLocalDate(new Date());
}

// Renders a stored "YYYY-MM-DD" (Gregorian, local) date string as a short
// Persian/Jalali (Shamsi) label — e.g. "۶ مرداد" — matching how a Persian
// user reads dates on their device, instead of raw Gregorian digits.
export function formatDateShamsiShort(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' });
}

// Effective Goal Date: Resets at 02:00 AM (02:00 Midnight/Early morning)
export function getEffectiveGoalDate(): string {
  const d = new Date();
  // If current hour is before 02:00 AM, consider it part of previous day's cycle
  if (d.getHours() < 2) {
    d.setDate(d.getDate() - 1);
  }
  return formatLocalDate(d);
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
  // Grows the tree and counts toward the "استاد تمرکز" badge (3 sessions).
  recordToolUsage('focus', 25, 0);
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
  // Grows the tree and counts toward the "آرامش ذهنی" badge (3 entries).
  recordToolUsage('cbt', 15, 0);
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
  // Daily check-in isn't tied to a specific badge — it still grows the tree.
  addPointsOnly(10);
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
  // Grows the tree and counts toward the "قهرمان خواب منظم" badge (3 logs).
  recordToolUsage('sleep', 10, 0);
}

// Gamification
// ---------------------------------------------------------------------------
// Points needed (cumulative, toward the CURRENT sapling) for each growth
// stage. Reaching the last one (350) means the sapling is fully grown: it
// gets "planted" in the garden bed and a brand new sapling starts at 0.
export const TREE_STAGE_THRESHOLDS = [0, 50, 100, 200, 350];
const POINTS_PER_TREE = TREE_STAGE_THRESHOLDS[TREE_STAGE_THRESHOLDS.length - 1];
// How many planted trees fill one garden bed before they merge into a single
// golden tree that takes the first spot.
export const GARDEN_SIZE = 10;

// User level tiers, keyed to the lifetime tree count (not the per-cycle
// garden bed, which resets every 10 trees). Reaching the Nth tree count in
// this list grants level N+1. Level 3 (10th tree / 1st golden tree) grants a
// silver carrot badge; level 6 (100th tree / 10th golden tree) grants a
// golden carrot badge — both shown next to the user in the side menu.
export const LEVEL_TREE_THRESHOLDS = [1, 5, 10, 20, 50, 100];
export const SILVER_CARROT_LEVEL = 3;
export const GOLDEN_CARROT_LEVEL = 6;

function computeLevel(totalTreesCompleted: number): number {
  let level = 0;
  for (let i = 0; i < LEVEL_TREE_THRESHOLDS.length; i++) {
    if (totalTreesCompleted >= LEVEL_TREE_THRESHOLDS[i]) {
      level = i + 1;
    }
  }
  return level;
}

// Which "tool" each badge is tied to, and how many times that tool must be
// used (regardless of points earned elsewhere) before the badge unlocks.
export const BADGE_TOOL_MAP: Record<string, keyof ToolUsageCounts> = {
  first_goal: 'goals',
  focus_master: 'focus',
  task_slayer: 'decomposer',
  cbt_champion: 'cbt',
  sleep_hero: 'sleep'
};
export const BADGE_USES_REQUIRED = 3;

function defaultGamification(): GamificationData {
  return {
    points: 0,
    coins: 0,
    level: 0,
    totalTreesCompleted: 0,
    treeGrowthStage: 0,
    unlockedBadges: [],
    toolUsage: { goals: 0, focus: 0, decomposer: 0, cbt: 0, sleep: 0 },
    gardenTrees: [],
    goldenMerges: 0
  };
}

export function getStoredGamification(): GamificationData {
  const raw = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
  if (!raw) return defaultGamification();
  try {
    const parsed = JSON.parse(raw);
    // Merge with defaults so users upgrading from an older version (before
    // tool-usage / garden tracking existed) get sane fallback values instead
    // of undefined fields breaking the new UI.
    return {
      ...defaultGamification(),
      ...parsed,
      toolUsage: { ...defaultGamification().toolUsage, ...(parsed.toolUsage || {}) }
    };
  } catch {
    return defaultGamification();
  }
}

export function saveGamification(data: GamificationData): void {
  localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(data));
}

// Grows the current sapling by `earnedPoints`. If it reaches full growth,
// it's moved into the garden bed (and, every 10 trees, merged into a single
// golden tree), a new sapling starts from zero, and the user's level — the
// lifetime count of fully grown trees — goes up. Coins are only ever passed
// in for the Task Decomposer ("خردکن"), per the app's coin rule.
function growTreeAndAddPoints(current: GamificationData, earnedPoints: number, earnedCoins: number): GamificationData {
  let points = current.points + earnedPoints;
  let totalTreesCompleted = current.totalTreesCompleted;
  let gardenTrees = [...current.gardenTrees];
  let goldenMerges = current.goldenMerges;

  // A single big point award could, in theory, finish more than one tree —
  // loop so none of that progress is lost.
  while (points >= POINTS_PER_TREE) {
    points -= POINTS_PER_TREE;
    totalTreesCompleted += 1;
    gardenTrees.push({ id: `${Date.now()}-${totalTreesCompleted}`, completedAt: new Date().toISOString() });

    if (gardenTrees.length >= GARDEN_SIZE) {
      goldenMerges += 1;
      gardenTrees = [{ id: `golden-${Date.now()}`, completedAt: new Date().toISOString(), golden: true }];
    }
  }

  const level = computeLevel(totalTreesCompleted);

  let stage = 0;
  for (let i = TREE_STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= TREE_STAGE_THRESHOLDS[i]) {
      stage = i;
      break;
    }
  }

  let unlockedBadges = current.unlockedBadges;
  // "باغبان طلایی" isn't tied to a tool — it unlocks the first time a full
  // garden bed (10 trees) merges into a golden tree.
  if (goldenMerges >= 1 && !unlockedBadges.includes('golden_tree')) {
    unlockedBadges = [...unlockedBadges, 'golden_tree'];
  }

  return {
    ...current,
    points,
    coins: current.coins + earnedCoins,
    level,
    totalTreesCompleted,
    treeGrowthStage: stage,
    gardenTrees,
    goldenMerges,
    unlockedBadges
  };
}

// Awards points (and, only for the decomposer, coins) for using a specific
// tool, tracks how many times that tool has been used, and unlocks its badge
// once that reaches 3 uses — independent of the points/tree growth, and
// independent of whether the underlying item (a task, a log entry...) still
// exists later.
export function recordToolUsage(tool: keyof ToolUsageCounts, earnedPoints: number, earnedCoins: number): GamificationData {
  const current = getStoredGamification();
  // Per the app's coin rule, only the Task Decomposer ("خردکن") earns coins;
  // every other tool grows the tree with points alone.
  const coinsToAward = tool === 'decomposer' ? earnedCoins : 0;

  const grown = growTreeAndAddPoints(current, earnedPoints, coinsToAward);

  const newToolUsage: ToolUsageCounts = {
    ...grown.toolUsage,
    [tool]: grown.toolUsage[tool] + 1
  };

  const badgeId = Object.keys(BADGE_TOOL_MAP).find((id) => BADGE_TOOL_MAP[id] === tool);
  let unlockedBadges = grown.unlockedBadges;
  if (badgeId && newToolUsage[tool] >= BADGE_USES_REQUIRED && !unlockedBadges.includes(badgeId)) {
    unlockedBadges = [...unlockedBadges, badgeId];
  }

  const updated: GamificationData = {
    ...grown,
    toolUsage: newToolUsage,
    unlockedBadges
  };
  saveGamification(updated);
  return updated;
}

// Awards points only (no coins, no tool/badge tracking) — for activities like
// the daily check-in that grow the tree but aren't tied to a specific badge.
export function addPointsOnly(earnedPoints: number): GamificationData {
  const current = getStoredGamification();
  const updated = growTreeAndAddPoints(current, earnedPoints, 0);
  saveGamification(updated);
  return updated;
}

// Awards points and coins, growing the tree, but WITHOUT touching any tool's
// badge-progress counter. Used where an activity should still earn its
// reward every time (e.g. finishing one step of a decomposed task) but the
// matching badge has a stricter condition than "used N times" — e.g.
// "غول‌کش کارهای بزرگ" only counts a task once it's fully decomposed AND
// fully completed, not once per step or once per task created.
export function addPointsAndCoinsOnly(earnedPoints: number, earnedCoins: number): GamificationData {
  const current = getStoredGamification();
  const updated = growTreeAndAddPoints(current, earnedPoints, earnedCoins);
  saveGamification(updated);
  return updated;
}

// Advances a badge's tool-usage counter by one (and unlocks it at the
// threshold) without awarding any points or coins — for badges whose
// trigger is a distinct event from the points-earning actions themselves.
export function incrementToolBadgeProgress(tool: keyof ToolUsageCounts): GamificationData {
  const current = getStoredGamification();
  const newToolUsage: ToolUsageCounts = {
    ...current.toolUsage,
    [tool]: current.toolUsage[tool] + 1
  };
  const badgeId = Object.keys(BADGE_TOOL_MAP).find((id) => BADGE_TOOL_MAP[id] === tool);
  let unlockedBadges = current.unlockedBadges;
  if (badgeId && newToolUsage[tool] >= BADGE_USES_REQUIRED && !unlockedBadges.includes(badgeId)) {
    unlockedBadges = [...unlockedBadges, badgeId];
  }
  const updated: GamificationData = { ...current, toolUsage: newToolUsage, unlockedBadges };
  saveGamification(updated);
  return updated;
}

export function resetGamification(): GamificationData {
  const initialData = defaultGamification();
  saveGamification(initialData);
  return initialData;
}

// Journal Notes (free-form notes opened from the "+" button in the bottom nav)
export function getStoredJournalNotes(): JournalNote[] {
  const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL_NOTES);
  return raw ? JSON.parse(raw) : [];
}

export function saveJournalNotes(notes: JournalNote[]): void {
  localStorage.setItem(STORAGE_KEYS.JOURNAL_NOTES, JSON.stringify(notes));
}

// Whether the user has already dismissed the "how does the Motivation
// Garden work" first-time guide — shown once, then never again unless
// they clear the app's storage.
export function getGardenGuideSeen(): boolean {
  return localStorage.getItem(STORAGE_KEYS.GARDEN_GUIDE_SEEN) === 'true';
}

export function setGardenGuideSeen(): void {
  localStorage.setItem(STORAGE_KEYS.GARDEN_GUIDE_SEEN, 'true');
}

// Deterministically picks an index in [0, length) from today's date, so the
// same day always yields the same pick (across re-renders and re-opens) and
// the next day naturally rolls to a new one. Used for anything that should
// rotate "once a day" — e.g. the story-bubble article.
export function seededIndexForToday(length: number): number {
  if (length <= 0) return 0;
  const dateStr = getTodayDateString(); // YYYY-MM-DD
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed * 31 + dateStr.charCodeAt(i)) % 100000;
  }
  return seed % length;
}

// Whether today's story-bubble article has already been opened — drives the
// Instagram-style "unread" ring around the bubble: present until read,
// gone once it has been, and back again the next day with a new article.
export function isTodayStoryRead(): boolean {
  return localStorage.getItem(STORAGE_KEYS.STORY_READ) === getTodayDateString();
}

export function markTodayStoryRead(): void {
  localStorage.setItem(STORAGE_KEYS.STORY_READ, getTodayDateString());
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
      goalsReminderEnabled: true,
      wakeReminderTime: '07:30',
      wakeReminderEnabled: false,
      dailyLogReminderTime: '20:30',
      dailyLogReminderEnabled: false
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
      goalsReminderEnabled: parsed.goalsReminderEnabled ?? true,
      wakeReminderTime: parsed.wakeReminderTime || '07:30',
      wakeReminderEnabled: parsed.wakeReminderEnabled ?? false,
      dailyLogReminderTime: parsed.dailyLogReminderTime || '20:30',
      dailyLogReminderEnabled: parsed.dailyLogReminderEnabled ?? false
    };
  } catch {
    return {
      enabled: true,
      sound: true,
      studyReminderTime: '10:00',
      sleepReminderTime: '22:30',
      sleepReminderEnabled: true,
      goalsReminderTime: '09:00',
      goalsReminderEnabled: true,
      wakeReminderTime: '07:30',
      wakeReminderEnabled: false,
      dailyLogReminderTime: '20:30',
      dailyLogReminderEnabled: false
    };
  }
}

export function saveNotifications(settings: NotificationSettings): void {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(settings));
}
