import type { Express } from "express";
import { storage } from "../storage";

export function registerSettingsRoutes(app: Express, requireAuth: any) {
  
  // GET /api/subscription - Get subscription status and children list (new architecture)
  app.get("/api/subscription", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;

      // Find parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get all children
      const children = await storage.getChildrenByParentId(parentUser.id);

      // Determine curriculum country from first child
      let curriculumCountry: 'uk' | 'us' = 'us';
      if (children.length > 0 && children[0].curriculumCountry) {
        curriculumCountry = children[0].curriculumCountry as 'uk' | 'us';
      }

      res.json({
        plan: parentUser.subscriptionPlan || 'free',
        childrenLimit: parentUser.subscriptionChildrenLimit || 1,
        childrenCount: children.length,
        curriculumCountry,
        activeChildId: parentUser.activeChildId || (children.length > 0 ? children[0].id : null),
        children: children.map(child => ({
          id: child.id,
          name: child.name,
          username: child.username,
          avatar: child.avatar,
          yearGroup: child.yearGroup,
          curriculumId: child.curriculumId,
          goal: child.goal,
          totalXp: child.totalXp || 0,
          level: child.level || 1,
          streak: child.streak || 0,
          isActive: child.id === parentUser.activeChildId,
        })),
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
      
      // Find parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update subscription
      const updatedUser = await storage.updateSubscription(parentUser.id, plan, limit);
      
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
  
  // GET /api/children - Get all children for current user (new architecture)
  app.get("/api/children", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;

      // Find parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get all children from children table
      const children = await storage.getChildrenByParentId(parentUser.id);

      res.json(children.map(child => ({
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
        totalXp: child.totalXp || 0,
        level: child.level || 1,
        streak: child.streak || 0,
        isActive: child.id === parentUser.activeChildId,
      })));
    } catch (error) {
      console.error("Get children error:", error);
      res.status(500).json({ error: "Failed to get children" });
    }
  });
  
  // POST /api/children - Add a new child (new architecture)
  app.post("/api/children", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const {
        name,
        username,
        avatar,
        yearGroup,
        curriculumId,
        curriculumCountry,
        goal,
        favoriteFruits,
        favoriteVeggies,
        favoriteFoods,
        favoriteSports,
        timezone,
      } = req.body;

      // Validate required fields
      if (!name || !yearGroup || !curriculumId) {
        return res.status(400).json({ error: 'Name, year group, and curriculum are required' });
      }

      // Find parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check subscription
      if (parentUser.subscriptionPlan !== 'family') {
        return res.status(403).json({ error: 'Family plan required to add children' });
      }

      // Check children limit
      const existingChildren = await storage.getChildrenByParentId(parentUser.id);
      if (existingChildren.length >= (parentUser.subscriptionChildrenLimit || 1)) {
        return res.status(403).json({ error: 'Children limit reached for your plan' });
      }

      // Generate username if not provided
      const finalUsername = username || name.toUpperCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);

      // Create child
      const child = await storage.createChildProfile({
        parentId: parentUser.id,
        name,
        username: finalUsername,
        avatar: avatar || '🧒',
        yearGroup,
        curriculumId,
        curriculumCountry: curriculumCountry || (curriculumId.startsWith('uk-') ? 'uk' : 'us'),
        goal: goal || null,
        favoriteFruits: favoriteFruits || [],
        favoriteVeggies: favoriteVeggies || [],
        favoriteFoods: favoriteFoods || [],
        favoriteSports: favoriteSports || [],
        tz: timezone || null,
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
          totalXp: child.totalXp,
          level: child.level,
          streak: child.streak,
        }
      });
    } catch (error) {
      console.error("Create child error:", error);
      res.status(500).json({ error: "Failed to create child" });
    }
  });
  
  // PUT /api/children/:id - Update a child's profile (new architecture)
  app.put("/api/children/:id", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const childId = req.params.id;
      const updates = req.body;

      // Find parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify child belongs to parent
      const child = await storage.getChildById(childId);
      if (!child || child.parentId !== parentUser.id) {
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
          totalXp: updatedChild.totalXp || 0,
          level: updatedChild.level || 1,
          streak: updatedChild.streak || 0,
        }
      });
    } catch (error) {
      console.error("Update child error:", error);
      res.status(500).json({ error: "Failed to update child" });
    }
  });
  
  // DELETE /api/children/:id - Remove a child (new architecture)
  app.delete("/api/children/:id", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const childId = req.params.id;

      // Find parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify child belongs to parent
      const child = await storage.getChildById(childId);
      if (!child || child.parentId !== parentUser.id) {
        return res.status(404).json({ error: 'Child not found' });
      }

      // Check if this is the last child (cannot delete last child)
      const allChildren = await storage.getChildrenByParentId(parentUser.id);
      if (allChildren.length <= 1) {
        return res.status(400).json({ error: 'Cannot delete the last child profile' });
      }

      // Delete child
      await storage.deleteChild(childId);

      // If this was the active child, switch to another child
      if (parentUser.activeChildId === childId) {
        const remainingChildren = allChildren.filter(c => c.id !== childId);
        if (remainingChildren.length > 0) {
          await storage.setActiveChildId(parentUser.id, remainingChildren[0].id);
        }
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Delete child error:", error);
      res.status(500).json({ error: "Failed to delete child" });
    }
  });
  
  // POST /api/children/:id/switch - Switch to this child's profile (new architecture)
  app.post("/api/children/:id/switch", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const childId = req.params.id;

      // 1. Find parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 2. Verify child belongs to this parent
      const child = await storage.getChildById(childId);
      if (!child || child.parentId !== parentUser.id) {
        return res.status(404).json({ error: 'Child not found' });
      }

      // 3. Set active child
      await storage.setActiveChildId(parentUser.id, childId);

      res.json({
        success: true,
        activeChildId: childId,
        child: {
          id: child.id,
          name: child.name,
          username: child.username,
          avatar: child.avatar,
          yearGroup: child.yearGroup,
          curriculumId: child.curriculumId,
          goal: child.goal,
          totalXp: child.totalXp,
          level: child.level,
          streak: child.streak,
        }
      });
    } catch (error) {
      console.error("Switch child error:", error);
      res.status(500).json({ error: "Failed to switch child" });
    }
  });
  
  // GET /api/profile - Get active child profile (new architecture)
  app.get("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;

      // Find parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get active child
      let activeChildId = parentUser.activeChildId;
      if (!activeChildId) {
        const children = await storage.getChildrenByParentId(parentUser.id);
        if (children.length > 0) {
          activeChildId = children[0].id;
        }
      }

      const child = activeChildId ? await storage.getChildById(activeChildId) : null;

      res.json({
        // Parent info
        parentId: parentUser.id,
        email: parentUser.email,
        subscriptionPlan: parentUser.subscriptionPlan,
        subscriptionChildrenLimit: parentUser.subscriptionChildrenLimit,
        activeChildId: parentUser.activeChildId,
        // Active child info
        id: child?.id || parentUser.id,
        displayName: child?.name || parentUser.displayName,
        avatarId: child?.avatar || parentUser.avatarId,
        yearGroup: child?.yearGroup || parentUser.yearGroup,
        goal: child?.goal || parentUser.goal,
        curriculum: child?.curriculumId || parentUser.curriculum,
        curriculumCountry: child?.curriculumCountry || parentUser.curriculumCountry,
        totalXp: child?.totalXp || 0,
        level: child?.level || 1,
        streak: child?.streak || 0,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });
  
  // PUT /api/profile - Update active child profile (new architecture)
  app.put("/api/profile", requireAuth, async (req: any, res) => {
    try {
      const parentAuthId = req.userId;
      const { displayName, avatarId, yearGroup, goal, name, avatar } = req.body;

      // Find parent user
      const parentUser = await storage.getParentByAuthId(parentAuthId);
      if (!parentUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get active child
      const activeChildId = parentUser.activeChildId;
      if (!activeChildId) {
        return res.status(400).json({ error: 'No active child set' });
      }

      const child = await storage.getChildById(activeChildId);
      if (!child || child.parentId !== parentUser.id) {
        return res.status(404).json({ error: 'Active child not found' });
      }

      // Build child updates object (map legacy field names)
      const childUpdates: any = {};
      if (displayName !== undefined || name !== undefined) childUpdates.name = name || displayName;
      if (avatarId !== undefined || avatar !== undefined) childUpdates.avatar = avatar || avatarId;
      if (yearGroup !== undefined) childUpdates.yearGroup = yearGroup;
      if (goal !== undefined) childUpdates.goal = goal;

      // Update child
      const updatedChild = await storage.updateChild(activeChildId, childUpdates);

      res.json({
        success: true,
        user: {
          id: updatedChild.id,
          displayName: updatedChild.name,
          avatarId: updatedChild.avatar,
          yearGroup: updatedChild.yearGroup,
          goal: updatedChild.goal,
        }
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
}
