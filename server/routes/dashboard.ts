import type { Express } from "express";
import { storage } from "../storage";

export function registerDashboardRoutes(app: Express, requireAuth: any) {
  // Get dashboard data
  app.get('/api/dashboard', requireAuth, async (req: any, res: any) => {
    try {
      const userId = req.userId;
      
      // Get user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get streak data
      const streakData = await storage.getUserStreak(userId) || {
        current: 0,
        longest: 0,
        lastActive: null
      };

      // Get today's logs to calculate XP
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = await storage.getUserLogs(userId, 50); // Get recent logs
      const todayLogsFiltered = todayLogs.filter(log => 
        log.ts && log.ts.toISOString().split('T')[0] === today
      );
      
      const todayXp = todayLogsFiltered.reduce((sum, log) => sum + (log.xpAwarded || 0), 0);

      // Get user badges
      const badges = await storage.getUserBadges(userId);

      // Daily XP goal based on user goal
      const dailyGoalMap = {
        energy: 100,
        focus: 80,
        strength: 120
      };
      const dailyGoal = dailyGoalMap[user.goal] || 100;

      const dashboardData = {
        user: {
          id: user.id,
          displayName: user.displayName,
          goal: user.goal,
          xp: user.totalXp,
          streak: user.streak,
          avatarId: user.avatarId
        },
        todayXp,
        dailyGoal,
        streakData: {
          current: streakData.current,
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