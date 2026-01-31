# BiteBurst Dashboard Two-Column Layout - Replit Agent Prompt

## OBJECTIVE
Redesign the Dashboard/Profile page to use a **two-column layout** (like Duolingo):
- **Main column (left)**: Profile hero, Statistics, Lesson Hero, Quick Log
- **Right sidebar (340px)**: Daily XP Goal, Today's Journey, Today's Activity, Badges

Also make elements **larger and more square** to reduce whitespace.

---

## REFERENCE WIREFRAME
See: `wireframes/dashboard-redesign-wireframe-FINAL.html` for visual reference

---

## FILES TO MODIFY

### Primary File: `client/src/pages/DashboardRedesign.tsx`

---

## STEP-BY-STEP CHANGES

### STEP 1: Update the Main Layout Structure

**Find the current structure (around line 200-210):**
```tsx
return (
  <div className="min-h-screen bg-[#FAFAFA]">
    {/* Sidebar for tablet/desktop */}
    <Sidebar />

    {/* Main content - offset for sidebar on larger screens */}
    <div className="md:ml-[200px]">
```

**Replace with TWO-COLUMN layout:**
```tsx
return (
  <div className="min-h-screen bg-[#FAFAFA]">
    {/* Sidebar for tablet/desktop */}
    <Sidebar />

    {/* Main content area - offset for sidebar */}
    <div className="md:ml-[200px]">
      {/* FULL-WIDTH SECTIONS (Avatar, User Info, Status Bar) */}
      {/* ... keep these as-is ... */}

      {/* TWO-COLUMN LAYOUT for content below status bar */}
      <div className="flex justify-center">
        <div className="flex max-w-[1100px] w-full">

          {/* LEFT: Main Content Column */}
          <div className="flex-1 min-w-0 p-8 space-y-6 pb-32">
            {/* Mascot, Statistics, Lesson Hero, Quick Log */}
          </div>

          {/* RIGHT: Sidebar Column (hidden on mobile) */}
          <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">
            {/* Daily XP, Today's Journey, Today's Activity, Badges */}
          </div>

        </div>
      </div>
    </div>

    <BottomNavigation />
  </div>
);
```

---

### STEP 2: Restructure the Content Sections

**Current order in main content:**
1. Mascot Greeting
2. Lesson Hero
3. Statistics Grid
4. XP Progress Bar
5. Today's Journey
6. Quick Log
7. Badges Shelf

**NEW order - Main Column (left):**
1. Mascot Greeting
2. **Statistics Grid** (MOVED UP - before Lesson Hero)
3. Lesson Hero
4. Quick Log

**NEW order - Right Sidebar:**
1. Daily XP Goal (XP Progress Bar)
2. Today's Journey
3. Today's Activity (new component showing recent logs or empty state)
4. Badges & Rewards (Badges Shelf)

---

### STEP 3: Update Statistics Grid - Make Cards Larger/Square

**Find StatisticsGrid component usage and update the grid styling.**

