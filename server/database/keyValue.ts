import Database from "@replit/database";
import { 
  User, 
  OnboardingSession, 
  Log, 
  UserStats, 
  UserStreak, 
  UserBadges,
  Avatar,
  GoalCatalog,
  SchemaVersion,
  AgeBracket,
  Goal 
} from "@shared/types";

// Initialize Replit Database
const db = new Database();

// Key generation functions
export const userKey = (uid: string) => `users:${uid}`;
export const emailIndexKey = (email: string) => `userIndex:email:${email.toLowerCase()}`;
export const onboardingKey = (uid: string) => `onboarding:${uid}`;
export const statsKey = (uid: string) => `stats:${uid}`;
export const streakKey = (uid: string) => `streak:${uid}`;
export const badgeKey = (uid: string) => `badges:${uid}`;
export const logKey = (uid: string, ymd: string, id: string) => `logs:${uid}:${ymd}:${id}`;

// Helper function to generate date string
export const getDateString = (date: Date = new Date()) => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

// Generate unique ID for logs
export const generateLogId = () => {
  return 'log_' + Math.random().toString(36).substr(2, 9);
};

// Onboarding Functions
export async function saveOnboarding(uid: string, answers: Partial<OnboardingSession['answers']>, step?: number): Promise<void> {
  const key = onboardingKey(uid);
  const existingResult = await db.get(key);
  let existing = null;
  if (existingResult) {
    const data = (existingResult as any).ok ? (existingResult as any).value : existingResult;
    existing = JSON.parse(JSON.stringify(data)) as OnboardingSession;
  }
  
  const onboarding: OnboardingSession = {
    step: step ?? existing?.step ?? 0,
    answers: {
      ...existing?.answers,
      ...answers
    },
    updatedAt: Date.now()
  };
  
  console.log('Saving onboarding:', JSON.stringify(onboarding, null, 2));
  await db.set(key, onboarding);
  console.log('Onboarding saved to key:', key);
}

export async function getOnboarding(uid: string): Promise<OnboardingSession | null> {
  const result = await db.get(onboardingKey(uid));
  if (!result) return null;
  
  // Handle Replit Database wrapper format
  const data = (result as any).ok ? (result as any).value : result;
  return data ? JSON.parse(JSON.stringify(data)) as OnboardingSession : null;
}

export async function finalizeProfile(uid: string): Promise<User> {
  const onboarding = await getOnboarding(uid);
  if (!onboarding || !onboarding.answers || !onboarding.answers.displayName) {
    throw new Error("Incomplete onboarding data");
  }
  
  const { answers } = onboarding;
  
  // Validate required fields
  if (!answers.displayName || !answers.ageBracket || !answers.goal || !answers.parentConsent) {
    throw new Error("Missing required onboarding fields");
  }
  
  const now = Date.now();
  const user: User = {
    uid,
    displayName: answers.displayName,
    ageBracket: answers.ageBracket,
    goal: answers.goal,
    avatar: answers.avatar || "mascot-01",
    email: answers.email,
    parentConsent: answers.parentConsent,
    createdAt: now,
    updatedAt: now,
    xp: 0,
    streak: 0,
    badges: [],
    locale: "en-US",
    tz: "UTC",
    status: "active"
  };
  
  // Save user
  await db.set(userKey(uid), user);
  
  // Create email index if email provided
  if (user.email) {
    await db.set(emailIndexKey(user.email), { uid });
  }
  
  // Initialize stats, streak, and badges
  await initializeUserStats(uid);
  await initializeUserStreak(uid);
  await initializeUserBadges(uid);
  
  // Clean up onboarding
  await db.delete(onboardingKey(uid));
  
  return user;
}

// User Functions
export async function getUser(uid: string): Promise<User | null> {
  const result = await db.get(userKey(uid));
  if (!result) return null;
  
  // Handle Replit Database wrapper format
  const data = (result as any).ok ? (result as any).value : result;
  return data ? JSON.parse(JSON.stringify(data)) as User : null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const indexResult = await db.get(emailIndexKey(email));
  if (!indexResult) return null;
  
  // Handle Replit Database wrapper format
  const indexData = (indexResult as any).ok ? (indexResult as any).value : indexResult;
  const index = JSON.parse(JSON.stringify(indexData)) as { uid: string };
  return await getUser(index.uid);
}

export async function updateUser(uid: string, updates: Partial<User>): Promise<User> {
  const user = await getUser(uid);
  if (!user) throw new Error("User not found");
  
  const updatedUser: User = {
    ...user,
    ...updates,
    updatedAt: Date.now()
  };
  
  await db.set(userKey(uid), updatedUser);
  return updatedUser;
}

