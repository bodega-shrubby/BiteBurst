import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Fresh Replit Auth setup
  await setupAuth(app);

  // Replit Auth user route
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // BiteBurst profile creation endpoint (for onboarding)
  app.post("/api/profile/create", async (req: any, res) => {
    try {
      const { username, email, password, name, ageBracket, goal, avatar, onboardingCompleted } = req.body;
      
      // Create BiteBurst profile (this happens before Replit Auth)
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
      
      // Create user using storage interface
      const newUser = await storage.createUser(userData);
      
      console.log("BiteBurst profile created for user:", newUser.id);
      
      res.json({ 
        success: true, 
        message: "Profile created successfully"
      });
    } catch (error) {
      console.error("Profile creation error:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // Protected route example
  app.get("/api/protected", isAuthenticated, async (req: any, res) => {
    const userId = req.user?.claims?.sub;
    res.json({ message: "This is a protected route", userId });
  });

  const httpServer = createServer(app);
  return httpServer;
}
