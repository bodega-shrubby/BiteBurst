/**
 * Badge Evaluation Engine - Server-driven badge awarding system
 * Based on the comprehensive badge system requirements
 */

import { db } from "../db";
import { badges, badgeCatalog, logs, users, streaks } from "@shared/schema";
import { eq, and, count, sql } from "drizzle-orm";

export interface BadgeCheckContext {
  userId: string;
  nowISO: string;
  today: string; // local day string YYYY-MM-DD
  lastLogAt?: string;
  streakDays: number;
  // counters available from DB:
  totals: {
    foodsToday: number;
    activitiesTotal: number;
    fruitsDistinctTotal: number; // distinct fruit emojis
    vegetablesDistinctTotal: number; // distinct vegetable emojis
    waterDays: number; // days with water logged
    comboToday: boolean;
  };
  records: {
    dailyXpBest: number;
    longestStreak: number;
  };
}

export interface BadgeAward {
  code: string;
  name: string;
  description: string;
  category: string;
  tier: number;
  threshold: number;
  rarity: string;
}

/**
 * Check if user already has a specific badge
 */
async function userAlreadyHasBadge(userId: string, badgeCode: string): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(badges)
    .where(and(eq(badges.userId, userId), eq(badges.badgeCode, badgeCode)));
  
  return !!existing;
}

/**
 * Award a badge to a user if they don't already have it
 */
async function awardBadge(userId: string, badgeCode: string): Promise<void> {
  await db
    .insert(badges)
    .values({
      userId,
      badgeCode,
      earnedAt: new Date(),
      progress: 0
    })
    .onConflictDoNothing(); // Prevent duplicate awards
}

/**
 * Get badge details from catalog
 */
async function getBadgeDetails(badgeCode: string): Promise<BadgeAward | null> {
  const [badge] = await db
    .select()
    .from(badgeCatalog)
    .where(eq(badgeCatalog.code, badgeCode));
  
  if (!badge) return null;
  
  return {
    code: badge.code,
    name: badge.name,
    description: badge.description,
    category: badge.category,
    tier: badge.tier,
    threshold: badge.threshold,
    rarity: badge.rarity
  };
}

/**
 * Calculate badge context data from database
 */
