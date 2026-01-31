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
  // Get comprehensive daily summary for dashboard (now uses child ID)
  app.get('/api/user/:id/daily-summary', requireAuth, async (req: any, res) => {
    try {
      const childId = req.params.id;
      const parentAuthId = req.userId;

      // Get parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get child and verify ownership
      const child = await storage.getChildById(childId);
      if (!child || child.parentId !== parentUser.id) {
        return res.status(403).json({ error: 'Cannot access other user data' });
      }

      // Calculate today's date in child's timezone
      const timezone = child.tz || 'UTC';
      const now = new Date();
      const today = now.toLocaleDateString('en-CA', { 
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit'
      }); // Returns YYYY-MM-DD

      // Get today's logs for this child (using childId as userId for logs)
      const todaysLogs = await db
        .select()
        .from(logs)
        .where(and(
          eq(logs.userId, childId),
          eq(logs.logDate, today)
        ));

      // Calculate today's XP
      const xpToday = todaysLogs.reduce((sum, log) => sum + (log.xpAwarded || 0), 0);

      // Get daily goal based on child's goal
      const dailyGoalMap: Record<string, number> = {
        energy: 80,
        focus: 80,
        strength: 100
      };
      const xpGoal = child.goal ? dailyGoalMap[child.goal] || 80 : 80;

      // Get streak data (use child streak directly from child profile)
      const streakData = { current: child.streak || 0, longest: child.streak || 0, lastActive: child.lastLogAt };

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

      // Get badges - simplified for MVP (using childId as userId)
      const userBadges = await storage.getUserBadges(childId);

      const earnedBadges = userBadges.map((ub: any) => {
        const earnedAt = ub.ts || ub.createdAt || ub.earnedAt;
        const isNew = earnedAt && (Date.now() - new Date(earnedAt).getTime()) < 86400000; // 24 hours
        return {
          code: ub.badgeCode,
          name: ub.badgeCode.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: `You earned this badge!`,
          earnedAt: earnedAt ? new Date(earnedAt).toISOString() : null,
          isNew
        };
      });

      // Get all-time logs for badge progress calculation
      const allTimeLogs = await db
        .select()
        .from(logs)
        .where(eq(logs.userId, childId));
      
      // Calculate badge progress for each badge type
      const fruitEmojis = ['🍎', '🍌', '🍇', '🍓', '🍊', '🫐', '🍉', '🥝', '🍑', '🍒', '🥭', '🍍'];
      const veggieEmojis = ['🥦', '🥕', '🥬', '🥒', '🌽', '🥗', '🫛', '🧅', '🧄'];
      
      const badgeProgress: Record<string, { current: number; total: number }> = {
        'FIRST_LOG': {
          current: Math.min(allTimeLogs.length, 1),
          total: 1
        },
        'STREAK_3': {
          current: Math.min(streakData?.current || 0, 3),
          total: 3
        },
        'STREAK_7': {
          current: Math.min(streakData?.current || 0, 7),
          total: 7
        },
        'STREAK_30': {
          current: Math.min(streakData?.current || 0, 30),
          total: 30
        },
        'FRUIT_FIGHTER': {
          current: allTimeLogs.filter(log => 
            log.type === 'food' && 
            log.content && 
            typeof log.content === 'object' &&
            (log.content as any).emojis?.some((e: string) => fruitEmojis.includes(e))
          ).length,
          total: 10
        },
        'VEGGIE_VICTOR': {
          current: allTimeLogs.filter(log => 
            log.type === 'food' && 
            log.content && 
            typeof log.content === 'object' &&
            (log.content as any).emojis?.some((e: string) => veggieEmojis.includes(e))
          ).length,
          total: 10
        },
        'MOVE_MASTER': {
          current: allTimeLogs.filter(log => log.type === 'activity').length,
          total: 10
        },
        'COMBO_MASTER': {
          current: (() => {
            const dateMap = new Map<string, { food: boolean; activity: boolean }>();
            allTimeLogs.forEach(log => {
              const date = log.logDate;
              if (!dateMap.has(date)) {
                dateMap.set(date, { food: false, activity: false });
              }
              const entry = dateMap.get(date)!;
              if (log.type === 'food') entry.food = true;
              if (log.type === 'activity') entry.activity = true;
            });
            return Array.from(dateMap.values()).filter(d => d.food && d.activity).length;
          })(),
          total: 10
        }
      };
      
      // Locked badges with progress data
      const lockedBadges = [
        { code: 'STREAK_7', name: 'One Week Streak', description: 'Log for 7 days in a row', emoji: '🔥' },
        { code: 'STREAK_30', name: 'One Month Streak', description: 'Log for 30 days in a row', emoji: '🔥' },
        { code: 'FRUIT_FIGHTER', name: 'Fruit Fighter', description: 'Log 10 fruits', emoji: '🍎' },
        { code: 'VEGGIE_VICTOR', name: 'Veggie Victor', description: 'Log 10 vegetables', emoji: '🥦' },
        { code: 'MOVE_MASTER', name: 'Move Master', description: 'Log 10 activities', emoji: '🏃' },
        { code: 'COMBO_MASTER', name: 'Combo Master', description: 'Log food and activity on the same day 10 times', emoji: '⭐' }
      ]
        .filter((badge: any) => !userBadges.some((ub: any) => ub.badgeCode === badge.code))
        .map(badge => ({
          ...badge,
          progress: badgeProgress[badge.code] || null
        }));
      
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
            ts: log.ts.toISOString(),
            xpAwarded: log.xpAwarded || 0,
            feedback: log.aiFeedback || null
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
          lifetime_xp: child.totalXp || 0,
          level: child.level || Math.floor((child.totalXp || 0) / 100) + 1,
          goal: child.goal,
          display_name: child.name
        }
      };

      res.json(response);
      
    } catch (error) {
      console.error('Daily summary V2 error:', error);
      res.status(500).json({ error: 'Failed to get daily summary' });
    }
  });
}