# Replit Agent Prompt 1: Schema & API Migration
## Priority: HIGH - Do This First

---

## 🚨 CRITICAL: Why Questions Aren't Loading

The **database has been updated** but the **codebase has NOT**. There's a mismatch:

| Component | Currently Uses | Database Has |
|-----------|----------------|--------------|
| Code | `yearGroup` + `curriculumId` | ❌ Columns removed |
| Database | `age` (integer 6-14) | ✅ Column exists |

**Result**: API queries non-existent columns → zero lessons returned → app broken.

---

## Overview

Update the codebase to match the simplified database schema:
- **Old system**: `curriculumId` + `yearGroup` (complex, curriculum-based)
- **New system**: `age` + `locale` (simple, age-based)

---

## 1. Database Changes Already Made (Reference Only)

The following changes have **already been applied to Supabase** - you need to update the code to match:

### Added Columns:
- `children.age` (integer) - Child's age 6-14
- `lessons.age` (integer) - Target age for lesson
- `topics.age` (integer) - Target age for topic
- `lesson_steps.content_variants` (jsonb) - UK/US English content variants

### Removed Columns:
- `children.year_group`, `children.curriculum_id`, `children.curriculum_country`
- `lessons.curriculum_id`, `lessons.year_group`
- `topics.curriculum_id`, `topics.year_group`
- `users.curriculum`, `users.curriculum_id`, `users.year_group`, `users.curriculum_country`

### Dropped Tables:
- `curriculums` (deleted)
- `year_group_mappings` (deleted)

### New Question Type:
- Added `lesson-content` to the `question_type` enum

---

## 2. Update Drizzle Schema (`shared/schema.ts`)

### Delete These Table Definitions Entirely:
```typescript
// DELETE the curriculums table (around line 51-58)
export const curriculums = pgTable("curriculums", { ... });

// DELETE the yearGroupMappings table (around line 313-319)
export const yearGroupMappings = pgTable("year_group_mappings", { ... });
```

### Update Question Type Enum (around line 22):
```typescript
export const questionTypeEnum = pgEnum('question_type', [
  'multiple-choice',
  'true-false',
  'matching',
  'tap-pair',
  'fill-blank',
  'ordering',
  'label-reading',
  'lesson-content'  // ADD THIS NEW TYPE
]);
```

### Update `children` Table (around line 120-148):
```typescript
export const children = pgTable("children", {
  id: varchar("id").primaryKey().$defaultFn(() => sql`gen_random_uuid()`),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  username: text("username").notNull(),
  avatar: text("avatar").default("child"),
  age: integer("age").notNull(),           // CHANGED: was year_group + curriculum_id
  locale: text("locale").default("en-GB"), // KEEP: for UK/US English
  tz: text("tz"),
  goal: text("goal"),
  favoriteFruits: text("favorite_fruits").array(),
  favoriteVeggies: text("favorite_veggies").array(),
  favoriteFoods: text("favorite_foods").array(),
  favoriteSports: text("favorite_sports").array(),
  xp: integer("xp").default(0),
  totalXp: integer("total_xp").default(0),
  level: integer("level").default(1),
  streak: integer("streak").default(0),
  lastLogAt: timestamp("last_log_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // REMOVED: year_group, curriculum_id, curriculum_country
});
```

### Update `lessons` Table (around line 237-257):
```typescript
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  age: integer("age").notNull(),  // CHANGED: was curriculum_id + year_group
  totalSteps: integer("total_steps").notNull(),
  category: text("category").default("nutrition"),
  isActive: boolean("is_active").default(true),
  learningTakeaway: text("learning_takeaway"),
  mascotId: varchar("mascot_id").references(() => mascots.id),
  mascotIntro: text("mascot_intro"),
  topicId: varchar("topic_id").references(() => topics.id),
  difficultyLevel: integer("difficulty_level").default(1),
  orderInUnit: integer("order_in_unit"),
  estimatedMinutes: integer("estimated_minutes").default(5),
  iconEmoji: text("icon_emoji"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // REMOVED: curriculum_id, year_group
});
```

### Update `topics` Table (around line 61-73):
```typescript
export const topics = pgTable("topics", {
  id: varchar("id").primaryKey(),
  age: integer("age").notNull(),  // CHANGED: was curriculum_id + year_group
  title: text("title").notNull(),
  description: text("description"),
  iconEmoji: text("icon_emoji"),
  orderPosition: integer("order_position").notNull(),
  isActive: boolean("is_active").default(true),
  defaultMascotId: varchar("default_mascot_id").references(() => mascots.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  // REMOVED: curriculum_id, year_group
});
```

