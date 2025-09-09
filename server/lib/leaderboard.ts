/**
 * Leaderboard Logic Engine
 * Handles weekly league calculations, rankings, and promotions/demotions
 */

import { db } from "../db";
import { users, xpEvents, leagueBoards, leaderboardCache } from "@shared/schema";
import { eq, and, sql, desc, gte, lte, inArray } from "drizzle-orm";

export interface WeekInfo {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  seconds_remaining: number;
}

export interface LeagueInfo {
  tier: 'bronze' | 'silver' | 'gold';
  name: string;
  promote_count: number;
  demote_count: number;
}

export interface LeaderboardMember {
  rank: number;
  user_id: string;
  name: string;
  avatar: string;
  xp_week: number;
  streak: number;
}

export interface LeaderboardResponse {
  week: WeekInfo;
  league: LeagueInfo;
  promotion_zone_rank: number;
  demotion_zone_rank: number | null;
  members: LeaderboardMember[];
  me: LeaderboardMember | null;
  user_opted_out: boolean;
}

/**
 * Get current week boundaries (Monday 00:00 -> Sunday 23:59)
 */
export function getCurrentWeekBoundaries(timezone = 'UTC'): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayOffset = day === 0 ? -6 : 1 - day; // Get to Monday
  
  const start = new Date(now);
  start.setDate(now.getDate() + mondayOffset);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Sunday
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

/**
 * Get league configuration by tier
 */
export function getLeagueConfig(tier: string): LeagueInfo {
  switch (tier) {
    case 'bronze':
      return {
        tier: 'bronze',
        name: 'Bronze League',
        promote_count: 10,
        demote_count: 0,
      };
    case 'silver':
      return {
        tier: 'silver',
        name: 'Silver League',
        promote_count: 10,
        demote_count: 10,
      };
    case 'gold':
      return {
        tier: 'gold',
        name: 'Gold League',
        promote_count: 3, // Top 3 get champion ribbon
        demote_count: 10,
      };
    default:
      throw new Error(`Invalid league tier: ${tier}`);
  }
}

/**
 * Calculate weekly XP for a user
 */
export async function calculateWeeklyXP(userId: string, weekStart: Date, weekEnd: Date): Promise<number> {
  const [result] = await db
    .select({ 
      total: sql<number>`COALESCE(SUM(${xpEvents.amount}), 0)` 
    })
    .from(xpEvents)
    .where(
      and(
        eq(xpEvents.userId, userId),
        gte(xpEvents.ts, weekStart),
        lte(xpEvents.ts, weekEnd)
      )
    );
  
  return result?.total || 0;
}

/**
 * Get or create league board for a specific week/tier
 */
export async function getLeagueBoard(weekStart: string, tier: string): Promise<string[] | null> {
  const [board] = await db
    .select()
    .from(leagueBoards)
    .where(
      and(
        eq(leagueBoards.weekStart, weekStart),
        eq(leagueBoards.leagueTier, tier)
      )
    );
  
  if (!board) return null;
  
  // JSONB-safe parsing
  const raw = board.members as unknown;
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === 'string') {
    try { 
      return JSON.parse(raw) as string[]; 
    } catch { 
      return [raw]; 
    }
  }
  return null;
}

/**
 * Generate avatar string from user data
 */
export function generateAvatar(userId: string, displayName: string): string {
  // For mock users, we'll use predetermined avatars based on name
  // For real users, generate from initials
  
  if (displayName.includes('.')) {
    // Mock user format like "Alex K."
    const parts = displayName.split(' ');
    const first = parts[0];
    const lastInitial = parts[1]?.replace('.', '') || '';
    
    // Simple color assignment based on first letter
    const colors = ['🟦', '🟧', '🟩', '🟨', '🟪', '🟫', '⬛', '⬜'];
    const colorIndex = first.charCodeAt(0) % colors.length;
    
    return `${colors[colorIndex]}${first.charAt(0)}${lastInitial}`;
  }
  
  // Real user - use initials
  const parts = displayName.split(' ');
  const initials = parts.map(p => p.charAt(0)).join('').substring(0, 2);
  
  const colors = ['🟦', '🟧', '🟩', '🟨', '🟪', '🟫'];
  const colorIndex = userId.charCodeAt(0) % colors.length;
  
  return `${colors[colorIndex]}${initials}`;
}

/**
 * Build complete leaderboard for a user
 */
