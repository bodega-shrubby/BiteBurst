# BiteBurst Food Log - Add Right Column & Update Header

## Overview

Update the Food Log page (`FoodLog.tsx` or `FoodLogNew.tsx`) to match the Lessons page layout with a right sidebar column. This creates visual consistency across the app.

**Reference:** See `Lessons.tsx` for the exact layout structure to replicate.

---

## Current State Analysis

### Lessons Page Structure (from `Lessons.tsx`)
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
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <LessonMascot type="professor" message="..." size="md" />
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Professor's Tip</p>
              <p className="text-sm text-gray-700 mt-1">...</p>
            </div>
          </div>

          <WeeklyChallenge />
          <TopicLessonsList />
          <LeaderboardCard />
          <AdPlaceholder />
        </div>
      </div>
    </div>
  </div>
</div>
```

### Current Food Log (`FoodLog.tsx`)
- Uses simple full-width layout
- No right column
- Has its own header style
- Does NOT use the same layout structure as Lessons

### Existing Mascot Component (`LessonMascot.tsx`)
**Important:** Apple Buddy already exists in the codebase!
```tsx
import appleBuddyImage from '@assets/Mascots/AppleBuddy.png';

// Can be used with:
<LessonMascot
  type="topic"
  topicMascot="apple"
  message="Your message here"
  size="md"
/>
```

---

## Implementation Steps

### Step 1: Update Food Log Layout Structure

Modify `FoodLog.tsx` (or create new version) to match Lessons page layout:

```tsx
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import LessonMascot from '@/components/LessonMascot';

export default function FoodLog() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex min-h-screen md:ml-[200px]">
        <div className="flex-1 flex justify-center">
          <div className="flex max-w-[1100px] w-full">

            {/* Main Content */}
            <div className="flex-1 min-w-0 bg-white">
              <FoodLogHeader user={user} />

              <div className="px-6 py-6 bg-gray-50">
                {/* Existing meal type cards and food logging content */}
                <MealTypeSelection />
              </div>
            </div>

            {/* Right Column - NEW */}
            <FoodLogRightColumn user={user} />
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

### Step 2: Create Food Log Header (Match Lessons Page)

```tsx
// components/food-log/FoodLogHeader.tsx

interface FoodLogHeaderProps {
  user: User | null;
}

export default function FoodLogHeader({ user }: FoodLogHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-30">
      {/* Orange gradient section - matches Lessons */}
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
        <h1 className="text-2xl font-bold text-white">Log Your Meal</h1>
        <p className="text-orange-100 text-sm mt-1">What meal is this?</p>
      </div>

      {/* Stats bar - matches Lessons */}
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
        </div>
      </div>
    </header>
  );
}
```

### Step 3: Create Right Column Component

```tsx
// components/food-log/FoodLogRightColumn.tsx

import LessonMascot from '@/components/LessonMascot';

interface FoodLogRightColumnProps {
  user: User | null;
}

export default function FoodLogRightColumn({ user }: FoodLogRightColumnProps) {
  return (
    <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">

      {/* Apple Buddy Card */}
      <AppleBuddyCard />

      {/* Food Fact / New Food Recognition */}
      <FoodFactCard userId={user?.id} />

      {/* Badges */}
      <FoodLogBadges userId={user?.id} />

      {/* Ad Placeholder */}
      <AdPlaceholder />
    </div>
  );
}
```

### Step 4: Apple Buddy Card (Using Existing LessonMascot)

```tsx
// components/food-log/AppleBuddyCard.tsx

import LessonMascot from '@/components/LessonMascot';

export default function AppleBuddyCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      {/* Use existing LessonMascot with Apple Buddy */}
      <LessonMascot
        type="topic"
        topicMascot="apple"
        message="Welcome! Let's log what you ate today!"
        size="md"
      />

      {/* Tip section - matches Lessons page structure */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 font-medium">Apple Buddy's Tip</p>
        <p className="text-sm text-gray-700 mt-1">
          Logging your meals helps you eat healthy and earn rewards!
        </p>
      </div>
    </div>
  );
}
```

### Step 5: Food Fact / Recognition Card

```tsx
// components/food-log/FoodFactCard.tsx

interface FoodFactCardProps {
  userId?: string;
}

// Fun food facts for kids
const FOOD_FACTS = [
  "Carrots were originally purple before orange ones became popular! 🥕",
  "Strawberries have about 200 seeds on the outside! 🍓",
  "Honey never spoils - archaeologists found 3000-year-old honey that was still good! 🍯",
  "Bananas are technically berries, but strawberries aren't! 🍌",
  "Apples float because they're 25% air! 🍎",
  "Broccoli contains more protein than steak per calorie! 🥦",
  "Cucumbers are 96% water - super hydrating! 🥒",
  "Avocados are actually fruits, not vegetables! 🥑"
];

export default function FoodFactCard({ userId }: FoodFactCardProps) {
  // TODO: Fetch from API to check if child tried new food this week
  const { data: newFoodData } = useQuery({
    queryKey: ['/api/food-log/new-foods', userId],
    queryFn: () => apiRequest(`/api/food-log/new-foods/${userId}`),
    enabled: !!userId,
  });

  // If child tried a new food this week, show recognition
  if (newFoodData?.newFood) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-orange-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-medium">
            🌟 NEW FOOD EXPLORER
          </span>
        </div>
        <h3 className="font-bold text-base text-gray-800">
          Amazing! You tried {newFoodData.newFood.name}!
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Trying new foods makes you a food adventurer! Keep exploring new tastes!
        </p>
      </div>
    );
  }

  // Default: Show fun food fact
  const randomFact = FOOD_FACTS[Math.floor(Math.random() * FOOD_FACTS.length)];

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">
          🧠 FUN FOOD FACT
        </span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {randomFact}
      </p>
    </div>
  );
}
```

