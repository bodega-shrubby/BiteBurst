/**
 * Clean timezone-aware streak tracking utility
 * Implements the logic from user requirements document
 */

// Milestone badge configuration
export const STREAK_MILESTONES = [
  { code: "STREAK_3", name: "3-Day Streak", days: 3 },
  { code: "STREAK_7", name: "One-Week Streak", days: 7 },
  { code: "STREAK_14", name: "Two-Week Streak", days: 14 },
  { code: "STREAK_30", name: "30-Day Streak", days: 30 }
] as const;

export interface StreakResult {
  streak_days: number;
  streak_changed: boolean;
  longest_streak: number;
  badge_awarded: { code: string; name: string } | null;
}

/**
 * Convert timestamp to calendar date in specified timezone
 */
function toCalendarDate(timestamp: Date, timezone: string): string {
  try {
    return timestamp.toLocaleDateString('en-CA', { 
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    }); // Returns YYYY-MM-DD
  } catch (error) {
    // Fallback to UTC if timezone is invalid
    return timestamp.toISOString().split('T')[0];
  }
}

/**
 * Check if two calendar dates are the same day
 */
function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

/**
 * Check if date1 is exactly one day after date2
 */
function isNextDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = d1.getTime() - d2.getTime();
  return diff === 24 * 60 * 60 * 1000; // Exactly 24 hours
}

/**
 * Main streak tracking function
 * @param userId - User ID
 * @param currentStreak - Current streak from database
 * @param longestStreak - Longest streak from database  
 * @param lastLogAt - Last log timestamp (or null for first log)
 * @param now - Current timestamp
 * @param userTz - User timezone (e.g., "Asia/Dubai")
 * @returns StreakResult with updated values and flags
 */
export function updateStreak(
  userId: string,
  currentStreak: number = 0,
  longestStreak: number = 0,
  lastLogAt: Date | null,
  now: Date,
  userTz: string | null = null
): StreakResult {
  const timezone = userTz || 'UTC'; // Fallback to server timezone
  const today = toCalendarDate(now, timezone);
  const lastDay = lastLogAt ? toCalendarDate(lastLogAt, timezone) : null;

  let newStreak = currentStreak;
  let streakChanged = false;

  if (!lastDay) {
    // First log ever
    newStreak = 1;
    streakChanged = true;
  } else if (isSameDay(today, lastDay)) {
    // Same calendar day - no change
    streakChanged = false;
  } else if (isNextDay(today, lastDay)) {
    // Next day - increment streak
    newStreak = currentStreak + 1;
    streakChanged = true;
  } else {
    // Gap in days - reset to 1
    newStreak = 1;
    streakChanged = false; // Don't show pill for streak reset
  }

  // Update longest streak
  const newLongestStreak = Math.max(longestStreak, newStreak);

  // Check for milestone badge
  let badgeAwarded: { code: string; name: string } | null = null;
  if (streakChanged) {
    const milestone = STREAK_MILESTONES.find(m => m.days === newStreak);
    if (milestone) {
      badgeAwarded = { code: milestone.code, name: milestone.name };
    }
  }

  return {
    streak_days: newStreak,
    streak_changed: streakChanged,
    longest_streak: newLongestStreak,
    badge_awarded: badgeAwarded
  };
}

/**
 * Test clock override for development
 * Set NOW_OVERRIDE=YYYY-MM-DDTHH:mm:ssZ in environment
 */
export function getCurrentTime(): Date {
  if (process.env.NODE_ENV === 'development' && process.env.NOW_OVERRIDE) {
    return new Date(process.env.NOW_OVERRIDE);
  }
  return new Date();
}