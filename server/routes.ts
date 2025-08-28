import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // User registration endpoint with Replit Auth integration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, name, ageBracket, goal, avatar, onboardingCompleted } = req.body;
      
      // For MVP, create a basic user record using the existing storage interface
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

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
