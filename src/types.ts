export interface UserProfile {
  name: string;
  age: number | string;
  avatar?: string;
  onboarded?: boolean;
  primaryChallenges: string[];
  personalGoals: string[];
  energyLevel: 'high' | 'medium' | 'low';
  focusLevel: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface PinSettings {
  enabled: boolean;
  pin: string;
}

export interface DailyGoal {
  id: string;
  title: string;
  approxTimeMinutes: number;
  importance: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: string;
  date: string; // YYYY-MM-DD
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskDecomposed {
  id: string;
  title: string;
  subtasks: Subtask[];
  createdAt: string;
}

export interface FocusSessionLog {
  id: string;
  taskTitle: string;
  durationMinutes: number;
  completedAt: string;
  mode: 'pomodoro' | 'custom' | 'micro5';
}

export interface TimelineEvent {
  id: string;
  title: string;
  timeSlot: string; // e.g. "09:00 - 09:30"
  category: 'work' | 'rest' | 'health' | 'routine';
  completed: boolean;
  date: string;
}

export interface CBTEntry {
  id: string;
  date: string;
  thought: string;
  emotion: string;
  emotionIntensity: number; // 0-100
  evidenceFor: string;
  evidenceAgainst: string;
  alternativeThought: string;
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  energyRating: number; // 1-5
  focusRating: number; // 1-5
  moodRating: number; // 1-5
  notes?: string;
}

export interface SleepLog {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  qualityRating: number; // 1-5
  notes?: string;
}

// Tracks how many times each "tool" (feature) has been used, independent of
// how many of those items still exist (deleting a task shouldn't undo badge
// progress). Badges are granted once the matching counter reaches 3 — NOT
// from raw points — so a badge always means "used this tool 3 times",
// regardless of which activity happened to earn the points along the way.
export interface ToolUsageCounts {
  goals: number;
  focus: number;
  decomposer: number;
  cbt: number;
  sleep: number;
}

// A single tree that has finished growing and been "planted" in the garden bed.
export interface GardenTree {
  id: string;
  completedAt: string;
  golden?: boolean; // true once 10 regular trees have merged into this one
}

export interface GamificationData {
  points: number;
  coins: number;
  level: number; // 0-6 tier, computed from totalTreesCompleted (see LEVEL_THRESHOLDS)
  totalTreesCompleted: number; // lifetime count of fully grown trees, never resets
  treeGrowthStage: number; // 0 to 4 — growth stage of the CURRENT sapling only
  unlockedBadges: string[];
  toolUsage: ToolUsageCounts;
  gardenTrees: GardenTree[]; // current cycle's planted trees (max 10 before merge)
  goldenMerges: number; // how many times 10 trees have merged into a golden tree
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  studyReminderTime: string;
  sleepReminderTime: string;
  sleepReminderEnabled: boolean;
  goalsReminderTime?: string;
  goalsReminderEnabled?: boolean;
  wakeReminderTime?: string;
  wakeReminderEnabled?: boolean;
}

export interface JournalNote {
  id: string;
  title?: string;
  content: string;
  color?: string; // palette key chosen by the user for this note
  mood?: string; // a single emoji the user picked to tag the note's mood
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  fullContent: {
    introduction: string;
    sections: {
      heading: string;
      body: string;
      bulletPoints?: string[];
    }[];
    actionableTips: string[];
  };
}
