# Replit Agent Prompt: Lesson Journey with 3-Level Flow + Treasure Chest

## Priority: HIGH

---

## Overview

Update the Lesson Journey page to show the new simplified learning flow:

```
Lesson 1: Morning Energy Boost
  ├── Level 1 ✓ (completed)
  ├── Level 2 ▶ (current/unlocked)
  ├── Level 3 🔒 (locked until Level 2 done)
  └── 🎁 Treasure Chest (unlocks after Level 3)

Lesson 2: [Next Lesson]
  ├── Level 1 🔒 (locked until Lesson 1 complete)
  ├── Level 2 🔒
  ├── Level 3 🔒
  └── 🎁 Treasure Chest
```

---

## Key Rules

1. **Each lesson has 3 levels** - Level 1, Level 2, Level 3 (same content, increasing difficulty)
2. **Sequential progression** - Must complete Level 1 to unlock Level 2, Level 2 to unlock Level 3
3. **NO score requirement** - Simply completing a level unlocks the next one (no 80% threshold)
4. **Treasure Chest reward** - After completing Level 3 of each lesson, a treasure chest unlocks
5. **Lesson progression** - Must complete all 3 levels + claim treasure to move to next lesson

---

## Database Structure (Already Updated)

The lessons are now named with level indicators:

| Lesson ID | Title | Difficulty Level |
|-----------|-------|------------------|
| `age6-t1-L1-morning-energy-boost` | Morning Energy Boost - Level 1 | 1 |
| `age6-t1-L1-morning-energy-boost-medium` | Morning Energy Boost - Level 2 | 2 |
| `age6-t1-L1-morning-energy-boost-hard` | Morning Energy Boost - Level 3 | 3 |

---

## UI Updates Required

### 1. Winding Path Journey

Show ALL 3 levels of each lesson in the path, plus treasure chest:

```
[Level 1 Node] ── "Morning Energy Boost - Level 1" (+15 XP) ✓
        │
        ▼
[Level 2 Node] ── "Morning Energy Boost - Level 2" (+15 XP) START
        │
        ▼
[Level 3 Node] ── "Morning Energy Boost - Level 3" (+15 XP) 🔒
        │
        ▼
[🎁 Treasure] ── "Checkpoint Reward" (+50 XP) 🔒
        │
        ▼
[Level 1 Node] ── "[Lesson 2] - Level 1" (+15 XP) 🔒
        ...
```

### 2. Node Styling

**Level Nodes:**
| State | Style | Icon |
|-------|-------|------|
| Completed | `bg-green-500 border-green-600 text-white` | ✓ |
| Current/Active | `bg-orange-500 border-orange-600 text-white animate-pulse` | Lesson emoji |
| Unlocked | `bg-blue-100 border-blue-300 text-blue-700` | Lesson emoji |
| Locked | `bg-gray-200 border-gray-300 text-gray-400` | 🔒 |

**Treasure Chest Node:**
| State | Style | Icon |
|-------|-------|------|
| Locked | `bg-amber-100 border-amber-200 opacity-50` | 🎁 (faded) |
| Unlocked (ready to claim) | `bg-amber-400 border-amber-500 animate-bounce` | 🎁 (glowing) |
| Claimed | `bg-amber-500 border-amber-600` | ✨ |

### 3. Topic Lessons Sidebar

Update the "Topic Lessons" panel to show:

```
Topic Lessons                           1/3
─────────────────────────────────────────
✓  Morning Energy Boost - Level 1      ✓
2  Morning Energy Boost - Level 2      ▶
3  Morning Energy Boost - Level 3      🔒
🎁 Checkpoint Reward                   1/3
─────────────────────────────────────────
```

### 4. Progress Calculation

Progress should be calculated as:
- Each lesson has 4 items: Level 1 + Level 2 + Level 3 + Treasure
- If user completed Level 1 of Lesson 1: `1/4` for that lesson, `1/12` for topic (3 lessons)
- Display both lesson progress and topic progress

---

## Code Changes

### File: `client/src/pages/Lessons.tsx`

