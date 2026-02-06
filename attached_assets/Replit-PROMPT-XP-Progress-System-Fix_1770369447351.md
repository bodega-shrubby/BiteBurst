# Replit Prompt: Fix XP Awards, Progress Saving & Duplicate Prevention

## Issues to Fix

1. **XP on 2nd/3rd attempt = 0** - The `calculateXP` function returns 0 for attempts 2 and 3 when no `retryConfig` exists
2. **Progress not saved** - Leaving mid-lesson and returning starts from the beginning
3. **Duplicate XP** - Completing a lesson/question twice still awards XP

---

## Part 1: Fix XP Calculation (Frontend)

### File: `client/src/pages/lessons/LessonPlayer.tsx`

**Find this function (around line 408):**
```typescript
const calculateXP = (step: LessonStep, attempt: number): number => {
  if (!hasFullRetryConfig(step.retryConfig)) {
    return attempt === 1 ? step.xpReward : 0;
  }

  if (attempt === 1) return step.retryConfig!.xp.firstTry;
  if (attempt === 2) return step.retryConfig!.xp.secondTry;
  return step.retryConfig!.xp.learnCard;
};
```

**Replace with this (includes default XP scaling):**
```typescript
const calculateXP = (step: LessonStep, attempt: number): number => {
  const baseXP = step.xpReward || 10;

  // If step has custom retryConfig, use those values
  if (hasFullRetryConfig(step.retryConfig)) {
    if (attempt === 1) return step.retryConfig!.xp.firstTry;
    if (attempt === 2) return step.retryConfig!.xp.secondTry;
    return step.retryConfig!.xp.learnCard;
  }

  // Default XP scaling when no retryConfig:
  // 1st attempt: 100% XP
  // 2nd attempt: 70% XP
  // 3rd attempt (learn card): 30% XP
  if (attempt === 1) return baseXP;
  if (attempt === 2) return Math.round(baseXP * 0.7);
  return Math.round(baseXP * 0.3); // Learn card
};
```

---

## Part 2: Save Progress Mid-Lesson

### 2A. Add State to Track Completed Steps

**In LessonPlayer.tsx, add this state (near other useState declarations):**
```typescript
const [completedStepIds, setCompletedStepIds] = useState<Set<string>>(new Set());
const [isReplay, setIsReplay] = useState(false); // True if replaying completed lesson
```

### 2B. Add API Endpoint to Save Progress

**File: `server/routes/lessons.ts`**

Add this new endpoint after the existing lesson routes:

