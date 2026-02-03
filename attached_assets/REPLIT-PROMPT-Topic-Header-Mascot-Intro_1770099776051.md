# Replit Agent Prompt: Topic Header & Mascot Intro Screen

## Overview
Two changes needed:

1. **Topic Header (Option A):** Update the lessons journey page header to show dynamic topic title and description from the database
2. **Mascot Intro (Option 2):** Add a dedicated intro screen that appears AFTER tapping "Start" but BEFORE the first question

**Reference Wireframe:** `/wireframes/topic-header-redesign.html`

**GitHub Repository:** https://github.com/bodega-shrubby/BiteBurst

---

## Quick Summary

### What to Build:

| Component | Location | Data Source | What to Show |
|-----------|----------|-------------|--------------|
| **Topic Header** | `Lessons.tsx` | `topics` table | Title: "Operation Power Up!" + Description + Icon emoji |
| **Mascot Intro Screen** | `LessonPlayer.tsx` | `lessons` table | Mascot greeting + Learning goal (before Q1) |

### User Flow:
```
Lessons.tsx (Journey Page)
├── Header shows: "⚡ Operation Power Up!" + "Learn how food, water, and sleep..."
├── User sees list of lessons
└── User taps "START" on Lesson 1
    ↓
LessonPlayer.tsx
├── NEW: Intro Screen appears first
│   ├── Lesson title: "The Warm Up"
│   ├── Mascot says: "Hey Superhero! 🦸‍♀️ I'm Captain Carrot!..."
│   ├── Learning goal: "I can recognize the basic fuels..."
│   └── "Let's Go!" button
└── User taps "Let's Go!" → First question appears
```

---

## Current Codebase Structure

```
client/src/pages/
├── Lessons.tsx                    ← MAIN LESSONS LIST PAGE (update header here)
├── lessons/
│   ├── LessonPlayer.tsx          ← LESSON PLAYER (add intro screen here)
│   ├── BrainFuelForSchool.tsx
│   ├── FuelForFootball.tsx
│   └── components/
│       ├── LessonAsking.tsx
│       ├── LessonComplete.tsx
│       ├── LessonIncorrect.tsx
│       ├── LessonLearn.tsx
│       ├── LessonSuccess.tsx
│       ├── ProgressBar.tsx
│       └── index.ts
```

---

## Database Schema Reference (Supabase)

### `topics` table
```sql
id              VARCHAR   -- e.g., 'topic_1_power_up'
title           TEXT      -- e.g., 'Operation Power Up!'
description     TEXT      -- e.g., 'Learn how food, water, and sleep fuel your body battery.'
icon_emoji      TEXT      -- e.g., '⚡'
default_mascot_id VARCHAR -- e.g., 'captain-carrot'
year_group      VARCHAR   -- e.g., 'year-2'
curriculum_id   VARCHAR   -- e.g., 'uk-ks1'
```

### `lessons` table
```sql
id                VARCHAR  -- e.g., 'L1-01'
title             TEXT     -- e.g., 'The Warm Up'
description       TEXT     -- e.g., 'Start your engine! Learn the simple basics...'
topic_id          VARCHAR  -- e.g., 'topic_1_power_up'
difficulty_level  INTEGER  -- 1, 2, or 3
learning_takeaway TEXT     -- e.g., 'I can recognize the basic fuels...'
mascot_intro      TEXT     -- e.g., 'Hey Superhero! 🦸‍♀️ I'm Captain Carrot!...'
mascot_id         VARCHAR  -- e.g., 'captain-carrot'
order_in_unit     INTEGER  -- 1, 2, 3...
total_steps       INTEGER  -- Number of questions (10 per lesson)
icon_emoji        TEXT     -- e.g., '⚡'
```

### `mascots` table
```sql
id          VARCHAR  -- e.g., 'captain-carrot'
name        TEXT     -- e.g., 'Captain Carrot'
emoji       TEXT     -- e.g., '🥕'
image_path  TEXT     -- Path to mascot image
```

---

## Task 1: Update Lessons.tsx Header

### Current State
The header in `Lessons.tsx` currently shows **hardcoded** values:
- "Sports Nutrition: Week 1"
- "⚽ Football Edition"

### Required Changes
Replace hardcoded values with **dynamic data from the `topics` table**:
- Topic title from `topics.title`
- Topic description from `topics.description`
- Topic icon from `topics.icon_emoji`
- Mascot name from `topics.default_mascot_id` → lookup in `mascots` table

### Requirements

