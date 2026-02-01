# BiteBurst Activity Log - Add Right Column & Update Header

## Overview

Update the Activity Log page (`ActivityLog.tsx` or `ActivityLogNew.tsx`) to match the Lessons and Food Log page layouts with a right sidebar column. This creates visual consistency across the app.

**Reference Files:**
- `Lessons.tsx` - Master layout structure
- `FoodLog.tsx` - Same layout pattern (being updated)
- `LessonMascot.tsx` - Mascot component (has CoachFlex for fitness)

---

## Current State Analysis

### Lessons/Food Log Page Structure (Target Layout)
```tsx
<div className="min-h-screen bg-gray-50">
  <Sidebar />

  <div className="flex min-h-screen md:ml-[200px]">
    <div className="flex-1 flex justify-center">
      <div className="flex max-w-[1100px] w-full">

        {/* Main Content - Left/Center */}
        <div className="flex-1 min-w-0 bg-white">
          <header>...</header>
          <div className="px-6 py-6 bg-gray-50">...</div>
        </div>

        {/* Right Column - 340px */}
        <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">
          {/* Mascot Card */}
          {/* Challenge/Fact Card */}
          {/* Badges */}
          {/* Ad Placeholder */}
        </div>
      </div>
    </div>
  </div>
</div>
```

### Current Activity Log (`ActivityLog.tsx`)
- Uses simple full-width layout: `max-w-md mx-auto`
- Header uses custom `bb-appbar` class
- No right column
- Does NOT match Lessons/Food Log layout structure

### Current Activity Log New (`ActivityLogNew.tsx`)
- Multi-step flow with AnimatePresence
- Uses screens: TimePeriodScreen → ActivityTypeScreen → DurationSelectionScreen
- Each screen has its own header (blue gradient)
- Also does NOT match the app-wide layout structure

### Existing Mascot Component (`LessonMascot.tsx`)
**Important:** CoachFlex (fitness mascot) already exists in the codebase!
```tsx
import coachFlexImage from '@assets/Mascots/CoachFlex.png';

// Available mascots:
// - professor (ProfessorBloop) - lessons
// - apple (AppleBuddy) - food
// - carrot (CaptainCarrot)
// - hydration (HydroHero)
// - fitness (CoachFlex) - USE THIS FOR ACTIVITY LOG!
// - brain (BrainyBolt)
// - snacks (SnackTwins)

// Usage for Activity Log:
<LessonMascot
  type="topic"
  topicMascot="fitness"
  message="Your message here"
  size="md"
/>
```

---

## Implementation Steps

### Step 1: Update Activity Log Layout Structure

Modify `ActivityLog.tsx` to match Lessons page layout:

```tsx
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import LessonMascot from '@/components/LessonMascot';
import { useAuth } from "@/hooks/useAuth";

export default function ActivityLog() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // ... existing state and handlers ...

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex min-h-screen md:ml-[200px]">
        <div className="flex-1 flex justify-center">
          <div className="flex max-w-[1100px] w-full">

            {/* Main Content */}
            <div className="flex-1 min-w-0 bg-white">
              <ActivityLogHeader user={user} />

              <div className="px-6 py-6 bg-gray-50">
                {/* Existing activity selection content */}
                <ActivitySelectionContent
                  state={state}
                  onActivitySelect={handleActivitySelect}
                  onDurationSelect={handleDurationSelect}
                  onMoodSelect={handleMoodSelect}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

            {/* Right Column - NEW */}
            <ActivityLogRightColumn user={user} />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}
```

### Step 2: Create Activity Log Header (Match Lessons/Food Log)

