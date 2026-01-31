# BiteBurst Lessons Page Redesign - Replit Agent Prompt

## Overview
Redesign the Lessons page (`client/src/pages/Lessons.tsx`) to match the approved wireframe design. The new layout features a two-column structure with card-based horizontal lesson cards, a simplified right sidebar, and consistent navigation matching the Dashboard.

## Reference Wireframe
`/wireframes/lessons-page-redesign-FINAL.html`

---

## Layout Structure

### Overall Container
```
┌──────────────────────────────────────────────────────────────────┐
│ LEFT SIDEBAR │        MAIN CONTENT        │   RIGHT SIDEBAR      │
│   (200px)    │       (flex-1, white)      │     (340px)          │
│              │                            │                      │
│ - Logo       │  - Topic Header (sticky)   │  - Weekly Challenge  │
│ - Nav Items  │  - Stats Bar               │  - Topic Lessons     │
│ - Mascot     │  - Progress Card           │  - Leaderboard       │
│              │  - Lesson Cards            │  - Ad Placeholder    │
│              │  - Checkpoints             │                      │
│              │  - Next Topic Preview      │                      │
└──────────────────────────────────────────────────────────────────┘
```

### Key Measurements
- Left Sidebar: `w-[200px]` fixed, sticky
- Main Content: `flex-1`, white background, `bg-gray-50` for content area
- Right Sidebar: `w-[340px]` fixed
- Max container width: `max-w-[1100px]`
- Card border radius: `rounded-2xl`
- Standard padding: `p-5` for cards

---

## Component Details

### 1. Left Sidebar (Reuse existing Sidebar.tsx)
Already implemented. Ensure:
- Remove `flex-1` from nav if present (fixes "More" button position)
- Lessons should be the active/highlighted item
- Include mascot helper at bottom

### 2. Topic Header (Sticky)
```tsx
// Sticky header with gradient background
<header className="sticky top-0 z-30">
  {/* Gradient header - softer orange */}
  <div className="px-6 py-6" style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}>
    {/* Back button + Week indicator */}
    <div className="flex items-center space-x-2 mb-2">
      <button className="text-white/80 hover:text-white text-sm">← Back</button>
      <span className="text-white/40">|</span>
      <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
        Week 1 of 8
      </span>
    </div>

    {/* Title */}
    <h1 className="text-2xl font-bold text-white">Sports Nutrition: Week 1</h1>
    <p className="text-orange-100 text-sm mt-1">
      ⚽ Football Edition • 10 Lessons • ~30 min
    </p>
  </div>

  {/* Stats bar - white background */}
  <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
    {/* Stats: Completed, XP Earned, Streak */}
    {/* Mini progress bar on right */}
  </div>
</header>
```

### 3. Progress Card
Simple white card showing lessons completed:
- Icon + "0 of 10 lessons" text
- Progress bar (green)
- Tip text: "Tap 'Rocket Fuel for Legs!' to start your journey!"
- Styling: `bg-white rounded-2xl p-5 shadow-sm border border-gray-200`

### 4. Lesson Cards (Main Feature)
**Current Lesson (Available):**
```tsx
<div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden">
  <div className="flex">
    {/* Left: Number badge - orange background */}
    <div className="w-16 bg-orange-500 flex flex-col items-center justify-center py-4">
      <span className="text-white text-2xl font-bold">1</span>
    </div>

    {/* Center: Content */}
    <div className="flex-1 p-4">
      <h3 className="font-bold text-base text-gray-900">🚀 Rocket Fuel for Legs!</h3>
      <p className="text-sm text-gray-500 mt-1">Learn which foods give you energy...</p>
      <div className="flex items-center space-x-2 mt-3">
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">5 min</span>
        <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">+15 XP</span>
        <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">Quiz</span>
      </div>
    </div>

    {/* Right: Action button - green */}
    <div className="w-28 bg-green-500 flex items-center justify-center cursor-pointer hover:bg-green-600">
      <div className="text-center text-white">
        <span className="text-xl">▶️</span>
        <p className="text-sm font-bold mt-1">START</p>
      </div>
    </div>
  </div>
</div>
```

