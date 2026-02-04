# BiteBurst Dashboard UI Redesign V4 - Replit Agent Prompt

## OBJECTIVE
Update the Dashboard page (`client/src/pages/DashboardRedesign.tsx`) to match the approved V4 wireframe design. This involves:
1. Moving Oni the Orange mascot to the TOP of the RIGHT column
2. Adding a "Continue Learning" section in the main content area
3. Adding a "Today's Activity" section in the right sidebar
4. Updating color scheme to include blue shades alongside primary orange
5. Ensuring all existing functionality remains intact

**CRITICAL: Do NOT break any existing functionality. Test thoroughly after changes.**

---

## REFERENCE WIREFRAME
See: `wireframes/v4-design-1-updated-layout.html` for visual reference

---

## COLOR PALETTE

### Primary Colors (Existing - DO NOT CHANGE)
```css
--primary-orange: #FF8C42;
--orange-deep: #FF6B35;
--orange-light: #FFAA6C;
--orange-pale: #FFF4ED;
--peach: #FFD5C2;
```

### New Blue Shades (ADD THESE)
```css
--blue-primary: #4A90D9;
--blue-light: #7AB8F5;
--blue-dark: #2E6BB5;
--blue-pale: #E8F4FD;
--blue-sky: #87CEEB;
```

### Utility Colors
```css
--amber: #F9A826;
--green-success: #4CAF50;
--text-dark: #3D3D3D;
--text-medium: #707070;
```

---

## FILES TO MODIFY

### Primary Files
| File | Changes |
|------|---------|
| `client/src/pages/DashboardRedesign.tsx` | Main dashboard layout updates |
| `client/src/components/TodaysJourney.tsx` | Update journey task names if needed |

### Files to Create (if not existing)
| File | Purpose |
|------|---------|
| `client/src/components/dashboard/OniMascotCard.tsx` | Oni mascot card for right sidebar |
| `client/src/components/dashboard/ContinueLearning.tsx` | Continue Learning / Lesson Hero section |
| `client/src/components/dashboard/TodaysActivity.tsx` | Today's Activity section |

---

## STEP-BY-STEP IMPLEMENTATION

### STEP 1: Update the Right Sidebar Structure

**Current right sidebar order:**
1. Daily XP Goal
2. Today's Journey
3. Badges

**NEW right sidebar order (TOP TO BOTTOM):**
1. **Oni Mascot Card (NEW - MOVE HERE)**
2. Daily XP Goal
3. Today's Journey
4. **Today's Activity (NEW)**
5. Badges & Rewards
6. Ad Placeholder (existing)

---

### STEP 2: Create Oni Mascot Card Component

**File:** `client/src/components/dashboard/OniMascotCard.tsx`

**IMPORTANT:** Use the existing mascot asset `Oni_the_Orange.png` from `/public/mascots/` or `@assets/Mascots/`

```tsx
import oniImage from '@assets/Mascots/Oni_the_Orange.png';

interface OniMascotCardProps {
  message?: string;
  userName?: string;
}

export default function OniMascotCard({ message, userName }: OniMascotCardProps) {
  // Default messages - rotate or use based on context
  const defaultMessages = [
    `Great job logging your breakfast! Keep it up! 🎉`,
    `You're doing amazing today, ${userName || 'champ'}!`,
    `Ready to crush your goals today? 💪`,
    `Let's make today healthy and fun!`,
  ];

  const displayMessage = message || defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex items-center gap-4">
      {/* Oni Avatar - Static, no animation */}
      <div className="w-[70px] h-[70px] flex-shrink-0">
        <img
          src={oniImage}
          alt="Oni the Orange"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Oni Info */}
      <div className="flex-1">
        <h3 className="font-bold text-base text-orange-500">Oni the Orange</h3>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          {displayMessage}
        </p>
      </div>
    </div>
  );
}
```

**Usage in DashboardRedesign.tsx:**
```tsx
import OniMascotCard from '@/components/dashboard/OniMascotCard';

// In the right sidebar section, at the TOP:
<OniMascotCard userName={user?.display_name || 'Champion'} />
```

---

### STEP 3: Create Continue Learning Section

**File:** `client/src/components/dashboard/ContinueLearning.tsx`

This section shows the current/next lesson to resume and should be placed in the **MAIN CONTENT** area (left/center column), AFTER the stats row.

```tsx
import { useLocation } from 'wouter';