```typescript
// Fetch all lessons for the topic (all difficulty levels)
const allLessons = await fetchLessonsForTopic(topicId);

// Group lessons by base lesson ID
const lessonGroups = groupLessonsByBaseId(allLessons);

// Helper function to group
function groupLessonsByBaseId(lessons) {
  const groups = new Map();

  lessons.forEach(lesson => {
    // Extract base ID (remove -medium, -hard suffix)
    const baseId = lesson.id
      .replace(/-medium$/, '')
      .replace(/-hard$/, '');

    if (!groups.has(baseId)) {
      groups.set(baseId, {
        baseId,
        baseName: lesson.title.replace(/ - Level \d$/, ''),
        levels: []
      });
    }

    groups.get(baseId).levels.push(lesson);
  });

  // Sort levels within each group
  groups.forEach(group => {
    group.levels.sort((a, b) => a.difficultyLevel - b.difficultyLevel);
  });

  return Array.from(groups.values());
}

// Render the journey with levels and treasure chests
{lessonGroups.map((lessonGroup, groupIndex) => (
  <React.Fragment key={lessonGroup.baseId}>
    {/* Render all 3 levels */}
    {lessonGroup.levels.map((level, levelIndex) => (
      <LessonNode
        key={level.id}
        lesson={level}
        state={getLevelState(level, userProgress)}
        position={calculatePosition(groupIndex, levelIndex)}
      />
    ))}

    {/* Render Treasure Chest after Level 3 */}
    <TreasureChestNode
      lessonGroupId={lessonGroup.baseId}
      isUnlocked={allLevelsComplete(lessonGroup, userProgress)}
      isClaimed={treasureClaimed(lessonGroup.baseId, userProgress)}
      position={calculatePosition(groupIndex, 3)}
    />
  </React.Fragment>
))}
```

### File: `server/routes/lessons.ts`

Update progression logic - NO 80% requirement:

```typescript
// When lesson is completed, check if next level should unlock
app.post("/api/lessons/:lessonId/complete", async (req, res) => {
  const { lessonId } = req.params;
  const { childId } = req.body;

  // Mark current level as complete
  await storage.markLessonComplete(childId, lessonId);

  // Determine next level to unlock (no score check needed!)
  const currentLevel = await storage.getLesson(lessonId);

  if (currentLevel.difficultyLevel < 3) {
    // Unlock next difficulty level of same lesson
    const nextLevelId = getNextLevelId(lessonId, currentLevel.difficultyLevel);
    await storage.unlockLesson(childId, nextLevelId);
  } else {
    // Level 3 complete - unlock treasure chest
    await storage.unlockTreasure(childId, getBaseLessonId(lessonId));
  }

  res.json({ success: true });
});
```

### Helper Functions

```typescript
// Get next level ID based on current
function getNextLevelId(currentId: string, currentLevel: number) {
  const baseId = currentId.replace(/-medium$/, '').replace(/-hard$/, '');

  switch (currentLevel) {
    case 1: return `${baseId}-medium`;  // Level 1 → Level 2
    case 2: return `${baseId}-hard`;    // Level 2 → Level 3
    default: return null;               // Level 3 → Treasure
  }
}

// Check if all levels of a lesson are complete
function allLevelsComplete(lessonGroup, userProgress) {
  return lessonGroup.levels.every(level =>
    userProgress.completedLessons.includes(level.id)
  );
}
```

---

## Treasure Chest Implementation

### Database: Add to `child_rewards` or similar table

