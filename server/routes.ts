import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerKeyValueRoutes } from "./routes/keyValue";
// Replit Auth completely removed

export async function registerRoutes(app: Express): Promise<Server> {
  // No authentication system active
  
  // Register Key-Value database routes
  registerKeyValueRoutes(app);

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
        message: "Profile created successfully"
      });
    } catch (error) {
      console.error("Profile creation error:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // No protected routes - auth removed

  const httpServer = createServer(app);
  return httpServer;
}
