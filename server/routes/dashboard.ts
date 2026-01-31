import type { Express } from "express";
import { storage } from "../storage";

export function registerDashboardRoutes(app: Express, requireAuth: any) {
  // Get dashboard data (new architecture - uses child IDs)
  app.get('/api/dashboard', requireAuth, async (req: any, res: any) => {
    try {
      const parentAuthId = req.userId;

      // Get parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get active child (required in new architecture)
      let activeChildId = parentUser.activeChildId;
      if (!activeChildId) {
        // Get first child if no active child set
        const children = await storage.getChildrenByParentId(parentUser.id);
        if (children.length > 0) {
          activeChildId = children[0].id;
          await storage.setActiveChildId(parentUser.id, activeChildId);
        } else {
          return res.status(404).json({ error: 'No child profiles found' });
        }
      }

      // Get active child data
      const child = await storage.getChildById(activeChildId);
      if (!child) {
        return res.status(404).json({ error: 'Active child not found' });
      }

      // Get today's logs for this child (using childId)
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = await storage.getUserLogs(activeChildId, 50);
      const todayLogsFiltered = todayLogs.filter(log => 
        log.ts && log.ts.toISOString().split('T')[0] === today
      );

      const todayXp = todayLogsFiltered.reduce((sum, log) => sum + (log.xpAwarded || 0), 0);

      // Get child badges
      const badges = await storage.getUserBadges(activeChildId);

      // Daily XP goal based on child's goal
      const dailyGoalMap: Record<string, number> = {
        energy: 100,
        focus: 80,
        strength: 120
      };
      const dailyGoal = dailyGoalMap[child.goal || 'energy'] || 100;

      const dashboardData = {
        user: {
          id: activeChildId,
          displayName: child.name,
          goal: child.goal,
          xp: child.totalXp || 0,
          streak: child.streak || 0,
          avatarId: child.avatar,
          level: child.level || 1,
        },
        todayXp,
        dailyGoal,
        streakData: {
          current: child.streak || 0,
          longest: child.streak || 0,
          lastActive: child.lastLogAt
        },
        badges: badges.map(badge => ({
          badgeId: badge.badgeCode,
          awardedAt: badge.earnedAt.toISOString()
        })),
        todayLogs: todayLogsFiltered.map(log => ({
          id: log.id,
          type: log.type,
          content: log.content,
          xpAwarded: log.xpAwarded,
          ts: log.ts.toISOString()
        }))
      };

      res.json(dashboardData);
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Failed to load dashboard data' });
    }
  });

  // Quick log endpoint (new architecture - uses child IDs)
  app.post('/api/dashboard/quick-log', requireAuth, async (req: any, res: any) => {
    try {
      const parentAuthId = req.userId;
      const { type, content, entryMethod } = req.body;

      if (!type || !content || !entryMethod) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get active child
      const activeChildId = parentUser.activeChildId;
      if (!activeChildId) {
        return res.status(400).json({ error: 'No active child set' });
      }

      const child = await storage.getChildById(activeChildId);
      if (!child || child.parentId !== parentUser.id) {
        return res.status(404).json({ error: 'Active child not found' });
      }

      // Calculate XP based on type and content
      let xpAwarded = 10; // Base XP
      if (type === 'food') xpAwarded = 15;
      if (type === 'activity') xpAwarded = 20;

      // Get child's current goal for context
      const goalContext = child.goal;

      // Create log entry (using childId as userId for backward compatibility)
      const logEntry = await storage.createLog({
        userId: activeChildId,
        type: type as 'food' | 'activity',
        entryMethod: entryMethod as 'emoji' | 'text' | 'photo',
        content: typeof content === 'string' ? { description: content } : content,
        goalContext: goalContext as 'energy' | 'focus' | 'strength' | null,
        xpAwarded
      });

      // Update child's XP and streak
      const today = new Date().toISOString().split('T')[0];
      const lastLogDate = child.lastLogAt ? new Date(child.lastLogAt).toISOString().split('T')[0] : null;

      let newStreak = child.streak || 0;
      if (lastLogDate !== today) {
        // Check if this is consecutive day
        if (lastLogDate) {
          const lastDate = new Date(lastLogDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            newStreak = newStreak + 1;
          } else if (diffDays > 1) {
            newStreak = 1; // Reset streak
          }
        } else {
          newStreak = 1; // First log
        }
      }

      // Update child progress
      await storage.updateChildProgress(activeChildId, {
        totalXp: (child.totalXp || 0) + xpAwarded,
        streak: newStreak,
        lastLogAt: new Date(),
      });

      // Simple feedback based on type
      const feedback = type === 'food' 
        ? "Great choice! Your body will thank you for this nutritious fuel."
        : "Awesome activity! You're building stronger, healthier habits.";

      res.json({
        success: true,
        xpAwarded,
        feedback,
        logId: logEntry.id
      });

    } catch (error) {
      console.error('Quick log error:', error);
      res.status(500).json({ error: 'Failed to log entry' });
    }
  });

  // Complete journey task (new architecture - uses child IDs)
  app.post('/api/dashboard/complete-task', requireAuth, async (req: any, res: any) => {
    try {
      const parentAuthId = req.userId;
      const { taskId, xpReward } = req.body;

      if (!taskId || !xpReward) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get active child
      const activeChildId = parentUser.activeChildId;
      if (!activeChildId) {
        return res.status(400).json({ error: 'No active child set' });
      }

      const child = await storage.getChildById(activeChildId);
      if (!child || child.parentId !== parentUser.id) {
        return res.status(404).json({ error: 'Active child not found' });
      }

      // Update child's XP
      await storage.updateChildProgress(activeChildId, {
        totalXp: (child.totalXp || 0) + xpReward
      });

      res.json({
        success: true,
        xpAwarded: xpReward,
        feedback: "Task completed! Great job staying on track."
      });

    } catch (error) {
      console.error('Complete task error:', error);
      res.status(500).json({ error: 'Failed to complete task' });
    }
  });
}