If inline in DashboardRedesign.tsx, update to:
```tsx
{/* STATISTICS - Larger Square Cards */}
<div>
  <h2 className="font-bold text-xl mb-4">Statistics</h2>
  <div className="grid grid-cols-2 gap-5">
    {/* Day Streak */}
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
      <div className="flex items-center space-x-4">
        <span className="text-4xl">🔥</span>
        <div>
          <div className="text-4xl font-bold text-gray-900">{dailySummary.streak_days}</div>
          <div className="text-sm text-gray-500 font-medium">Day streak</div>
        </div>
      </div>
    </div>

    {/* Total XP */}
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
      <div className="flex items-center space-x-4">
        <span className="text-4xl">⚡</span>
        <div>
          <div className="text-4xl font-bold text-gray-900">{dailySummary.user.lifetime_xp}</div>
          <div className="text-sm text-gray-500 font-medium">Total XP</div>
        </div>
      </div>
    </div>

    {/* League */}
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
      <div className="flex items-center space-x-4">
        <span className="text-4xl">🥉</span>
        <div>
          <div className="text-2xl font-bold text-orange-600">Bronze</div>
          <div className="text-sm text-gray-500 font-medium">League</div>
        </div>
      </div>
    </div>

    {/* Best Streak */}
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
      <div className="flex items-center space-x-4">
        <span className="text-4xl">🏅</span>
        <div>
          <div className="text-4xl font-bold text-gray-900">{dailySummary.best_streak}</div>
          <div className="text-sm text-gray-500 font-medium">Best Streak</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

**Key changes:**
- `min-h-[140px]` - taller cards
- `text-4xl` - larger icons and numbers
- `gap-5` - more spacing between cards
- `p-6` - more padding inside cards

---

### STEP 4: Update Quick Log - Larger Emoji Grid

**Update Quick Log section:**
```tsx
{/* QUICK LOG - Larger Grid */}
<div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
  <div className="flex justify-between items-center mb-5">
    <h3 className="font-bold text-xl">Quick Log</h3>
    <span className="text-sm text-gray-400">Tap to log</span>
  </div>

  {/* 4-column emoji grid with larger items */}
  <div className="grid grid-cols-4 gap-4 mb-6">
    {['🍎', '🥦', '🍞', '🧃', '⚽', '🧘', '🏃', '🚴'].map((emoji, i) => (
      <button
        key={i}
        onClick={() => setLocation(i < 4 ? '/food-log' : '/activity-log')}
        className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-4xl hover:bg-orange-50 hover:scale-105 cursor-pointer transition"
      >
        {emoji}
      </button>
    ))}
  </div>

  {/* Larger buttons */}
  <div className="grid grid-cols-2 gap-5">
    <button
      onClick={() => setLocation('/food-log')}
      className="border-2 border-orange-500 text-orange-500 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition"
    >
      Log Food
    </button>
    <button
      onClick={() => setLocation('/activity-log')}
      className="border-2 border-orange-500 text-orange-500 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition"
    >
      Log Activity
    </button>
  </div>
</div>
```

**Key changes:**
- `grid-cols-4` - 4 columns instead of inline flex
- `aspect-square` - square emoji buttons
- `text-4xl` - larger emojis
- `gap-4` and `gap-5` - more spacing
- `py-4` - taller buttons

---

### STEP 5: Create Right Sidebar Content

**Add this as a sibling to the main content column:**
```tsx
{/* RIGHT SIDEBAR - Desktop only */}
<div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">

  {/* Daily XP Goal */}
  <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        <span className="text-xl">⚡</span>
        <span className="font-bold">Daily XP Goal</span>
      </div>
      <span className="text-sm">
        <span className="text-orange-500 font-bold">{dailySummary.xp_today}</span> / {dailySummary.xp_goal}
      </span>
    </div>
    <div className="bg-gray-200 rounded-full h-3">
      <div
        className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all"
        style={{ width: `${Math.min((dailySummary.xp_today / dailySummary.xp_goal) * 100, 100)}%` }}
      />
    </div>
    <p className="text-center text-sm text-orange-500 mt-2 font-medium">
      {dailySummary.xp_goal - dailySummary.xp_today} XP to go!
    </p>
  </div>

  {/* Today's Journey */}
  <TodaysJourney
    milestones={dailySummary.milestones}
    onTaskComplete={handleXpBurst}
    compact={true}
  />

  {/* Today's Activity */}
  <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
    <h3 className="font-bold text-lg mb-4">Today's Activity</h3>
    {dailySummary.recent_logs.length === 0 ? (
      <div className="text-center py-4">
        <div className="text-5xl mb-3">🍊</div>
        <p className="font-bold text-gray-800">No activity yet today</p>
        <p className="text-sm text-gray-500">Time to fuel up! 🍎</p>
      </div>
    ) : (
      <div className="space-y-2">
        {dailySummary.recent_logs.slice(0, 3).map((log, i) => (
          <div key={i} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-0">
            <span className="text-xl">{log.type === 'food' ? '🍽️' : '🏃'}</span>
            <span className="text-sm flex-1">{log.summary}</span>
            {log.xpAwarded && (
              <span className="text-xs text-orange-500 font-bold">+{log.xpAwarded} XP</span>
            )}
          </div>
        ))}
      </div>
    )}
    <div className="space-y-2 mt-4">
      <button
        onClick={() => setLocation('/food-log')}
        className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
      >
        🍽️ Log Your First Meal
      </button>
      <button
        onClick={() => setLocation('/activity-log')}
        className="w-full border-2 border-orange-200 text-orange-500 py-3 rounded-xl font-bold hover:bg-orange-50 transition"
      >
        ⚽ Log Your First Activity
      </button>
    </div>
  </div>

  {/* Badges & Rewards */}
  <BadgesShelf
    earnedBadges={badgeData?.earned || dailySummary.badges.earned}
    lockedBadges={badgeData?.locked || dailySummary.badges.locked}
    compact={true}
  />