```tsx
// components/activity-log/ActivityLogHeader.tsx

import { useLocation } from 'wouter';

interface ActivityLogHeaderProps {
  user: User | null;
}

export default function ActivityLogHeader({ user }: ActivityLogHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-30">
      {/* Orange gradient section - matches Lessons & Food Log */}
      <div
        className="px-6 py-6"
        style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setLocation('/dashboard')}
            className="text-white/80 hover:text-white text-sm flex items-center space-x-1"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold text-white">Log Your Activity</h1>
        <p className="text-orange-100 text-sm mt-1">What did you do today?</p>
      </div>

      {/* Stats bar - matches Lessons & Food Log */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🔥</span>
            <div>
              <div className="text-base font-bold text-gray-900">{user?.streak || 0}</div>
              <div className="text-xs text-gray-500">Streak</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">⭐</span>
            <div>
              <div className="text-base font-bold text-gray-700">{user?.totalXp || 0} XP</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏃</span>
            <div>
              <div className="text-base font-bold text-gray-700">{user?.weeklyActivityMinutes || 0} min</div>
              <div className="text-xs text-gray-500">This Week</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
```

### Step 3: Create Right Column Component

```tsx
// components/activity-log/ActivityLogRightColumn.tsx

import LessonMascot from '@/components/LessonMascot';
import CoachFlexCard from './CoachFlexCard';
import ActivityFactCard from './ActivityFactCard';
import ActivityLogBadges from './ActivityLogBadgesCard';
import AdPlaceholder from './AdPlaceholder';

interface ActivityLogRightColumnProps {
  user: User | null;
}

export default function ActivityLogRightColumn({ user }: ActivityLogRightColumnProps) {
  return (
    <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">

      {/* Coach Flex Mascot Card */}
      <CoachFlexCard />

      {/* Activity Fact / Achievement Recognition */}
      <ActivityFactCard userId={user?.id} />

      {/* Activity Badges */}
      <ActivityLogBadges userId={user?.id} />

      {/* Ad Placeholder */}
      <AdPlaceholder />
    </div>
  );
}
```

### Step 4: Coach Flex Card (Using Existing LessonMascot)

```tsx
// components/activity-log/CoachFlexCard.tsx

import LessonMascot from '@/components/LessonMascot';

export default function CoachFlexCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      {/* Use existing LessonMascot with Coach Flex (fitness) */}
      <LessonMascot
        type="topic"
        topicMascot="fitness"
        message="Ready to move? Let's log your activity!"
        size="md"
      />

      {/* Tip section - matches Lessons & Food Log structure */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 font-medium">Coach Flex's Tip</p>
        <p className="text-sm text-gray-700 mt-1">
          Every minute of movement counts! Log your activities to track your progress.
        </p>
      </div>
    </div>
  );
}
```

### Step 5: Activity Fact / Recognition Card

```tsx
// components/activity-log/ActivityFactCard.tsx

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ActivityFactCardProps {
  userId?: string;
}

// Fun activity facts for kids
const ACTIVITY_FACTS = [
  "Running for just 10 minutes can boost your mood for hours! 🏃",
  "Dancing is one of the best exercises because it works your whole body! 💃",
  "Swimming uses almost every muscle in your body! 🏊",
  "Kids who play sports tend to do better in school! ⚽",
  "Just 30 minutes of activity a day keeps you healthy and strong! 💪",
  "Walking 10,000 steps is about 5 miles - that's far! 🚶",
  "Jumping rope for 10 minutes burns as many calories as 30 minutes of jogging! 🪢",
  "Playing outside in nature reduces stress and makes you happier! 🌳"
];

export default function ActivityFactCard({ userId }: ActivityFactCardProps) {
  // TODO: Fetch from API to check for activity achievements this week
  const { data: achievementData } = useQuery({
    queryKey: ['/api/activity-log/achievements', userId],
    queryFn: () => apiRequest(`/api/activity-log/achievements/${userId}`),
    enabled: !!userId,
  });

  // If child hit a milestone this week, show recognition
  if (achievementData?.milestone) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-medium">
            🏆 ACHIEVEMENT UNLOCKED
          </span>
        </div>
        <h3 className="font-bold text-base text-gray-800">
          {achievementData.milestone.title}
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          {achievementData.milestone.description}
        </p>
      </div>
    );
  }

  // Default: Show fun activity fact
  const randomFact = ACTIVITY_FACTS[Math.floor(Math.random() * ACTIVITY_FACTS.length)];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full font-medium">
          💡 FUN ACTIVITY FACT
        </span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {randomFact}
      </p>
    </div>
  );
}
```

