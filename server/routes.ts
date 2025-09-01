import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerDashboardRoutes } from "./routes/dashboard";
import { registerLogRoutes } from "./routes/logs";
import { registerAIRoutes } from "./routes/ai";
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
      const { username, email, password, name, ageBracket, goal, avatar, onboardingCompleted } = req.body;
      
      // Create BiteBurst profile with new schema
      const userData = {
        displayName: name,
        ageBracket: ageBracket as '6-8' | '9-11' | '12-14',
        goal: goal as 'energy' | 'focus' | 'strength',
        avatarId: avatar,
        email,
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
          xp: user.xp,
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
        xp: user.xp,
        streak: user.streak
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user data" });
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

  // Register routes
  registerDashboardRoutes(app, requireAuth);
  registerLogRoutes(app, requireAuth);
  registerAIRoutes(app, requireAuth);

  const httpServer = createServer(app);
  return httpServer;
}
