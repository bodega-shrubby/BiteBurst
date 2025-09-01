import type { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";

const createLogSchema = z.object({
  userId: z.string(),
  type: z.enum(['food', 'activity']),
  entryMethod: z.enum(['emoji', 'text', 'photo']),
  content: z.any(), // JSON content
  timestamp: z.string().optional(),
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
      if (validatedData.type === 'activity') xpAwarded = 20;

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
        xpAwarded
      });

      // Update user XP
      if (user) {
        await storage.updateUser(validatedData.userId, {
          xp: user.xp + xpAwarded
        });

        // Update streak if it's a new day
        const today = new Date().toISOString().split('T')[0];
        const existingStreak = await storage.getUserStreak(validatedData.userId);
        
        if (existingStreak) {
          const lastActiveDate = existingStreak.lastActive ? new Date(existingStreak.lastActive).toISOString().split('T')[0] : null;
          
          if (lastActiveDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            const newCurrent = lastActiveDate === yesterdayStr 
              ? existingStreak.current + 1 
              : 1;
            
            await storage.updateStreak(validatedData.userId, {
              current: newCurrent,
              longest: Math.max(existingStreak.longest, newCurrent),
              lastActive: new Date()
            });
          }
        } else {
          // Create initial streak
          await storage.updateStreak(validatedData.userId, {
            current: 1,
            longest: 1,
            lastActive: new Date()
          });
        }
      }

      // Note: XP events could be tracked but not required for MVP

      res.json({
        id: logEntry.id,
        xpAwarded,
        feedback: null, // Will be populated by AI endpoint
        content: validatedData.content,
        entryMethod: validatedData.entryMethod
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