### Step 6: Activity Log Badges Card

```tsx
// components/activity-log/ActivityLogBadgesCard.tsx

import { Link } from 'wouter';

const ACTIVITY_BADGES = [
  { id: 'first-move', emoji: '🏃', name: 'First Move', earned: true },
  { id: 'week-warrior', emoji: '🔥', name: 'Week Warrior', earned: false },
  { id: 'hour-hero', emoji: '⏱️', name: 'Hour Hero', earned: false },
  { id: 'diverse-mover', emoji: '🌟', name: 'Diverse Mover', earned: true },
];

interface ActivityLogBadgesProps {
  userId?: string;
}

export default function ActivityLogBadges({ userId }: ActivityLogBadgesProps) {
  // TODO: Fetch actual badge data from API
  // const { data: badges } = useQuery({...});

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base text-gray-800">🏆 Activity Badges</h3>
        <Link href="/achievements" className="text-sm text-orange-500 font-medium hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {ACTIVITY_BADGES.map((badge) => (
          <div key={badge.id} className="text-center">
            <div className={`
              w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl
              ${badge.earned
                ? 'bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300'
                : 'bg-gray-100 opacity-40 grayscale'}
            `}>
              {badge.emoji}
            </div>
            <p className={`text-xs mt-1 ${badge.earned ? 'text-gray-700' : 'text-gray-400'}`}>
              {badge.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 7: Ad Placeholder (Same as Lessons/Food Log)

```tsx
// components/activity-log/AdPlaceholder.tsx

