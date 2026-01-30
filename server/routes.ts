import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerDashboardRoutes } from "./routes/dashboard";
import { registerLogRoutes } from "./routes/logs";
import { registerAIRoutes } from "./routes/ai";
import { registerDevRoutes } from "./routes/dev";
import { registerDailySummaryRoutes } from "./routes/dailySummary";
import { registerDailySummaryV2Routes } from "./routes/dailySummaryV2";
import { registerBadgeRoutes } from "./routes/badges";
import { registerLeaderboardRoutes } from "./routes/leaderboard";
import { registerLessonRoutes } from "./routes/lessons";
import { updateStreak, getCurrentTime } from "./utils/streakTracker";
import { requireAuth } from "./middleware/auth";
import { supabaseAdmin } from "./lib/supabase";

export async function registerRoutes(app: Express): Promise<Server> {

  // Supabase Auth: Signup endpoint (Parent-first flow)
  // Parent creates auth account, then child profile is linked via parent_auth_id
  app.post("/api/auth/signup", async (req: any, res) => {
    try {
      const { 
        parentEmail,  // Parent's email for Supabase auth
        password, 
        parentConsent,
        childName,    // Child's display name
        age,          // "5-7" | "7-11" | "11-14"
        yearGroup,    // e.g., "year-5", "grade-3"
        curriculum,   // "uk-ks1" | "uk-ks2" | "uk-ks3" | "us-k2" | "us-35" | "us-68"
        goal,         // "energy" | "focus" | "strength"
        avatarId, 
        timezone 
      } = req.body;
      
      // Validate required fields
      if (!parentEmail || !password || !childName || !age || !goal) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      if (!parentConsent) {
        return res.status(400).json({ error: 'Parent consent is required' });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      
      // Validate curriculum (supports both UK Key Stages and US Grades)
      const validCurriculums = ['uk-ks1', 'uk-ks2', 'uk-ks3', 'us-k2', 'us-35', 'us-68'];
      const selectedCurriculum = curriculum || 'us-35';
      if (!validCurriculums.includes(selectedCurriculum)) {
        return res.status(400).json({ error: 'Please select a valid curriculum' });
      }
      
      console.log("Signup attempt for parent:", parentEmail);
      
      // Create parent account in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: parentEmail,
        password,
        email_confirm: true, // Skip email verification for MVP
      });
      
      if (authError) {
        console.error("Supabase auth error:", authError.message);
        if (authError.message.includes('already registered')) {
          return res.status(409).json({ error: 'This email is already registered. Try logging in instead.' });
        }
        return res.status(400).json({ error: authError.message });
      }
      
      if (!authData.user) {
        return res.status(500).json({ error: 'Failed to create auth user' });
      }
      
      const parentAuthId = authData.user.id;
      
      // Check if child profile already exists with this parent email
      let existingUser = await storage.getUserByEmail(parentEmail);
      let childProfile;
      
      if (existingUser) {
        // Update existing profile with parent auth ID and new info
        childProfile = await storage.updateUser(existingUser.id, {
          parentAuthId,
          displayName: childName,
          ageBracket: age as '5-7' | '7-11' | '11-14',
          yearGroup: yearGroup || null,
          goal: goal as 'energy' | 'focus' | 'strength',
          curriculum: selectedCurriculum,
          parentConsent: true,
          authProvider: 'supabase',
          avatarId: avatarId || null,
          tz: timezone || null,
        });
        if (!childProfile) {
          childProfile = existingUser;
        }
      } else {
        // Create new child profile (auto-generated ID, NOT Supabase auth ID)
        childProfile = await storage.createUser({
          parentAuthId,
          displayName: childName,
          ageBracket: age as '5-7' | '7-11' | '11-14',
          yearGroup: yearGroup || null,
          goal: goal as 'energy' | 'focus' | 'strength',
          curriculum: selectedCurriculum,
          email: parentEmail, // Use parent email as unique identifier
          parentEmail,
          parentConsent: true,
          authProvider: 'supabase',
          avatarId: avatarId || null,
          tz: timezone || null,
        });
      }
      
      console.log("Child profile created successfully:", childProfile.id);
      
      // Sign in the parent to get a session
      const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
        email: parentEmail,
        password,
      });
      
      res.json({
        success: true,
        user: {
          id: childProfile.id,
          displayName: childProfile.displayName,
          email: childProfile.email,
          ageBracket: childProfile.ageBracket,
          yearGroup: childProfile.yearGroup,
          goal: childProfile.goal,
          curriculum: childProfile.curriculum,
          avatarId: childProfile.avatarId,
          totalXp: childProfile.totalXp || 0,
          level: childProfile.level || 1,
          streak: childProfile.streak || 0,
        },
        session: signInData?.session || null,
      });
      
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // Supabase Auth: Login endpoint (Parent-first flow)
  // Parent logs in, then we fetch child profile(s) by parent_auth_id
  app.post("/api/auth/login", async (req: any, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }
      
      console.log("Login attempt for:", email);
      
      // Sign in with Supabase (parent account)
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
      
      // First try to find child profile by parent_auth_id (new flow)
      let childProfile = await storage.getUserByParentAuthId(parentAuthId);
      
      // Fallback: Try legacy lookup by email or user ID
      if (!childProfile) {
        childProfile = await storage.getUserByEmail(email);
      }
      if (!childProfile) {
        childProfile = await storage.getUser(parentAuthId);
      }
      
      if (!childProfile) {
        console.error("No child profile found for parent:", parentAuthId);
        return res.status(404).json({ error: 'No child profile found. Please complete signup.' });
      }
      
      console.log("Login successful for child profile:", childProfile.id);
      
      res.json({
        success: true,
        user: {
          id: childProfile.id,
          displayName: childProfile.displayName,
          email: childProfile.email,
          ageBracket: childProfile.ageBracket,
          yearGroup: childProfile.yearGroup,
          goal: childProfile.goal,
          curriculum: childProfile.curriculum,
          avatarId: childProfile.avatarId,
          totalXp: childProfile.totalXp || 0,
          level: childProfile.level || 1,
          streak: childProfile.streak || 0,
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

  // Supabase Auth: Get current user (child profile)
  // req.userId is the parent's Supabase auth ID from JWT
  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      
      // First try to find child profile by parent_auth_id
      let user = await storage.getUserByParentAuthId(parentAuthId);
      
      // Fallback: Direct lookup by ID (legacy users)
      if (!user) {
        user = await storage.getUser(parentAuthId);
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json({
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        ageBracket: user.ageBracket,
        yearGroup: user.yearGroup,
        goal: user.goal,
        curriculum: user.curriculum,
        avatarId: user.avatarId,
        parentEmail: user.parentEmail,
        totalXp: user.totalXp || 0,
        level: user.level || 1,
        streak: user.streak || 0,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  // XP update endpoint
  app.post("/api/user/:id/xp", requireAuth, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const { delta_xp, reason } = req.body;
      
      // Validate request
      if (!delta_xp || typeof delta_xp !== 'number') {
        return res.status(400).json({ error: 'delta_xp is required and must be a number' });
      }
      
      // Get current user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Verify parent owns the child profile
      // req.userId is the Supabase parent auth ID
      // userId (from URL) is the child profile ID
      const isParentOwned = user.parentAuthId === req.userId;
      const isDirectMatch = userId === req.userId;
      
      if (!isParentOwned && !isDirectMatch) {
        return res.status(403).json({ error: 'Cannot update XP for other users' });
      }
      
      // Calculate new totals
      const newTotalXp = Math.max(0, (user.totalXp || 0) + delta_xp);
      
      // Calculate new level using the same curve as frontend (100 + L * 25)
      let newLevel = 1;
      let remaining = newTotalXp;
      while (remaining >= (100 + (newLevel - 1) * 25)) {
        remaining -= (100 + (newLevel - 1) * 25);
        newLevel++;
      }
      
      // Update streak using timezone-aware utility
      const now = getCurrentTime();
      const streakResult = updateStreak(
        userId,
        user.streak || 0,
        user.streak || 0, // Using current streak as longest for simplicity, could add separate field
        user.lastLogAt,
        now,
        user.tz
      );
      
      // Check for level-based badge eligibility
      let badge = undefined;
      if (newLevel > (user.level || 1)) {
        badge = `level_${newLevel}`;
      } else if (streakResult.badge_awarded) {
        // Use milestone streak badge from utility
        badge = streakResult.badge_awarded.code;
      }
      
      // Update user in database
      await storage.updateUserXP(userId, {
        totalXp: newTotalXp,
        level: newLevel,
        streak: streakResult.streak_days,
        lastLogAt: now
      });
      
      // Log XP event for audit trail
      await storage.logXPEvent({
        userId,
        amount: delta_xp,
        reason: reason || 'unknown'
      });
      
      res.json({
        total_xp: newTotalXp,
        level: newLevel,
        streak_days: streakResult.streak_days,
        streak_changed: streakResult.streak_changed,
        longest_streak: streakResult.longest_streak,
        badge_awarded: streakResult.badge_awarded,
        badge // Keep legacy badge for level-ups
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
  registerDevRoutes(app); // Development testing routes

  const httpServer = createServer(app);
  return httpServer;
}