1. **Fetch Topic Data**
   - When the page loads, fetch the topic data from Supabase based on `topic_id`
   - Use the existing Supabase client/query pattern in your codebase

2. **Update Header to Show:**
   - **Topic Title** (from `topics.title`) - e.g., "Operation Power Up!"
   - **Topic Description** (from `topics.description`)
   - **Topic Icon** (from `topics.icon_emoji`)
   - **Mascot Name** (from `topics.default_mascot_id` → lookup in `mascots` table)
   - **Lesson Count** (count of lessons in this topic)

### Implementation

```tsx
// Example header structure
<header className="sticky top-0 z-30">
  <div
    className="px-6 py-6"
    style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}
  >
    {/* Back button */}
    <div className="flex items-center space-x-2 mb-3">
      <button className="text-white/80 hover:text-white text-sm flex items-center space-x-1">
        <span>←</span>
        <span>Back to Topics</span>
      </button>
      <span className="text-white/40">|</span>
      <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
        Unit 1
      </span>
    </div>

    {/* Topic Title - FROM DATABASE */}
    <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
      <span>{topic.icon_emoji}</span>
      <span>{topic.title}</span>
    </h1>

    {/* Topic Description - FROM DATABASE */}
    <p className="text-orange-100 text-sm mt-2 max-w-lg">
      {topic.description}
    </p>

    {/* Meta info */}
    <div className="flex items-center space-x-3 mt-3">
      <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
        🥕 {mascot?.name || 'Captain Carrot'}
      </span>
      <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
        {lessons.length} Lessons
      </span>
      <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
        ~{lessons.length * 5} min
      </span>
    </div>
  </div>

  {/* Stats bar remains the same */}
</header>
```

### API Endpoint Changes

You'll need to create or update an API endpoint to fetch topic data. Add this to your server routes:

**File:** `server/routes.ts` (or wherever your API routes are defined)

```ts
// GET /api/topics/:topicId
app.get('/api/topics/:topicId', async (req, res) => {
  const { topicId } = req.params;

  const { data: topic, error } = await supabase
    .from('topics')
    .select(`
      id,
      title,
      description,
      icon_emoji,
      default_mascot_id,
      year_group,
      mascots (
        id,
        name,
        emoji,
        image_path
      )
    `)
    .eq('id', topicId)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json(topic);
});

// GET /api/topics/:topicId/lessons
app.get('/api/topics/:topicId/lessons', async (req, res) => {
  const { topicId } = req.params;

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      description,
      topic_id,
      difficulty_level,
      learning_takeaway,
      mascot_intro,
      mascot_id,
      order_in_unit,
      total_steps,
      icon_emoji
    `)
    .eq('topic_id', topicId)
    .order('order_in_unit', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(lessons);
});
```

### Frontend Query in Lessons.tsx

```tsx
// Add this query to fetch topic data
const { data: topic } = useQuery({
  queryKey: ['/api/topics', topicId],
  queryFn: () => apiRequest(`/api/topics/${topicId}`),
  enabled: !!topicId,
});

// Update lessons query to use topic_id
const { data: lessons } = useQuery({
  queryKey: ['/api/topics', topicId, 'lessons'],
  queryFn: () => apiRequest(`/api/topics/${topicId}/lessons`),
  enabled: !!topicId,
});
```

---

## Task 2: Add Lesson Start Intro Screen

### Purpose
Before the first question (Q1) appears, show a dedicated intro screen with:
- Lesson title & description
- Mascot character with intro message
- Learning goal/takeaway
- "Let's Go!" button to start

### Current Flow (in LessonPlayer.tsx)
```
User taps "START" on lesson card in Lessons.tsx
  → LessonPlayer loads with lessonId prop
  → Fetches lesson data from /api/lessons/${lessonId}
  → lessonState = 'asking'
  → Immediately shows first question (LessonAsking component)
```

### New Flow
```
User taps "START" on lesson card
  → LessonPlayer loads with lessonId prop
  → Fetches lesson data (including mascot_intro, learning_takeaway)
  → lessonState = 'intro' (NEW STATE)
  → Shows INTRO SCREEN with mascot greeting
  → User taps "Let's Go!"
  → lessonState = 'asking'
  → Shows first question
```

### Implementation

**File:** `client/src/pages/lessons/LessonPlayer.tsx`

1. Update the lessonState type to include 'intro':
```tsx
// Change from:
const [lessonState, setLessonState] = useState<'asking' | 'incorrect' | 'learn' | 'success' | 'complete'>('asking');

