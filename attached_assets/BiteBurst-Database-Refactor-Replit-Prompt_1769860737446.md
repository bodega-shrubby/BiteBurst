# BiteBurst Database Architecture Refactor

## Overview

We're refactoring the database architecture to properly separate **parent accounts** from **child profiles**. This fixes the child switching bug and creates a cleaner, more scalable system.

### New Architecture:
- **`users` table** = Parent accounts (auth only)
- **`children` table** = ALL child profiles (including the first child created during onboarding)
- **All data fetching uses the child's ID**, not the parent's ID

---

## Database Schema (Already Updated in Supabase)

### `users` table (Parents)
```
id, parent_auth_id, email, parent_email, parent_consent, auth_provider,
subscription_plan, subscription_children_limit, active_child_id,
created_at, updated_at
```

### `children` table (All Children)
```
id, parent_id, name, username, avatar, year_group, curriculum_id,
curriculum_country, goal, total_xp, level, streak, last_log_at,
favorite_fruits[], favorite_veggies[], favorite_foods[], favorite_sports[],
locale, tz, created_at, updated_at
```

---

## PART 1: Update Server Storage Layer

### File: `server/storage.ts`

Update the storage interface and methods to work with the new architecture:

```typescript
// Add these new methods to the storage class:

// Create a parent user (auth only, no child data)
async createParentUser(data: {
  parentAuthId: string;
  email: string;
  parentEmail?: string;
  parentConsent: boolean;
  authProvider: string;
  subscriptionPlan?: string;
  subscriptionChildrenLimit?: number;
}): Promise<User> {
  const id = crypto.randomUUID();
  const result = await db.insert(users).values({
    id,
    parentAuthId: data.parentAuthId,
    email: data.email,
    parentEmail: data.parentEmail || data.email,
    parentConsent: data.parentConsent,
    authProvider: data.authProvider,
    subscriptionPlan: data.subscriptionPlan || 'free',
    subscriptionChildrenLimit: data.subscriptionChildrenLimit || 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return result[0];
}

// Create a child profile (used for ALL children, including first)
async createChildProfile(data: {
  parentId: string;
  name: string;
  username: string;
  avatar?: string;
  yearGroup: string;
  curriculumId: string;
  curriculumCountry: string;
  goal?: string;
  favoriteFruits?: string[];
  favoriteVeggies?: string[];
  favoriteFoods?: string[];
  favoriteSports?: string[];
  locale?: string;
  tz?: string;
}): Promise<Child> {
  const id = crypto.randomUUID();
  const result = await db.insert(children).values({
    id,
    parentId: data.parentId,
    name: data.name,
    username: data.username,
    avatar: data.avatar || '🧒',
    yearGroup: data.yearGroup,
    curriculumId: data.curriculumId,
    curriculumCountry: data.curriculumCountry,
    goal: data.goal || null,
    totalXp: 0,
    level: 1,
    streak: 0,
    favoriteFruits: data.favoriteFruits || [],
    favoriteVeggies: data.favoriteVeggies || [],
    favoriteFoods: data.favoriteFoods || [],
    favoriteSports: data.favoriteSports || [],
    locale: data.locale || null,
    tz: data.tz || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return result[0];
}

// Get child by ID
async getChildById(childId: string): Promise<Child | null> {
  const result = await db.select().from(children).where(eq(children.id, childId));
  return result[0] || null;
}

// Get all children for a parent
async getChildrenByParentId(parentId: string): Promise<Child[]> {
  return await db.select().from(children).where(eq(children.parentId, parentId));
}

// Update child profile
async updateChildProfile(childId: string, updates: Partial<Child>): Promise<Child> {
  const result = await db.update(children)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(children.id, childId))
    .returning();
  return result[0];
}

// Update child XP/level/streak
async updateChildProgress(childId: string, data: {
  totalXp?: number;
  level?: number;
  streak?: number;
  lastLogAt?: Date;
}): Promise<Child> {
  const result = await db.update(children)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(children.id, childId))
    .returning();
  return result[0];
}

// Set active child for parent
async setActiveChildId(parentId: string, childId: string | null): Promise<User> {
  const result = await db.update(users)
    .set({ activeChildId: childId, updatedAt: new Date() })
    .where(eq(users.id, parentId))
    .returning();
  return result[0];
}

// Check if child belongs to parent
async isChildOwnedByParent(childId: string, parentId: string): Promise<boolean> {
  const child = await this.getChildById(childId);
  return child ? child.parentId === parentId : false;
}

// Get parent by auth ID
async getParentByAuthId(authId: string): Promise<User | null> {
  const result = await db.select().from(users).where(eq(users.parentAuthId, authId));
  return result[0] || null;
}
```

