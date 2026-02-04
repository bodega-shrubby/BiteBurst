# BiteBurst Dashboard - Complete Fix to Match V4 Wireframe

## OVERVIEW
The current implementation does NOT match the approved V4 wireframe. This prompt details ALL changes needed to make it match exactly.

**Reference:** `wireframes/v4-design-1-updated-layout.html`

---

## VISUAL COMPARISON

### WIREFRAME (What it SHOULD look like):
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ LEFT SIDEBAR │        MAIN CONTENT              │     RIGHT SIDEBAR        │
│  (white)     │                                  │                          │
│              │ ┌──────────────────────────────┐ │ ┌──────────────────────┐ │
│ 🍊 BiteBurst │ │ 🦸 Hey Alex! 🌟              │ │ │ 🍊 Oni the Orange    │ │
│              │ │ Ready to fuel your body...   │ │ │ Great job logging!   │ │
│ 🏠 Dashboard │ │ 🍊 Health Hero 🏃            │ │ └──────────────────────┘ │
│ 📚 Lessons   │ └──────────────────────────────┘ │                          │
│ 📊 Progress  │                                  │ ┌──────────────────────┐ │
│ 🏆 Achieve   │ ┌────┐ ┌────┐ ┌────┐ ┌────┐     │ │ ⚡ Daily XP Goal     │ │
│ ⚙️ Settings  │ │ XP │ │Act │ │Strk│ │Lvl │     │ │ [======] 65/100      │ │
│              │ └────┘ └────┘ └────┘ └────┘     │ └──────────────────────┘ │
│              │                                  │                          │
│              │ ┌──────────────────────────────┐ │ ┌──────────────────────┐ │
│              │ │ ⚽ 📚 CONTINUE LEARNING      │ │ │ 🗺️ Today's Journey   │ │
│              │ │ The Boss Battle   3 of 5     │ │ │ ✅ Log one fruit     │ │
│              │ │ [====GREEN====]              │ │ │ ▶️ Move for 15 min   │ │
│              │ │ [   START LESSON   ]         │ │ │ 🔒 Drink water       │ │
│              │ └──────────────────────────────┘ │ └──────────────────────┘ │
│              │                                  │                          │
│              │ ┌──────────────────────────────┐ │ ┌──────────────────────┐ │
│              │ │ ⚡ Quick Log                 │ │ │ 📋 Today's Activity  │ │
│              │ │ ┌─────────┐ ┌─────────┐      │ │ │ 🍊 No activity yet   │ │
│              │ │ │🍎Log    │ │🏃Log    │      │ │ │ [Log a Meal]         │ │
│              │ │ │ Food    │ │Exercise │      │ │ │ [Log Activity]       │ │
│              │ │ └─────────┘ └─────────┘      │ │ └──────────────────────┘ │
│              │ └──────────────────────────────┘ │                          │
│              │                                  │ ┌──────────────────────┐ │
│              │                                  │ │ 🏅 Badges & Rewards  │ │
│              │                                  │ │ 🍎🏃💧🥕 🔒🔒🔒🔒    │ │
│              │                                  │ └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CURRENT (What it looks like NOW - WRONG):
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LARGE PURPLE AVATAR HEADER ❌ REMOVE                      │
│                    Arjun @arjun Level 7 XP bar                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                    🔥 1 day streak ⭐⭐⭐ ⚙️ ❌ REMOVE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ LEFT SIDEBAR │        MAIN CONTENT              │     RIGHT SIDEBAR        │
│              │ ┌──────────────────────────────┐ │                          │
│              │ │ Avatar greeting card ✓       │ │ Oni ✓                    │
│              │ └──────────────────────────────┘ │ Daily XP ✓               │
│              │ Statistics (2x2) ⚠️ Should be 4  │ Journey ✓                │
│              │ Continue Learning ✓              │ Activity ✓               │
│              │ LessonHero ❌ DUPLICATE          │ Badges ✓                 │
│              │ Quick Log with 8 emojis ❌       │                          │
│              │ RecentLogsList ⚠️               │                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## CHANGES REQUIRED

### 1. ❌ REMOVE: Large Purple Avatar Header Section

**File:** `client/src/pages/DashboardRedesign.tsx`