// Stats Functions
async function initializeUserStats(uid: string): Promise<UserStats> {
  const stats: UserStats = {
    uid,
    xp: 0,
    streak: 0,
    lastLogDate: "",
    dailyTotals: {},
    updatedAt: Date.now()
  };
  
  await db.set(statsKey(uid), stats);
  return stats;
}

export async function getUserStats(uid: string): Promise<UserStats | null> {
  const result = await db.get(statsKey(uid));
  if (!result) return null;
  
  // Handle Replit Database wrapper format
  const data = (result as any).ok ? (result as any).value : result;
  return data ? JSON.parse(JSON.stringify(data)) as UserStats : null;
}

export async function updateUserStats(uid: string, updates: Partial<UserStats>): Promise<UserStats> {
  const stats = await getUserStats(uid);
  if (!stats) throw new Error("User stats not found");
  
  const updatedStats: UserStats = {
    ...stats,
    ...updates,
    updatedAt: Date.now()
  };
  
  await db.set(statsKey(uid), updatedStats);
  return updatedStats;
}

// Streak Functions
async function initializeUserStreak(uid: string): Promise<UserStreak> {
  const streak: UserStreak = {
    uid,
    current: 0,
    longest: 0,
    lastActiveDate: "",
    updatedAt: Date.now()
  };
  
  await db.set(streakKey(uid), streak);
  return streak;
}

export async function getUserStreak(uid: string): Promise<UserStreak | null> {
  const result = await db.get(streakKey(uid));
  if (!result) return null;
  
  // Handle Replit Database wrapper format
  const data = (result as any).ok ? (result as any).value : result;
  return data ? JSON.parse(JSON.stringify(data)) as UserStreak : null;
}

export async function updateUserStreak(uid: string, updates: Partial<UserStreak>): Promise<UserStreak> {
  const streak = await getUserStreak(uid);
  if (!streak) throw new Error("User streak not found");
  
  const updatedStreak: UserStreak = {
    ...streak,
    ...updates,
    updatedAt: Date.now()
  };
  
  await db.set(streakKey(uid), updatedStreak);
  return updatedStreak;
}

// Badge Functions
async function initializeUserBadges(uid: string): Promise<UserBadges> {
  const badges: UserBadges = {
    uid,
    earned: []
  };
  
  await db.set(badgeKey(uid), badges);
  return badges;
}

export async function getUserBadges(uid: string): Promise<UserBadges | null> {
  const result = await db.get(badgeKey(uid));
  if (!result) return null;
  
  // Handle Replit Database wrapper format
  const data = (result as any).ok ? (result as any).value : result;
  return data ? JSON.parse(JSON.stringify(data)) as UserBadges : null;
}

export async function awardBadge(uid: string, badgeId: string, badgeName: string): Promise<UserBadges> {
  const badges = await getUserBadges(uid);
  if (!badges) throw new Error("User badges not found");
  
  // Check if badge already earned
  if (badges.earned.some(b => b.id === badgeId)) {
    return badges; // Already has this badge
  }
  
  badges.earned.push({
    id: badgeId,
    name: badgeName,
    ts: Date.now()
  });
  
  await db.set(badgeKey(uid), badges);
  return badges;
}

// Log Functions
export async function addLog(uid: string, logData: Omit<Log, 'id' | 'uid' | 'date' | 'ts'>): Promise<Log> {
  const now = new Date();
  const dateStr = getDateString(now);
  const logId = generateLogId();
  
  const log: Log = {
    id: logId,
    uid,
    date: dateStr,
    ts: now.getTime(),
    ...logData
  };
  
  // Save log
  await db.set(logKey(uid, dateStr, logId), log);
  
  // Update stats
  await updateStatsAfterLog(uid, log);
  
  // Update streak
  await updateStreakAfterLog(uid, dateStr);
  
  // Check for badges
  await checkAndAwardBadges(uid);
  
  return log;
}

export async function getDayLogs(uid: string, ymd: string): Promise<Log[]> {
  try {
    const prefix = `logs:${uid}:${ymd}:`;
    const keysResult = await db.list(prefix);
    
    // Handle different response formats from Replit Database
    let keys: string[] = [];
    
    if (keysResult && typeof keysResult === 'object') {
      if ((keysResult as any).ok) {
        // Wrapped response format
        const data = (keysResult as any).value;
        keys = data ? Object.keys(data) : [];
      } else {
        // Direct object format
        keys = Object.keys(keysResult);
      }
    }
    
    const logs: Log[] = [];
    
    for (const key of keys) {
      const result = await db.get(key);
      if (result) {
        const data = (result as any).ok ? (result as any).value : result;
        if (data) {
          const log = JSON.parse(JSON.stringify(data)) as Log;
          logs.push(log);
        }
      }
    }
    
    // Sort by timestamp
    return logs.sort((a, b) => a.ts - b.ts);
  } catch (error) {
    console.log(`No logs found for ${uid} on ${ymd}`);
    return [];
  }
}