// To:
const [lessonState, setLessonState] = useState<'intro' | 'asking' | 'incorrect' | 'learn' | 'success' | 'complete'>('intro');
```

2. Ensure the API returns mascot_intro and learning_takeaway:
Update `/api/lessons/${lessonId}` endpoint to include these fields from the lessons table.

3. Create the intro screen component:

```tsx
// Add this before the main lesson content
if (showIntro && lesson) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-6">

        {/* Lesson Title */}
        <div>
          <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-medium">
            Lesson {lesson.order_in_unit} of {totalLessonsInTopic}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-3">
            {lesson.icon_emoji || '📚'} {lesson.title}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {lesson.description}
          </p>
        </div>

        {/* Mascot with Intro */}
        <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-sm">
          <img
            src={getMascotImage(lesson.mascot_id)}
            alt="Mascot"
            className="w-24 h-24 mx-auto object-contain animate-bounce"
          />

          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 mt-4">
            <p className="text-gray-800 text-sm leading-relaxed">
              {lesson.mascot_intro || "Let's learn something new today!"}
            </p>
          </div>
        </div>

        {/* Learning Takeaway */}
        {lesson.learning_takeaway && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-xs text-blue-600 font-medium mb-1">🎯 LEARNING GOAL</p>
            <p className="text-sm text-blue-800">"{lesson.learning_takeaway}"</p>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={() => setShowIntro(false)}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-lg transition shadow-lg"
        >
          Let's Go! 🚀
        </button>

      </div>
    </div>
  );
}
```

### Mascot Image Helper

Use the existing mascot image mapping or create one:

```tsx
const getMascotImage = (mascotId: string): string => {
  const mascotImages: Record<string, string> = {
    'captain-carrot': captainCarrotImage,
    'apple-buddy': appleBuddyImage,
    'hydro-hero': hydroHeroImage,
    // ... add other mascots
  };
  return mascotImages[mascotId] || defaultMascotImage;
};
```

---

## Task 3: Ensure Data is Fetched Correctly

### Update LessonPlayer to Fetch Full Lesson Data

The `mascot_intro` and `learning_takeaway` fields need to be included in the query:

```tsx
const { data: lesson } = await supabase
  .from('lessons')
  .select(`
    id,
    title,
    description,
    topic_id,
    difficulty_level,
    learning_takeaway,
    mascot_intro,
    mascot_id,
    order_in_unit,
    total_steps,
    icon_emoji
  `)
  .eq('id', lessonId)
  .single();
```

---

## Design Specifications

### Colors
| Element | Color |
|---------|-------|
| Header gradient | `#fb923c → #f97316 → #ea580c` |
| Header text | White |
| Description text | `orange-100` |
| Learning goal bg | `blue-50` |
| Learning goal border | `blue-200` |
| Learning goal text | `blue-800` |
| Start button | `green-500` |

### Typography
| Element | Style |
|---------|-------|
| Topic Title | `text-2xl font-bold` |
| Topic Description | `text-sm` |
| Lesson Title | `text-2xl font-bold` |
| Mascot Intro | `text-sm leading-relaxed` |
| Learning Takeaway | `text-sm` |

### Spacing
- Header padding: `px-6 py-6`
- Card padding: `p-6`
- Card border radius: `rounded-2xl`

---

## Testing Checklist

After implementation, verify:

- [ ] Topic title displays correctly from database
- [ ] Topic description displays correctly
- [ ] Topic icon emoji displays before title
- [ ] Lesson count shows correct number
- [ ] Intro screen appears when starting a lesson
- [ ] Mascot intro message displays from database
- [ ] Learning takeaway displays in blue box
- [ ] "Let's Go!" button advances to Q1
- [ ] Works on mobile (responsive)
- [ ] Works on tablet/desktop

---

## File Summary

| File | Changes |
|------|---------|
| `client/src/pages/Lessons.tsx` | Update header to show topic.title, topic.description, topic.icon_emoji |
| `client/src/pages/lessons/LessonPlayer.tsx` | Add 'intro' state and intro screen component before Q1 |
| `server/routes.ts` | Add `/api/topics/:topicId` endpoint to fetch topic data |
| `/api/lessons/:lessonId` endpoint | Ensure mascot_intro and learning_takeaway are included in response |

---

## Notes

- The mascot_intro in Lesson 1 says "Hey Superhero! 🦸‍♀️ I'm Captain Carrot! Let's wake up your body battery. Tap the healthy choices to charge up!"
- Each lesson can have a different mascot_intro, allowing for variety
- The learning_takeaway helps kids understand what they'll learn before starting