export default function AdPlaceholder() {
  return (
    <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
      <div className="text-center py-8">
        <div className="text-3xl mb-2 opacity-50">📣</div>
        <p className="text-sm text-gray-400">Ad Placeholder</p>
        <p className="text-xs text-gray-300 mt-1">340 x 180</p>
      </div>
    </div>
  );
}
```

---

## Files to Create

| File | Description |
|------|-------------|
| `components/activity-log/ActivityLogHeader.tsx` | Header matching Lessons/Food Log |
| `components/activity-log/ActivityLogRightColumn.tsx` | Right column container |
| `components/activity-log/CoachFlexCard.tsx` | Coach Flex mascot card |
| `components/activity-log/ActivityFactCard.tsx` | Fun fact or achievement recognition |
| `components/activity-log/ActivityLogBadgesCard.tsx` | Activity-related badges |
| `components/activity-log/AdPlaceholder.tsx` | Ad placeholder (can reuse from food-log) |

## Files to Modify

| File | Changes |
|------|---------|
| `pages/ActivityLog.tsx` | Update layout structure to match Lessons.tsx |
| `pages/ActivityLogNew.tsx` | Optional: Update to match same layout or deprecate |

---

## Key Implementation Notes

1. **Use existing `LessonMascot` component** - Coach Flex (fitness) is already available:
   ```tsx
   <LessonMascot type="topic" topicMascot="fitness" message="..." />
   ```

2. **Match exact layout widths from Lessons.tsx:**
   - Right column: `w-[340px]`
   - Max container: `max-w-[1100px]`
   - Sidebar offset: `md:ml-[200px]`

3. **Match exact styling classes from Lessons.tsx:**
   - Card style: `bg-white rounded-2xl p-5 border border-gray-200 shadow-sm`
   - Gradient header: `linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)`

4. **AI Integration for Activity Recognition:**
   - Create API endpoint `/api/activity-log/achievements/:userId`
   - Returns `{ milestone: { title: string, description: string } | null }`
   - Can generate personalized recognition messages for:
     - First activity logged
     - Hitting weekly minutes goal
     - Trying new activity type
     - Consistent logging streak

5. **Responsive:** Right column hides on mobile: `hidden lg:block`

6. **Reuse Components:** AdPlaceholder can be shared between Food Log and Activity Log

---

## Consistency Checklist

Ensure these match across Lessons, Food Log, and Activity Log pages:

- [ ] Same layout structure (`flex max-w-[1100px]`)
- [ ] Same sidebar offset (`md:ml-[200px]`)
- [ ] Same right column width (`w-[340px]`)
- [ ] Same header gradient (`linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)`)
- [ ] Same card styling (`bg-white rounded-2xl p-5 border border-gray-200 shadow-sm`)
- [ ] Same mascot card structure (mascot + tip section with border-t)
- [ ] Same badge card layout (4-column grid)
- [ ] Same Ad Placeholder styling

---

## Visual Reference

```
┌──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │           MAIN CONTENT              │    RIGHT COLUMN      │
│  200px  │                                     │       340px          │
│         │  ┌─────────────────────────────┐   │                      │
│ Lessons │  │  HEADER (orange gradient)   │   │ ┌──────────────────┐ │
│ Champs  │  │  Log Your Activity          │   │ │  🏃 Coach Flex   │ │
│ + LOG   │  │  What did you do today?     │   │ │  Ready to move!  │ │
│ Profile │  └─────────────────────────────┘   │ │  Let's log your  │ │
│ More    │  ┌─────────────────────────────┐   │ │  activity!       │ │
│         │  │  🔥 0  │  ⭐ 0 XP │ 🏃 0min │   │ └──────────────────┘ │
│         │  │ Streak   Total     This Week│   │                      │
│         │  └─────────────────────────────┘   │ ┌──────────────────┐ │
│         │                                     │ │ 💡 ACTIVITY FACT │ │
│         │  "Pick your activity"              │ │ Running for 10   │ │
│         │                                     │ │ minutes can...   │ │
│         │  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │ └──────────────────┘ │
│         │  │ ⚽ │ │ 🏃 │ │ 🧘 │ │ 🎯 │       │                      │
│         │  │Soccr│ │ Run│ │Yoga│ │Prac│       │ ┌──────────────────┐ │
│         │  └────┘ └────┘ └────┘ └────┘       │ │ 🏆 Activity      │ │
│         │  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │ │    Badges        │ │
│         │  │ 🚴 │ │ 🕺 │ │ 🏊 │ │ 🧗 │       │ │ 🏃 🔥 ⏱️ 🌟     │ │
│         │  │Bike│ │Danc│ │Swim│ │Climb│       │ └──────────────────┘ │
│         │  └────┘ └────┘ └────┘ └────┘       │                      │
│         │                                     │ ┌──────────────────┐ │
│         │  "How long?"                       │ │ 📣 Ad Placeholder│ │
│         │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │ └──────────────────┘ │
│         │  │5 min│ │15min│ │30min│ │60min│   │                      │
│         │  └─────┘ └─────┘ └─────┘ └─────┘   │                      │
│         │                                     │                      │
│         │  ┌─────────────────────────────┐   │                      │
│         │  │      LOG ACTIVITY           │   │                      │
│         │  └─────────────────────────────┘   │                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Existing Activity Components to Keep/Refactor

These existing components from `ActivityLog.tsx` should be extracted and integrated:

1. **Activity Selection Grid** - The 3x3 emoji grid for picking activities
2. **Duration Selection** - The duration buttons (5, 15, 30, 60 min + custom)
3. **Mood Selection** - Optional mood picker (😃 😐 😴)
4. **Preview Card** - Shows selected activity, duration, mood, XP preview
5. **Submit Button** - Sticky CTA at bottom

These should be wrapped in the new layout structure while keeping their existing functionality.

---

## API Endpoints to Create (Optional)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/activity-log/achievements/:userId` | Get user's activity achievements/milestones |
| `GET /api/activity-log/weekly-stats/:userId` | Get weekly activity minutes and stats |
| `GET /api/activity-log/badges/:userId` | Get user's earned activity badges |