export async function getLog(uid: string, ymd: string, logId: string): Promise<Log | null> {
  const result = await db.get(logKey(uid, ymd, logId));
  if (!result) return null;
  
  // Handle Replit Database wrapper format
  const data = (result as any).ok ? (result as any).value : result;
  return data ? JSON.parse(JSON.stringify(data)) as Log : null;
}

// Helper Functions
async function updateStatsAfterLog(uid: string, log: Log): Promise<void> {
  const stats = await getUserStats(uid);
  if (!stats) return;
  
  const newXp = stats.xp + log.xpAwarded;
  const dateStr = log.date;
  
  const dailyTotal = stats.dailyTotals[dateStr] || { entries: 0, xp: 0 };
  dailyTotal.entries += 1;
  dailyTotal.xp += log.xpAwarded;
  
  await updateUserStats(uid, {
    xp: newXp,
    lastLogDate: dateStr,
    dailyTotals: {
      ...stats.dailyTotals,
      [dateStr]: dailyTotal
    }
  });
  
  // Update user XP convenience field
  await updateUser(uid, { xp: newXp });
}

async function updateStreakAfterLog(uid: string, dateStr: string): Promise<void> {
  const streak = await getUserStreak(uid);
  if (!streak) return;
  
  const today = new Date(dateStr);
  const lastActiveDate = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
  
  let newCurrent = streak.current;
  let newLongest = streak.longest;
  
  if (!lastActiveDate) {
    // First log ever
    newCurrent = 1;
  } else {
    const daysDiff = Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Same day, no change to streak
      return;
    } else if (daysDiff === 1) {
      // Consecutive day
      newCurrent += 1;
    } else {
      // Streak broken
      newCurrent = 1;
    }
  }
  
  newLongest = Math.max(newLongest, newCurrent);
  
  await updateUserStreak(uid, {
    current: newCurrent,
    longest: newLongest,
    lastActiveDate: dateStr
  });
  
  // Update user streak convenience field
  await updateUser(uid, { streak: newCurrent });
}

async function checkAndAwardBadges(uid: string): Promise<void> {
  const user = await getUser(uid);
  const stats = await getUserStats(uid);
  const streak = await getUserStreak(uid);
  
  if (!user || !stats || !streak) return;
  
  // Badge: First Log
  if (stats.xp > 0 && user.badges.length === 0) {
    await awardBadge(uid, "first-log", "First Log!");
    await updateUser(uid, { badges: [...user.badges, "first-log"] });
  }
  
  // Badge: 7-Day Streak
  if (streak.current >= 7 && !user.badges.includes("streak-7")) {
    await awardBadge(uid, "streak-7", "7-Day Streak");
    await updateUser(uid, { badges: [...user.badges, "streak-7"] });
  }
  
  // Badge: 100 XP
  if (stats.xp >= 100 && !user.badges.includes("xp-100")) {
    await awardBadge(uid, "xp-100", "100 XP Master");
    await updateUser(uid, { badges: [...user.badges, "xp-100"] });
  }
}

// Catalog initialization
export async function initializeCatalogs(): Promise<void> {
  // Avatar catalog
  const avatars: Avatar[] = [
    { id: "mascot-01", src: "/assets/mascot-biteburst@512.png", label: "Zestie" },
    { id: "kid-01", src: "/assets/avatar-kid01.png", label: "Skater" },
    { id: "kid-02", src: "/assets/avatar-kid02.png", label: "Artist" },
    { id: "kid-03", src: "/assets/avatar-kid03.png", label: "Explorer" }
  ];
  
  await db.set("avatars:catalog", avatars);
  
  // Goals catalog
  const goals: GoalCatalog[] = [
    { id: "energy", label: "Energy ⚡" },
    { id: "focus", label: "Focus 🧠" },
    { id: "strength", label: "Strength 💪" }
  ];
  
  await db.set("goals:catalog", goals);
  
  // Schema version
  const version: SchemaVersion = { current: 1 };
  await db.set("versions:schema", version);
}

export async function getAvatarCatalog(): Promise<Avatar[]> {
  const result = await db.get("avatars:catalog");
  if (!result) return [];
  
  // Handle Replit Database wrapper format
  const data = (result as any).ok ? (result as any).value : result;
  return data ? JSON.parse(JSON.stringify(data)) as Avatar[] : [];
}

export async function getGoalsCatalog(): Promise<GoalCatalog[]> {
  const result = await db.get("goals:catalog");
  if (!result) return [];
  
  // Handle Replit Database wrapper format
  const data = (result as any).ok ? (result as any).value : result;
  return data ? JSON.parse(JSON.stringify(data)) as GoalCatalog[] : [];
}