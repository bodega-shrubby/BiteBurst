/**
 * Daily Summary API Routes
 * Handles daily combo detection and provides today's logs for combined feedback
 */

import type { Express } from "express";
import { storage } from "../storage";
import { eq, and } from "drizzle-orm";
import { logs } from "@shared/schema";
import { db } from "../db";

export function registerDailySummaryRoutes(app: Express, requireAuth: any) {
  // Get daily summary for combo detection and combined feedback
  app.post('/api/user/:id/daily-summary', requireAuth, async (req: any, res) => {
    try {
      const userId = req.params.id;
      
      // Only allow users to access their own summary
      if (req.user.userId !== userId) {
        return res.status(403).json({ error: 'Cannot access other user data' });
      }
      
      // Get user for timezone
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
      
      // Separate food and activity logs
      const foodLogs = todaysLogs.filter(log => log.type === 'food');
      const activityLogs = todaysLogs.filter(log => log.type === 'activity');
      
      const hasFoodLog = foodLogs.length > 0;
      const hasActivityLog = activityLogs.length > 0;
      const hasCombo = hasFoodLog && hasActivityLog;
      
      // Check if combo bonus was already awarded today
      // We can check this by looking for any XP event with reason 'combo_bonus' today
      const comboAlreadyAwarded = todaysLogs.some(log => 
        log.xpAwarded > 0 && log.content && 
        typeof log.content === 'object' && 
        (log.content as any).combo_bonus === true
      );
      
      // Format today's logs for AI feedback
      let todaysFood = null;
      let todaysActivity = null;
      
      if (hasFoodLog) {
        const foodItems = foodLogs.map(log => {
          if (log.entryMethod === 'emoji' && log.content && (log.content as any).emojis) {
            return (log.content as any).emojis.join(' ');
          } else if (log.content && (log.content as any).description) {
            return (log.content as any).description;
          }
          return 'food';
        }).join(', ');
        todaysFood = foodItems;
      }
      
      if (hasActivityLog) {
        const activities = activityLogs.map(log => {
          let activityDesc = '';
          if (log.entryMethod === 'emoji' && log.content && (log.content as any).emojis) {
            activityDesc = (log.content as any).emojis.join(' ');
          } else if (log.content && (log.content as any).description) {
            activityDesc = (log.content as any).description;
          } else {
            activityDesc = 'activity';
          }
          
          // Add duration if available
          if (log.durationMin) {
            activityDesc += ` ${log.durationMin}min`;
          }
          
          // Add mood if available
          if (log.mood) {
            const moodEmoji = { happy: '😃', ok: '😐', tired: '😴' }[log.mood] || '';
            activityDesc += ` ${moodEmoji}`;
          }
          
          return activityDesc;
        }).join(', ');
        todaysActivity = activities;
      }
      
      res.json({
        has_food: hasFoodLog,
        has_activity: hasActivityLog,
        bonus_awarded: hasCombo && !comboAlreadyAwarded,
        todays_food: todaysFood,
        todays_activity: todaysActivity,
        date: today,
        timezone
      });
      
    } catch (error) {
      console.error('Daily summary error:', error);
      res.status(500).json({ error: 'Failed to get daily summary' });
    }
  });
}