---

## PART 2: Update Auth Routes

### File: `server/routes.ts`

#### 2.1 Update Signup Endpoint

Replace the existing `/api/auth/signup` with:

```typescript
// Supabase Auth: Signup endpoint
// Creates parent account + first child profile
app.post("/api/auth/signup", async (req: any, res) => {
  try {
    const {
      parentEmail,
      password,
      parentConsent,
      childName,
      yearGroup,
      curriculum,
      curriculumCountry,
      goal,
      avatarId,
      timezone,
      favoriteFruits,
      favoriteVeggies,
      favoriteFoods,
      favoriteSports,
    } = req.body;

    // Validate required fields
    if (!parentEmail || !password || !childName || !yearGroup || !curriculum) {
      return res.status(400).json({ error: 'Missing required fields' });
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
    const parentUser = await storage.createParentUser({
      parentAuthId,
      email: parentEmail,
      parentEmail,
      parentConsent: true,
      authProvider: 'supabase',
      subscriptionPlan: 'free',
      subscriptionChildrenLimit: 1,
    });

    console.log("Parent user created:", parentUser.id);

    // 3. Create first child profile in children table
    const username = childName.toUpperCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);

    const childProfile = await storage.createChildProfile({
      parentId: parentUser.id,
      name: childName,
      username,
      avatar: avatarId || '🧒',
      yearGroup,
      curriculumId: curriculum,
      curriculumCountry: curriculumCountry || (curriculum.startsWith('uk-') ? 'uk' : 'us'),
      goal: goal || null,
      favoriteFruits: favoriteFruits || [],
      favoriteVeggies: favoriteVeggies || [],
      favoriteFoods: favoriteFoods || [],
      favoriteSports: favoriteSports || [],
      tz: timezone || null,
    });

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
        yearGroup: childProfile.yearGroup,
        goal: childProfile.goal,
        curriculum: childProfile.curriculumId,
        curriculumCountry: childProfile.curriculumCountry,
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
```

#### 2.2 Update Login Endpoint

Replace the existing `/api/auth/login` with:

```typescript
// Supabase Auth: Login endpoint
// Returns the active child's profile
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

    // 2. Find parent user
    const parentUser = await storage.getParentByAuthId(parentAuthId);

    if (!parentUser) {
      console.error("No parent user found for auth ID:", parentAuthId);
      return res.status(404).json({ error: 'No account found. Please sign up.' });
    }

    // 3. Get children for this parent
    const children = await storage.getChildrenByParentId(parentUser.id);

    if (children.length === 0) {
      return res.status(404).json({ error: 'No child profiles found. Please complete signup.' });
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
        yearGroup: activeChild.yearGroup,
        goal: activeChild.goal,
        curriculum: activeChild.curriculumId,
        curriculumCountry: activeChild.curriculumCountry,
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
```

#### 2.3 Update `/api/auth/me` Endpoint

Replace the existing `/api/auth/me` with:

```typescript
// Get current user (returns active child's profile)
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
      return res.status(404).json({ error: 'No child profiles found' });
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
      yearGroup: activeChild.yearGroup,
      goal: activeChild.goal,
      curriculum: activeChild.curriculumId,
      curriculumCountry: activeChild.curriculumCountry,
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
```

---

## PART 3: Update Child Management Routes

### File: `server/routes/settings.ts`

#### 3.1 Update Switch Child Endpoint

```typescript
// POST /api/children/:id/switch - Switch to this child's profile
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
```

#### 3.2 Update Add Child Endpoint

```typescript
// POST /api/children - Add a new child
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
```

#### 3.3 Update Get Subscription/Children Endpoint

```typescript
// GET /api/subscription - Get subscription status and children list
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
```

---

## PART 4: Update XP/Progress Endpoints

### File: `server/routes.ts`

Update the XP endpoint to work with child IDs:

```typescript
// XP update endpoint - now uses child ID
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
    const now = new Date();
    let newStreak = child.streak || 0;

    if (child.lastLogAt) {
      const lastLog = new Date(child.lastLogAt);
      const hoursSinceLastLog = (now.getTime() - lastLog.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastLog < 24) {
        // Same day or consecutive - keep/increment streak
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

    // Update child progress
    await storage.updateChildProgress(childId, {
      totalXp: newTotalXp,
      level: newLevel,
      streak: newStreak,
      lastLogAt: now,
    });

    res.json({
      total_xp: newTotalXp,
      level: newLevel,
      streak_days: newStreak,
    });

  } catch (error) {
    console.error("XP update error:", error);
    res.status(500).json({ error: "Failed to update XP" });
  }
});
```

