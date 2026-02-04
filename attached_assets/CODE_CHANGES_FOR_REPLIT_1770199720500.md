# Exact Code Changes for Replit

Copy and paste these exact changes into Replit.

---

## CHANGE 1: Fix Lesson Ordering Bug

**File:** `server/routes/lessons.ts`

**Find this code block** (around line 80-100 in the GET /api/curriculum/:curriculumId/lessons endpoint):

```typescript
const allLessons: any[] = [];
for (const topic of curriculumTopics) {
  const topicLessons = await storage.getLessonsByTopic(topic.id);
  for (const lesson of topicLessons) {
    allLessons.push({
      id: lesson.id,
      title: lesson.title,
      icon: lesson.iconEmoji || '📚',
      topicId: topic.id,
      topicTitle: topic.title,
      sortOrder: lesson.orderInUnit ?? 0,
      description: lesson.description
    });
  }
}

allLessons.sort((a, b) => a.sortOrder - b.sortOrder);
```

**Replace with:**

```typescript
const allLessons: any[] = [];
for (const topic of curriculumTopics) {
  const topicLessons = await storage.getLessonsByTopic(topic.id);
  for (const lesson of topicLessons) {
    allLessons.push({
      id: lesson.id,
      title: lesson.title,
      icon: lesson.iconEmoji || '📚',
      topicId: topic.id,
      topicTitle: topic.title,
      topicOrder: topic.orderPosition ?? 0,
      sortOrder: lesson.orderInUnit ?? 0,
      description: lesson.description
    });
  }
}

// Sort by topic order first, then by lesson order within topic
allLessons.sort((a, b) => {
  if (a.topicOrder !== b.topicOrder) {
    return a.topicOrder - b.topicOrder;
  }
  return a.sortOrder - b.sortOrder;
});
```

---

## CHANGE 2: Create New Winding Path Component

**File:** `client/src/components/LessonJourney.tsx` (CREATE NEW FILE)

```tsx
import { useLocation } from 'wouter';

interface Lesson {
  id: string;
  title: string;
  icon: string;
  state: 'completed' | 'current' | 'unlocked' | 'locked';
  xp: number;
  topicId?: string;
  topicTitle?: string;
}

interface LessonJourneyProps {
  lessons: Lesson[];
  onLessonClick: (lessonId: string) => void;
}

export default function LessonJourney({ lessons, onLessonClick }: LessonJourneyProps) {

  const getNodeStyle = (state: string) => {
    switch (state) {
      case 'completed':
        return 'bg-green-500 border-green-600 text-white shadow-lg';
      case 'current':
        return 'bg-orange-500 border-orange-600 text-white shadow-lg animate-pulse ring-4 ring-orange-200';
      case 'unlocked':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      default:
        return 'bg-gray-200 border-gray-300 text-gray-400';
    }
  };

  const getBorderStyle = (state: string) => {
    if (state === 'locked') return 'opacity-50 border-gray-200';
    if (state === 'current') return 'border-orange-300';
    return 'border-gray-100';
  };

  const getNodeContent = (lesson: Lesson) => {
    if (lesson.state === 'completed') return '✓';
    if (lesson.state === 'locked') return '🔒';
    return lesson.icon;
  };

  // Calculate path height based on number of lessons
  const pathHeight = lessons.length * 100 + 60;

  // Generate SVG path that winds through all lessons
  const generatePath = () => {
    const points: string[] = [];
    lessons.forEach((_, index) => {
      const y = 60 + index * 100;
      const x = index % 2 === 0 ? 80 : 220;
      const prevX = index % 2 === 0 ? 220 : 80;

      if (index === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        const prevY = 60 + (index - 1) * 100;
        const midY = (prevY + y) / 2;
        points.push(`Q ${prevX} ${midY} ${x} ${y}`);
      }
    });
    return points.join(' ');
  };

  return (
    <div className="p-6 bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
      <div className="max-w-md mx-auto relative">
        {/* Winding Path SVG */}
        <svg
          className="absolute inset-0 w-full pointer-events-none"
          style={{ zIndex: 0, height: pathHeight }}
          viewBox={`0 0 300 ${pathHeight}`}
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path
            d={generatePath()}
            stroke="url(#pathGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="12 8"
          />
        </svg>

        {/* Lesson Nodes */}
        <div className="relative" style={{ zIndex: 1 }}>
          {lessons.map((lesson, index) => {
            const isEven = index % 2 === 0;
            const isClickable = lesson.state === 'current' || lesson.state === 'unlocked' || lesson.state === 'completed';

            return (
              <div key={lesson.id}>
                <div
                  className={`flex items-center mb-12 ${isEven ? 'justify-start pl-4' : 'justify-end pr-4'}`}
                >
                  <div className={`flex items-center gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Circular Node */}
                    <div
                      className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl transition-transform ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${getNodeStyle(lesson.state)}`}
                      onClick={() => isClickable && onLessonClick(lesson.id)}
                    >
                      {getNodeContent(lesson)}
                    </div>

                    {/* Label Card */}
                    <div className={`bg-white rounded-xl px-4 py-2 shadow-lg max-w-[160px] border ${getBorderStyle(lesson.state)}`}>
                      <p className="font-bold text-sm text-gray-800">{lesson.title}</p>
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
                  </div>
                </div>

                {/* Checkpoint Reward after every 3 lessons */}
                {(index + 1) % 3 === 0 && index < lessons.length - 1 && (
                  <div className="flex justify-center mb-12">
                    <div className="bg-yellow-100 border-2 border-yellow-300 rounded-2xl px-5 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-200 rounded-xl flex items-center justify-center text-xl">
                        🎁
                      </div>
                      <div>
                        <p className="font-bold text-yellow-800 text-sm">Checkpoint!</p>
                        <p className="text-xs text-yellow-600">+50 XP</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Finish Line */}
        <div className="flex justify-center mt-4 mb-8">
          <div className="text-center">
            <span className="text-4xl">🏆</span>
            <p className="text-sm font-bold text-gray-600 mt-1">Complete All!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## CHANGE 3: Update Lessons.tsx to Use New Component

**File:** `client/src/pages/Lessons.tsx`

**Add this import at the top of the file:**

```tsx
import LessonJourney from '../components/LessonJourney';
```

**Find the main return statement and replace the lesson cards section with:**

```tsx
// Inside your Lessons component, replace the lesson cards rendering with:

