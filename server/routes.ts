import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Replit Auth completely removed

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple session middleware (in-memory for development)
  const sessions = new Map<string, { userId: number; username: string; createdAt: Date }>();
  
  // Session middleware
  app.use((req: any, res, next) => {
    const sessionId = req.headers['x-session-id'];
    if (sessionId && sessions.has(sessionId)) {
      const session = sessions.get(sessionId);
      if (session && Date.now() - session.createdAt.getTime() < 24 * 60 * 60 * 1000) { // 24 hours
        req.user = session;
      } else {
        sessions.delete(sessionId);
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
      
      // Create BiteBurst profile
      const userData = {
        username,
        password, // In production, this should be hashed
        name,
        displayName: name,
        ageBracket,
        age: parseInt(ageBracket.split('-')[0]) || 10,
        goal,
        avatar,
        email,
        onboardingCompleted: onboardingCompleted ? 1 : 0
      };
      
      console.log("Creating BiteBurst profile for:", username);
      
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
          username: newUser.username,
          email: newUser.email,
          displayName: newUser.displayName
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
      
      // Find user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        console.log("User not found:", username);
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      
      // Simple password check (in production, use proper hashing)
      if (user.password !== password) {
        console.log("Invalid password for:", username);
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      
      // Check if onboarding is completed
      if (!user.onboardingCompleted) {
        console.log("Onboarding not completed for:", username);
        return res.status(403).json({ 
          error: 'Please complete onboarding first',
          onboardingRequired: true 
        });
      }
      
      // Create session
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessions.set(sessionId, {
        userId: user.id,
        username: user.username!,
        createdAt: new Date()
      });
      
      console.log("Login successful for user:", user.id);
      
      res.json({
        success: true,
        sessionId,
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          email: user.email,
          ageBracket: user.ageBracket,
          goal: user.goal,
          avatar: user.avatar,
          xp: user.xp,
          streak: user.streak,
          badges: user.badges
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
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        ageBracket: user.ageBracket,
        goal: user.goal,
        avatar: user.avatar,
        xp: user.xp,
        streak: user.streak,
        badges: user.badges
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