---

## PART 5: Update Daily Summary Endpoint

### File: `server/routes/dailySummaryV2.ts`

Update to work with child IDs:

```typescript
// Get daily summary for a child
app.get("/api/user/:userId/daily-summary", requireAuth, async (req: any, res) => {
  try {
    const childId = req.params.userId;
    const parentAuthId = req.userId;

    // Get parent user
    const parentUser = await storage.getParentByAuthId(parentAuthId);
    if (!parentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify child belongs to parent
    const child = await storage.getChildById(childId);
    if (!child || child.parentId !== parentUser.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get today's logs for this child
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysLogs = await storage.getLogsByChildIdAndDate(childId, today);

    // Calculate XP earned today
    const xpToday = todaysLogs.reduce((sum, log) => sum + (log.xpAwarded || 0), 0);

    // Get badges for this child
    const badges = await storage.getBadgesByChildId(childId);

    res.json({
      xp_today: xpToday,
      xp_goal: 100, // Daily XP goal
      streak_days: child.streak || 0,
      best_streak: child.streak || 0, // Could track separately
      has_food_today: todaysLogs.some(log => log.type === 'food'),
      has_activity_today: todaysLogs.some(log => log.type === 'activity'),
      milestones: [], // Add milestone logic
      badges: {
        earned: badges.filter(b => b.earnedAt),
        locked: badges.filter(b => !b.earnedAt),
      },
      recent_logs: todaysLogs.slice(0, 10).map(log => ({
        id: log.id,
        type: log.type,
        summary: log.summary,
        ts: log.createdAt,
        xpAwarded: log.xpAwarded,
        feedback: log.feedback,
      })),
      user: {
        lifetime_xp: child.totalXp || 0,
        level: child.level || 1,
        goal: child.goal,
        display_name: child.name,
      },
    });
  } catch (error) {
    console.error("Daily summary error:", error);
    res.status(500).json({ error: "Failed to get daily summary" });
  }
});
```

---

## PART 6: Update Frontend

### File: `client/src/hooks/useAuth.ts`

The `useAuth` hook should work as-is since `/api/auth/me` now returns the child's data. Just ensure `refreshUser` properly clears cache:

```typescript
const refreshUser = async () => {
  if (session?.access_token) {
    setUser(null); // Clear current user first
    await fetchUserProfile(session.access_token);
  }
};
```

### File: Child switching UI (Settings page)

After switching children, invalidate all queries:

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const handleSwitchChild = async (childId: string) => {
  try {
    const response = await fetch(`/api/children/${childId}/switch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
      },
    });

    if (response.ok) {
      // Invalidate ALL cached queries to refetch with new child
      await queryClient.invalidateQueries();

      // Refresh user state
      await refreshUser();

      // Navigate to dashboard
      setLocation('/dashboard');
    }
  } catch (error) {
    console.error('Failed to switch child:', error);
  }
};
```

---

## PART 7: Update Related Tables

If you have other tables that store user-specific data (food_logs, activity_logs, badges, etc.), they should use `child_id` instead of `user_id`:

```sql
-- Example: If food_logs exists, add child_id column
ALTER TABLE food_logs ADD COLUMN IF NOT EXISTS child_id varchar REFERENCES children(id);

-- Example: If badges table exists
ALTER TABLE badges ADD COLUMN IF NOT EXISTS child_id varchar REFERENCES children(id);
```

Update the storage methods and routes to use `child_id` for these tables.

---

## Testing Checklist

After implementing all changes:

1. [ ] Create a new account - verify parent created in `users`, child created in `children`
2. [ ] Login - verify returns child's data (not parent's)
3. [ ] Dashboard loads correctly with child's XP, streak, name
4. [ ] Upgrade to Family plan
5. [ ] Add a second child - verify created in `children` table
6. [ ] Switch to second child - verify dashboard updates immediately
7. [ ] Switch back to first child - verify correct data loads
8. [ ] Log food/activity - verify XP goes to correct child
9. [ ] Check lessons page loads correct curriculum for active child

---

## Summary of Key Changes

| Component | Before | After |
|-----------|--------|-------|
| First child data | Stored in `users` table | Stored in `children` table |
| `/api/auth/me` | Returns parent's user ID | Returns active child's ID |
| API calls | Use `user.id` (parent) | Use `user.id` (child) |
| Child switch | Updated `activeChildId` but data didn't change | Updates `activeChildId` AND `/api/auth/me` returns new child |
| XP updates | Went to `users` table | Goes to `children` table |
