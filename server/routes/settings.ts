import type { Express } from "express";
import { storage } from "../storage";

export function registerSettingsRoutes(app: Express, requireAuth: any) {
  
  // GET /api/subscription - Get current subscription status
  app.get("/api/subscription", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      
      // Find user by parent auth ID
      let user = await storage.getUserByParentAuthId(parentAuthId);
      if (!user) {
        user = await storage.getUser(parentAuthId);
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get all children from children table
      const childrenFromTable = await storage.getChildren(user.id);
      
      // Determine curriculum country from curriculum ID
      let curriculumCountry: 'uk' | 'us' = 'us';
      if (user.curriculum?.startsWith('uk-') || user.curriculumCountry === 'uk') {
        curriculumCountry = 'uk';
      }
      
      // Build combined children list
      // Include the primary user profile as the "first child" if they have child data
      const allChildren: any[] = [];
      
      // Add primary child from users table if they have display name (from onboarding)
      if (user.displayName && user.yearGroup) {
        const primaryChildId = `primary-${user.id}`;
        allChildren.push({
          id: primaryChildId,
          name: user.displayName,
          username: user.displayName.toUpperCase().replace(/\s+/g, ''),
          avatar: user.avatarId || '🧒',
          yearGroup: user.yearGroup,
          curriculumId: user.curriculum || '',
          goal: user.goal,
          xp: user.totalXp || 0,
          streak: user.streak || 0,
          isActive: !user.activeChildId || user.activeChildId === primaryChildId,
          isPrimary: true,
        });
      }
      
      // Add additional children from children table
      childrenFromTable.forEach(child => {
        allChildren.push({
          id: child.id,
          name: child.name,
          username: child.username,
          avatar: child.avatar,
          yearGroup: child.yearGroup,
          curriculumId: child.curriculumId,
          goal: child.goal,
          xp: child.xp,
          streak: child.streak,
          isActive: child.id === user.activeChildId,
          isPrimary: false,
        });
      });
      
      res.json({
        plan: user.subscriptionPlan || 'free',
        childrenLimit: user.subscriptionChildrenLimit || 1,
        childrenCount: allChildren.length,
        curriculumCountry,
        activeChildId: user.activeChildId || (allChildren.length > 0 ? allChildren[0].id : null),
        children: allChildren,
      });
    } catch (error) {
      console.error("Get subscription error:", error);
      res.status(500).json({ error: "Failed to get subscription data" });
    }
  });
  
  // POST /api/subscription - Update subscription (for testing without payment)
  app.post("/api/subscription", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const { plan, childrenLimit } = req.body;
      
      // Validate plan
      const validPlans = ['free', 'individual', 'family'];
      if (!validPlans.includes(plan)) {
        return res.status(400).json({ error: 'Invalid subscription plan' });
      }
      
      // Determine children limit based on plan
      let limit = 1;
      if (plan === 'family') {
        limit = Math.min(Math.max(childrenLimit || 2, 2), 4); // 2-4 for family
      } else {
        limit = 1; // 1 for free/individual
      }
      
      // Find user by parent auth ID
      let user = await storage.getUserByParentAuthId(parentAuthId);
      if (!user) {
        user = await storage.getUser(parentAuthId);
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Update subscription
      const updatedUser = await storage.updateSubscription(user.id, plan, limit);
      
      res.json({
        success: true,
        plan: updatedUser.subscriptionPlan,
        childrenLimit: updatedUser.subscriptionChildrenLimit,
      });
    } catch (error) {
      console.error("Update subscription error:", error);
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });
  
  // GET /api/children - Get all children for current user
  app.get("/api/children", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      
      // Find user by parent auth ID
      let user = await storage.getUserByParentAuthId(parentAuthId);
      if (!user) {
        user = await storage.getUser(parentAuthId);
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const childrenList = await storage.getChildren(user.id);
      
      res.json(childrenList.map(child => ({
        id: child.id,
        name: child.name,
        username: child.username,
        avatar: child.avatar,
        yearGroup: child.yearGroup,
        curriculumId: child.curriculumId,
        goal: child.goal,
        favoriteFruits: child.favoriteFruits,
        favoriteVeggies: child.favoriteVeggies,
        favoriteFoods: child.favoriteFoods,
        favoriteSports: child.favoriteSports,
        xp: child.xp,
        streak: child.streak,
        isActive: child.id === user.activeChildId,
      })));
    } catch (error) {
      console.error("Get children error:", error);
      res.status(500).json({ error: "Failed to get children" });
    }
  });
  
  // POST /api/children - Add a new child (after completing onboarding)
  app.post("/api/children", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const { 
        name, 
        username, 
        avatar, 
        yearGroup, 
        curriculumId, 
        goal,
        favoriteFruits,
        favoriteVeggies,
        favoriteFoods,
        favoriteSports
      } = req.body;
      
      // Validate required fields
      if (!name || !yearGroup || !curriculumId) {
        return res.status(400).json({ error: 'Name, year group, and curriculum are required' });
      }
      
      // Find user by parent auth ID
      let user = await storage.getUserByParentAuthId(parentAuthId);
      if (!user) {
        user = await storage.getUser(parentAuthId);
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if user has family plan
      if (user.subscriptionPlan !== 'family') {
        return res.status(403).json({ error: 'Family plan required to add children' });
      }
      
      // Check children limit
      const existingChildren = await storage.getChildren(user.id);
      if (existingChildren.length >= (user.subscriptionChildrenLimit || 1)) {
        return res.status(403).json({ error: 'Children limit reached for your plan' });
      }
      
      // Generate username if not provided
      const finalUsername = username || name.toUpperCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      
      // Create child
      const child = await storage.createChild({
        parentId: user.id,
        name,
        username: finalUsername,
        avatar: avatar || 'child',
        yearGroup,
        curriculumId,
        goal: goal || null,
        favoriteFruits: favoriteFruits || [],
        favoriteVeggies: favoriteVeggies || [],
        favoriteFoods: favoriteFoods || [],
        favoriteSports: favoriteSports || [],
      });
      
      res.json({
        success: true,
        child: {
          id: child.id,
          name: child.name,
          username: child.username,
          avatar: child.avatar,
          yearGroup: child.yearGroup,
          curriculumId: child.curriculumId,
          goal: child.goal,
          xp: child.xp,
          streak: child.streak,
        }
      });
    } catch (error) {
      console.error("Create child error:", error);
      res.status(500).json({ error: "Failed to create child" });
    }
  });
  
  // PUT /api/children/:id - Update a child's profile
  app.put("/api/children/:id", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const childId = req.params.id;
      const updates = req.body;
      
      // Find user by parent auth ID
      let user = await storage.getUserByParentAuthId(parentAuthId);
      if (!user) {
        user = await storage.getUser(parentAuthId);
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Verify child belongs to user
      const child = await storage.getChild(childId);
      if (!child || child.parentId !== user.id) {
        return res.status(404).json({ error: 'Child not found' });
      }
      
      // Update child
      const updatedChild = await storage.updateChild(childId, updates);
      
      res.json({
        success: true,
        child: {
          id: updatedChild.id,
          name: updatedChild.name,
          username: updatedChild.username,
          avatar: updatedChild.avatar,
          yearGroup: updatedChild.yearGroup,
          curriculumId: updatedChild.curriculumId,
          goal: updatedChild.goal,
          xp: updatedChild.xp,
          streak: updatedChild.streak,
        }
      });
    } catch (error) {
      console.error("Update child error:", error);
      res.status(500).json({ error: "Failed to update child" });
    }
  });
  
  // DELETE /api/children/:id - Remove a child
  app.delete("/api/children/:id", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const childId = req.params.id;
      
      // Find user by parent auth ID
      let user = await storage.getUserByParentAuthId(parentAuthId);
      if (!user) {
        user = await storage.getUser(parentAuthId);
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Verify child belongs to user
      const child = await storage.getChild(childId);
      if (!child || child.parentId !== user.id) {
        return res.status(404).json({ error: 'Child not found' });
      }
      
      // Delete child
      await storage.deleteChild(childId);
      
      // If this was the active child, clear activeChildId
      if (user.activeChildId === childId) {
        await storage.setActiveChild(user.id, '');
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Delete child error:", error);
      res.status(500).json({ error: "Failed to delete child" });
    }
  });
  
  // POST /api/children/:id/switch - Switch to this child's profile
  app.post("/api/children/:id/switch", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const childId = req.params.id;
      
      // Find user by parent auth ID
      let user = await storage.getUserByParentAuthId(parentAuthId);
      if (!user) {
        user = await storage.getUser(parentAuthId);
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Handle primary child (from users table)
      const primaryChildId = `primary-${user.id}`;
      if (childId === primaryChildId) {
        // Switch to primary child - set activeChildId to null
        const updatedUser = await storage.setActiveChild(user.id, null);
        
        return res.json({
          success: true,
          activeChildId: null,
          child: {
            id: primaryChildId,
            name: user.displayName,
            username: user.displayName?.toUpperCase().replace(/\s+/g, '') || 'USER',
            avatar: user.avatarId || '🧒',
            yearGroup: user.yearGroup,
          }
        });
      }
      
      // Handle additional child (from children table)
      const child = await storage.getChild(childId);
      if (!child || child.parentId !== user.id) {
        return res.status(404).json({ error: 'Child not found' });
      }
      
      // Set active child
      const updatedUser = await storage.setActiveChild(user.id, childId);
      
      res.json({
        success: true,
        activeChildId: updatedUser.activeChildId,
        child: {
          id: child.id,
          name: child.name,
          username: child.username,
          avatar: child.avatar,
          yearGroup: child.yearGroup,
        }
      });
    } catch (error) {
      console.error("Switch child error:", error);
      res.status(500).json({ error: "Failed to switch child" });
    }
  });
  
  // GET /api/profile - Get current user profile
  app.get("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      
      // Find user by parent auth ID
      let user = await storage.getUserByParentAuthId(parentAuthId);
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
        parentEmail: user.parentEmail,
        avatarId: user.avatarId,
        yearGroup: user.yearGroup,
        goal: user.goal,
        curriculum: user.curriculum,
        curriculumCountry: user.curriculumCountry,
        totalXp: user.totalXp,
        level: user.level,
        streak: user.streak,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionChildrenLimit: user.subscriptionChildrenLimit,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });
  
  // PUT /api/profile - Update current user profile
  app.put("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const { displayName, avatarId, yearGroup, goal } = req.body;
      
      // Find user by parent auth ID
      let user = await storage.getUserByParentAuthId(parentAuthId);
      if (!user) {
        user = await storage.getUser(parentAuthId);
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Build updates object
      const updates: any = {};
      if (displayName !== undefined) updates.displayName = displayName;
      if (avatarId !== undefined) updates.avatarId = avatarId;
      if (yearGroup !== undefined) updates.yearGroup = yearGroup;
      if (goal !== undefined) updates.goal = goal;
      
      // Update user
      const updatedUser = await storage.updateUser(user.id, updates);
      
      res.json({
        success: true,
        user: {
          id: updatedUser.id,
          displayName: updatedUser.displayName,
          email: updatedUser.email,
          avatarId: updatedUser.avatarId,
          yearGroup: updatedUser.yearGroup,
          goal: updatedUser.goal,
        }
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
}
