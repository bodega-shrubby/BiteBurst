import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerDashboardRoutes } from "./routes/dashboard";
import { registerLogRoutes } from "./routes/logs";
import { registerAIRoutes } from "./routes/ai";
import { registerDevRoutes } from "./routes/dev";
import { registerDailySummaryRoutes } from "./routes/dailySummary";
import { registerDailySummaryV2Routes } from "./routes/dailySummaryV2";
import { registerBadgeRoutes } from "./routes/badges";
import { registerLeaderboardRoutes } from "./routes/leaderboard";
import { updateStreak, getCurrentTime } from "./utils/streakTracker";
// Replit Auth completely removed

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple session middleware (in-memory for development)
  const sessions = new Map<string, { userId: string; displayName: string; createdAt: Date }>();
  
  // Session middleware
  app.use((req: any, res, next) => {
    const sessionId = req.headers['x-session-id'];
    if (sessionId && sessions.has(sessionId as string)) {
      const session = sessions.get(sessionId as string);
      if (session && Date.now() - session.createdAt.getTime() < 24 * 60 * 60 * 1000) { // 24 hours
        req.user = session;
      } else {
        sessions.delete(sessionId as string);
      }
    }
    next();
  });

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  };

  // BiteBurst profile creation endpoint (for onboarding)
  app.post("/api/profile/create", async (req: any, res) => {
    try {
      const { username, email, password, name, ageBracket, goal, avatar, timezone, onboardingCompleted } = req.body;
      
      // Create BiteBurst profile with new schema
      const userData = {
        displayName: name,
        ageBracket: ageBracket as '6-8' | '9-11' | '12-14',
        goal: goal as 'energy' | 'focus' | 'strength',
        avatarId: avatar,
        email,
        tz: timezone, // Store user timezone for streak calculations
        parentConsent: true, // Default for onboarding
      };
      
      console.log("Creating BiteBurst profile for:", name);
      
      // Check if user already exists by email
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        console.log("User already exists, returning success");
        return res.json({ 
          success: true, 
          message: "Profile already exists"
        });
      }
      
      // Create user using storage interface
      const newUser = await storage.createUser(userData);
      
      console.log("BiteBurst profile created for user:", newUser.id);
      
      res.json({ 
        success: true, 
        message: "Profile created successfully",
        user: {
          id: newUser.id,
          displayName: newUser.displayName,
          email: newUser.email,
          ageBracket: newUser.ageBracket,
          goal: newUser.goal,
          avatarId: newUser.avatarId
        }
      });
    } catch (error) {
      console.error("Profile creation error:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req: any, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }
      
      console.log("Login attempt for:", username);
      
      // Find user by display name (treating it as username)
      const user = await storage.getUserByDisplayName(username);
      if (!user) {
        console.log("User not found:", username);
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      
      // For now, accept any password (development only)
      // TODO: Add proper password field and hashing
      
      // Create session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessions.set(sessionId, {
        userId: user.id,
        displayName: user.displayName,
        createdAt: new Date()
      });
      
      console.log("Login successful for user:", user.id);
      
      res.json({
        success: true,
        sessionId,
        user: {
          id: user.id,
          displayName: user.displayName,
          email: user.email,
          ageBracket: user.ageBracket,
          goal: user.goal,
          avatarId: user.avatarId,
          totalXp: user.totalXp || 0,
          level: user.level || 1,
          streak: user.streak
        }
      });
      
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: any, res) => {
    const sessionId = req.headers['x-session-id'];
    if (sessionId && sessions.has(sessionId)) {
      sessions.delete(sessionId);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        ageBracket: user.ageBracket,
        goal: user.goal,
        avatarId: user.avatarId,
        totalXp: user.totalXp || 0,
        level: user.level || 1,
        streak: user.streak
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  // XP update endpoint
  app.post("/api/user/:id/xp", requireAuth, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const { delta_xp, reason } = req.body;
      
      // Validate request
      if (!delta_xp || typeof delta_xp !== 'number') {
        return res.status(400).json({ error: 'delta_xp is required and must be a number' });
      }
      
      // Only allow users to update their own XP
      if (req.user.userId !== userId) {
        return res.status(403).json({ error: 'Cannot update XP for other users' });
      }
      
      // Get current user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Calculate new totals
      const newTotalXp = Math.max(0, (user.totalXp || 0) + delta_xp);
      
      // Calculate new level using the same curve as frontend (100 + L * 25)
      let newLevel = 1;
      let remaining = newTotalXp;
      while (remaining >= (100 + (newLevel - 1) * 25)) {
        remaining -= (100 + (newLevel - 1) * 25);
        newLevel++;
      }
      
      // Update streak using timezone-aware utility
      const now = getCurrentTime();
      const streakResult = updateStreak(
        userId,
        user.streak || 0,
        user.streak || 0, // Using current streak as longest for simplicity, could add separate field
        user.lastLogAt,
        now,
        user.tz
      );
      
      // Check for level-based badge eligibility
      let badge = undefined;
      if (newLevel > (user.level || 1)) {
        badge = `level_${newLevel}`;
      } else if (streakResult.badge_awarded) {
        // Use milestone streak badge from utility
        badge = streakResult.badge_awarded.code;
      }
      
      // Update user in database
      await storage.updateUserXP(userId, {
        totalXp: newTotalXp,
        level: newLevel,
        streak: streakResult.streak_days,
        lastLogAt: now
      });
      
      // Log XP event for audit trail
      await storage.logXPEvent({
        userId,
        amount: delta_xp,
        reason: reason || 'unknown'
      });
      
      res.json({
        total_xp: newTotalXp,
        level: newLevel,
        streak_days: streakResult.streak_days,
        streak_changed: streakResult.streak_changed,
        longest_streak: streakResult.longest_streak,
        badge_awarded: streakResult.badge_awarded,
        badge // Keep legacy badge for level-ups
      });
      
    } catch (error) {
      console.error("XP update error:", error);
      res.status(500).json({ error: "Failed to update XP" });
    }
  });

  // Get avatars
  app.get('/api/avatars', async (req: any, res: any) => {
    try {
      const avatars = await storage.getAvatars();
      res.json(avatars);
    } catch (error) {
      console.error('Error getting avatars:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Get goals
  app.get('/api/goals', async (req: any, res: any) => {
    try {
      const goals = await storage.getGoals();
      res.json(goals);
    } catch (error) {
      console.error('Error getting goals:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Get user streak data
  app.get('/api/user/:id/streak', requireAuth, async (req: any, res: any) => {
    try {
      const userId = req.params.id;
      
      // Only allow users to access their own streak data
      if (req.user.userId !== userId) {
        return res.status(403).json({ error: 'Cannot access other user data' });
      }
      
      const streakData = await storage.getUserStreak(userId);
      if (!streakData) {
        // Return default streak data if none exists
        return res.json({
          current: 0,
          longest: 0,
          lastActive: null
        });
      }
      
      res.json({
        current: streakData.current,
        longest: streakData.longest,
        lastActive: streakData.lastActive
      });
    } catch (error) {
      console.error('Error getting streak data:', error);
      res.status(500).json({ error: 'Failed to get streak data' });
    }
  });

  // Register routes
  registerDashboardRoutes(app, requireAuth);
  registerLogRoutes(app, requireAuth);
  registerAIRoutes(app, requireAuth);
  registerDailySummaryRoutes(app, requireAuth);
  registerDailySummaryV2Routes(app, requireAuth);
  registerBadgeRoutes(app, requireAuth);
  registerLeaderboardRoutes(app, requireAuth);
  registerDevRoutes(app); // Development testing routes

  const httpServer = createServer(app);
  return httpServer;
}