```typescript
// Save lesson progress (called after each step completion)
lessonsRouter.post('/:lessonId/progress', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { userId, childId, currentStep, hearts, xpEarned, completedStepIds } = req.body;

    if (!userId || currentStep === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (childId) {
      // For additional children, store in lesson_attempts or a separate progress table
      // For now, we'll track via the lesson_attempts table
      // Progress is implicit from the attempts
    } else {
      // For primary child, update user_lesson_progress
      await db
        .insert(userLessonProgress)
        .values({
          userId,
          lessonId,
          currentStep,
          completed: false,
          totalXpEarned: xpEarned || 0,
          hearts: hearts || 5,
        })
        .onConflictDoUpdate({
          target: [userLessonProgress.userId, userLessonProgress.lessonId],
          set: {
            currentStep,
            totalXpEarned: xpEarned || 0,
            hearts: hearts || 5,
            updatedAt: new Date(),
          }
        });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to save progress:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Get lesson progress (to resume)
lessonsRouter.get('/:lessonId/progress', async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.query.userId as string;
    const childId = req.query.childId as string | undefined;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    let progress = null;
    let completedStepIds: string[] = [];

    if (childId) {
      // For additional children, get completed steps from lesson_attempts
      const attempts = await db
        .select({
          stepId: lessonAttempts.stepId,
          stepNumber: lessonAttempts.stepNumber,
          isCorrect: lessonAttempts.isCorrect,
          usedLearnCard: lessonAttempts.usedLearnCard,
        })
        .from(lessonAttempts)
        .where(and(
          eq(lessonAttempts.childId, childId),
          eq(lessonAttempts.lessonId, lessonId),
          or(
            eq(lessonAttempts.isCorrect, true),
            eq(lessonAttempts.usedLearnCard, true)
          )
        ));

      completedStepIds = attempts.map(a => a.stepId);
      const maxStep = Math.max(...attempts.map(a => a.stepNumber), 0);

      progress = {
        currentStep: maxStep + 1,
        hearts: 5, // Could track this too
        totalXpEarned: 0, // Could sum from attempts
        completedStepIds,
      };
    } else {
      // For primary child, get from user_lesson_progress
      const [existingProgress] = await db
        .select()
        .from(userLessonProgress)
        .where(and(
          eq(userLessonProgress.userId, userId),
          eq(userLessonProgress.lessonId, lessonId)
        ))
        .limit(1);

      if (existingProgress) {
        // Also get completed step IDs from attempts
        const attempts = await db
          .select({ stepId: lessonAttempts.stepId })
          .from(lessonAttempts)
          .where(and(
            eq(lessonAttempts.userId, userId),
            eq(lessonAttempts.lessonId, lessonId),
            or(
              eq(lessonAttempts.isCorrect, true),
              eq(lessonAttempts.usedLearnCard, true)
            )
          ));

        completedStepIds = attempts.map(a => a.stepId);

        progress = {
          currentStep: existingProgress.currentStep,
          hearts: existingProgress.hearts,
          totalXpEarned: existingProgress.totalXpEarned,
          completed: existingProgress.completed,
          completedStepIds,
        };
      }
    }

    res.json({ progress });
  } catch (error) {
    console.error('Failed to get progress:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});
```

### 2C. Load Progress on Lesson Start (Frontend)

**In LessonPlayer.tsx, add a query to load existing progress:**

```typescript
// Add this query near the top of the component, after the lesson query
const { data: existingProgress } = useQuery({
  queryKey: ['lesson-progress', lessonId, user?.id, activeChild?.childId],
  queryFn: async () => {
    const params = new URLSearchParams({
      userId: user!.id,
      ...(activeChild?.childId && { childId: activeChild.childId })
    });
    const res = await fetch(`/api/lessons/${lessonId}/progress?${params}`);
    if (!res.ok) return null;
    return res.json();
  },
  enabled: !!user?.id && !!lessonId,
});

// Add useEffect to restore progress when loaded
useEffect(() => {
  if (existingProgress?.progress && lessonData?.steps) {
    const { currentStep, hearts, totalXpEarned, completed, completedStepIds } = existingProgress.progress;

    if (completed) {
      // Lesson was already completed - this is a replay
      setIsReplay(true);
      setCurrentStepIndex(0); // Start from beginning for replay
    } else if (currentStep > 1) {
      // Resume from saved position
      const resumeIndex = Math.min(currentStep - 1, lessonData.steps.length - 1);
      setCurrentStepIndex(resumeIndex);
      setLives(hearts || 5);
      setTotalXpEarned(totalXpEarned || 0);
      setCompletedStepIds(new Set(completedStepIds || []));
    }
  }
}, [existingProgress, lessonData]);
```

### 2D. Save Progress After Each Step

**In LessonPlayer.tsx, add a mutation to save progress:**