// Map API lessons to the format LessonJourney expects
const journeyLessons = (lessonsWithState || []).map(lesson => ({
  id: lesson.id,
  title: lesson.title,
  icon: lesson.icon || '📚',
  state: lesson.state as 'completed' | 'current' | 'unlocked' | 'locked',
  xp: 15, // or lesson.xp if available
  topicId: lesson.topicId,
  topicTitle: lesson.topicTitle
}));

// Then in the JSX return:
<LessonJourney
  lessons={journeyLessons}
  onLessonClick={(lessonId) => {
    // Navigate to lesson
    window.location.href = `/lesson/${lessonId}`;
    // Or use your router: setLocation(`/lesson/${lessonId}`);
  }}
/>
```

---

## CHANGE 4: Add Animation to Tailwind Config (if needed)

**File:** `tailwind.config.ts`

**Add or ensure this animation exists:**

```typescript
// In the theme.extend section:
extend: {
  animation: {
    'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  keyframes: {
    pulse: {
      '0%, 100%': { opacity: '1' },
      '50%': { opacity: '.7' },
    }
  }
}
```

---

## Quick Test

After making these changes:

1. The lessons should now display in correct order (Topic 1 first, then Topic 2)
2. The UI should show a winding path with circular nodes
3. Completed lessons = green with checkmark
4. Current lesson = orange with pulse animation + START badge
5. Locked lessons = gray with lock icon

---

## Alternative: Full Page Replacement

If you want to completely replace Lessons.tsx, here's a minimal working version:

**File:** `client/src/pages/Lessons.tsx` (FULL REPLACEMENT)

```tsx
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'wouter';
import LessonJourney from '../components/LessonJourney';

interface ApiLesson {
  id: string;
  title: string;
  icon: string;
  topicId: string;
  topicTitle: string;
  sortOrder: number;
  topicOrder: number;
  description: string;
  state: 'completed' | 'current' | 'unlocked' | 'locked';
}

export default function Lessons() {
  const { user, activeChild } = useAuth();
  const [, setLocation] = useLocation();
  const curriculumId = 'uk-ks1'; // Or get from user/child profile

  const { data: lessons, isLoading } = useQuery<ApiLesson[]>({
    queryKey: [`/api/curriculum/${curriculumId}/lessons`, user?.id, activeChild?.childId],
    queryFn: async () => {
      const params = new URLSearchParams({ userId: user?.id || '' });
      if (activeChild?.childId) {
        params.append('childId', activeChild.childId);
      }
      const response = await fetch(`/api/curriculum/${curriculumId}/lessons?${params.toString()}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch lessons');
      return response.json();
    },
    enabled: !!user,
  });

  const handleLessonClick = (lessonId: string) => {
    setLocation(`/lesson/${lessonId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  const journeyLessons = (lessons || []).map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    icon: lesson.icon || '📚',
    state: lesson.state,
    xp: 15,
    topicId: lesson.topicId,
    topicTitle: lesson.topicTitle
  }));

  return (
    <LessonJourney
      lessons={journeyLessons}
      onLessonClick={handleLessonClick}
    />
  );
}
```

---

## Summary of Changes

| File | Action |
|------|--------|
| `server/routes/lessons.ts` | Fix sorting bug - add topicOrder |
| `client/src/components/LessonJourney.tsx` | Create new winding path component |
| `client/src/pages/Lessons.tsx` | Import and use LessonJourney |
| `tailwind.config.ts` | Ensure pulse animation exists |
