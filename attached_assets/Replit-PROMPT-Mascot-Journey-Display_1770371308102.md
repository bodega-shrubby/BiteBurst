# Replit Prompt: Display Lesson Mascots in Journey Component

## Overview
Update the LessonJourney component to display mascot images beside each lesson group. Mascots should be:
- **Colored** when the lesson is unlocked/current/completed
- **Greyscale** when the lesson is locked

---

## Part 1: Update API to Return Mascot Data

### File: `server/routes/topics.ts`

Modify the `/api/topics/:topicId/lessons` endpoint to include mascot details:

**Find this section (around line 74-89):**
```typescript
return {
  id: lesson.id,
  title: lesson.title,
  description: lesson.description,
  topicId: lesson.topicId,
  difficultyLevel: lesson.difficultyLevel,
  learningTakeaway: lesson.learningTakeaway,
  mascotIntro: lesson.mascotIntro,
  mascotId: lesson.mascotId,
  orderInUnit: lesson.orderInUnit,
  totalSteps: lesson.totalSteps,
  iconEmoji: lesson.iconEmoji,
  estimatedMinutes: lesson.estimatedMinutes,
  state,
};
```

**Replace with (adds mascot details):**
```typescript
// Fetch mascot details if mascotId exists
let mascot = null;
if (lesson.mascotId) {
  mascot = await storage.getMascotById(lesson.mascotId);
}

return {
  id: lesson.id,
  title: lesson.title,
  description: lesson.description,
  topicId: lesson.topicId,
  difficultyLevel: lesson.difficultyLevel,
  learningTakeaway: lesson.learningTakeaway,
  mascotIntro: lesson.mascotIntro,
  mascotId: lesson.mascotId,
  mascot: mascot ? {
    id: mascot.id,
    name: mascot.name,
    emoji: mascot.emoji,
    imagePath: mascot.imagePath,
  } : null,
  orderInUnit: lesson.orderInUnit,
  totalSteps: lesson.totalSteps,
  iconEmoji: lesson.iconEmoji,
  estimatedMinutes: lesson.estimatedMinutes,
  state,
};
```

---

## Part 2: Update LessonJourney Component

### File: `client/src/components/LessonJourney.tsx`

### 2A. Add Mascot Imports

Add these imports at the top of the file:

```typescript
// Import mascot images
import appleBuddyImage from '@assets/Mascots/AppleBuddy.png';
import brainyBoltImage from '@assets/Mascots/BrainyBolt.png';
import captainCarrotImage from '@assets/Mascots/CaptainCarrot.png';
import coachFlexImage from '@assets/Mascots/CoachFlex.png';
import danceStarImage from '@assets/Mascots/DanceStar.png';
import hydroHeroImage from '@assets/Mascots/HydroHero.png';
import professorBloopImage from '@assets/Mascots/ProfessorBloop.png';
import snackTwinsImage from '@assets/Mascots/SnackTwins.png';
import yumYumImage from '@assets/Mascots/YumYum.png';

// Mascot image mapping
const mascotImages: Record<string, string> = {
  'apple-buddy': appleBuddyImage,
  'brainy-bolt': brainyBoltImage,
  'captain-carrot': captainCarrotImage,
  'coach-flex': coachFlexImage,
  'dance-star': danceStarImage,
  'hydro-hero': hydroHeroImage,
  'professor-bloop': professorBloopImage,
  'snack-twins': snackTwinsImage,
  'yum-yum': yumYumImage,
};

// Default mascot for lessons without one assigned
const DEFAULT_MASCOT = 'professor-bloop';
```

### 2B. Update Lesson Interface

Update the `Lesson` interface to include mascot data:

```typescript
interface Lesson {
  id: string;
  title: string;
  icon: string;
  state: 'completed' | 'current' | 'unlocked' | 'locked';
  xp: number;
  topicId?: string;
  topicTitle?: string;
  difficultyLevel: number;
  mascotId?: string;  // Add this
  mascot?: {          // Add this
    id: string;
    name: string;
    emoji: string;
    imagePath: string | null;
  } | null;
}
```

### 2C. Update LessonGroup Interface

```typescript
interface LessonGroup {
  baseId: string;
  baseName: string;
  icon: string;
  mascotId: string | null;  // Add this
  levels: Lesson[];
}
```

### 2D. Update groupLessonsByBaseId Function

Modify to capture mascot from the first lesson in each group:

```typescript
function groupLessonsByBaseId(lessons: Lesson[]): LessonGroup[] {
  const groups = new Map<string, LessonGroup>();

  lessons.forEach(lesson => {
    const baseId = lesson.id
      .replace(/-medium$/, '')
      .replace(/-hard$/, '');

    const baseName = lesson.title
      .replace(/ - Level \d$/, '')
      .replace(/ - Level 1$/, '')
      .replace(/ - Level 2$/, '')
      .replace(/ - Level 3$/, '');

    if (!groups.has(baseId)) {
      groups.set(baseId, {
        baseId,
        baseName,
        icon: lesson.icon,
        mascotId: lesson.mascotId || null,  // Capture mascot from first lesson
        levels: []
      });
    }

    groups.get(baseId)!.levels.push(lesson);
  });

  groups.forEach(group => {
    group.levels.sort((a, b) => a.difficultyLevel - b.difficultyLevel);
  });

  return Array.from(groups.values());
}
```

### 2E. Add getMascotImage Helper Function