### Step 6: Food Log Badges Card

```tsx
// components/food-log/FoodLogBadges.tsx

import { Link } from 'wouter';

const FOOD_BADGES = [
  { id: 'first-log', emoji: '🌟', name: 'First Log', earned: true },
  { id: 'breakfast-champ', emoji: '🥞', name: 'Breakfast Champ', earned: false },
  { id: 'veggie-lover', emoji: '🥦', name: 'Veggie Lover', earned: false },
  { id: 'fruit-explorer', emoji: '🍎', name: 'Fruit Explorer', earned: true },
];

interface FoodLogBadgesProps {
  userId?: string;
}

export default function FoodLogBadges({ userId }: FoodLogBadgesProps) {
  // TODO: Fetch actual badge data from API
  // const { data: badges } = useQuery({...});

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base text-gray-800">🏆 Food Badges</h3>
        <Link href="/achievements" className="text-sm text-orange-500 font-medium hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {FOOD_BADGES.map((badge) => (
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

### Step 7: Ad Placeholder (Copy from Lessons.tsx)

```tsx
// components/food-log/AdPlaceholder.tsx

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
| `components/food-log/FoodLogHeader.tsx` | Header matching Lessons page |
| `components/food-log/FoodLogRightColumn.tsx` | Right column container |
| `components/food-log/AppleBuddyCard.tsx` | Apple Buddy mascot card |
| `components/food-log/FoodFactCard.tsx` | Fun fact or new food recognition |
| `components/food-log/FoodLogBadges.tsx` | Food-related badges |
| `components/food-log/AdPlaceholder.tsx` | Ad placeholder |

## Files to Modify

| File | Changes |
|------|---------|
| `pages/FoodLog.tsx` | Update layout structure to match Lessons.tsx |

---

## Key Implementation Notes

1. **Use existing `LessonMascot` component** - Apple Buddy is already available:
   ```tsx
   <LessonMascot type="topic" topicMascot="apple" message="..." />
   ```

2. **Match exact layout widths from Lessons.tsx:**
   - Right column: `w-[340px]`
   - Max container: `max-w-[1100px]`
   - Sidebar offset: `md:ml-[200px]`

3. **Match exact styling classes from Lessons.tsx:**
   - Card style: `bg-white rounded-2xl p-5 border border-gray-200 shadow-sm`
   - Gradient header: `linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)`

4. **AI Integration for Food Fact:**
   - Create API endpoint `/api/food-log/new-foods/:userId`
   - Returns `{ newFood: { name: string, date: string } | null }`
   - Can generate personalized recognition messages

5. **Responsive:** Right column hides on mobile: `hidden lg:block`

---

## Visual Reference

```
┌──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR │           MAIN CONTENT              │    RIGHT COLUMN      │
│  200px  │                                     │       340px          │
│         │  ┌─────────────────────────────┐   │                      │
│ Lessons │  │  HEADER (orange gradient)   │   │ ┌──────────────────┐ │
│ Champs  │  │  Log Your Meal              │   │ │  🍎 Apple Buddy  │ │
│ + LOG   │  │  What meal is this?         │   │ │  Welcome! Let's  │ │
│ Profile │  └─────────────────────────────┘   │ │  log what you... │ │
│ More    │  ┌─────────────────────────────┐   │ └──────────────────┘ │
│         │  │  🔥 0  │  ⭐ 0 XP           │   │                      │
│         │  │  Streak   Total             │   │ ┌──────────────────┐ │
│         │  └─────────────────────────────┘   │ │ 🧠 FUN FOOD FACT │ │
│         │                                     │ │ Carrots were...  │ │
│         │  "What meal are you logging?"      │ └──────────────────┘ │
│         │                                     │                      │
│         │  ┌──────────┐  ┌──────────┐        │ ┌──────────────────┐ │
│         │  │ 🥞       │  │ 🥪       │        │ │ 🏆 Food Badges   │ │
│         │  │Breakfast │  │ Lunch    │        │ │ 🌟 🥞 🥦 🍎     │ │
│         │  └──────────┘  └──────────┘        │ └──────────────────┘ │
│         │  ┌──────────┐  ┌──────────┐        │                      │
│         │  │ 🍝       │  │ 🍎       │        │ ┌──────────────────┐ │
│         │  │ Dinner   │  │ Snack    │        │ │ 📣 Ad Placeholder│ │
│         │  └──────────┘  └──────────┘        │ └──────────────────┘ │
│         │                                     │                      │
└──────────────────────────────────────────────────────────────────────┘
```
