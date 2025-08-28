import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // Profile creation endpoint for onboarding
  app.post("/api/profile/create", async (req, res) => {
    try {
      const { displayName, ageBracket, goal, avatar, email, onboardingCompleted } = req.body;
      
      // For MVP, just log the profile data
      const profileData = {
        displayName,
        ageBracket,
        goal,
        avatar,
        email,
        onboardingCompleted: onboardingCompleted || false
      };
      
      console.log("Profile created:", profileData);
      
      res.json({ success: true, message: "Profile created successfully" });
    } catch (error) {
      console.error("Profile creation error:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