```sql
CREATE TABLE IF NOT EXISTS child_treasures (
  id VARCHAR PRIMARY KEY,
  child_id VARCHAR NOT NULL REFERENCES children(id),
  lesson_base_id VARCHAR NOT NULL,  -- e.g., 'age6-t1-L1-morning-energy-boost'
  unlocked_at TIMESTAMP,
  claimed_at TIMESTAMP,
  xp_reward INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Treasure Chest Component

```tsx
function TreasureChestNode({ lessonGroupId, isUnlocked, isClaimed, position }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClaim = async () => {
    if (!isUnlocked || isClaimed) return;

    setIsOpening(true);
    await claimTreasure(lessonGroupId);
    // Show celebration animation
    confetti();
    setIsOpening(false);
  };

  return (
    <div
      className={`
        w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-3xl
        cursor-pointer transition-all
        ${isClaimed
          ? 'bg-amber-500 border-amber-600'
          : isUnlocked
            ? 'bg-amber-400 border-amber-500 animate-bounce shadow-lg shadow-amber-300'
            : 'bg-amber-100 border-amber-200 opacity-50'
        }
      `}
      onClick={handleClaim}
    >
      {isClaimed ? '✨' : '🎁'}
    </div>
  );
}
```

### Treasure Claim API

```typescript
app.post("/api/treasures/:lessonBaseId/claim", async (req, res) => {
  const { lessonBaseId } = req.params;
  const { childId } = req.body;

  // Verify all 3 levels are complete
  const levels = await storage.getLessonLevels(lessonBaseId);
  const progress = await storage.getChildProgress(childId);

  const allComplete = levels.every(level =>
    progress.completedLessons.includes(level.id)
  );

  if (!allComplete) {
    return res.status(400).json({ error: "Complete all levels first!" });
  }

  // Award XP and mark claimed
  await storage.claimTreasure(childId, lessonBaseId);
  await storage.addXP(childId, 50); // Treasure reward

  // Unlock next lesson's Level 1
  const nextLesson = await storage.getNextLesson(lessonBaseId);
  if (nextLesson) {
    await storage.unlockLesson(childId, nextLesson.id);
  }

  res.json({
    success: true,
    xpEarned: 50,
    message: "🎉 Treasure claimed! You earned 50 XP!"
  });
});
```

---

## Visual Mockup

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Topics  │ Unit 1                                  │
├─────────────────────────────────────────────────────────────┤
│ ⚡ Fuel Up Academy                                          │
│ Food as energy - learn what makes you strong!               │
│                                                             │
│ [3 Levels] [~15 min]    Progress ████████░░░░ 33%          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     ┌──────────────────────────────────┐                   │
│     │  ✓  Morning Energy Boost         │                   │
│     │      Level 1    +15 XP  ✓        │                   │
│     └──────────────────────────────────┘                   │
│              │                                              │
│              ▼                                              │
│         ┌──────────────────────────────────┐               │
│         │  ⚡ Morning Energy Boost         │               │
│         │      Level 2    +15 XP  START   │               │
│         └──────────────────────────────────┘               │
│                   │                                         │
│                   ▼                                         │
│              ┌──────────────────────────────────┐          │
│              │  🔒 Morning Energy Boost         │          │
│              │      Level 3    +15 XP           │          │
│              └──────────────────────────────────┘          │
│                        │                                    │
│                        ▼                                    │
│                   ┌─────────┐                              │
│                   │   🎁    │  Checkpoint Reward           │
│                   │ +50 XP  │  Complete all levels!        │
│                   └─────────┘                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

| Item | Change |
|------|--------|
| Lesson naming | "Morning Energy Boost - Level 1/2/3" |
| Journey display | Show all 3 levels + treasure chest |
| Unlock requirement | Completion only (no 80% rule) |
| Treasure chest | After Level 3, awards +50 XP |
| Progression | Level 1 → Level 2 → Level 3 → 🎁 → Next Lesson |

---

## Testing Checklist

- [ ] Journey shows all 3 levels of each lesson
- [ ] Levels show as "Level 1", "Level 2", "Level 3"
- [ ] Completing Level 1 unlocks Level 2 (no score requirement)
- [ ] Completing Level 2 unlocks Level 3
- [ ] Completing Level 3 shows treasure chest as unlocked
- [ ] Clicking treasure chest awards XP and shows celebration
- [ ] After claiming treasure, next lesson's Level 1 unlocks
- [ ] Progress bar reflects levels completed
- [ ] Sidebar shows all levels with correct states

---

## GitHub Repository

**URL**: `https://github.com/bodega-shrubby/BiteBurst`

Files to modify:
- `client/src/pages/Lessons.tsx`
- `server/routes/lessons.ts`
- `server/storage.ts`
- Add new treasure chest components and API routes