export async function buildBadgeContext(userId: string, timezone = 'UTC'): Promise<BadgeCheckContext> {
  const now = new Date();
  const nowISO = now.toISOString();
  
  // Calculate today in user's timezone
  const today = now.toLocaleDateString('en-CA', { 
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit'
  }); // Returns YYYY-MM-DD
  
  // Get user's streak data
  const [streakData] = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId));
  
  // Get user's last log timestamp
  const [userInfo] = await db
    .select({ lastLogAt: users.lastLogAt })
    .from(users)
    .where(eq(users.id, userId));
  
  // Calculate totals
  const [foodsTodayResult] = await db
    .select({ count: count() })
    .from(logs)
    .where(and(
      eq(logs.userId, userId),
      eq(logs.type, 'food'),
      eq(logs.logDate, today)
    ));
  
  const [activitiesTotalResult] = await db
    .select({ count: count() })
    .from(logs)
    .where(and(
      eq(logs.userId, userId),
      eq(logs.type, 'activity')
    ));
  
  // Check for combo today (food + activity on same day)
  const [foodTodayCheck] = await db
    .select({ count: count() })
    .from(logs)
    .where(and(
      eq(logs.userId, userId),
      eq(logs.type, 'food'),
      eq(logs.logDate, today)
    ));
  
  const [activityTodayCheck] = await db
    .select({ count: count() })
    .from(logs)
    .where(and(
      eq(logs.userId, userId),
      eq(logs.type, 'activity'),
      eq(logs.logDate, today)
    ));
  
  // Count distinct fruit and vegetable emojis (simplified approach)
  const fruitEmojis = ['🍎', '🍌', '🍇', '🍓', '🍊', '🫐', '🍉', '🥝', '🍑', '🍒', '🥭', '🍍'];
  const vegetableEmojis = ['🥦', '🥕', '🌽', '🥒', '🍅', '🥬', '🥑', '🌶️', '🧄', '🧅', '🍆', '🥔'];
  const userLogs = await db
    .select({ content: logs.content })
    .from(logs)
    .where(and(eq(logs.userId, userId), eq(logs.type, 'food')));
  
  const uniqueFruits = new Set();
  const uniqueVegetables = new Set();
  userLogs.forEach(log => {
    if (log.content && typeof log.content === 'object' && (log.content as any).emojis) {
      const emojis = (log.content as any).emojis as string[];
      emojis.forEach(emoji => {
        if (fruitEmojis.includes(emoji)) {
          uniqueFruits.add(emoji);
        }
        if (vegetableEmojis.includes(emoji)) {
          uniqueVegetables.add(emoji);
        }
      });
    }
  });
  
  // Count days with water logged (simplified - look for water-related terms)
  const waterTerms = ['water', 'H2O', 'hydrate', 'drink'];
  const waterEmojis = ['💧', '🚰', '🥤', '🧊'];
  
  const waterLogs = await db
    .select({ logDate: logs.logDate, content: logs.content })
    .from(logs)
    .where(eq(logs.userId, userId));
  
  const waterDaysSet = new Set();
  waterLogs.forEach(log => {
    let hasWater = false;
    if (log.content && typeof log.content === 'object') {
      const content = log.content as any;
      // Check emojis
      if (content.emojis && content.emojis.some((emoji: string) => waterEmojis.includes(emoji))) {
        hasWater = true;
      }
      // Check description
      if (content.description && typeof content.description === 'string') {
        const description = content.description.toLowerCase();
        if (waterTerms.some(term => description.includes(term))) {
          hasWater = true;
        }
      }
    }
    if (hasWater) {
      waterDaysSet.add(log.logDate);
    }
  });
  
  // Calculate personal records
  // Daily XP best: get highest XP earned in a single day
  const dailyXpRows = await db
    .select({ 
      logDate: logs.logDate,
      totalXp: sql<number>`SUM(${logs.xpAwarded})`
    })
    .from(logs)
    .where(eq(logs.userId, userId))
    .groupBy(logs.logDate);
  
  const dailyXpBest = Math.max(0, ...dailyXpRows.map(row => row.totalXp));
  
  // Longest streak: from streaks table
  const longestStreak = streakData?.longest || 0;
  
  return {
    userId,
    nowISO,
    today,
    lastLogAt: userInfo?.lastLogAt?.toISOString(),
    streakDays: streakData?.current || 0,
    totals: {
      foodsToday: foodsTodayResult.count,
      activitiesTotal: activitiesTotalResult.count,
      fruitsDistinctTotal: uniqueFruits.size,
      vegetablesDistinctTotal: uniqueVegetables.size,
      waterDays: waterDaysSet.size,
      comboToday: foodTodayCheck.count > 0 && activityTodayCheck.count > 0
    },
    records: {
      dailyXpBest,
      longestStreak
    }
  };
}

/**
 * Main badge evaluation function - checks all badge conditions
 * Returns array of newly earned badges
 */
export async function evaluateBadges(ctx: BadgeCheckContext): Promise<BadgeAward[]> {
  const newlyEarned: string[] = [];
  
  // Helper: award if not already owned
  async function tryAward(code: string) {
    const has = await userAlreadyHasBadge(ctx.userId, code);
    if (!has) {
      await awardBadge(ctx.userId, code);
      newlyEarned.push(code);
    }
  }
  
  // FIRST_FOOD - Award when user logs their first food
  if (ctx.totals.foodsToday >= 1) {
    // Check if this is truly their first food log ever
    const [totalFoodLogs] = await db
      .select({ count: count() })
      .from(logs)
      .where(and(eq(logs.userId, ctx.userId), eq(logs.type, 'food')));
    
    if (totalFoodLogs.count === 1) { // This is their first food log
      await tryAward('FIRST_FOOD');
    }
  }
  
  // FIRST_ACTIVITY - Award when user logs their first activity
  if (ctx.totals.activitiesTotal >= 1) {
    if (ctx.totals.activitiesTotal === 1) { // This is their first activity log
      await tryAward('FIRST_ACTIVITY');
    }
  }
  
  // STREAK milestones - Award when streak reaches exact thresholds
  for (const threshold of [3, 7, 14, 30]) {
    if (ctx.streakDays >= threshold) {
      await tryAward(`STREAK_${threshold}`);
    }
  }
  
  // FOOD_VARIETY_5 - Award when logged 5 different fruits
  if (ctx.totals.fruitsDistinctTotal >= 5) {
    await tryAward('FOOD_VARIETY_5');
  }
  
  // VEG_VARIETY_5 - Award when logged 5 different vegetables
  if (ctx.totals.vegetablesDistinctTotal >= 5) {
    await tryAward('VEG_VARIETY_5');
  }
  
  // ACTIVITY_10 - Award when logged 10 activities total
  if (ctx.totals.activitiesTotal >= 10) {
    await tryAward('ACTIVITY_10');
  }
  
  // COMBO_DAY - Award when logged food and activity on same day
  if (ctx.totals.comboToday) {
    await tryAward('COMBO_DAY');
  }
  
  // WATER_7 - Award when logged water on 7 different days
  if (ctx.totals.waterDays >= 7) {
    await tryAward('WATER_7');
  }
  
  // Personal Record badges - always "earned" if values exist
  if (ctx.records.dailyXpBest > 0) {
    await tryAward('PR_DAILY_XP');
  }
  
  if (ctx.records.longestStreak > 0) {
    await tryAward('PR_LONGEST_STREAK');
  }
  
  // Get badge details for newly earned badges
  const badgeDetails: BadgeAward[] = [];
  for (const code of newlyEarned) {
    const badge = await getBadgeDetails(code);
    if (badge) {
      badgeDetails.push(badge);
    }
  }
  
  return badgeDetails;
}