**FIND AND DELETE (lines ~306-353):**
```tsx
{/* 1. AVATAR HERO SECTION - Light lavender background */}
<div
  className="w-full py-8 px-4 flex flex-col items-center"
  style={{ background: 'linear-gradient(180deg, #E8E0F0 0%, #DDD6E8 100%)' }}
>
  ... entire section including CharacterAvatar, Pencil button ...
</div>

{/* 2. USER INFO BAR - Dark navy blue */}
<div
  className="text-white py-5 px-4 text-center"
  style={{ backgroundColor: '#1A1B4B' }}
>
  ... entire section including name, @username, Level badge, Level Progress ...
</div>
```

**DELETE THE ENTIRE PURPLE HEADER AND NAVY USER INFO BAR.**

---

### 2. ❌ REMOVE: Status Bar (Streak, Stars, Settings)

**FIND AND DELETE (lines ~355-377):**
```tsx
{/* 3. STATUS BAR - Streak, Hearts, Settings - FULL WIDTH */}
<div className="w-full bg-white border-b border-gray-200 px-4 py-3">
  <div className="flex items-center justify-center space-x-6">
    {/* Streak Pill */}
    ...
    {/* Stars */}
    <StarsDisplay stars={3} maxStars={5} />
    {/* Settings */}
    ...
  </div>
</div>
```

**DELETE THIS ENTIRE SECTION.** The streak is already shown in the Statistics cards.

---

### 3. ❌ REMOVE: Duplicate LessonHero Component

**FIND AND DELETE (line ~471):**
```tsx
{/* 6. LESSON HERO - PRIMARY CTA */}
<LessonHero />
```

**Also remove the import at the top:**
```tsx
import LessonHero from "@/components/dashboard/LessonHero";
```

---

### 4. ⚠️ FIX: Quick Log - Remove Emoji Grid

**FIND (lines ~474-508):**
```tsx
{/* 7. QUICK LOG - Larger Grid */}
<div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
  <div className="flex justify-between items-center mb-5">
    <h3 className="font-bold text-xl">Quick Log</h3>
    <span className="text-sm text-gray-400">Tap to log</span>
  </div>

  {/* 4-column emoji grid with larger items */}
  <div className="grid grid-cols-4 gap-4 mb-6">
    {['🍎', '🥦', '🍞', '🧃', '⚽', '🧘', '🏃', '🚴'].map((emoji, i) => (
      ...
    ))}
  </div>

  {/* Larger buttons */}
  <div className="grid grid-cols-2 gap-5">
    ...
  </div>
</div>
```

**REPLACE WITH (matches wireframe - just 2 styled buttons):**
```tsx
{/* QUICK LOG - Two buttons only */}
<div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
  <h3 className="font-bold text-xl mb-5 flex items-center gap-2">
    <span>⚡</span> Quick Log
  </h3>

  <div className="flex gap-4">
    {/* Log Food Button - Orange theme */}
    <button
      onClick={() => setLocation('/food-log')}
      className="flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-500 hover:to-orange-400 hover:text-white text-orange-600 transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <span className="text-4xl">🍎</span>
      <span className="font-bold text-base">Log Food</span>
    </button>

    {/* Log Exercise Button - Blue theme */}
    <button
      onClick={() => setLocation('/activity-log')}
      className="flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-[#4A90D9] hover:to-[#7AB8F5] hover:text-white text-[#2E6BB5] transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <span className="text-4xl">🏃</span>
      <span className="font-bold text-base">Log Exercise</span>
    </button>
  </div>
</div>
```

---

### 5. ⚠️ FIX: Statistics Grid - Should be 4 in a Row

**FIND (line ~408):**
```tsx
<div className="grid grid-cols-2 gap-5">
```

**CHANGE TO:**
```tsx
<div className="grid grid-cols-4 gap-4">
```

This makes the 4 stat cards display in a single row like the wireframe.

---

### 6. ⚠️ OPTIONAL: Remove RecentLogsList from Main Content

The wireframe doesn't show a "Recent Activity" list in the main content area. The "Today's Activity" section in the right sidebar serves this purpose.

**Consider removing (line ~511):**
```tsx
{/* 8. RECENT ACTIVITY - with AI feedback dropdown (main column for all screens) */}
<RecentLogsList logs={dailySummary.recent_logs} />
```

**If you keep it**, move it below Quick Log but make it less prominent.

---

### 7. ✅ VERIFY: Avatar Greeting Section is Correct

