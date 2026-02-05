# Replit Agent Prompt: Update Code for Simplified Schema

## Overview
The database schema has been updated to simplify the curriculum/year group system. We now use a simple **age + locale** system instead. You need to update the Drizzle schema and frontend to match.

---

## DATABASE CHANGES ALREADY MADE (for reference)

The following changes have already been applied to Supabase:

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

### Existing Data Migrated:
- All children set to `age = 6` (from year-2)
- All lessons set to `age = 6` (from year-2)
- `locale` field already exists on children (use 'en-GB' or 'en-US')

---

## PART 1: Update Drizzle Schema (`shared/schema.ts`)

### Remove These Table Definitions:
```typescript
// DELETE these entirely:
export const curriculums = pgTable("curriculums", { ... });
export const yearGroupMappings = pgTable("year_group_mappings", { ... });
```

### Update `children` Table:
```typescript
export const children = pgTable("children", {
  id: varchar("id").primaryKey().$defaultFn(() => sql`gen_random_uuid()`),
  parentId: varchar("parent_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  username: text("username").notNull(),
  avatar: text("avatar").default("child"),
  age: integer("age").notNull(), // CHANGED: was year_group + curriculum_id
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

### Update `lessons` Table:
```typescript
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  age: integer("age").notNull(), // CHANGED: was curriculum_id + year_group
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

### Update `topics` Table:
```typescript
export const topics = pgTable("topics", {
  id: varchar("id").primaryKey(),
  age: integer("age").notNull(), // CHANGED: was curriculum_id + year_group
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

### Update `lessonSteps` Table:
```typescript
export const lessonSteps = pgTable("lesson_steps", {
  id: varchar("id").primaryKey(),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id),
  stepNumber: integer("step_number").notNull(),
  questionType: questionTypeEnum("question_type").notNull(),
  question: text("question").notNull(),
  content: jsonb("content").notNull(),
  contentVariants: jsonb("content_variants"), // NEW: for UK/US locale variants
  xpReward: integer("xp_reward").default(10),
  mascotAction: text("mascot_action"),
  retryConfig: jsonb("retry_config"),
});
```

### Update `users` Table:
```typescript
// Remove these fields from users table definition:
// - curriculum
// - curriculum_id
// - year_group
// - curriculum_country
// Keep: locale
```

### Remove Foreign Key References:
Remove any references to `curriculums` or `yearGroupMappings` tables.

---

## PART 2: Update Onboarding Flow

### Current Flow (remove these steps):
- Country selection → REMOVE
- Curriculum selection (UK KS1, UK KS2, etc.) → REMOVE
- Year group selection (Year 2, Grade 3, etc.) → REMOVE

### New Flow (add these steps):

**Step: Child's Age**
```tsx
// New component: AgeStep.tsx
const ageOptions = [
  { value: 6, label: "6 years old" },
  { value: 7, label: "7 years old" },
  { value: 8, label: "8 years old" },
  { value: 9, label: "9 years old" },
  { value: 10, label: "10 years old" },
  { value: 11, label: "11 years old" },
  { value: 12, label: "12 years old" },
  { value: 13, label: "13 years old" },
  { value: 14, label: "14 years old" },
];

// Question: "How old is [child name]?"
```

**Step: Location (sets locale)**
```tsx
// New component: LocationStep.tsx
const locationOptions = [
  { value: "en-GB", label: "United Kingdom", flag: "🇬🇧" },
  { value: "en-US", label: "United States", flag: "🇺🇸" },
];

// Question: "Where do you live?"
// This sets the `locale` field on the child record
```

### Files to Update:
- `/client/src/pages/onboarding/` - Add AgeStep.tsx, LocationStep.tsx
- Remove: CurriculumStep.tsx, YearGroupStep.tsx (or similar)
- Update onboarding state/context to use `age` and `locale` instead of year_group/curriculum

---

## PART 3: Update Backend APIs

### Fetch Lessons by Age:
```typescript
// In /server/routes/lessons.ts
// Change from filtering by curriculum_id/year_group to filtering by age

// Before:
// .where(eq(lessonsTable.curriculumId, curriculumId))

// After:
.where(eq(lessonsTable.age, childAge))
```

### Fetch Topics by Age:
```typescript
// In /server/routes/topics.ts
// Before:
// .where(eq(topicsTable.curriculumId, curriculumId))

// After:
.where(eq(topicsTable.age, childAge))
```

### Apply Locale Content Variants:
```typescript
// When serving lesson steps, check for locale-specific content
function getLocalizedContent(step: LessonStep, locale: string) {
  const variants = step.contentVariants as Record<string, any> | null;
  if (variants && variants[locale]) {
    // Merge locale-specific content with base content
    return { ...step.content, ...variants[locale] };
  }
  return step.content;
}

// Use when fetching lesson steps:
const localizedSteps = steps.map(step => ({
  ...step,
  content: getLocalizedContent(step, childLocale)
}));
```

### Update Child Creation:
```typescript
// When creating a child, use age and locale instead of year_group/curriculum
const newChild = {
  parentId,
  name,
  username,
  avatar,
  age: 6,           // From age selection step
  locale: 'en-GB',  // From location selection step (UK → en-GB, US → en-US)
  goal,
  // ... other fields
};
```

---

## PART 4: Update Type Definitions

### Update Child Type:
```typescript
interface Child {
  id: string;
  parentId: string;
  name: string;
  username: string;
  avatar: string;
  age: number;        // NEW
  locale: string;     // KEEP (was already there)
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
  age: number;        // NEW
  // REMOVED: curriculumId, yearGroup
  totalSteps: number;
  category: string;
  isActive: boolean;
  // ... rest unchanged
}
```

---

## PART 5: Testing Checklist

After making changes, verify:
- [ ] Drizzle schema compiles without errors
- [ ] New child onboarding works with age + location steps
- [ ] Child record saves with correct `age` and `locale`
- [ ] Lessons load filtered by child's age
- [ ] Topics load filtered by child's age
- [ ] Existing lesson progress still works
- [ ] XP and streaks still track correctly

---

## Summary

| Area | Change |
|------|--------|
| Drizzle Schema | Remove curriculums/yearGroupMappings tables, add `age` to children/lessons/topics, add `contentVariants` to lessonSteps |
| Onboarding | Replace curriculum/year steps with Age + Location steps |
| APIs | Filter by `age` instead of curriculum_id, apply locale content variants |
| Types | Update Child/Lesson interfaces |

**The database is already updated. You just need to update the code to match.**