export async function buildLeaderboard(userId: string, tier?: string): Promise<LeaderboardResponse> {
  const { start: weekStart, end: weekEnd } = getCurrentWeekBoundaries();
  const weekStartStr = weekStart.toISOString().split('T')[0];
  
  // Get user info
  console.log('🔍 LEADERBOARD QUERY - Looking for user with ID:', userId);
  console.log('🔍 LEADERBOARD QUERY - userId type:', typeof userId);
  
  let user;
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    user = result[0];
    
    console.log('🔍 LEADERBOARD QUERY - Database returned:', user);
    
    if (!user) {
      console.error('❌ User not found with ID:', userId);
      // Let's also try a broader search to see if user exists with different ID
      const allUsers = await db.select({ id: users.id, displayName: users.displayName }).from(users).limit(5);
      console.error('❌ Sample users in DB:', allUsers);
      throw new Error('User not found');
    }
    
    console.log('✅ Found user successfully:', user.displayName);
    
  } catch (dbError) {
    console.error('💥 Database query error:', dbError);
    throw dbError;
  }
  
  // Check if user opted out
  if (user!.leaderboardOptOut) {
    return {
      week: {
        start: weekStartStr,
        end: weekEnd.toISOString().split('T')[0],
        seconds_remaining: Math.max(0, Math.floor((weekEnd.getTime() - Date.now()) / 1000)),
      },
      league: getLeagueConfig('bronze'),
      promotion_zone_rank: 10,
      demotion_zone_rank: null,
      members: [],
      me: null,
      user_opted_out: true,
    };
  }
  
  const userTier = tier || user!.leagueTier || 'bronze';
  const leagueConfig = getLeagueConfig(userTier);
  
  // Get league board members
  let memberIds = await getLeagueBoard(weekStartStr, userTier);
  
  // If user is not in any league board yet, add them to Bronze league
  if (!memberIds || !memberIds.includes(userId)) {
    await ensureUserInLeague(userId, userTier, weekStartStr);
    memberIds = await getLeagueBoard(weekStartStr, userTier);
  }
  
  // 🔒 Normalize to a proper array for SQL ANY/IN
  let memberIdList: string[] = [];
  if (Array.isArray(memberIds)) {
    memberIdList = memberIds.filter(Boolean);
  } else if (typeof memberIds === 'string' && memberIds.length > 0) {
    // Defensive: in case something serialized it earlier
    try { 
      memberIdList = JSON.parse(memberIds); 
    } catch { 
      memberIdList = [memberIds]; 
    }
  }
  
  // Fallback: at least include the current user so query never breaks
  if (memberIdList.length === 0) memberIdList = [userId];
  
  console.log('🔍 memberIdList (normalized):', memberIdList, 'isArray:', Array.isArray(memberIdList), 'length:', memberIdList.length);
  
  // Better empty board fallback (prevents 500 errors)
  if (memberIdList.length === 0) {
    return {
      week: {
        start: weekStartStr,
        end: weekEnd.toISOString().split('T')[0],
        seconds_remaining: Math.max(0, Math.floor((weekEnd.getTime() - Date.now()) / 1000)),
      },
      league: leagueConfig,
      promotion_zone_rank: leagueConfig.promote_count,
      demotion_zone_rank: leagueConfig.demote_count > 0 ? 30 - leagueConfig.demote_count + 1 : null,
      members: [],
      me: null,
      user_opted_out: false,
    };
  }
  
  // Get user data for all members (guaranteed array now)
  const memberUsers = await db
    .select()
    .from(users)
    .where(inArray(users.id, memberIdList));
  
  // Calculate weekly XP for all members (performance optimized - single query)
  const xpRows = await db
    .select({
      userId: xpEvents.userId,
      xp: sql<number>`COALESCE(SUM(${xpEvents.amount}), 0)`
    })
    .from(xpEvents)
    .where(and(
      inArray(xpEvents.userId, memberIdList),
      gte(xpEvents.ts, weekStart),
      lte(xpEvents.ts, weekEnd)
    ))
    .groupBy(xpEvents.userId);

  const xpMap = new Map(xpRows.map(r => [r.userId, r.xp]));

  const membersWithXP = memberUsers.map(member => ({
    user: member,
    xp_week: xpMap.get(member.id) ?? 0
  }));
  
  // Sort by XP (descending) with tie-breakers
  membersWithXP.sort((a, b) => {
    if (a.xp_week !== b.xp_week) {
      return b.xp_week - a.xp_week; // Higher XP first
    }
    if (a.user.streak !== b.user.streak) {
      return b.user.streak - a.user.streak; // Higher streak first
    }
    // Earlier user ID as final tie-breaker
    return a.user.id.localeCompare(b.user.id);
  });
  
  // Build member list with ranks
  const members: LeaderboardMember[] = membersWithXP.map((member, index) => ({
    rank: index + 1,
    user_id: member.user.id,
    name: member.user.displayName,
    avatar: generateAvatar(member.user.id, member.user.displayName),
    xp_week: member.xp_week,
    streak: member.user.streak,
  }));
  
  // Find current user in the list
  const me = members.find(m => m.user_id === userId) || null;
  
  return {
    week: {
      start: weekStartStr,
      end: weekEnd.toISOString().split('T')[0],
      seconds_remaining: Math.max(0, Math.floor((weekEnd.getTime() - Date.now()) / 1000)),
    },
    league: leagueConfig,
    promotion_zone_rank: leagueConfig.promote_count,
    demotion_zone_rank: leagueConfig.demote_count > 0 ? members.length - leagueConfig.demote_count + 1 : null,
    members,
    me,
    user_opted_out: false,
  };
}

/**
 * Ensure user is added to appropriate league board
 */
export async function ensureUserInLeague(userId: string, tier: string, weekStart: string): Promise<void> {
  // Check if league board exists for this week/tier
  const [existingBoard] = await db
    .select()
    .from(leagueBoards)
    .where(
      and(
        eq(leagueBoards.weekStart, weekStart),
        eq(leagueBoards.leagueTier, tier)
      )
    );

  if (existingBoard) {
    // JSONB-safe member parsing
    let members: string[] = [];
    const raw = existingBoard.members as unknown;
    if (Array.isArray(raw)) {
      members = raw as string[];
    } else if (typeof raw === 'string') {
      try { 
        members = JSON.parse(raw) as string[]; 
      } catch { 
        members = [raw]; 
      }
    }

    if (!members.includes(userId)) {
      await db
        .update(leagueBoards)
        .set({ members: [...members, userId] })
        .where(eq(leagueBoards.id, existingBoard.id));
    }
  } else {
    // Create new league board with this user
    await db.insert(leagueBoards).values({
      weekStart,
      leagueTier: tier,
      members: [userId],
    });
  }
}

/**
 * Update user's opt-out preference
 */
export async function updateOptOut(userId: string, optOut: boolean): Promise<void> {
  await db
    .update(users)
    .set({ leaderboardOptOut: optOut })
    .where(eq(users.id, userId));
}