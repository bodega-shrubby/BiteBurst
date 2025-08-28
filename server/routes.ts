import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple session middleware for MVP
  app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  // Auth routes for BiteBurst
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (req.session.userId) {
        const user = await storage.getUser(req.session.userId);
        res.json(user);
      } else {
        res.status(401).json({ message: "Not authenticated" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User registration endpoint for onboarding (creates BiteBurst profile)
  app.post("/api/auth/register", async (req: any, res) => {
    try {
      const { username, email, password, name, ageBracket, goal, avatar, onboardingCompleted } = req.body;
      
      // Create BiteBurst user profile
      const userData = {
        username,
        password, // In production, this should be hashed
        name,
        age: parseInt(ageBracket.split('-')[0]) || 10, // Extract first age from range
        goal,
        displayName: name,
        ageBracket,
        avatar,
        email,
        onboardingCompleted: onboardingCompleted || false
      };
      
      console.log("User registration:", { username, email, ageBracket, goal, avatar });
      
      // Create user using storage interface
      const newUser = await storage.createUser(userData);
      
      // Set up session
      req.session.userId = newUser.id;
      req.session.username = newUser.username;
      
      res.json({ 
        success: true, 
        message: "Account created successfully",
        user: { id: newUser.id, username: newUser.username, name: newUser.name }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req: any, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set up session
      req.session.userId = user.id;
      req.session.username = user.username;
      
      res.json({ 
        success: true, 
        message: "Logged in successfully",
        user: { id: user.id, username: user.username, name: user.name }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to log in" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", async (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log out" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  // Protected route example
  app.get("/api/protected", async (req: any, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: "This is a protected route", userId: req.session.userId });
  });

  const httpServer = createServer(app);
  return httpServer;
}
