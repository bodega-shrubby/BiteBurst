/**
 * Development testing utilities for streak system
 * Only available in development mode
 */

import type { Express } from "express";
import { storage } from "../storage";
import { updateStreak, getCurrentTime } from "../utils/streakTracker";
import { supabaseAdmin } from "../lib/supabase";

export function registerDevRoutes(app: Express) {
  // Only register dev routes in development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // Test endpoint to manually set user's lastLogAt for testing
  app.post('/api/dev/set-last-log', async (req: any, res) => {
    try {
      const { userId, lastLogAt } = req.body;
      
      if (!userId || !lastLogAt) {
        return res.status(400).json({ error: 'userId and lastLogAt required' });
      }

      // Update user's lastLogAt
      await storage.updateUser(userId, {
        lastLogAt: new Date(lastLogAt)
      });

      res.json({ 
        success: true, 
        message: `Set lastLogAt to ${lastLogAt} for user ${userId}` 
      });
    } catch (error) {
      console.error('Dev set-last-log error:', error);
      res.status(500).json({ error: 'Failed to set lastLogAt' });
    }
  });

  // Test endpoint to simulate streak scenarios
  app.post('/api/dev/test-streak', async (req: any, res) => {
    try {
      const { userId, scenario } = req.body;
      
      if (!userId || !scenario) {
        return res.status(400).json({ error: 'userId and scenario required' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const now = getCurrentTime();
      let lastLogAt: Date | null = null;
      let currentStreak = user.streak || 0;

      // Define test scenarios
      switch (scenario) {
        case 'same_day':
          // Same day - no streak change
          lastLogAt = new Date(now.getTime()); // Same time
          break;
          
        case 'next_day':
          // Next day - streak should increment
          lastLogAt = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday
          break;
          
        case 'gap_2_days':
          // 2 day gap - streak should reset
          lastLogAt = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
          break;
          
        case 'milestone_2_days':
          // Set up for 3-day milestone
          currentStreak = 2;
          lastLogAt = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday
          break;
          
        case 'milestone_6_days':
          // Set up for 7-day milestone
          currentStreak = 6;
          lastLogAt = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday
          break;
          
        case 'first_log':
          // First log ever
          lastLogAt = null;
          currentStreak = 0;
          break;
          
        default:
          return res.status(400).json({ error: 'Invalid scenario. Use: same_day, next_day, gap_2_days, milestone_2_days, milestone_6_days, first_log' });
      }

      // Update user with test data
      await storage.updateUser(userId, {
        streak: currentStreak,
        lastLogAt
      });

      // Test the streak logic
      const streakResult = updateStreak(
        userId,
        currentStreak,
        currentStreak, // Using current as longest for simplicity
        lastLogAt,
        now,
        user.tz
      );

      res.json({
        scenario,
        testData: {
          currentStreak,
          lastLogAt: lastLogAt?.toISOString() || null,
          now: now.toISOString(),
          timezone: user.tz || 'UTC'
        },
        result: streakResult
      });

    } catch (error) {
      console.error('Dev test-streak error:', error);
      res.status(500).json({ error: 'Failed to test streak' });
    }
  });

  // Get current time (respects NOW_OVERRIDE)
  app.get('/api/dev/current-time', (req: any, res) => {
    const now = getCurrentTime();
    res.json({
      current_time: now.toISOString(),
      override: process.env.NOW_OVERRIDE || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  });

  // Clear localStorage guard (for testing pill display)
  app.post('/api/dev/clear-pill-guard', (req: any, res) => {
    res.json({
      success: true,
      message: 'Clear localStorage.removeItem("streakShownOn") on the frontend to test pill display again'
    });
  });

  // Delete orphaned Supabase user by email (for cleanup after failed signup)
  app.post('/api/dev/delete-supabase-user', async (req: any, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'email required' });
      }

      // List users and find by email
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        return res.status(500).json({ error: 'Failed to list users', details: listError.message });
      }

      const user = users.users.find(u => u.email === email);
      if (!user) {
        return res.status(404).json({ error: `No Supabase user found with email: ${email}` });
      }

      // Delete the user
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      if (deleteError) {
        return res.status(500).json({ error: 'Failed to delete user', details: deleteError.message });
      }

      res.json({ 
        success: true, 
        message: `Deleted Supabase user: ${email}`,
        userId: user.id
      });
    } catch (error) {
      console.error('Dev delete-supabase-user error:', error);
      res.status(500).json({ error: 'Failed to delete Supabase user' });
    }
  });

  console.log('🛠️  Development streak testing routes registered:');
  console.log('   POST /api/dev/set-last-log - Set user lastLogAt manually');
  console.log('   POST /api/dev/test-streak - Test streak scenarios');
  console.log('   GET /api/dev/current-time - Check current time (with override)');
  console.log('   POST /api/dev/clear-pill-guard - Instructions for clearing pill guard');
  console.log('   💡 Set NOW_OVERRIDE=YYYY-MM-DDTHH:mm:ssZ to override current time');
}