The white card greeting section (lines ~385-403) should remain. This is correct:
```tsx
{/* 1. AVATAR/GREETING SECTION */}
<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
  <div className="flex items-center gap-6">
    <div className="w-[100px] h-[100px] bg-gradient-to-br from-orange-500 to-orange-400 rounded-full ...">
      <CharacterAvatar size="lg" />
    </div>
    <div className="flex-1">
      <h1 className="text-2xl font-extrabold text-gray-800">
        Hey <span className="text-orange-500">{dailySummary.user.display_name}</span>! 🌟
      </h1>
      <p className="text-gray-500 mt-1">Ready to fuel your body and get moving?</p>
      <span className="inline-block bg-orange-50 text-orange-500 px-4 py-1.5 rounded-full text-sm font-bold mt-2">
        🍊 Health Hero 🏃
      </span>
    </div>
  </div>
</div>
```

---

## COMPLETE FIXED STRUCTURE

After all changes, `DashboardRedesign.tsx` should have this structure:

```tsx
return (
  <div className="min-h-screen bg-[#FAFAFA]">
    <Sidebar />

    <div className="md:ml-[200px]">
      {/* NO PURPLE HEADER */}
      {/* NO NAVY USER INFO BAR */}
      {/* NO STATUS BAR */}

      {/* TWO-COLUMN LAYOUT */}
      <div className="flex justify-center">
        <div className="flex max-w-[1100px] w-full">

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 space-y-6 pb-32">

            {/* 1. Avatar/Greeting Card */}
            <div className="bg-white rounded-2xl p-6 ...">
              {/* Avatar + "Hey {Name}!" */}
            </div>

            {/* 2. Statistics Grid - 4 columns */}
            <div>
              <h2 className="font-bold text-xl mb-4">Statistics</h2>
              <div className="grid grid-cols-4 gap-4">
                {/* XP, Active Min, Streak, Level */}
              </div>
            </div>

            {/* 3. Continue Learning - ONLY ONE */}
            <ContinueLearning />

            {/* 4. Quick Log - TWO BUTTONS ONLY */}
            <div className="bg-white rounded-2xl p-6 ...">
              <h3>⚡ Quick Log</h3>
              <div className="flex gap-4">
                <button>🍎 Log Food</button>
                <button>🏃 Log Exercise</button>
              </div>
            </div>

            {/* MOBILE ONLY: Sidebar content stacked */}
            <div className="lg:hidden space-y-6">
              ...
            </div>
          </div>

          {/* RIGHT SIDEBAR - Desktop only */}
          <div className="hidden lg:block w-[340px] ...">
            {/* 1. Oni Mascot */}
            <OniMascotCard ... />

            {/* 2. Daily XP Goal */}
            <div>...</div>

            {/* 3. Today's Journey */}
            <TodaysJourney ... />

            {/* 4. Today's Activity */}
            <TodaysActivity ... />

            {/* 5. Badges */}
            <BadgesShelf ... />
          </div>

        </div>
      </div>
    </div>

    <BottomNavigation />
  </div>
);
```

---

## SUMMARY CHECKLIST

| Item | Action | Priority |
|------|--------|----------|
| Purple avatar header | ❌ DELETE entirely | 🔴 HIGH |
| Navy user info bar | ❌ DELETE entirely | 🔴 HIGH |
| Status bar (streak/stars) | ❌ DELETE entirely | 🔴 HIGH |
| LessonHero component | ❌ DELETE (duplicate) | 🔴 HIGH |
| Quick Log emoji grid | ❌ REPLACE with 2 buttons | 🔴 HIGH |
| Statistics grid | ⚠️ CHANGE to 4 columns | 🟡 MEDIUM |
| RecentLogsList | ⚠️ Consider removing | 🟢 LOW |
| Avatar greeting card | ✅ KEEP as is | - |
| ContinueLearning | ✅ KEEP as is | - |
| Right sidebar | ✅ KEEP as is | - |

---

## TESTING AFTER CHANGES

1. ✅ NO purple/lavender header at top
2. ✅ NO navy blue user info bar
3. ✅ NO status bar with streak/stars/settings
4. ✅ Main content starts with white avatar greeting card
5. ✅ Statistics show 4 cards in ONE ROW
6. ✅ Only ONE "Continue Learning" section
7. ✅ Quick Log has only 2 buttons (no emoji grid)
8. ✅ Right sidebar shows Oni → XP → Journey → Activity → Badges
9. ✅ Mobile view works correctly