### Update `lessonSteps` Table (around line 259-272):
```typescript
export const lessonSteps = pgTable("lesson_steps", {
  id: varchar("id").primaryKey(),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id),
  stepNumber: integer("step_number").notNull(),
  questionType: questionTypeEnum("question_type").notNull(),
  question: text("question").notNull(),
  content: jsonb("content").notNull(),
  contentVariants: jsonb("content_variants"),  // NEW: for UK/US locale variants
  xpReward: integer("xp_reward").default(10),
  mascotAction: text("mascot_action"),
  retryConfig: jsonb("retry_config"),
});
```

### Update `users` Table:
Remove these fields from users table definition:
- `curriculum`
- `curriculum_id`
- `year_group`
- `curriculum_country`

Keep: `locale`

### Remove All Foreign Key References:
Search for and remove any references to `curriculums` or `yearGroupMappings` tables throughout the file.

---

## 3. Update Backend APIs

### File: `server/routes/lessons.ts`

#### Find and Replace All Year Group/Curriculum Filtering:

**Search for patterns like:**
```typescript
.where(eq(lessonsTable.yearGroup, yearGroup))
.where(eq(lessonsTable.curriculumId, curriculumId))
.where(eq(lessons.yearGroup, ...))
.where(eq(lessons.curriculumId, ...))
```

**Replace with:**
```typescript
.where(eq(lessonsTable.age, childAge))
.where(eq(lessons.age, childAge))
```

#### Update `/api/user/:userId/current-lesson` Route:
```typescript
// Get child's age from their profile, then filter lessons by age
const child = await storage.getChild(childId);
const lessons = await db.select().from(lessonsTable)
  .where(and(
    eq(lessonsTable.age, child.age),
    eq(lessonsTable.isActive, true)
  ))
  .orderBy(lessonsTable.orderInUnit);
```

#### Create New Route: `/api/lessons/age/:age`
```typescript
app.get("/api/lessons/age/:age", async (req, res) => {
  const age = parseInt(req.params.age);
  if (isNaN(age) || age < 6 || age > 14) {
    return res.status(400).json({ error: "Invalid age. Must be 6-14." });
  }

  const lessons = await db.select().from(lessonsTable)
    .where(and(
      eq(lessonsTable.age, age),
      eq(lessonsTable.isActive, true)
    ))
    .orderBy(lessonsTable.orderInUnit);

  res.json(lessons);
});
```

#### Apply Locale Content Variants:
```typescript
// Add this helper function at the top of the file
function getLocalizedContent(step: any, locale: string) {
  const variants = step.contentVariants as Record<string, any> | null;
  if (variants && variants[locale]) {
    // Merge locale-specific content with base content
    return { ...step.content, ...variants[locale] };
  }
  return step.content;
}

// Update the GET /api/lessons/:lessonId route to apply localization
app.get("/api/lessons/:lessonId", async (req, res) => {
  const { lessonId } = req.params;
  const childLocale = req.query.locale as string || 'en-GB';

  const lesson = await storage.getLesson(lessonId);
  if (!lesson) {
    return res.status(404).json({ error: "Lesson not found" });
  }

  const steps = await storage.getLessonSteps(lessonId);

  // Apply locale variants to each step
  const localizedSteps = steps.map(step => ({
    ...step,
    content: getLocalizedContent(step, childLocale)
  }));

  res.json({
    ...lesson,
    steps: localizedSteps
  });
});
```

#### Update Answer Validation for lesson-content:
```typescript
// In the answer validation logic (around line 730+)
// Add this at the beginning of the validation switch/if block:

if (step.questionType === 'lesson-content') {
  // No validation needed - this is a learning step, not a quiz
  return res.json({
    correct: true,
    xpEarned: 0,
    isLearningStep: true,
    message: "Great! You've learned the lesson. Now let's test your knowledge!"
  });
}
```

### File: `server/routes/topics.ts`

#### Change All Curriculum Filtering to Age:

**Search for:**
```typescript
.where(eq(topicsTable.curriculumId, curriculumId))
.where(eq(topics.curriculumId, ...))
```

**Replace with:**
```typescript
.where(eq(topicsTable.age, childAge))
.where(eq(topics.age, childAge))
```

#### Create New Route: `/api/topics/age/:age`
```typescript
app.get("/api/topics/age/:age", async (req, res) => {
  const age = parseInt(req.params.age);
  if (isNaN(age) || age < 6 || age > 14) {
    return res.status(400).json({ error: "Invalid age. Must be 6-14." });
  }

  const topics = await db.select().from(topicsTable)
    .where(and(
      eq(topicsTable.age, age),
      eq(topicsTable.isActive, true)
    ))
    .orderBy(topicsTable.orderPosition);

  res.json(topics);
});
```