**Locked Lesson:**
```tsx
<div className="opacity-60">
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="flex">
      {/* Left: Number badge - gray */}
      <div className="w-16 bg-gray-200 flex flex-col items-center justify-center py-4">
        <span className="text-gray-400 text-2xl font-bold">2</span>
      </div>

      {/* Center: Content - grayed out */}
      <div className="flex-1 p-4">
        <h3 className="font-bold text-base text-gray-400">🥩 Power Up Proteins</h3>
        <p className="text-sm text-gray-400 mt-1">Description...</p>
      </div>

      {/* Right: Lock icon */}
      <div className="w-28 bg-gray-100 flex items-center justify-center">
        <span className="text-xl text-gray-400">🔒</span>
      </div>
    </div>
  </div>
</div>
```

### 5. Path Connectors
Between lesson cards:
```tsx
<div className="flex justify-center">
  <div className="w-0.5 h-6 rounded-full"
       style={{
         background: 'repeating-linear-gradient(to bottom, #86efac 0px, #86efac 8px, transparent 8px, transparent 16px)'
       }} />
</div>
```
- Active (completed): `#86efac` (green)
- Inactive: `#e5e7eb` (gray)

### 6. Checkpoint Reward (Treasure Chest)
**IMPORTANT: Use subtle, muted design - NOT bright/glowing**
```tsx
<div className="bg-white rounded-2xl px-6 py-5 border border-gray-200 shadow-sm max-w-lg w-full">
  <div className="flex items-center space-x-4">
    {/* Treasure chest icon - subtle amber gradient */}
    <div className="relative">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center border border-amber-300">
        <span className="text-3xl">📦</span>
      </div>
      {/* Lock overlay when locked */}
      <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center border-2 border-white">
        <span className="text-xs">🔒</span>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1">
      <h4 className="font-bold text-gray-800">Checkpoint Reward</h4>
      <p className="text-sm text-gray-500 mt-0.5">Complete 3 lessons to unlock</p>
      {/* Progress bar */}
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>0 / 3</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div className="bg-amber-400 h-full rounded-full" style={{ width: '0%' }} />
        </div>
      </div>
    </div>

    {/* Reward preview */}
    <div className="text-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-lg">🎁</div>
      <div className="text-xs text-gray-600 font-medium">+50 XP</div>
    </div>
  </div>
</div>
```

### 7. Right Sidebar Components

#### Weekly Challenge
```tsx
<div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-md">
  <div className="flex items-center justify-between mb-3">
    <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">🎯 WEEKLY CHALLENGE</span>
    <span className="text-xs opacity-80">3 days left</span>
  </div>
  <h3 className="font-bold text-lg">Complete 5 Lessons</h3>
  <p className="text-sm text-indigo-100 mt-1">Earn a special badge!</p>
  {/* Progress bar */}
</div>
```

#### Topic Lessons (Simple List)
```tsx
<div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-bold text-base text-gray-800">Topic Lessons</h3>
    <span className="text-sm text-gray-400">0/10</span>
  </div>

  <div className="space-y-1 max-h-[300px] overflow-y-auto">
    {/* Current lesson */}
    <div className="flex items-center space-x-3 py-2 px-2 rounded-lg bg-orange-50 cursor-pointer">
      <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
      <span className="text-sm font-medium text-gray-900 flex-1">Rocket Fuel for Legs!</span>
      <span className="text-green-500 text-xs">▶</span>
    </div>

    {/* Locked lesson */}
    <div className="flex items-center space-x-3 py-2 px-2 rounded-lg hover:bg-gray-50 opacity-50">
      <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold">2</span>
      <span className="text-sm text-gray-500 flex-1">Power Up Proteins</span>
      <span className="text-gray-400 text-xs">🔒</span>
    </div>

    {/* Checkpoint in list */}
    <div className="flex items-center space-x-3 py-2 px-2 rounded-lg opacity-50">
      <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 text-xs">📦</span>
      <span className="text-sm text-amber-700 flex-1">Checkpoint Reward</span>
      <span className="text-amber-600 text-xs">0/3</span>
    </div>
  </div>
</div>
```

#### Leaderboard
```tsx
<div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-bold text-base text-gray-800">🏆 Leaderboard</h3>
    <a href="#" className="text-sm text-orange-500 font-medium hover:underline">View All →</a>
  </div>

  <div className="space-y-2">
    {/* 1st place */}
    <div className="flex items-center space-x-3 p-2 bg-amber-50/50 rounded-xl">
      <span className="text-lg">🥇</span>
      <div className="w-7 h-7 bg-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
      <p className="font-medium text-sm text-gray-800 flex-1">Sarah K.</p>
      <span className="font-bold text-sm text-gray-700">450 XP</span>
    </div>

    {/* 2nd, 3rd place similar... */}

    {/* Your position - highlighted */}
    <div className="border-t border-gray-100 pt-2 mt-2">
      <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded-xl border border-orange-200">
        <span className="text-xs font-bold text-gray-500 w-5 text-center">#8</span>
        <div className="w-7 h-7 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">R</div>
        <p className="font-medium text-sm text-gray-800 flex-1">You (Rav)</p>
        <span className="font-bold text-sm text-orange-600">85 XP</span>
      </div>
    </div>
  </div>
</div>
```

