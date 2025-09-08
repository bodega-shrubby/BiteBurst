import type { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { buildBadgeContext, evaluateBadges } from "../lib/badges";

const createLogSchema = z.object({
  userId: z.string(),
  type: z.enum(['food', 'activity']),
  entryMethod: z.enum(['emoji', 'text', 'photo']),
  content: z.any(), // JSON content
  timestamp: z.string().optional(),
  durationMin: z.number().optional(), // For activity logs
  mood: z.enum(['happy', 'ok', 'tired']).optional(), // For activity logs
});

export function registerLogRoutes(app: Express, requireAuth: any) {
  // Create a new log entry
  app.post('/api/logs', requireAuth, async (req: any, res: any) => {
    try {
      const validatedData = createLogSchema.parse(req.body);
      
      // Verify user matches authenticated user
      if (validatedData.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Calculate XP based on type and content
      let xpAwarded = 10; // Base XP
      if (validatedData.type === 'food') {
        xpAwarded = 15;
        // Bonus XP for healthier choices (detect fruits/vegetables in emojis)
        if (validatedData.entryMethod === 'emoji' && validatedData.content?.emojis) {
          const healthyEmojis = ['🍎', '🍌', '🍇', '🍓', '🍊', '🫐', '🍉', '🥦', '🥕', '🥒', '🍅', '🥬'];
          const healthyCount = validatedData.content.emojis.filter((emoji: string) => 
            healthyEmojis.includes(emoji)
          ).length;
          xpAwarded += healthyCount * 5; // +5 XP per healthy emoji
        }
      }
      
      if (validatedData.type === 'activity') {
        // Duration-based XP for activities
        const duration = validatedData.durationMin || 0;
        if (duration >= 60) {
          xpAwarded = 30;
        } else if (duration >= 30) {
          xpAwarded = 20;
        } else if (duration >= 15) {
          xpAwarded = 15;
        } else if (duration >= 5) {
          xpAwarded = 10;
        } else {
          xpAwarded = 10; // Default for activities without duration
        }
      }

      // Get user's current goal for context
      const user = await storage.getUser(validatedData.userId);
      const goalContext = user?.goal;

      // Create log entry
      const logEntry = await storage.createLog({
        userId: validatedData.userId,
        type: validatedData.type,
        entryMethod: validatedData.entryMethod,
        content: validatedData.content,
        goalContext,
        xpAwarded,
        durationMin: validatedData.durationMin,
        mood: validatedData.mood
      });

      // Note: XP and streak updates are now handled by the dedicated XP endpoint
      // called from the frontend after the log is created

      // Note: XP events could be tracked but not required for MVP

      // Evaluate badges after successful log creation
      let badgeAwarded = null;
      try {
        const badgeContext = await buildBadgeContext(validatedData.userId);
        const newBadges = await evaluateBadges(badgeContext);
        
        // Return first badge if any were awarded (UI will handle celebration)
        if (newBadges.length > 0) {
          badgeAwarded = {
            code: newBadges[0].code,
            name: newBadges[0].name,
            description: newBadges[0].description,
            category: newBadges[0].category,
            rarity: newBadges[0].rarity
          };
        }
      } catch (badgeError) {
        console.error('Badge evaluation error:', badgeError);
        // Don't fail the log creation if badge evaluation fails
      }

      res.json({
        id: logEntry.id,
        xpAwarded,
        feedback: null, // Will be populated by AI endpoint
        content: validatedData.content,
        entryMethod: validatedData.entryMethod,
        badge_awarded: badgeAwarded
      });

    } catch (error) {
      console.error('Create log error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create log entry' });
      }
    }
  });

  // Get user logs
  app.get('/api/logs', requireAuth, async (req: any, res: any) => {
    try {
      const userId = req.user.userId;
      const limit = parseInt(req.query.limit as string) || 50;
      
      const logs = await storage.getUserLogs(userId, limit);
      
      res.json(logs.map(log => ({
        id: log.id,
        type: log.type,
        entryMethod: log.entryMethod,
        content: log.content,
        xpAwarded: log.xpAwarded,
        aiFeedback: log.aiFeedback,
        ts: log.ts.toISOString()
      })));

    } catch (error) {
      console.error('Get logs error:', error);
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  });

  // Get specific log
  app.get('/api/logs/:id', requireAuth, async (req: any, res: any) => {
    try {
      const userId = req.user.userId;
      const logId = req.params.id;
      
      const logs = await storage.getUserLogs(userId, 1);
      const log = logs.find(l => l.id === logId);
      
      if (!log) {
        return res.status(404).json({ error: 'Log not found' });
      }
      
      if (log.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      res.json({
        id: log.id,
        type: log.type,
        entryMethod: log.entryMethod,
        content: log.content,
        xpAwarded: log.xpAwarded,
        aiFeedback: log.aiFeedback,
        ts: log.ts.toISOString()
      });

    } catch (error) {
      console.error('Get log error:', error);
      res.status(500).json({ error: 'Failed to fetch log' });
    }
  });
}