```typescript
const saveProgressMutation = useMutation({
  mutationFn: async (data: { currentStep: number; hearts: number; xpEarned: number }) => {
    if (!user?.id) return;

    await fetch(`/api/lessons/${lessonId}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        childId: activeChild?.childId,
        currentStep: data.currentStep,
        hearts: data.hearts,
        xpEarned: data.xpEarned,
      })
    });
  }
});
```

**Call it when moving to next step (in handleContinue or similar):**

```typescript
// After moving to next step, save progress
saveProgressMutation.mutate({
  currentStep: currentStepIndex + 2, // +2 because we just completed current step
  hearts: lives,
  xpEarned: totalXpEarned,
});
```

---

## Part 3: Prevent Duplicate XP Awards

### 3A. Check if Step Already Completed Before Awarding XP

**Modify the answer submission logic in LessonPlayer.tsx:**

```typescript
// In the onSuccess handler for submitAnswer, before awarding XP:
if (response.correct) {
  const stepId = currentStep?.id;

  // Check if this step was already completed (no XP for replays)
  const isFirstTimeCompletion = stepId && !completedStepIds.has(stepId);

  // Only award XP on first-time completion
  const xpEarned = isFirstTimeCompletion
    ? (calculateXP(currentStep, currentAttempt) ?? 0)
    : 0;

  if (isFirstTimeCompletion && stepId) {
    setTotalXpEarned(prev => prev + xpEarned);
    setCompletedStepIds(prev => new Set([...prev, stepId]));
  }

  // ... rest of success handling
}
```

### 3B. Server-Side Duplicate Check

**In `server/routes/lessons.ts`, modify the answer submission endpoint:**

```typescript
// Before awarding XP, check if step was already completed
const existingCompletion = await db
  .select()
  .from(lessonAttempts)
  .where(and(
    childId
      ? eq(lessonAttempts.childId, childId)
      : eq(lessonAttempts.userId, userId),
    eq(lessonAttempts.lessonId, lessonId),
    eq(lessonAttempts.stepId, stepId),
    or(
      eq(lessonAttempts.isCorrect, true),
      eq(lessonAttempts.usedLearnCard, true)
    )
  ))
  .limit(1);

const isFirstTimeCompletion = existingCompletion.length === 0;
const xpAwarded = isCorrect && isFirstTimeCompletion ? xpReward : 0;
```

### 3C. Mark Lesson Replay in Completion

**Modify `markLessonComplete` to track replays:**

```typescript
// In storage.ts markLessonComplete function
// Add a check for existing completion and don't update XP on replay

const existingCompletion = await db
  .select()
  .from(userLessonProgress)
  .where(and(
    eq(userLessonProgress.userId, userId),
    eq(userLessonProgress.lessonId, lessonId),
    eq(userLessonProgress.completed, true)
  ))
  .limit(1);

const isReplay = existingCompletion.length > 0;

// Only award XP if not a replay
const finalXp = isReplay ? 0 : xpEarned;
```

---

## Summary of Changes

| Area | File | Change |
|------|------|--------|
| **XP Calculation** | `LessonPlayer.tsx` | Add default XP scaling (100%/70%/30%) when no retryConfig |
| **Save Progress** | `server/routes/lessons.ts` | Add POST `/progress` endpoint |
| **Load Progress** | `server/routes/lessons.ts` | Add GET `/progress` endpoint |
| **Resume Lesson** | `LessonPlayer.tsx` | Load existing progress on mount, resume from saved step |
| **Duplicate Prevention** | `LessonPlayer.tsx` | Track completed step IDs, skip XP on replays |
| **Duplicate Prevention** | `server/routes/lessons.ts` | Check for existing completion before awarding XP |

---

## XP System Overview

| Scenario | XP Awarded |
|----------|------------|
| Correct on 1st attempt | 100% (10 XP) |
| Correct on 2nd attempt | 70% (7 XP) |
| Correct on 3rd attempt / Learn card | 30% (3 XP) |
| Replay (already completed) | 0 XP |

---

## Testing Checklist

After implementing these changes:

- [ ] Answer correctly on 1st attempt → Full XP awarded
- [ ] Answer correctly on 2nd attempt → 70% XP awarded
- [ ] Answer correctly on 3rd attempt → 30% XP awarded
- [ ] Leave mid-lesson, return → Resume from saved step
- [ ] Complete lesson, replay it → 0 XP awarded
- [ ] Complete same question twice → XP only awarded first time
