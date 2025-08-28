import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = parseInt(req.user.claims.sub);
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User registration endpoint for onboarding (creates BiteBurst profile)
  app.post("/api/auth/register", async (req, res) => {
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

  // Protected route example
  app.get("/api/protected", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    // Do something with the user id.
    res.json({ message: "This is a protected route", userId });
  });

  const httpServer = createServer(app);
  return httpServer;
}
