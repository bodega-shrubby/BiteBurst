import type { Express } from "express";
import { storage } from "../storage";

export function registerDashboardRoutes(app: Express, requireAuth: any) {
  // Get dashboard data
  app.get('/api/dashboard', requireAuth, async (req: any, res: any) => {
    try {
      const parentAuthId = req.userId;
      
      // Get parent user data (may be different from active child)
      let parentUser = await storage.getUserByParentAuthId(parentAuthId);
      if (!parentUser) {
        parentUser = await storage.getUser(parentAuthId);
      }
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Determine active child data
      let activeChildId = parentUser.activeChildId;
      let displayName: string;
      let goal: string | null;
      let totalXp: number;
      let streak: number;
      let avatarId: string | null;
      let userId: string;
      
      if (activeChildId) {
        // Get active child from children table
        const activeChild = await storage.getChild(activeChildId);
        if (activeChild) {
          displayName = activeChild.name;
          goal = activeChild.goal;
          totalXp = activeChild.xp || 0;
          streak = activeChild.streak || 0;
          avatarId = activeChild.avatar;
          userId = activeChildId;
        } else {
          // Fallback to primary user
          displayName = parentUser.displayName || 'User';
          goal = parentUser.goal;
          totalXp = parentUser.totalXp || 0;
          streak = parentUser.streak || 0;
          avatarId = parentUser.avatarId;
          userId = parentUser.id;
        }
      } else {
        // Use primary user data
        displayName = parentUser.displayName || 'User';
        goal = parentUser.goal;
        totalXp = parentUser.totalXp || 0;
        streak = parentUser.streak || 0;
        avatarId = parentUser.avatarId;
        userId = parentUser.id;
      }

      // Get streak data (for primary user - TODO: separate per child)
      const streakData = await storage.getUserStreak(parentUser.id) || {
        current: 0,
        longest: 0,
        lastActive: null
      };

      // Get today's logs (for primary user - TODO: separate per child)
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = await storage.getUserLogs(parentUser.id, 50);
      const todayLogsFiltered = todayLogs.filter(log => 
        log.ts && log.ts.toISOString().split('T')[0] === today
      );
      
      const todayXp = todayLogsFiltered.reduce((sum, log) => sum + (log.xpAwarded || 0), 0);

      // Get user badges (for primary user - TODO: separate per child)
      const badges = await storage.getUserBadges(parentUser.id);

      // Daily XP goal based on user goal
      const dailyGoalMap: Record<string, number> = {
        energy: 100,
        focus: 80,
        strength: 120
      };
      const dailyGoal = dailyGoalMap[goal || 'energy'] || 100;

      const dashboardData = {
        user: {
          id: userId,
          displayName,
          goal,
          xp: totalXp,
          streak,
          avatarId
        },
        todayXp,
        dailyGoal,
        streakData: {
          current: streak || streakData.current,
          longest: streakData.longest,
          lastActive: streakData.lastActive
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

  // Quick log endpoint
  app.post('/api/dashboard/quick-log', requireAuth, async (req: any, res: any) => {
    try {
      const userId = req.userId;
      const { type, content, entryMethod } = req.body;

      if (!type || !content || !entryMethod) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Calculate XP based on type and content
      let xpAwarded = 10; // Base XP
      if (type === 'food') xpAwarded = 15;
      if (type === 'activity') xpAwarded = 20;

      // Get user's current goal for context
      const user = await storage.getUser(userId);
      const goalContext = user?.goal;

      // Create log entry
      const logEntry = await storage.createLog({
        userId,
        type: type as 'food' | 'activity',
        entryMethod: entryMethod as 'emoji' | 'text' | 'photo',
        content: typeof content === 'string' ? { description: content } : content,
        goalContext,
        xpAwarded
      });

      // Update user XP
      if (user) {
        await storage.updateUser(userId, {
          totalXp: (user.totalXp || 0) + xpAwarded
        });
      }

      // Update streak if it's a new day
      const today = new Date().toISOString().split('T')[0];
      const streakData = await storage.getUserStreak(userId);
      
      if (!streakData || streakData.lastActive !== today) {
        const newCurrent = streakData ? streakData.current + 1 : 1;
        const newLongest = Math.max(newCurrent, streakData?.longest || 0);
        
        await storage.updateStreak(userId, { current: newCurrent, longest: newLongest, lastActive: new Date() });
      }

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

  // Complete journey task
  app.post('/api/dashboard/complete-task', requireAuth, async (req: any, res: any) => {
    try {
      const userId = req.userId;
      const { taskId, xpReward } = req.body;

      if (!taskId || !xpReward) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Get user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user XP
      await storage.updateUser(userId, {
        totalXp: (user.totalXp || 0) + xpReward
      });

      // Create XP event for tracking
      // Note: This would be implemented once xp_events storage methods are added

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