import type { Express } from "express";
import { keyValueStorage } from "../storage/keyValueStorage";
import { z } from "zod";

// Validation schemas
const onboardingAnswersSchema = z.object({
  displayName: z.string().min(2).max(20).optional(),
  ageBracket: z.enum(["6-8", "9-11", "12-14"]).optional(),
  goal: z.enum(["energy", "focus", "strength"]).optional(),
  avatar: z.string().optional(),
  email: z.string().email().optional(),
  parentConsent: z.boolean().optional()
});

const logContentSchema = z.object({
  emoji: z.array(z.string()).optional(),
  text: z.string().optional(),
  photoB64: z.string().optional()
});

const logSchema = z.object({
  type: z.enum(["food", "activity"]),
  entryMethod: z.enum(["emoji", "text", "photo"]),
  content: logContentSchema,
  goalContext: z.enum(["energy", "focus", "strength"]),
  aiFeedback: z.string().optional(),
  xpAwarded: z.number().default(5),
  meta: z.record(z.unknown()).optional()
});

export function registerKeyValueRoutes(app: Express) {
  
  // Onboarding Routes
  app.post('/api/kv/onboarding/:uid', async (req, res) => {
    try {
      const { uid } = req.params;
      const { answers, step } = req.body;
      
      const validatedAnswers = onboardingAnswersSchema.parse(answers);
      await keyValueStorage.saveOnboardingData(uid, validatedAnswers, step);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Onboarding save error:', error);
      res.status(400).json({ error: 'Invalid onboarding data' });
    }
  });

  app.get('/api/kv/onboarding/:uid', async (req, res) => {
    try {
      const { uid } = req.params;
      const onboarding = await keyValueStorage.getOnboardingData(uid);
      res.json(onboarding);
    } catch (error) {
      console.error('Onboarding get error:', error);
      res.status(500).json({ error: 'Failed to get onboarding data' });
    }
  });

  app.post('/api/kv/onboarding/:uid/complete', async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await keyValueStorage.completeOnboarding(uid);
      res.json({ success: true, user });
    } catch (error) {
      console.error('Onboarding complete error:', error);
      res.status(400).json({ error: 'Failed to complete onboarding' });
    }
  });

  // User Routes
  app.get('/api/kv/user/:uid', async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await keyValueStorage.getUser(uid);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });

  app.get('/api/kv/user/email/:email', async (req, res) => {
    try {
      const { email } = req.params;
      const user = await keyValueStorage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Get user by email error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });

  // Stats Routes
  app.get('/api/kv/user/:uid/stats', async (req, res) => {
    try {
      const { uid } = req.params;
      const stats = await keyValueStorage.getUserStatsData(uid);
      
      if (!stats) {
        return res.status(404).json({ error: 'User stats not found' });
      }
      
      res.json(stats);
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({ error: 'Failed to get user stats' });
    }
  });

  app.get('/api/kv/user/:uid/streak', async (req, res) => {
    try {
      const { uid } = req.params;
      const streak = await keyValueStorage.getUserStreakData(uid);
      
      if (!streak) {
        return res.status(404).json({ error: 'User streak not found' });
      }
      
      res.json(streak);
    } catch (error) {
      console.error('Get user streak error:', error);
      res.status(500).json({ error: 'Failed to get user streak' });
    }
  });

  app.get('/api/kv/user/:uid/badges', async (req, res) => {
    try {
      const { uid } = req.params;
      const badges = await keyValueStorage.getUserBadgesData(uid);
      
      if (!badges) {
        return res.status(404).json({ error: 'User badges not found' });
      }
      
      res.json(badges);
    } catch (error) {
      console.error('Get user badges error:', error);
      res.status(500).json({ error: 'Failed to get user badges' });
    }
  });

  // Log Routes
  app.post('/api/kv/user/:uid/logs', async (req, res) => {
    try {
      const { uid } = req.params;
      const logData = logSchema.parse(req.body);
      
      const log = await keyValueStorage.addUserLog(uid, logData);
      res.json({ success: true, log });
    } catch (error) {
      console.error('Add log error:', error);
      res.status(400).json({ error: 'Failed to add log' });
    }
  });

  app.get('/api/kv/user/:uid/logs', async (req, res) => {
    try {
      const { uid } = req.params;
      const { date } = req.query;
      
      const logs = await keyValueStorage.getUserDayLogs(uid, date as string);
      res.json(logs);
    } catch (error) {
      console.error('Get logs error:', error);
      res.status(500).json({ error: 'Failed to get logs' });
    }
  });

  // Catalog Routes
  app.get('/api/kv/avatars', async (req, res) => {
    try {
      const avatars = await keyValueStorage.getAvatars();
      res.json(avatars);
    } catch (error) {
      console.error('Get avatars error:', error);
      res.status(500).json({ error: 'Failed to get avatars' });
    }
  });

  app.get('/api/kv/goals', async (req, res) => {
    try {
      const goals = await keyValueStorage.getGoals();
      res.json(goals);
    } catch (error) {
      console.error('Get goals error:', error);
      res.status(500).json({ error: 'Failed to get goals' });
    }
  });

  // Test endpoint to verify Key-Value database connection
  app.get('/api/kv/test', async (req, res) => {
    try {
      const testUid = 'test-user-' + Date.now();
      
      // Test onboarding flow
      await keyValueStorage.saveOnboardingData(testUid, {
        displayName: 'Test User',
        ageBracket: '9-11',
        goal: 'energy',
        avatar: 'mascot-01',
        parentConsent: true
      });
      
      const onboarding = await keyValueStorage.getOnboardingData(testUid);
      console.log('Retrieved onboarding data:', JSON.stringify(onboarding, null, 2));
      
      const user = await keyValueStorage.completeOnboarding(testUid);
      
      // Test log creation
      const log = await keyValueStorage.addUserLog(testUid, {
        type: 'food',
        entryMethod: 'text',
        content: { text: 'Apple and peanut butter' },
        goalContext: 'energy',
        aiFeedback: 'Great energy boost!',
        xpAwarded: 10
      });
      
      res.json({
        success: true,
        message: 'Key-Value database test completed successfully',
        testData: {
          onboarding,
          user,
          log
        }
      });
    } catch (error) {
      console.error('KV test error:', error);
      res.status(500).json({ error: 'Key-Value database test failed', details: error.message });
    }
  });
}