/**
 * Get all badge catalog items (for showing locked badges)
 */
export async function getAllBadges(): Promise<BadgeAward[]> {
  const allBadges = await db
    .select()
    .from(badgeCatalog)
    .where(eq(badgeCatalog.active, true));
  
  return allBadges.map(badge => ({
    code: badge.code,
    name: badge.name,
    description: badge.description,
    category: badge.category,
    tier: badge.tier,
    threshold: badge.threshold,
    rarity: badge.rarity
  }));
}

/**
 * Get user's earned badges with progress info
 */
export async function getUserBadgesWithProgress(userId: string): Promise<{
  earned: Array<{ code: string; earnedAt: string }>;
  progress: Array<{ code: string; current: number; threshold: number }>;
  records: { dailyXpBest: number; longestStreak: number };
}> {
  // Get earned badges
  const earnedBadges = await db
    .select({
      code: badges.badgeCode,
      earnedAt: badges.earnedAt
    })
    .from(badges)
    .where(eq(badges.userId, userId));
  
  // Get progress context for threshold calculation
  const ctx = await buildBadgeContext(userId);
  
  // Calculate progress for unearned badges
  const allBadges = await getAllBadges();
  const earnedCodes = new Set(earnedBadges.map(b => b.code));
  
  const progress = [];
  for (const badge of allBadges) {
    if (!earnedCodes.has(badge.code)) {
      let current = 0;
      
      switch (badge.code) {
        case 'STREAK_3':
        case 'STREAK_7':
        case 'STREAK_14':
        case 'STREAK_30':
          current = ctx.streakDays;
          break;
        case 'FOOD_VARIETY_5':
          current = ctx.totals.fruitsDistinctTotal;
          break;
        case 'VEG_VARIETY_5':
          current = ctx.totals.vegetablesDistinctTotal;
          break;
        case 'ACTIVITY_10':
          current = ctx.totals.activitiesTotal;
          break;
        case 'WATER_7':
          current = ctx.totals.waterDays;
          break;
        case 'COMBO_DAY':
          current = ctx.totals.comboToday ? 1 : 0;
          break;
        case 'FIRST_FOOD':
          const totalFoods = await db
            .select({ count: count() })
            .from(logs)
            .where(and(eq(logs.userId, userId), eq(logs.type, 'food')));
          current = totalFoods[0].count;
          break;
        case 'FIRST_ACTIVITY':
          current = ctx.totals.activitiesTotal;
          break;
        case 'PR_DAILY_XP':
          current = ctx.records.dailyXpBest;
          break;
        case 'PR_LONGEST_STREAK':
          current = ctx.records.longestStreak;
          break;
      }
      
      progress.push({
        code: badge.code,
        current,
        threshold: badge.threshold
      });
    }
  }
  
  return {
    earned: earnedBadges.map(b => ({
      code: b.code,
      earnedAt: b.earnedAt.toISOString()
    })),
    progress,
    records: ctx.records
  };
}