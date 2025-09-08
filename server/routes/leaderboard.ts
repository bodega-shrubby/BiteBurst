/**
 * Leaderboard API Routes
 * Handles league data, user rankings, and opt-out preferences
 */

import type { Express } from "express";
import { buildLeaderboard, updateOptOut } from "../lib/leaderboard";
import { z } from "zod";

const optOutSchema = z.object({
  opt_out: z.boolean(),
});

export function registerLeaderboardRoutes(app: Express, requireAuth: any) {
  // GET /api/leaderboard/league - Get league data and rankings
  app.get('/api/leaderboard/league', requireAuth, async (req: any, res) => {
    try {
      console.log('🏆 LEADERBOARD ROUTE - req.user:', JSON.stringify(req.user, null, 2));
      const userId = req.user.userId;
      console.log('🏆 LEADERBOARD ROUTE - extracted userId:', userId);
      const tier = req.query.tier as string; // Optional tier override
      
      const leaderboardData = await buildLeaderboard(userId, tier);
      res.json(leaderboardData);
      
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
  });

  // POST /api/leaderboard/opt-in - Update user's leaderboard preference
  app.post('/api/leaderboard/opt-in', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.userId;
      const validatedData = optOutSchema.parse(req.body);
      
      await updateOptOut(userId, validatedData.opt_out);
      
      res.json({ 
        success: true, 
        opt_out: validatedData.opt_out 
      });
      
    } catch (error) {
      console.error('Error updating opt-out preference:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to update preference' });
      }
    }
  });

  // GET /api/leaderboard/my-history - Get user's league history (future feature)
  app.get('/api/leaderboard/my-history', requireAuth, async (req: any, res) => {
    try {
      // For MVP, return empty history
      res.json({
        weeks: []
      });
      
    } catch (error) {
      console.error('Error fetching leaderboard history:', error);
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  });
}