import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { registerDashboardRoutes } from "./routes/dashboard";
import { registerLogRoutes } from "./routes/logs";
import { registerAIRoutes } from "./routes/ai";
import { registerDevRoutes } from "./routes/dev";
import { registerDailySummaryRoutes } from "./routes/dailySummary";
import { registerDailySummaryV2Routes } from "./routes/dailySummaryV2";
import { registerBadgeRoutes } from "./routes/badges";
import { registerLeaderboardRoutes } from "./routes/leaderboard";
import { registerLessonRoutes } from "./routes/lessons";
import { registerTopicRoutes } from "./routes/topics";
import { registerSettingsRoutes } from "./routes/settings";
import { registerStripeRoutes } from "./routes/stripe";
import { updateStreak, getCurrentTime } from "./utils/streakTracker";
import { requireAuth } from "./middleware/auth";
import { supabaseAdmin } from "./lib/supabase";

export async function registerRoutes(app: Express): Promise<Server> {

  // Supabase Auth: Signup endpoint
  // Creates parent account + first child profile (new architecture)
  app.post("/api/auth/signup", async (req: any, res) => {
    try {
      const {
        parentEmail,
        password,
        parentConsent,
        childName,
        age,
        locale,
        goal,
        avatarId,
        timezone,
        favoriteFruits,
        favoriteVeggies,
        favoriteFoods,
        favoriteSports,
      } = req.body;

      // Validate required fields
      if (!parentEmail || !password || !childName || !age) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate age range
      if (age < 6 || age > 14) {
        return res.status(400).json({ error: 'Age must be between 6 and 14' });
      }

      if (!parentConsent) {
        return res.status(400).json({ error: 'Parent consent is required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      console.log("Signup attempt for parent:", parentEmail);

      // 1. Create parent account in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: parentEmail,
        password,
        email_confirm: true,
      });

      if (authError) {
        console.error("Supabase auth error:", authError.message);
        if (authError.message.includes('already registered')) {
          return res.status(409).json({ error: 'This email is already registered.' });
        }
        return res.status(400).json({ error: authError.message });
      }

      if (!authData.user) {
        return res.status(500).json({ error: 'Failed to create auth user' });
      }

      const parentAuthId = authData.user.id;

      // 2. Create parent record in users table (NO child data here)
      let parentUser;
      try {
        parentUser = await storage.createParentUser({
          parentAuthId,
          email: parentEmail,
          parentEmail,
          parentConsent: true,
          authProvider: 'supabase',
          subscriptionPlan: 'free',
          subscriptionChildrenLimit: 1,
        });
      } catch (parentError: any) {
        console.error("Parent user creation failed:", parentError);
        // Clean up the Supabase auth user
        try {
          await supabaseAdmin.auth.admin.deleteUser(parentAuthId);
          console.log("Cleaned up auth user after parent creation failure");
        } catch (cleanupError) {
          console.error("Cleanup failed:", cleanupError);
        }
        // Return appropriate error
        if (parentError.code === '23505') {
          return res.status(409).json({ error: 'This email is already registered.' });
        }
        throw parentError;
      }

      console.log("Parent user created:", parentUser.id);

      // 3. Create first child profile in children table
      const username = childName.toUpperCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);

      console.log("Creating child profile with:", {
        parentId: parentUser.id,
        name: childName,
        username,
        age,
        locale: locale || 'en-GB',
        goal: goal || null,
      });

      let childProfile;
      try {
        childProfile = await storage.createChildProfile({
          parentId: parentUser.id,
          name: childName,
          username,
          avatar: avatarId || '🧒',
          age,
          locale: locale || 'en-GB',
          goal: goal || null,
          favoriteFruits: favoriteFruits || [],
          favoriteVeggies: favoriteVeggies || [],
          favoriteFoods: favoriteFoods || [],
          favoriteSports: favoriteSports || [],
          tz: timezone || null,
        });
      } catch (childError) {
        console.error("Child profile creation failed:", childError);
        // Clean up: delete the parent user in database and auth user
        try {
          await db.delete(users).where(eq(users.id, parentUser.id));
          console.log("Cleaned up database parent user after child creation failure");
          await supabaseAdmin.auth.admin.deleteUser(parentAuthId);
          console.log("Cleaned up auth user after child creation failure");
        } catch (cleanupError) {
          console.error("Cleanup failed:", cleanupError);
        }
        throw childError;
      }

      console.log("Child profile created:", childProfile.id);

      // 4. Set this child as the active child
      await storage.setActiveChildId(parentUser.id, childProfile.id);

      // 5. Sign in to get session
      const { data: signInData } = await supabaseAdmin.auth.signInWithPassword({
        email: parentEmail,
        password,
      });

      // Return the CHILD's profile data (this is who's "logged in" from user perspective)
      res.json({
        success: true,
        user: {
          id: childProfile.id,  // Child ID for all API calls
          displayName: childProfile.name,
          email: parentEmail,
          age: childProfile.age,
          locale: childProfile.locale,
          goal: childProfile.goal,
          avatarId: childProfile.avatar,
          totalXp: childProfile.totalXp || 0,
          level: childProfile.level || 1,
          streak: childProfile.streak || 0,
          parentId: parentUser.id,
          activeChildId: childProfile.id,
        },
        session: signInData?.session || null,
      });

    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Supabase Auth: Login endpoint
  // Returns the active child's profile (new architecture)
  app.post("/api/auth/login", async (req: any, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      console.log("Login attempt for:", email);

      // 1. Sign in with Supabase (parent account)
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase login error:", error.message);
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (!data.user || !data.session) {
        return res.status(401).json({ error: 'Login failed' });
      }

      const parentAuthId = data.user.id;

      // 2. Find parent user (auto-create if auth exists but DB record is missing)
      let parentUser = await storage.getParentByAuthId(parentAuthId);

      if (!parentUser) {
        console.log("Auto-creating parent user for auth ID:", parentAuthId);
        parentUser = await storage.createParentUser({
          parentAuthId,
          email: data.user.email || email,
          parentEmail: data.user.email || email,
          parentConsent: true,
          authProvider: 'supabase',
          subscriptionPlan: 'free',
          subscriptionChildrenLimit: 1,
        });
        console.log("Auto-created parent user:", parentUser.id);
      }

      // 3. Get children for this parent
      const children = await storage.getChildrenByParentId(parentUser.id);

      if (children.length === 0) {
        console.log("No child profiles found, auto-creating default child for parent:", parentUser.id);
        const displayName = parentUser.displayName || email.split('@')[0];
        const username = displayName.toUpperCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
        const defaultChild = await storage.createChildProfile({
          parentId: parentUser.id,
          name: displayName,
          username,
          avatar: '🧒',
          age: 8,
          locale: 'en-GB',
          goal: 'energy',
        });
        await storage.setActiveChildId(parentUser.id, defaultChild.id);
        console.log("Auto-created child profile:", defaultChild.id);
        children.push(defaultChild);
      }

      // 4. Get active child (or default to first child)
      let activeChild = children[0];
      if (parentUser.activeChildId) {
        const found = children.find(c => c.id === parentUser.activeChildId);
        if (found) activeChild = found;
      }

      // 5. Ensure active_child_id is set
      if (!parentUser.activeChildId) {
        await storage.setActiveChildId(parentUser.id, activeChild.id);
      }

      console.log("Login successful for child profile:", activeChild.id);

      // Return the ACTIVE CHILD's profile data
      res.json({
        success: true,
        user: {
          id: activeChild.id,  // Child ID for all API calls
          displayName: activeChild.name,
          email: parentUser.email,
          age: activeChild.age,
          locale: activeChild.locale,
          goal: activeChild.goal,
          avatarId: activeChild.avatar,
          totalXp: activeChild.totalXp || 0,
          level: activeChild.level || 1,
          streak: activeChild.streak || 0,
          parentId: parentUser.id,
          activeChildId: activeChild.id,
        },
        session: data.session,
      });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Supabase Auth: Logout endpoint
  app.post("/api/auth/logout", async (req: any, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        await supabaseAdmin.auth.admin.signOut(token);
      }
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      console.error("Logout error:", error);
      res.json({ success: true, message: 'Logged out successfully' });
    }
  });

  // Get current user (returns active child's profile) - new architecture
  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;

      // 1. Find parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);

      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 2. Get children for this parent
      const children = await storage.getChildrenByParentId(parentUser.id);

      if (children.length === 0) {
        const displayName = parentUser.displayName || parentUser.email?.split('@')[0] || 'Child';
        const username = displayName.toUpperCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
        const defaultChild = await storage.createChildProfile({
          parentId: parentUser.id,
          name: displayName,
          username,
          avatar: '🧒',
          age: 8,
          locale: 'en-GB',
          goal: 'energy',
        });
        await storage.setActiveChildId(parentUser.id, defaultChild.id);
        children.push(defaultChild);
      }

      // 3. Get active child (or default to first child)
      let activeChild = children[0];
      if (parentUser.activeChildId) {
        const found = children.find(c => c.id === parentUser.activeChildId);
        if (found) activeChild = found;
      }

      // Return the ACTIVE CHILD's profile data
      res.json({
        id: activeChild.id,  // Child ID for all API calls
        displayName: activeChild.name,
        email: parentUser.email,
        age: activeChild.age,
        locale: activeChild.locale,
        goal: activeChild.goal,
        avatarId: activeChild.avatar,
        totalXp: activeChild.totalXp || 0,
        level: activeChild.level || 1,
        streak: activeChild.streak || 0,
        parentId: parentUser.id,
        activeChildId: activeChild.id,
        subscriptionPlan: parentUser.subscriptionPlan,
        subscriptionChildrenLimit: parentUser.subscriptionChildrenLimit,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  // XP update endpoint - now uses child ID (new architecture)
  app.post("/api/user/:id/xp", requireAuth, async (req: any, res) => {
    try {
      const childId = req.params.id;
      const { delta_xp, reason } = req.body;

      // Validate request
      if (!delta_xp || typeof delta_xp !== 'number') {
        return res.status(400).json({ error: 'delta_xp is required and must be a number' });
      }

      // Get parent user
      const parentAuthId = req.userId;
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify child belongs to parent
      const child = await storage.getChildById(childId);
      if (!child || child.parentId !== parentUser.id) {
        return res.status(403).json({ error: 'Cannot update XP for this user' });
      }

      // Calculate new totals
      const newTotalXp = Math.max(0, (child.totalXp || 0) + delta_xp);

      // Calculate new level (100 XP per level for simplicity)
      const newLevel = Math.floor(newTotalXp / 100) + 1;

      // Update streak
      const now = getCurrentTime();
      let newStreak = child.streak || 0;

      if (child.lastLogAt) {
        const lastLog = new Date(child.lastLogAt);
        const hoursSinceLastLog = (now.getTime() - lastLog.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastLog < 24) {
          // Same day or consecutive - keep streak
        } else if (hoursSinceLastLog < 48) {
          // Next day - increment streak
          newStreak += 1;
        } else {
          // Missed days - reset streak
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      // Check for level-based badge eligibility
      let badge = undefined;
      if (newLevel > (child.level || 1)) {
        badge = `level_${newLevel}`;
      }

      // Update child progress
      await storage.updateChildProgress(childId, {
        totalXp: newTotalXp,
        level: newLevel,
        streak: newStreak,
        lastLogAt: now,
      });

      // Log XP event for audit trail (still uses userId for compatibility)
      await storage.logXPEvent({
        userId: childId,
        amount: delta_xp,
        reason: reason || 'unknown'
      });

      res.json({
        total_xp: newTotalXp,
        level: newLevel,
        streak_days: newStreak,
        badge
      });
      
    } catch (error) {
      console.error("XP update error:", error);
      res.status(500).json({ error: "Failed to update XP" });
    }
  });

  // Get avatars - PUBLIC endpoint (needed for onboarding before auth)
  app.get('/api/avatars', async (req: any, res: any) => {
    try {
      const avatars = await storage.getAvatars();
      res.json(avatars);
    } catch (error) {
      console.error('Error getting avatars:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Get goals - PUBLIC endpoint (needed for onboarding before auth)
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
      if (req.userId !== userId) {
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
  registerLessonRoutes(app, requireAuth);
  registerTopicRoutes(app, requireAuth);
  registerSettingsRoutes(app, requireAuth);
  registerStripeRoutes(app, requireAuth);
  registerDevRoutes(app); // Development testing routes

  const httpServer = createServer(app);
  return httpServer;
}
