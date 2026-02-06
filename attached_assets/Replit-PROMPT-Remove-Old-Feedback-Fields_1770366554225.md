# Replit Prompt: Remove Dead Code & Consolidate Types

## Overview
The database now uses a consistent nested feedback structure. This prompt removes legacy field checks and consolidates duplicate type definitions.

---

## Part 1: Remove Legacy Field Checks

### File: `client/src/pages/lessons/LessonPlayer.tsx`

**Find this code (around lines 131-147):**
```typescript
const getStepFeedbackMessage = (step: LessonStep | undefined, type: 'hint_after_2' | 'motivating_fail'): string | undefined => {
  if (!step) return undefined;

  if (type === 'hint_after_2') {
    const hint = (step.content as any).hint;
    if (hint) return hint;
  }
  if (type === 'motivating_fail') {
    const incorrectFb = (step.content as any).incorrectFeedback;
    if (incorrectFb) return incorrectFb;
  }

  const feedback = step.content.feedback;
  if (!feedback) return undefined;
  if (typeof feedback === 'string') return undefined;
  return type === 'hint_after_2' ? feedback.hint_after_2 : feedback.motivating_fail;
};
```

**Replace with:**
```typescript
const getStepFeedbackMessage = (step: LessonStep | undefined, type: 'hint_after_2' | 'motivating_fail'): string | undefined => {
  if (!step) return undefined;
  const feedback = step.content.feedback;
  if (!feedback) return undefined;
  if (typeof feedback === 'string') return undefined;
  return type === 'hint_after_2' ? feedback.hint_after_2 : feedback.motivating_fail;
};
```

---

### File: `client/src/pages/lessons/components/LessonSuccess.tsx`

**Find this function (around lines 5-17):**
```typescript
function getFeedbackText(feedback: FeedbackType | undefined, type: 'success' | 'hint' | 'fail' = 'success', content?: any): string | undefined {
  if (type === 'success' && content?.successFeedback) {
    return content.successFeedback;
  }
  if (!feedback) return undefined;
  if (typeof feedback === 'string') return feedback;
  switch (type) {
    case 'success': return feedback.success;
    case 'hint': return feedback.hint_after_2;
    case 'fail': return feedback.motivating_fail;
    default: return feedback.success;
  }
}
```

**Replace with:**
```typescript
function getFeedbackText(feedback: FeedbackType | undefined, type: 'success' | 'hint' | 'fail' = 'success'): string | undefined {
  if (!feedback) return undefined;
  if (typeof feedback === 'string') return feedback;
  switch (type) {
    case 'success': return feedback.success;
    case 'hint': return feedback.hint_after_2;
    case 'fail': return feedback.motivating_fail;
    default: return feedback.success;
  }
}
```

**Also update all calls** - remove the third `content` parameter:
```typescript
// Find all instances of:
getFeedbackText(step.content.feedback, 'success', step.content)

// Replace with:
getFeedbackText(step.content.feedback, 'success')
```

---

## Part 2: Consolidate Duplicate Type Definitions

Currently, `FeedbackType` and `LessonStep` are defined in multiple files. Create a shared types file.

### Create: `client/src/pages/lessons/types.ts`

```typescript
// Shared types for lesson components

export type FeedbackType = string | {
  success?: string;
  hint_after_2?: string;
  motivating_fail?: string;
};

export interface LessonStep {
  id: string;
  stepNumber: number;
  questionType: 'multiple-choice' | 'true-false' | 'matching' | 'label-reading' | 'ordering' | 'tap-pair' | 'fill-blank' | 'lesson-content';
  question: string;
  content: {
    options?: Array<{ id: string; text: string; emoji?: string; correct?: boolean }> | string[];
    correctAnswer?: string | boolean;
    correctPair?: string[];
    feedback?: FeedbackType;
    matchingPairs?: Array<{ left: string; right: string }>;
    pairs?: Array<{ id?: string; left: string; right: string }>;
    labelOptions?: Array<{ id: string; name: string; sugar: string; fiber: string; protein: string; correct?: boolean }>;
    orderingItems?: Array<{ id: string; text: string; correctOrder: number }>;
    items?: Array<{ id: string; text: string; category: string }>;
    blanks?: Array<{ id: string; correctAnswer: string; hint?: string; acceptableAnswers?: string[] }>;
    sentence?: string;
    rememberCards?: Array<{ title: string; content: string; emoji?: string }>;
  };
  xpReward: number;
  mascotAction?: string;
}
```

### Update imports in each file:

**LessonPlayer.tsx:**
```typescript
import { FeedbackType, LessonStep } from './types';
// Remove local FeedbackType and LessonStep definitions
```

**LessonSuccess.tsx:**
```typescript
import { FeedbackType, LessonStep } from '../types';
// Remove local FeedbackType and LessonStep definitions
```

**LessonAsking.tsx:**
```typescript
import { LessonStep } from '../types';
// Remove local LessonStep definition
```

---

## Part 3: Remove Old Fields from LessonStep Interface

In the new shared `types.ts`, notice the `content` object does NOT include:
- ~~`successFeedback?: string`~~ (removed)
- ~~`incorrectFeedback?: string`~~ (removed)
- ~~`hint?: string`~~ (removed - at top level)

**Note:** Keep `hint` inside the `blanks` array - that's a different feature for inline fill-blank hints.

---

## Summary of Changes

| File | Action |
|------|--------|
| `LessonPlayer.tsx` | Remove legacy `content.hint` and `content.incorrectFeedback` checks |
| `LessonPlayer.tsx` | Import types from shared `types.ts` |
| `LessonSuccess.tsx` | Remove `content` parameter from `getFeedbackText()` |
| `LessonSuccess.tsx` | Update all `getFeedbackText()` calls |
| `LessonSuccess.tsx` | Import types from shared `types.ts` |
| `LessonAsking.tsx` | Import types from shared `types.ts` |
| `types.ts` | Create new shared types file |

---

## Files with Duplicate Definitions (to consolidate)

| Type | Currently Defined In |
|------|---------------------|
| `FeedbackType` | `LessonPlayer.tsx` (line 32), `LessonSuccess.tsx` (line 3) |
| `LessonStep` | `LessonPlayer.tsx` (line 58), `LessonSuccess.tsx` (line 19), `LessonAsking.tsx` (line 14) |

After consolidation, each type will be defined once in `types.ts` and imported where needed.