### File: `server/storage.ts`

#### Replace Storage Methods:

**Replace `getLessonsByYearGroup` with `getLessonsByAge`:**
```typescript
async getLessonsByAge(age: number): Promise<Lesson[]> {
  return await db.select().from(lessons)
    .where(and(
      eq(lessons.age, age),
      eq(lessons.isActive, true)
    ))
    .orderBy(lessons.orderInUnit);
}
```

**Replace `getTopicsByCurriculum` with `getTopicsByAge`:**
```typescript
async getTopicsByAge(age: number): Promise<Topic[]> {
  return await db.select().from(topics)
    .where(and(
      eq(topics.age, age),
      eq(topics.isActive, true)
    ))
    .orderBy(topics.orderPosition);
}
```

**Update `createChildProfile`:**
```typescript
async createChildProfile(data: {
  parentId: string;
  name: string;
  username: string;
  avatar?: string;
  age: number;           // CHANGED: was yearGroup + curriculumId
  locale?: string;       // KEEP
  goal?: string;
  favoriteFruits?: string[];
  favoriteVeggies?: string[];
  favoriteFoods?: string[];
  favoriteSports?: string[];
  tz?: string;
}): Promise<Child> {
  const [child] = await db.insert(children).values({
    id: sql`gen_random_uuid()`,
    parentId: data.parentId,
    name: data.name,
    username: data.username,
    avatar: data.avatar || 'child',
    age: data.age,
    locale: data.locale || 'en-GB',
    goal: data.goal,
    favoriteFruits: data.favoriteFruits,
    favoriteVeggies: data.favoriteVeggies,
    favoriteFoods: data.favoriteFoods,
    favoriteSports: data.favoriteSports,
    tz: data.tz,
  }).returning();
  return child;
}
```

---

## 4. Update Onboarding Flow

### Files to Modify:
- `client/src/pages/onboarding/OnboardingContext.tsx`
- `client/src/pages/onboarding/OnboardingLayout.tsx`
- `client/src/pages/onboarding/AgeStep.tsx` (rewrite)
- Create: `client/src/pages/onboarding/LocationStep.tsx` (new)

### Update `OnboardingContext.tsx`:

**Change the profile interface:**
```typescript
interface OnboardingProfile {
  displayName: string;
  age: number;              // CHANGED: was yearGroup (string)
  locale: string;           // CHANGED: set from location step
  goal: string;
  avatar: string;
  email?: string;
  parentEmail?: string;
  password?: string;
  hasParentConsent: boolean;
  favorite_fruits?: string[];
  favorite_veggies?: string[];
  favorite_foods?: string[];
  favorite_sports?: string[];
  // REMOVED: yearGroup, curriculumCountry, curriculum, curriculumId
}

// Update default state
const defaultProfile: OnboardingProfile = {
  displayName: '',
  age: 6,                   // Default age
  locale: 'en-GB',          // Default locale
  goal: '',
  avatar: 'child',
  hasParentConsent: false,
};
```

### Update `OnboardingLayout.tsx` Steps:
```typescript
const STEPS = [
  { path: "/profile/intro", name: "Intro" },
  { path: "/profile/account", name: "Parent Account" },
  { path: "/profile/name", name: "Name" },
  { path: "/profile/age", name: "Age" },           // KEEP (now collects age number)
  { path: "/profile/location", name: "Location" }, // NEW (sets locale)
  { path: "/profile/goal", name: "Goal" },
  { path: "/profile/preferences/fruits", name: "Fruits" },
  { path: "/profile/preferences/veggies", name: "Veggies" },
  { path: "/profile/preferences/foods", name: "Foods" },
  { path: "/profile/preferences/sports", name: "Sports" },
  { path: "/profile/review", name: "Review" }
];
// REMOVED: curriculum step
```