interface ContinueLearningProps {
  lesson?: {
    id: string;
    title: string;
    topicName: string;
    progress: number; // 0-100
    currentSlide: number;
    totalSlides: number;
    emoji?: string;
  };
  onStartLesson?: () => void;
}

export default function ContinueLearning({ lesson, onStartLesson }: ContinueLearningProps) {
  const [, setLocation] = useLocation();

  // Default lesson data if none provided
  const defaultLesson = {
    id: 'default',
    title: 'The Boss Battle',
    topicName: 'Sports Nutrition',
    progress: 60,
    currentSlide: 3,
    totalSlides: 5,
    emoji: '⚽',
  };

  const currentLesson = lesson || defaultLesson;

  const handleStartLesson = () => {
    if (onStartLesson) {
      onStartLesson();
    } else {
      setLocation(`/lessons/${currentLesson.id}`);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-3xl p-6">
      <div className="flex items-center gap-5">
        {/* Lesson Icon */}
        <div className="w-[90px] h-[90px] bg-gradient-to-br from-[#4A90D9] to-[#7AB8F5] rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 shadow-md">
          {currentLesson.emoji || '📚'}
        </div>

        {/* Lesson Content */}
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <span className="inline-block bg-[#E8F4FD] text-[#2E6BB5] text-xs font-bold px-3 py-1 rounded-full mb-2">
            📚 CONTINUE LEARNING
          </span>

          {/* Lesson Title */}
          <h3 className="font-extrabold text-lg text-orange-500 mb-2">
            {currentLesson.title}
          </h3>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
                style={{ width: `${currentLesson.progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-500">
              {currentLesson.currentSlide} of {currentLesson.totalSlides}
            </span>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartLesson}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-4 rounded-xl font-bold text-base hover:from-orange-600 hover:to-orange-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            📖 START LESSON
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Placement in DashboardRedesign.tsx:**
```tsx
import ContinueLearning from '@/components/dashboard/ContinueLearning';

// In the main content area, AFTER Statistics Grid, BEFORE Quick Log:
{/* Statistics Grid */}
<StatisticsGrid ... />

{/* Continue Learning - NEW */}
<ContinueLearning
  lesson={currentLesson}  // Get from API or context
  onStartLesson={() => handleResumeLesson()}
/>

{/* Quick Log */}
<QuickLog ... />
```

---

### STEP 4: Create Today's Activity Section

**File:** `client/src/components/dashboard/TodaysActivity.tsx`

This section shows recent activity logs or an empty state encouraging the user to log.

```tsx
import { useLocation } from 'wouter';

interface ActivityLog {
  id: string;
  type: 'food' | 'activity';
  summary: string;
  xpAwarded?: number;
  timestamp: Date;
}

interface TodaysActivityProps {
  recentLogs?: ActivityLog[];
}

export default function TodaysActivity({ recentLogs = [] }: TodaysActivityProps) {
  const [, setLocation] = useLocation();

  const hasActivity = recentLogs.length > 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <h3 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
        📋 Today's Activity
      </h3>

      {hasActivity ? (
        /* Show recent logs */
        <div className="space-y-2">
          {recentLogs.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-xl">
                {log.type === 'food' ? '🍽️' : '🏃'}
              </span>
              <span className="text-sm flex-1 text-gray-700">{log.summary}</span>
              {log.xpAwarded && (
                <span className="text-xs text-orange-500 font-bold">
                  +{log.xpAwarded} XP
                </span>
              )}
            </div>
          ))}

          {/* Additional log buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setLocation('/food-log')}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition flex items-center justify-center gap-1"
            >
              🍽️ Log More
            </button>
            <button
              onClick={() => setLocation('/activity-log')}
              className="flex-1 border-2 border-[#7AB8F5] text-[#2E6BB5] py-3 rounded-xl font-bold text-sm hover:bg-[#E8F4FD] transition flex items-center justify-center gap-1"
            >
              🏃 Log Activity
            </button>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-4">
          <div className="text-5xl mb-3">🍊</div>
          <p className="font-bold text-gray-800 text-base">No activity yet today</p>
          <p className="text-sm text-gray-500 mt-1">Time to fuel up! 🍎</p>

          <div className="flex flex-col gap-2 mt-5">
            <button
              onClick={() => setLocation('/food-log')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-orange-500 transition shadow-sm flex items-center justify-center gap-2"
            >
              🍽️ Log a Meal
            </button>
            <button
              onClick={() => setLocation('/activity-log')}
              className="w-full border-2 border-[#7AB8F5] text-[#2E6BB5] py-3 rounded-xl font-bold text-sm hover:bg-[#E8F4FD] transition flex items-center justify-center gap-2"
            >
              🏃 Log Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### STEP 5: Update Today's Journey Task Names

**File:** `client/src/components/TodaysJourney.tsx` (or wherever journey milestones are defined)

Update the default milestone names to match the wireframe:

```tsx
// Default milestones should be:
const defaultMilestones = [
  { id: '1', name: 'Log one fruit', xp: 15, completed: true },
  { id: '2', name: 'Move for 15 minutes', xp: 20, completed: false, current: true },
  { id: '3', name: 'Drink water', xp: 10, completed: false },
];
```

---

### STEP 6: Update DashboardRedesign.tsx Layout

**CRITICAL: Preserve ALL existing imports and functionality**

```tsx
// Add new imports at the top
import OniMascotCard from '@/components/dashboard/OniMascotCard';
import ContinueLearning from '@/components/dashboard/ContinueLearning';
import TodaysActivity from '@/components/dashboard/TodaysActivity';

// In the component, update the layout structure:

return (
  <div className="min-h-screen bg-[#FAFAFA]">
    <Sidebar />

    <div className="md:ml-[200px]">
      {/* FULL-WIDTH SECTIONS (Keep existing) */}
      {/* Avatar/User Info */}
      {/* Status Bar */}

      {/* TWO-COLUMN LAYOUT */}
      <div className="flex justify-center">
        <div className="flex max-w-[1100px] w-full">

          {/* MAIN CONTENT COLUMN */}
          <div className="flex-1 min-w-0 p-8 space-y-6 pb-32">

            {/* 1. Avatar/Greeting Section (existing) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Keep existing avatar section but UPDATE greeting */}
              {/* Change "Hey Champion" to "Hey {userName}" */}
              {/* Remove any emoji background decorations */}
            </div>

            {/* 2. Statistics Grid (existing) */}
            <StatisticsGrid />

            {/* 3. Continue Learning (NEW) */}
            <ContinueLearning
              lesson={currentLesson}
              onStartLesson={() => setLocation(`/lessons/${currentLesson?.id}`)}
            />

            {/* 4. Quick Log (existing - keep as is) */}
            <QuickLog />

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">

            {/* 1. Oni Mascot Card (NEW - TOP) */}
            <OniMascotCard userName={dailySummary?.user?.display_name} />

            {/* 2. Daily XP Goal (existing) */}
            <DailyXPGoal />

            {/* 3. Today's Journey (existing) */}
            <TodaysJourney
              milestones={dailySummary?.milestones}
              onTaskComplete={handleXpBurst}
              compact={true}
            />

            {/* 4. Today's Activity (NEW) */}
            <TodaysActivity recentLogs={dailySummary?.recent_logs} />

            {/* 5. Badges & Rewards (existing) */}
            <BadgesShelf
              earnedBadges={badgeData?.earned || dailySummary?.badges?.earned}
              lockedBadges={badgeData?.locked || dailySummary?.badges?.locked}
              compact={true}
            />

            {/* 6. Ad Placeholder (existing) */}
            <AdPlaceholder />

          </div>

        </div>
      </div>
    </div>

    <BottomNavigation />
  </div>
);
```

---

### STEP 7: Update Avatar/Greeting Section

**IMPORTANT CHANGES:**
1. Change "Hey Champion" to "Hey {userName}" (use user's actual name)
2. Remove any text gradients from the greeting
3. Remove any emoji/decorative background elements
4. Keep avatar STATIC (no animation)

```tsx
{/* Avatar Header - Clean version */}
<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
  <div className="flex items-center gap-6">
    {/* Avatar - STATIC, no animation */}
    <div className="w-[100px] h-[100px] bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg flex-shrink-0">
      <CharacterAvatar size="lg" />
    </div>

    {/* Info */}
    <div className="flex-1">
      {/* Greeting - plain text, no gradient */}
      <h1 className="text-2xl font-extrabold text-gray-800">
        Hey <span className="text-orange-500">{user?.display_name || 'Alex'}</span>! 🌟
      </h1>
      <p className="text-gray-500 mt-1">
        Ready to fuel your body and get moving?
      </p>
      <span className="inline-block bg-orange-50 text-orange-500 px-4 py-1.5 rounded-full text-sm font-bold mt-2">
        🍊 Health Hero 🏃
      </span>
    </div>
  </div>
</div>
```

---

### STEP 8: Remove Oni from Left Sidebar

**If Oni is currently in the left sidebar (`Sidebar.tsx`)**, remove it.

**File:** `client/src/components/Sidebar.tsx`

```tsx
// REMOVE any Oni mascot section from the sidebar
// Oni should ONLY appear in the right column now

// DELETE or comment out code like:
// <div className="sidebar-oni">
//   <img src={oniImage} ... />
// </div>
```

---

## TESTING CHECKLIST

After implementation, verify:

### Layout
- [ ] Oni appears at TOP of right column
- [ ] Continue Learning section appears in main content after stats
- [ ] Today's Activity section appears in right column
- [ ] All sections render correctly on desktop (1200px+)
- [ ] Right sidebar hides on tablet/mobile (`hidden lg:block`)
- [ ] Mobile view shows single column with bottom navigation

### Functionality
- [ ] "START LESSON" button navigates to correct lesson
- [ ] "Log a Meal" button navigates to `/food-log`
- [ ] "Log Activity" button navigates to `/activity-log`
- [ ] Today's Journey tasks still work (mark complete, earn XP)
- [ ] XP progress bar updates correctly
- [ ] Badges display correctly
- [ ] All existing dashboard functionality still works

### Visual
- [ ] Avatar is STATIC (no bounce/float animation)
- [ ] Greeting shows user's actual name
- [ ] No emoji background decorations on greeting
- [ ] Orange + Blue color scheme is consistent
- [ ] Cards have proper shadows and rounded corners

### Data
- [ ] User data loads correctly
- [ ] Recent activity logs display (if any)
- [ ] Current lesson data displays in Continue Learning
- [ ] XP values are correct

---

## MASCOT REFERENCE

### Oni the Orange - Main Mascot
- **Asset Path:** `@assets/Mascots/Oni_the_Orange.png` or `/public/mascots/Oni_the_Orange.png`
- **DO NOT** use `Oni_celebrate.png`, `Oni_groove.png`, etc. for the dashboard card
- **Display:** Static image, no animation
- **Placement:** TOP of right sidebar column

### Other Mascot Poses (for reference - NOT used in this update)
| File | Use Case |
|------|----------|
| `Oni_the_Orange.png` | Default pose (USE THIS) |
| `Oni_celebrate.png` | Success states |
| `Oni_hint.png` | Giving tips |
| `Oni_proud.png` | Completing lessons |

---

## RESPONSIVE BREAKPOINTS

- `lg:` (1024px+) - Show right sidebar
- `md:` (768px+) - Show left sidebar, offset main content
- Below 768px - Mobile layout with bottom navigation

---

## DO NOT CHANGE

- API calls or data fetching logic
- Authentication logic
- BottomNavigation component functionality
- Sidebar navigation items
- Any backend/server code
- Database schema

---

## SUMMARY OF CHANGES

| Section | Change |
|---------|--------|
| Oni Mascot | MOVE from sidebar to TOP of right column |
| Continue Learning | ADD new section in main content |
| Today's Activity | ADD new section in right column |
| Avatar Greeting | UPDATE to show user name, remove gradients |
| Journey Tasks | UPDATE task names to match wireframe |
| Quick Log | KEEP as is (no water button - already removed) |
| Color Scheme | ADD blue shades alongside orange |

---

## FILE STRUCTURE AFTER CHANGES

```
client/src/
├── components/
│   ├── dashboard/
│   │   ├── OniMascotCard.tsx (NEW)
│   │   ├── ContinueLearning.tsx (NEW)
│   │   └── TodaysActivity.tsx (NEW)
│   ├── Sidebar.tsx (MODIFY - remove Oni)
│   └── TodaysJourney.tsx (MODIFY - update task names)
├── pages/
│   └── DashboardRedesign.tsx (MODIFY - main layout)
```
