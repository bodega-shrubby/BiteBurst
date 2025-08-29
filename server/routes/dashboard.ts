import type { Express } from "express";
import { keyValueStorage } from "../storage/keyValueStorage";

/**
 * Dashboard API routes for BiteBurst app
 * Provides aggregated data for the main dashboard view
 */
export function registerDashboardRoutes(app: Express) {
  
  // Get complete dashboard data for a user
  app.get('/api/dashboard/:uid', async (req, res) => {
    try {
      const { uid } = req.params;
      
      // Fetch all user data in parallel
      const [user, stats, streak, badges] = await Promise.all([
        keyValueStorage.getUser(uid),
        keyValueStorage.getUserStatsData(uid),
        keyValueStorage.getUserStreakData(uid),
        keyValueStorage.getUserBadgesData(uid)
      ]);
      
      // Get today's logs separately to handle errors gracefully
      let todayLogs = [];
      try {
        todayLogs = await keyValueStorage.getUserDayLogs(uid) || [];
      } catch (error) {
        console.log('No logs found for today, using empty array');
        todayLogs = [];
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        user: {
          uid: user.replitId,
          displayName: user.displayName,
          ageBracket: user.ageBracket,
          goal: user.goal,
          avatar: user.avatar,
          xp: user.xp,
          streak: user.streak,
          badges: user.badges
        },
        stats: stats || { uid, xp: 0, streak: 0, lastLogDate: '', dailyTotals: {}, updatedAt: Date.now() },
        streak: streak || { uid, current: 0, longest: 0, lastActiveDate: '', updatedAt: Date.now() },
        badges: badges || { uid, earned: [] },
        todayLogs: Array.isArray(todayLogs) ? todayLogs : [],
        summary: {
          totalXP: stats?.xp || 0,
          currentStreak: streak?.current || 0,
          longestStreak: streak?.longest || 0,
          totalBadges: badges?.earned.length || 0,
          todayEntries: Array.isArray(todayLogs) ? todayLogs.length : 0,
          todayXP: Array.isArray(todayLogs) ? todayLogs.reduce((sum, log) => sum + (log.xpAwarded || 0), 0) : 0
        }
      });
      
    } catch (error) {
      console.error('Dashboard data error:', error);
      res.status(500).json({ error: 'Failed to load dashboard data' });
    }
  });
  
  // Get user's recent activity (last 7 days)
  app.get('/api/dashboard/:uid/recent', async (req, res) => {
    try {
      const { uid } = req.params;
      const days = parseInt(req.query.days as string) || 7;
      
      const recentLogs = [];
      const today = new Date();
      
      // Fetch logs for the last N days
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayLogs = await keyValueStorage.getUserDayLogs(uid, dateStr);
        if (dayLogs.length > 0) {
          recentLogs.push({
            date: dateStr,
            logs: dayLogs,
            totalXP: dayLogs.reduce((sum, log) => sum + log.xpAwarded, 0),
            entryCount: dayLogs.length
          });
        }
      }
      
      res.json({ recentActivity: recentLogs });
      
    } catch (error) {
      console.error('Recent activity error:', error);
      res.status(500).json({ error: 'Failed to load recent activity' });
    }
  });
  
  // Get leaderboard data (top users by XP)
  app.get('/api/dashboard/leaderboard', async (req, res) => {
    try {
      // Note: This is a simplified implementation
      // In a real app, you'd maintain a separate leaderboard structure
      // For now, return mock data to demonstrate the API structure
      
      const leaderboard = [
        { uid: 'demo-user-1', displayName: 'Alex', xp: 250, streak: 5, avatar: 'kid-01' },
        { uid: 'demo-user-2', displayName: 'Sam', xp: 180, streak: 3, avatar: 'kid-02' },
        { uid: 'demo-user-3', displayName: 'Jordan', xp: 150, streak: 7, avatar: 'mascot-01' }
      ];
      
      res.json({ leaderboard });
      
    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ error: 'Failed to load leaderboard' });
    }
  });
  
  // Quick stats endpoint for navigation/header
  app.get('/api/dashboard/:uid/quick-stats', async (req, res) => {
    try {
      const { uid } = req.params;
      
      const [user, stats, streak] = await Promise.all([
        keyValueStorage.getUser(uid),
        keyValueStorage.getUserStatsData(uid),
        keyValueStorage.getUserStreakData(uid)
      ]);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        displayName: user.displayName,
        avatar: user.avatar,
        xp: stats?.xp || 0,
        streak: streak?.current || 0,
        goal: user.goal
      });
      
    } catch (error) {
      console.error('Quick stats error:', error);
      res.status(500).json({ error: 'Failed to load quick stats' });
    }
  });
}