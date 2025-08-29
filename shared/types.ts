// BiteBurst Database Types for Replit Key-Value Store

export type AgeBracket = "6-8" | "9-11" | "12-14";
export type Goal = "energy" | "focus" | "strength";
export type LogType = "food" | "activity";
export type EntryMethod = "emoji" | "text" | "photo";
export type UserStatus = "active" | "deleted";

export interface User {
  uid: string;
  displayName: string;
  ageBracket: AgeBracket;
  goal: Goal;
  avatar: string;
  email?: string;
  parentConsent: boolean;
  createdAt: number;
  updatedAt: number;
  xp: number;
  streak: number;
  badges: string[];
  locale?: string;
  tz?: string;
  status: UserStatus;
}

export interface OnboardingSession {
  step: number;
  answers: {
    displayName?: string;
    ageBracket?: AgeBracket;
    goal?: Goal;
    avatar?: string;
    email?: string;
    parentConsent?: boolean;
  };
  updatedAt: number;
}

export interface Log {
  id: string;
  uid: string;
  date: string; // YYYY-MM-DD
  ts: number;
  type: LogType;
  entryMethod: EntryMethod;
  content: {
    emoji?: string[];
    text?: string;
    photoB64?: string;
  };
  goalContext: Goal;
  aiFeedback?: string;
  xpAwarded: number;
  meta?: Record<string, unknown>;
}

export interface UserStats {
  uid: string;
  xp: number;
  streak: number;
  lastLogDate: string;
  dailyTotals: Record<string, { entries: number; xp: number }>;
  updatedAt: number;
}

export interface UserStreak {
  uid: string;
  current: number;
  longest: number;
  lastActiveDate: string;
  updatedAt: number;
}

export interface UserBadges {
  uid: string;
  earned: Array<{
    id: string;
    name: string;
    ts: number;
  }>;
}

export interface Avatar {
  id: string;
  src: string;
  label: string;
}

export interface GoalCatalog {
  id: Goal;
  label: string;
}

export interface SchemaVersion {
  current: number;
}

// Validation schemas
export const DISPLAY_NAME_MIN = 2;
export const DISPLAY_NAME_MAX = 20;
export const AGE_BRACKETS: AgeBracket[] = ["6-8", "9-11", "12-14"];
export const GOALS: Goal[] = ["energy", "focus", "strength"];
export const LOG_TYPES: LogType[] = ["food", "activity"];
export const ENTRY_METHODS: EntryMethod[] = ["emoji", "text", "photo"];