### Rewrite `AgeStep.tsx`:
```tsx
import React from 'react';
import { useOnboarding } from './OnboardingContext';

const ageOptions = [
  { value: 6, label: "6 years old", emoji: "👶" },
  { value: 7, label: "7 years old", emoji: "🧒" },
  { value: 8, label: "8 years old", emoji: "🧒" },
  { value: 9, label: "9 years old", emoji: "👦" },
  { value: 10, label: "10 years old", emoji: "👧" },
  { value: 11, label: "11 years old", emoji: "🧑" },
  { value: 12, label: "12 years old", emoji: "🧑" },
  { value: 13, label: "13 years old", emoji: "👱" },
  { value: 14, label: "14 years old", emoji: "👱" },
];

export function AgeStep() {
  const { profile, updateProfile, goNext } = useOnboarding();

  const handleSelect = (age: number) => {
    updateProfile({ age });
    goNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">
        How old is {profile.displayName || 'your child'}?
      </h2>

      <div className="grid grid-cols-3 gap-3">
        {ageOptions.map(({ value, label, emoji }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={`p-4 rounded-2xl border-2 transition-all ${
              profile.age === value
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <span className="text-2xl">{emoji}</span>
            <p className="font-medium mt-1">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AgeStep;
```

### Create New `LocationStep.tsx`:
```tsx
import React from 'react';
import { useOnboarding } from './OnboardingContext';

const locationOptions = [
  { value: "en-GB", label: "United Kingdom", flag: "🇬🇧" },
  { value: "en-US", label: "United States", flag: "🇺🇸" },
];

export function LocationStep() {
  const { profile, updateProfile, goNext } = useOnboarding();

  const handleSelect = (locale: string) => {
    updateProfile({ locale });
    goNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Where do you live?
      </h2>
      <p className="text-center text-gray-600">
        This helps us use the right words (like "crisps" vs "chips"!)
      </p>

      <div className="grid grid-cols-2 gap-4">
        {locationOptions.map(({ value, label, flag }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={`p-6 rounded-2xl border-2 transition-all ${
              profile.locale === value
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <span className="text-5xl">{flag}</span>
            <p className="font-bold mt-2">{label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LocationStep;
```

### Update Route Registration:
Add the new LocationStep route in your router configuration.

### Update Child Creation API Call:
When the onboarding completes and creates the child, ensure it sends:
```typescript
{
  name: profile.displayName,
  username: generateUsername(profile.displayName),
  avatar: profile.avatar,
  age: profile.age,           // number 6-14
  locale: profile.locale,     // 'en-GB' or 'en-US'
  goal: profile.goal,
  favoriteFruits: profile.favorite_fruits,
  favoriteVeggies: profile.favorite_veggies,
  favoriteFoods: profile.favorite_foods,
  favoriteSports: profile.favorite_sports,
}
```

---

## 5. Update TypeScript Types

### Update Child Type (if separate from schema):
```typescript
interface Child {
  id: string;
  parentId: string;
  name: string;
  username: string;
  avatar: string;
  age: number;        // CHANGED from yearGroup
  locale: string;     // KEEP
  // REMOVED: yearGroup, curriculumId, curriculumCountry
  goal?: string;
  favoriteFruits?: string[];
  favoriteVeggies?: string[];
  favoriteFoods?: string[];
  favoriteSports?: string[];
  xp: number;
  totalXp: number;
  level: number;
  streak: number;
}
```

### Update Lesson Type:
```typescript
interface Lesson {
  id: string;
  title: string;
  description?: string;
  age: number;        // CHANGED from curriculumId + yearGroup
  // REMOVED: curriculumId, yearGroup
  totalSteps: number;
  category: string;
  isActive: boolean;
  // ... rest unchanged
}
```

### Update Topic Type:
```typescript
interface Topic {
  id: string;
  title: string;
  description?: string;
  age: number;        // CHANGED
  // REMOVED: curriculumId, yearGroup
  orderPosition: number;
  isActive: boolean;
  // ... rest unchanged
}
```

---

## 6. Testing Checklist

After implementing all changes, verify:

### Schema:
- [ ] Drizzle schema compiles without errors
- [ ] No references to `curriculums` table
- [ ] No references to `yearGroupMappings` table
- [ ] `age` column on children, lessons, topics
- [ ] `contentVariants` column on lesson_steps
- [ ] `lesson-content` in question_type enum

### Onboarding:
- [ ] Age selection shows 6-14 options
- [ ] Location step shows UK/US options
- [ ] Child record saves with correct `age` (number) and `locale`
- [ ] No curriculum/yearGroup fields collected or saved

### API:
- [ ] `/api/lessons/age/:age` returns lessons for that age
- [ ] `/api/topics/age/:age` returns topics for that age
- [ ] Lessons load correctly based on child's age
- [ ] Locale content variants are applied

### Existing Features:
- [ ] XP tracking still works
- [ ] Streaks still track correctly
- [ ] Lesson progress still saves
- [ ] Dashboard shows lessons

---

## Summary

| Area | Before | After |
|------|--------|-------|
| Child filtering | `yearGroup` + `curriculumId` | `age` (6-14) |
| Lesson filtering | `curriculumId` | `age` |
| Topic filtering | `curriculumId` | `age` |
| Locale | Derived from curriculum | Explicit `locale` field |
| Onboarding | Year group + Curriculum steps | Age + Location steps |
| Tables | curriculums, yearGroupMappings | DELETED |

**The database is already updated. Update the code to match.**
