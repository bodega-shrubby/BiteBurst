# URGENT: Fix Signup - Remove Deleted Columns

## Problem

Signup is failing because the code tries to insert into columns that no longer exist in the database.

**Error:**
```
Parent user creation failed: error: column "year_group" of relation "users" does not exist
```

## The Fix

### File: `server/storage.ts`

Find the `createParentUser` method (around line 191-219) and **remove the deleted columns**:

**BEFORE (broken):**
```typescript
async createParentUser(data: {
  parentAuthId: string;
  email: string;
  parentEmail?: string;
  parentConsent: boolean;
  authProvider: string;
  subscriptionPlan?: string;
  subscriptionChildrenLimit?: number;
  displayName?: string;
}): Promise<User> {
  const [user] = await db.insert(users).values({
    parentAuthId: data.parentAuthId,
    email: data.email,
    parentEmail: data.parentEmail || data.email,
    parentConsent: data.parentConsent,
    authProvider: data.authProvider,
    displayName: data.displayName || data.email.split('@')[0],
    // Default values for legacy fields (child data now in children table)
    goal: 'energy',
    yearGroup: 'year-1',        // ❌ DELETE - column no longer exists
    curriculum: 'uk-ks1',       // ❌ DELETE - column no longer exists
    curriculumCountry: 'uk',    // ❌ DELETE - column no longer exists
    subscriptionPlan: data.subscriptionPlan || 'free',
    subscriptionChildrenLimit: data.subscriptionChildrenLimit || 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any).returning();
  return user;
}
```

**AFTER (fixed):**
```typescript
async createParentUser(data: {
  parentAuthId: string;
  email: string;
  parentEmail?: string;
  parentConsent: boolean;
  authProvider: string;
  subscriptionPlan?: string;
  subscriptionChildrenLimit?: number;
  displayName?: string;
}): Promise<User> {
  const [user] = await db.insert(users).values({
    parentAuthId: data.parentAuthId,
    email: data.email,
    parentEmail: data.parentEmail || data.email,
    parentConsent: data.parentConsent,
    authProvider: data.authProvider,
    displayName: data.displayName || data.email.split('@')[0],
    isParent: true,
    subscriptionPlan: data.subscriptionPlan || 'free',
    subscriptionChildrenLimit: data.subscriptionChildrenLimit || 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any).returning();
  return user;
}
```

## Changes Made

| Line | Change |
|------|--------|
| Remove | `goal: 'energy',` |
| Remove | `yearGroup: 'year-1',` |
| Remove | `curriculum: 'uk-ks1',` |
| Remove | `curriculumCountry: 'uk',` |
| Add | `isParent: true,` |

## Why This Fixes It

The database schema was updated to use an age-based system instead of curriculum/yearGroup. These columns were removed from the `users` table. The code was still trying to insert values into columns that don't exist.

Parent users don't need age/curriculum data - that's stored on the `children` table now.
