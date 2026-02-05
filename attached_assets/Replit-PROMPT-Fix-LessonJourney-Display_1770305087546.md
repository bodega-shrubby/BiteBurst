# Replit Agent Prompt: Fix Lesson Journey Page Display

## Priority: HIGH

---

## Issues Found

Looking at the current Lesson Journey page, there are two main problems:

### Issue 1: Lesson Path Shows Same Lesson Multiple Times
**Current Behavior**: The winding path shows 3 nodes all labeled "Morning Energy Boost"
**Expected Behavior**: Each node should represent a UNIQUE lesson (Lesson 1, Lesson 2, Lesson 3, etc.)

**Root Cause**: The database has ONE lesson with 3 difficulty tiers:
- `age6-t1-L1-morning-energy-boost` (difficulty_level: 1 = Easy)
- `age6-t1-L1-morning-energy-boost-medium` (difficulty_level: 2 = Medium)
- `age6-t1-L1-morning-energy-boost-hard` (difficulty_level: 3 = Hard)

The frontend is fetching ALL lessons including all difficulty tiers and displaying each as a separate node.

### Issue 2: Topic Lessons Sidebar Shows Same Names
The "Topic Lessons" section on the right shows:
- ✓ Morning Energy Boost
- ▶ Morning Energy Boost
- 🔒 Morning Energy Boost

These are the same lesson at different difficulty levels, not different lessons.

---

## Solution: Filter Lessons to Show Only Base Difficulty

### Fix 1: Update the Lessons Query

**File: `server/routes/lessons.ts`**

When fetching lessons for the lesson journey page, filter to only return `difficulty_level = 1` (Easy) lessons. The difficulty tiers should be handled WITHIN a single lesson, not as separate lessons in the journey.

```typescript
// In the route that fetches lessons for the journey view
// Add filter: only show base difficulty (level 1) lessons

app.get("/api/topics/:topicId/lessons", async (req, res) => {
  const { topicId } = req.params;

  const topicLessons = await db.select().from(lessonsTable)
    .where(and(
      eq(lessonsTable.topicId, topicId),
      eq(lessonsTable.isActive, true),
      eq(lessonsTable.difficultyLevel, 1)  // ADD THIS: Only show base difficulty
    ))
    .orderBy(lessonsTable.orderInUnit);

  res.json(topicLessons);
});
```

### Fix 2: Update Lessons.tsx Component

**File: `client/src/pages/Lessons.tsx`**

If the filtering isn't done server-side, filter client-side:

```typescript
// Filter to only show base difficulty lessons (level 1)
const uniqueLessons = lessons.filter(lesson =>
  lesson.difficultyLevel === 1 || !lesson.difficultyLevel
);

// Then use uniqueLessons for rendering the path
```

### Fix 3: Update Topic Lessons Sidebar

**File: Where the "Topic Lessons" component is rendered**

Apply the same filter to the sidebar lessons list:

```typescript
// In the TopicLessons or sidebar component
const baseLessons = allLessons.filter(l => l.difficultyLevel === 1);

// Render baseLessons instead of allLessons
{baseLessons.map((lesson, index) => (
  <div key={lesson.id} className="flex items-center gap-2">
    {/* lesson display */}
  </div>
))}
```

---

## How Difficulty Tiers Should Work

The difficulty system should work like this:

1. **Journey View**: Shows only Lesson 1, Lesson 2, Lesson 3, etc. (base lessons)
2. **Within a Lesson**: User starts at Easy tier, unlocks Medium after completing Easy, unlocks Hard after completing Medium
3. **Database Design**:
   - Lesson 1 Easy: `age6-t1-L1-morning-energy-boost` (difficulty_level: 1)
   - Lesson 1 Medium: `age6-t1-L1-morning-energy-boost-medium` (difficulty_level: 2)
   - Lesson 1 Hard: `age6-t1-L1-morning-energy-boost-hard` (difficulty_level: 3)

The medium and hard tiers are accessed through the Lesson Player, NOT as separate nodes in the journey.

---

## Files to Modify

1. **`server/routes/lessons.ts`** - Add `difficultyLevel = 1` filter to journey queries
2. **`client/src/pages/Lessons.tsx`** - Filter lessons client-side if needed
3. **Any topic/lessons sidebar component** - Apply same filter

---

## Quick Test After Fix

1. Navigate to the Lesson Journey page for a topic
2. Verify the path shows UNIQUE lesson titles (not repeated)
3. Verify the "Topic Lessons" sidebar shows unique lessons
4. Count should match: if there are 10 lessons, show 10 nodes (not 30 for 3 difficulty tiers each)

---

## Alternative: Group Lessons by Base ID

If you prefer to keep all lessons in the query but group them:

```typescript
// Group lessons by base lesson (remove difficulty suffix)
const lessonGroups = new Map();

lessons.forEach(lesson => {
  // Extract base lesson ID (remove -medium, -hard suffix)
  const baseId = lesson.id.replace(/-medium$/, '').replace(/-hard$/, '');

  if (!lessonGroups.has(baseId)) {
    lessonGroups.set(baseId, lesson); // Keep the first (Easy) version
  }
});

const uniqueLessons = Array.from(lessonGroups.values());
```

---

## GitHub Repository

**URL**: `https://github.com/bodega-shrubby/BiteBurst`

Look for these files:
- `server/routes/lessons.ts`
- `client/src/pages/Lessons.tsx`
- Any component rendering the lesson journey path
- Any component rendering the topic lessons sidebar

---

## Summary

| What | Current | Expected |
|------|---------|----------|
| Journey nodes | 3 (all "Morning Energy Boost") | 1 per unique lesson |
| Sidebar lessons | 3 repeated titles | Unique lesson titles |
| Difficulty handling | Each tier shown separately | Tiers within one lesson |
| Filter needed | None | `difficultyLevel = 1` |
