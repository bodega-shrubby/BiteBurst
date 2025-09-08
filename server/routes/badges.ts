/**
 * Badge API Routes - Catalog and user badge endpoints
 */

import type { Express } from "express";
import { getAllBadges, getUserBadgesWithProgress, buildBadgeContext, evaluateBadges } from "../lib/badges";

export function registerBadgeRoutes(app: Express, requireAuth: any) {
  // GET /api/badges - Get all badge catalog items (for showing locked badges)
  app.get('/api/badges', async (req, res) => {
    try {
      const allBadges = await getAllBadges();
      res.json(allBadges);
    } catch (error) {
      console.error('Error fetching badge catalog:', error);
      res.status(500).json({ error: 'Failed to fetch badge catalog' });
    }
  });

  // GET /api/user/:id/badges - Get user's earned badges and progress
  app.get('/api/user/:id/badges', requireAuth, async (req: any, res) => {
    try {
      const userId = req.params.id;
      
      // Debug: log the req.user object to see what properties are available
      console.log('DEBUG - req.user object:', JSON.stringify(req.user, null, 2));
      console.log('DEBUG - userId from params:', userId);
      
      // Try different possible user ID properties
      const userIdFromAuth = req.user.id || req.user.userId || req.user.sessionData?.userId;
      console.log('DEBUG - userIdFromAuth:', userIdFromAuth);
      
      // Only allow users to access their own badges
      if (userIdFromAuth !== userId) {
        return res.status(403).json({ 
          error: 'Cannot access other user data',
          debug: { userIdFromAuth, userId }
        });
      }
      
      const badgeData = await getUserBadgesWithProgress(userId);
      res.json(badgeData);
      
    } catch (error) {
      console.error('Error fetching user badges:', error);
      res.status(500).json({ error: 'Failed to fetch user badges' });
    }
  });

  // POST /api/user/:id/badges/evaluate - Manually trigger badge evaluation (for testing)
  app.post('/api/user/:id/badges/evaluate', requireAuth, async (req: any, res) => {
    try {
      const userId = req.params.id;
      
      // Only allow users to evaluate their own badges (fix: use req.user.id instead of userId)
      if (req.user.id !== userId) {
        return res.status(403).json({ error: 'Cannot access other user data' });
      }
      
      // Build context and evaluate badges
      const context = await buildBadgeContext(userId);
      const newBadges = await evaluateBadges(context);
      
      res.json({
        newlyEarned: newBadges,
        context: {
          streakDays: context.streakDays,
          totals: context.totals
        }
      });
      
    } catch (error) {
      console.error('Error evaluating badges:', error);
      res.status(500).json({ error: 'Failed to evaluate badges' });
    }
  });
}