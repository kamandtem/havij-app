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

export interface GamificationData {
  points: number;
  coins: number;
  level: number;
  treeGrowthStage: number; // 0 to 4
  unlockedBadges: string[];
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
    actionableTip: string;
  };
}