</div>
```

---

### STEP 6: Update Lesson Hero - Larger Icon

**Update LessonHero or inline lesson card:**
```tsx
{/* LESSON HERO - Larger */}
<div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-3xl p-8">
  <div className="flex items-center space-x-6">
    {/* Large Square Icon - 28x28 (112px) */}
    <div className="w-28 h-28 bg-orange-100 rounded-2xl flex items-center justify-center text-6xl flex-shrink-0 shadow-sm">
      ⚽
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-xl">Continue Learning</h3>
        <span className="text-2xl">📚</span>
      </div>
      <p className="font-semibold text-lg text-gray-800">Fuel for Football</p>
      <p className="text-sm text-gray-500 mb-3">3 of 5 slides</p>
      <div className="bg-gray-200 rounded-full h-2.5 mb-5">
        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
      </div>
      <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-md">
        📖 START LESSON
      </button>
    </div>
  </div>
</div>
```

---

### STEP 7: Fix Sidebar.tsx - Move "More" button up

**In `client/src/components/Sidebar.tsx`, find (line ~49):**
```tsx
<nav className="flex-1 p-3 space-y-1">
```

**Replace with:**
```tsx
<nav className="p-3 space-y-1">
```

**(Remove `flex-1` so "More" appears right after nav items)**

---

## COMPLETE NEW STRUCTURE

```tsx
return (
  <div className="min-h-screen bg-[#FAFAFA]">
    <Sidebar />

    <div className="md:ml-[200px]">
      {/* FULL-WIDTH: Avatar Hero */}
      <div className="bg-gradient-to-b from-purple-200 to-purple-300 py-10 ...">
        <CharacterAvatar size="lg" />
      </div>

      {/* FULL-WIDTH: User Info Bar */}
      <div className="bg-[#1A1B4B] text-white py-6 ...">
        {/* Name, Level, XP Progress */}
      </div>

      {/* FULL-WIDTH: Status Bar */}
      <div className="bg-white border-b py-4 ...">
        {/* Streak, Hearts, Settings */}
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="flex justify-center">
        <div className="flex max-w-[1100px] w-full">

          {/* MAIN COLUMN */}
          <div className="flex-1 min-w-0 p-8 space-y-6 pb-32">
            {/* 1. Mascot Greeting */}
            {/* 2. Statistics Grid (MOVED UP) */}
            {/* 3. Lesson Hero */}
            {/* 4. Quick Log */}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block w-[340px] bg-gray-50 border-l p-5 space-y-5">
            {/* 1. Daily XP Goal */}
            {/* 2. Today's Journey */}
            {/* 3. Today's Activity */}
            {/* 4. Badges & Rewards */}
          </div>

        </div>
      </div>
    </div>

    <BottomNavigation />
  </div>
);
```

---

## SIZE CHANGES SUMMARY

| Element | Before | After |
|---------|--------|-------|
| Stat cards height | auto | `min-h-[140px]` |
| Stat icons | text-2xl | `text-4xl` |
| Stat numbers | text-2xl | `text-4xl` |
| Emoji buttons | w-12 h-12 | `aspect-square` in 4-col grid |
| Emoji size | text-2xl | `text-4xl` |
| Log buttons | py-3 | `py-4` |
| Lesson icon | w-20 h-20 | `w-28 h-28` |
| Card padding | p-5 | `p-6` or `p-8` |
| Grid gaps | gap-3/gap-4 | `gap-5` |
| Right sidebar | none | `w-[340px]` |

---

## ⚠️ DO NOT CHANGE

- Colors (keep orange #FF6A00, purple gradients, etc.)
- The avatar/user info/status bar sections (only restructure what's below)
- Mobile layout (keep existing mobile behavior)
- API calls or data fetching logic
- Authentication logic
- BottomNavigation component

---

## TESTING

After implementation:
1. Desktop (1200px+): Should show two-column layout with right sidebar
2. Tablet (768-1199px): Right sidebar should be hidden (`hidden lg:block`)
3. Mobile: Should show single column with bottom navigation
4. Statistics should appear ABOVE the Lesson Hero
5. Cards should be larger and more square-shaped
6. Less whitespace overall

---

## RESPONSIVE BREAKPOINTS

- `lg:` (1024px+) - Show right sidebar
- `md:` (768px+) - Show left sidebar, offset main content
- Below 768px - Mobile layout with bottom navigation