```typescript
const getMascotImage = (mascotId: string | null): string => {
  if (!mascotId) return mascotImages[DEFAULT_MASCOT];
  return mascotImages[mascotId] || mascotImages[DEFAULT_MASCOT];
};
```

### 2F. Add Mascot Display in Render (Alternating Left-Right)

The mascots should alternate positions to follow the winding path:
- When lesson card is on the **LEFT** (isEven) → Mascot on the **RIGHT**
- When lesson card is on the **RIGHT** (!isEven) → Mascot on the **LEFT**

**Find this section (around line 181-215) in the lesson rendering:**

```typescript
return (
  <div key={lesson.id}>
    <div
      className={`flex items-center mb-12 ${isEven ? 'justify-start pl-4' : 'justify-end pr-4'}`}
    >
      {/* ... existing node and card code ... */}
    </div>
  </div>
);
```

**Replace with this code that alternates mascot position:**

```typescript
return (
  <div key={lesson.id}>
    <div
      className={`flex items-center mb-12 ${isEven ? 'justify-start pl-4' : 'justify-end pr-4'}`}
    >
      <div
        className={`flex items-center gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse'} ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={() => isClickable && onLessonClick(lesson.id)}
      >
        {/* MASCOT IMAGE - LEFT SIDE (when lesson is on right, !isEven) */}
        {levelIndex === 0 && !isEven && (
          <div className={`w-20 h-20 transition-all flex-shrink-0 ${lesson.state === 'locked' ? 'grayscale opacity-50' : ''}`}>
            <img
              src={getMascotImage(group.mascotId)}
              alt={`${group.baseName} mascot`}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        )}

        {/* Existing node circle */}
        <div
          className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-transform flex-shrink-0 ${isClickable ? 'hover:scale-110' : ''} ${getNodeStyle(lesson.state)}`}
        >
          {lesson.state === 'completed' ? (
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          ) : (
            <span className={`text-2xl ${lesson.state === 'locked' ? 'grayscale opacity-40' : ''}`}>
              {themedIcon}
            </span>
          )}
        </div>

        {/* Lesson card */}
        <div className={`bg-white rounded-xl px-4 py-2 shadow-lg max-w-[180px] border transition-shadow ${isClickable ? 'hover:shadow-xl' : ''} ${getBorderStyle(lesson.state)}`}>
          <p className="font-bold text-sm text-gray-800">{group.baseName}</p>
          <p className="text-xs text-gray-500">{getLevelLabel(lesson.difficultyLevel)}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-green-600 font-medium">+{lesson.xp} XP</span>
            {lesson.state === 'current' && (
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">START</span>
            )}
            {lesson.state === 'completed' && (
              <span className="text-green-500 text-xs">✓</span>
            )}
          </div>
        </div>

        {/* MASCOT IMAGE - RIGHT SIDE (when lesson is on left, isEven) */}
        {levelIndex === 0 && isEven && (
          <div className={`w-20 h-20 transition-all flex-shrink-0 ${lesson.state === 'locked' ? 'grayscale opacity-50' : ''}`}>
            <img
              src={getMascotImage(group.mascotId)}
              alt={`${group.baseName} mascot`}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  </div>
);
```

**Visual Layout:**
```
[Lesson Card] [Node] [Mascot]    ← isEven (left side)
     [Mascot] [Node] [Lesson Card]    ← !isEven (right side)
[Lesson Card] [Node] [Mascot]    ← isEven (left side)
```

---

## Part 3: Update Lessons.tsx to Pass Mascot Data

### File: `client/src/pages/Lessons.tsx`

Ensure the lesson data passed to LessonJourney includes mascot information.

In the API response processing, make sure `mascotId` is included:

```typescript
const journeyLessons = lessonsData.map((lesson: any) => ({
  id: lesson.id,
  title: lesson.title,
  icon: lesson.iconEmoji || '📚',
  state: lesson.state,
  xp: lesson.totalSteps * 5 || 15,
  topicId: topicData?.id,
  topicTitle: topicData?.title,
  difficultyLevel: lesson.difficultyLevel || 1,
  mascotId: lesson.mascotId,  // Add this
  mascot: lesson.mascot,       // Add this
}));
```

---

## Mascot Assignment for New Lessons

When adding new lessons to the database, assign mascots based on this mapping:

| Lesson Topic/Keywords | Mascot ID |
|----------------------|-----------|
| Morning, breakfast, energy, fruit, apple | `apple-buddy` |
| Brain, focus, learning, school, memory | `brainy-bolt` |
| Vegetables, veggies, carrot, garden | `captain-carrot` |
| Exercise, sports, fitness, muscles | `coach-flex` |
| Dance, movement, activity, play | `dance-star` |
| Water, hydration, drinks, fluids | `hydro-hero` |
| General education, intro, basics | `professor-bloop` |
| Snacks, snacking, treats | `snack-twins` |
| Super foods, nutrition, healthy eating | `yum-yum` |

**Default:** `professor-bloop`

---

## Summary of Changes

| File | Change |
|------|--------|
| `server/routes/topics.ts` | Add mascot details to lesson response |
| `LessonJourney.tsx` | Import mascot images, update interfaces, add mascot display |
| `Lessons.tsx` | Pass mascotId and mascot data to LessonJourney |

---

## Expected Result

After implementing these changes:
- Each lesson group shows its assigned mascot beside the first level
- Mascots are colored when lessons are unlocked/current/completed
- Mascots are greyscale when lessons are locked
- New lessons automatically display their assigned mascot