#### Ad Placeholder
```tsx
<div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
  <div className="text-center py-8">
    <div className="text-3xl mb-2 opacity-50">📣</div>
    <p className="text-sm text-gray-400">Ad Placeholder</p>
    <p className="text-xs text-gray-300 mt-1">340 x 180</p>
  </div>
</div>
```

---

## CSS Animations (Add to global CSS or component)

```css
/* Lesson card hover */
.lesson-card {
  transition: all 0.3s ease;
}
.lesson-card:hover {
  transform: translateY(-3px);
}

/* Current lesson subtle glow */
.current-glow {
  box-shadow: 0 0 20px rgba(255, 106, 0, 0.15);
}
.current-glow:hover {
  box-shadow: 0 0 30px rgba(255, 106, 0, 0.25);
}

/* Treasure chest subtle animation */
.treasure-subtle {
  animation: subtle-glow 3s ease-in-out infinite;
}
@keyframes subtle-glow {
  0%, 100% { box-shadow: 0 4px 15px rgba(180, 140, 80, 0.15); }
  50% { box-shadow: 0 4px 20px rgba(180, 140, 80, 0.25); }
}

/* Mascot peek animation */
.mascot-peek {
  animation: peek 4s ease-in-out infinite;
}
@keyframes peek {
  0%, 80%, 100% { transform: translateX(0); }
  10%, 70% { transform: translateX(10px); }
}
```

---

## Data Structure

```typescript
interface Lesson {
  id: number;
  title: string;
  description: string;
  emoji: string;
  duration: number; // minutes
  xp: number;
  type: 'lesson' | 'quiz' | 'practice';
  status: 'completed' | 'current' | 'locked';
}

interface Checkpoint {
  id: number;
  requiredLessons: number;
  completedLessons: number;
  reward: {
    xp: number;
    badge?: string;
  };
}

interface TopicData {
  id: string;
  title: string;
  subtitle: string;
  weekNumber: number;
  totalWeeks: number;
  totalLessons: number;
  estimatedTime: number;
  lessons: Lesson[];
  checkpoints: Checkpoint[];
}
```

---

## Implementation Checklist

1. [ ] Update `Lessons.tsx` page structure to two-column layout
2. [ ] Add sticky topic header with gradient background
3. [ ] Implement horizontal lesson cards (current/locked states)
4. [ ] Add path connectors between cards
5. [ ] Create subtle checkpoint/treasure chest component
6. [ ] Add right sidebar with:
   - [ ] Weekly Challenge card
   - [ ] Topic Lessons simple list
   - [ ] Leaderboard component
   - [ ] Ad placeholder
7. [ ] Add CSS animations for hover effects
8. [ ] Ensure responsive behavior (hide right sidebar on mobile)
9. [ ] Connect to existing data/API for lessons

---

## Color Palette Reference

| Element | Color |
|---------|-------|
| Primary Orange | `#f97316` (orange-500) |
| Current Card Border | `#fed7aa` (orange-200) |
| Locked State | `#9ca3af` (gray-400) |
| Progress Green | `#22c55e` (green-500) |
| Checkpoint Amber | `#fbbf24` (amber-400) |
| Challenge Gradient | `indigo-500` to `purple-600` |
| Background | `#f9fafb` (gray-50) |
| Card Background | `#ffffff` (white) |

---

## Important Notes

1. **Color Balance**: Keep colors muted. Avoid bright glowing effects. The checkpoint box should be subtle white with light amber accents, NOT a glowing golden box.

2. **No "Expedition" terminology**: Use "lessons", "topic", or "journey" instead.

3. **Day Streak removed**: Do not include Day Streak in the right sidebar.

4. **Topic Lessons is a simple list**: Just numbered circles with lesson names, not styled cards.

5. **Mobile Responsive**: On mobile (`< md:`), hide the right sidebar and stack content vertically. Use the existing BottomNavigation component.

6. **Reuse Sidebar component**: Import and use the existing `Sidebar.tsx` component for the left navigation.
