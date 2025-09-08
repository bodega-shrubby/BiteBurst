/**
 * Daily Summary V2 API Routes
 * Server-driven dashboard data with timezone-aware milestone detection
 */

import type { Express } from "express";
import { storage } from "../storage";
import { eq, and } from "drizzle-orm";
import { logs } from "@shared/schema";
import { db } from "../db";

// Milestone definitions
const DAILY_MILESTONES = [
  {
    id: 'fruit1',
    title: 'Log one fruit',
    reward: 10,
    detector: (logs: any[]) => {
      const fruitEmojis = ['🍎', '🍌', '🍇', '🍓', '🍊', '🫐', '🍉', '🥝', '🍑', '🍒', '🥭', '🍍'];
      return logs.some(log => 
        log.type === 'food' && 
        log.content?.emojis?.some((emoji: string) => fruitEmojis.includes(emoji))
      );
    }
  },
  {
    id: 'activity15',
    title: 'Move for 15 minutes',
    reward: 20,
    detector: (logs: any[]) => {
      const totalActivityMin = logs
        .filter(log => log.type === 'activity')
        .reduce((total, log) => total + (log.durationMin || 0), 0);
      return totalActivityMin >= 15;
    }
  },
  {
    id: 'water',
    title: 'Drink water',
    reward: 5,
    detector: (logs: any[]) => {
      const waterTerms = ['water', 'H2O', 'hydrate', 'drink'];
      const waterEmojis = ['💧', '🚰', '🥤', '🧊'];
      return logs.some(log => {
        if (log.content?.emojis?.some((emoji: string) => waterEmojis.includes(emoji))) {
          return true;
        }
        if (log.content?.description) {
          const description = log.content.description.toLowerCase();
          return waterTerms.some(term => description.includes(term));
        }
        return false;
      });
    }
  }
];

export function registerDailySummaryV2Routes(app: Express, requireAuth: any) {
  // Get comprehensive daily summary for dashboard
  app.get('/api/user/:id/daily-summary', requireAuth, async (req: any, res) => {
    try {
      const userId = req.params.id;
      
      // Only allow users to access their own summary
      if (req.user.userId !== userId) {
        return res.status(403).json({ error: 'Cannot access other user data' });
      }
      
      // Get user for timezone and goal
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Calculate today's date in user's timezone
      const timezone = user.tz || 'UTC';
      const now = new Date();
      const today = now.toLocaleDateString('en-CA', { 
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit'
      }); // Returns YYYY-MM-DD
      
      // Get today's logs for this user
      const todaysLogs = await db
        .select()
        .from(logs)
        .where(and(
          eq(logs.userId, userId),
          eq(logs.logDate, today)
        ));
      
      // Calculate today's XP
      const xpToday = todaysLogs.reduce((sum, log) => sum + (log.xpAwarded || 0), 0);
      
      // Get daily goal based on user goal
      const dailyGoalMap = {
        energy: 80,
        focus: 80,
        strength: 100
      };
      const xpGoal = dailyGoalMap[user.goal] || 80;
      
      // Get streak data
      const streakData = await storage.getUserStreak(userId);
      
      // Detect milestones
      const milestones = DAILY_MILESTONES.map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        reward: milestone.reward,
        completed: milestone.detector(todaysLogs)
      }));
      
      // Check food and activity presence
      const hasFoodToday = todaysLogs.some(log => log.type === 'food');
      const hasActivityToday = todaysLogs.some(log => log.type === 'activity');
      
      // Get badges - simplified for MVP
      const userBadges = await storage.getUserBadges(userId);
      
      const earnedBadges = userBadges.map((ub: any) => ({
        code: ub.badgeId,
        name: ub.badgeId.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase()),
        description: `You earned this badge!`
      }));
      
      // Mock locked badges for now - will be enhanced later
      const lockedBadges = [
        { code: 'STREAK_7', name: 'One Week Streak', description: 'Log for 7 days in a row' },
        { code: 'STREAK_30', name: 'One Month Streak', description: 'Log for 30 days in a row' },
        { code: 'COMBO_MASTER', name: 'Combo Master', description: 'Log food and activity on the same day 10 times' }
      ].filter((badge: any) => !userBadges.some((ub: any) => ub.badgeId === badge.code));
      
      // Format recent logs for display
      const recentLogs = todaysLogs
        .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
        .slice(0, 5)
        .map(log => {
          let summary = '';
          
          if (log.type === 'food') {
            if (log.content && typeof log.content === 'object' && (log.content as any).emojis) {
              summary = (log.content as any).emojis.join(' ');
            } else if (log.content && typeof log.content === 'object' && (log.content as any).description) {
              summary = `📝 ${(log.content as any).description}`;
            } else {
              summary = '🍽️ Food';
            }
          } else if (log.type === 'activity') {
            let activitySummary = '';
            if (log.content && typeof log.content === 'object' && (log.content as any).emojis) {
              activitySummary = (log.content as any).emojis.join(' ');
            } else if (log.content && typeof log.content === 'object' && (log.content as any).description) {
              activitySummary = (log.content as any).description;
            } else {
              activitySummary = '🏃 Activity';
            }
            
            // Add duration and mood
            if (log.durationMin) {
              activitySummary += ` ${log.durationMin}m`;
            }
            if (log.mood) {
              const moodEmoji = { happy: '😃', ok: '😐', tired: '😴' }[log.mood] || '';
              activitySummary += ` ${moodEmoji}`;
            }
            
            summary = activitySummary;
          }
          
          return {
            id: log.id,
            type: log.type,
            summary,
            ts: log.ts.toISOString()
          };
        });
      
      const response = {
        xp_today: xpToday,
        xp_goal: xpGoal,
        streak_days: streakData?.current || 0,
        best_streak: streakData?.longest || 0,
        has_food_today: hasFoodToday,
        has_activity_today: hasActivityToday,
        milestones,
        badges: {
          earned: earnedBadges,
          locked: lockedBadges
        },
        recent_logs: recentLogs,
        user: {
          lifetime_xp: user.totalXp || 0,
          level: Math.floor((user.totalXp || 0) / 100) + 1,
          goal: user.goal,
          display_name: user.displayName
        }
      };
      
      res.json(response);
      
    } catch (error) {
      console.error('Daily summary V2 error:', error);
      res.status(500).json({ error: 'Failed to get daily summary' });
    }
  });
}