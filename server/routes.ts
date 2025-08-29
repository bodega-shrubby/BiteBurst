import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerKeyValueRoutes } from "./routes/keyValue";
import { registerDashboardRoutes } from "./routes/dashboard";
// Replit Auth completely removed

export async function registerRoutes(app: Express): Promise<Server> {
  // No authentication system active
  
  // Register Key-Value database routes
  registerKeyValueRoutes(app);
  
  // Register dashboard routes
  registerDashboardRoutes(app);

  // BiteBurst profile creation endpoint (for onboarding) - Updated for Key-Value DB
  app.post("/api/profile/create", async (req: any, res) => {
    try {
      const { username, email, password, name, ageBracket, goal, avatar, onboardingCompleted } = req.body;
      
      console.log("Creating BiteBurst profile for:", username);
      
      // Generate unique user ID
      const uid = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Save onboarding data first
      await storage.saveOnboardingData(uid, {
        displayName: name,
        ageBracket,
        goal,
        avatar: avatar || 'mascot-01',
        email,
        parentConsent: true
      });
      
      // Complete onboarding to create user
      const user = await storage.completeOnboarding(uid);
      
      console.log("BiteBurst profile created for user:", user.replitId);
      
      res.json({ 
        success: true, 
        message: "Profile created successfully",
        user: {
          uid: user.replitId,
          displayName: user.displayName,
          email: user.email,
          ageBracket: user.ageBracket,
          goal: user.goal,
          avatar: user.avatar
        }
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
