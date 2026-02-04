# Replit Agent Prompt: Redesign Lessons Page with Winding Path Journey

## Overview
Redesign the Lessons page (`client/src/pages/Lessons.tsx`) to use a **Duolingo-style winding path journey** layout instead of the current large card-based design. The lessons should display as small circular nodes in a snake/winding pattern.

---

## CRITICAL BUG FIX FIRST

Before implementing the redesign, fix the lesson ordering bug in `server/routes/lessons.ts`:

**Current problematic code:**
```typescript
allLessons.sort((a, b) => a.sortOrder - b.sortOrder);
```

**Fix - replace with:**
```typescript
// Sort by topic order first, then by lesson order within topic
allLessons.sort((a, b) => {
  if (a.topicOrder !== b.topicOrder) {
    return a.topicOrder - b.topicOrder;
  }
  return a.sortOrder - b.sortOrder;
});
```

**Also update the lesson object creation in the same file to include topicOrder:**
```typescript
allLessons.push({
  id: lesson.id,
  title: lesson.title,
  icon: lesson.iconEmoji || '📚',
  topicId: topic.id,
  topicTitle: topic.title,
  topicOrder: topic.orderPosition ?? 0,  // ADD THIS LINE
  sortOrder: lesson.orderInUnit ?? 0,
  description: lesson.description
});
```

---

## Design Specifications

### Layout Structure
1. **Background**: Gradient from `green-50` to `blue-50` (top to bottom)
2. **Container**: Max width `md` (448px), centered, with padding `p-6`
3. **Path**: SVG winding path connecting all lesson nodes

### Winding Path SVG
- Dashed line path with gradient stroke (green → orange → gray)
- Path follows an S-curve/snake pattern
- strokeWidth: 6
- strokeDasharray: "12 8"
- strokeLinecap: "round"

**SVG Path Definition:**
```jsx
<svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
  <defs>
    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#22c55e" />
      <stop offset="50%" stopColor="#f97316" />
      <stop offset="100%" stopColor="#d1d5db" />
    </linearGradient>
  </defs>
  <path
    d="M 200 60 Q 320 100 200 180 Q 80 260 200 340 Q 320 420 200 500 Q 80 580 200 660"
    stroke="url(#pathGradient)"
    strokeWidth="6"
    fill="none"
    strokeLinecap="round"
    strokeDasharray="12 8"
  />
</svg>
```

### Lesson Nodes

**Node Layout Pattern:**
- Nodes alternate left and right in a winding pattern
- Even indexes (0, 2, 4): `justify-start pl-8`
- Odd indexes (1, 3, 5): `justify-end pr-8`
- Vertical spacing: `mb-12` between each node row

**Node Styling by State:**

| State | Background | Border | Text | Extra |
|-------|-----------|--------|------|-------|
| completed | `bg-green-500` | `border-green-600` | `text-white` | `shadow-lg` |
| current | `bg-orange-500` | `border-orange-600` | `text-white` | `shadow-lg animate-pulse ring-4 ring-orange-200` |
| unlocked | `bg-blue-100` | `border-blue-300` | `text-blue-700` | - |
| locked | `bg-gray-200` | `border-gray-300` | `text-gray-400` | - |

**Node Structure:**
```jsx
<div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl cursor-pointer transition-transform hover:scale-110 ${getNodeStyle(lesson.state)}`}>
  {lesson.state === 'completed' ? '✓' : lesson.state === 'locked' ? '🔒' : lesson.icon}
</div>
```

### Label Cards (next to each node)
- Background: `bg-white`
- Border radius: `rounded-xl`
- Padding: `px-4 py-2`
- Shadow: `shadow-lg`
- Max width: `max-w-[160px]`
- Border: varies by state
  - locked: `opacity-50 border-gray-200`
  - current: `border-orange-300`
  - default: `border-gray-100`

**Label Content:**
```jsx
<div className={`bg-white rounded-xl px-4 py-2 shadow-lg max-w-[160px] border ${getBorderStyle(lesson.state)}`}>
  <p className="font-bold text-sm text-gray-800">{lesson.title}</p>
  <div className="flex items-center gap-2 mt-1">
    <span className="text-xs text-green-600 font-medium">+{lesson.xp} XP</span>
    {lesson.state === 'current' && (
      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">START</span>
    )}
  </div>
</div>
```

### Row Structure
Each lesson row should flex items center with the node and label:
```jsx
<div className={`flex items-center mb-12 ${isEven ? 'justify-start pl-8' : 'justify-end pr-8'}`}>
  <div className={`flex items-center gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
    {/* Node */}
    {/* Label */}
  </div>
</div>
```

---

## Complete Component Implementation

Create or update `client/src/pages/Lessons.tsx` with this structure:

```tsx
// Keep existing imports and data fetching logic

export default function Lessons() {
  // Keep existing hooks and data fetching...

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

  return (
    <div className="p-6 bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
      <div className="max-w-md mx-auto relative">
        {/* Winding Path SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path
            d="M 200 60 Q 320 100 200 180 Q 80 260 200 340 Q 320 420 200 500 Q 80 580 200 660"
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
            return (
              <div
                key={lesson.id}
                className={`flex items-center mb-12 ${isEven ? 'justify-start pl-8' : 'justify-end pr-8'}`}
              >
                <div className={`flex items-center gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Circular Node */}
                  <div
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl cursor-pointer transition-transform hover:scale-110 ${getNodeStyle(lesson.state)}`}
                    onClick={() => lesson.state !== 'locked' && handleLessonStart(lesson.id)}
                  >
                    {lesson.state === 'completed' ? '✓' : lesson.state === 'locked' ? '🔒' : lesson.icon}
                  </div>

                  {/* Label Card */}
                  <div className={`bg-white rounded-xl px-4 py-2 shadow-lg max-w-[160px] border ${getBorderStyle(lesson.state)}`}>
                    <p className="font-bold text-sm text-gray-800">{lesson.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-green-600 font-medium">+{lesson.xp} XP</span>
                      {lesson.state === 'current' && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">START</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

## Animations (add to global CSS or Tailwind config)

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

---

## Checkpoint Rewards (Optional Enhancement)

After every 3 lessons, add a checkpoint reward component:

```jsx
{index > 0 && index % 3 === 0 && (
  <div className="flex justify-center my-8">
    <div className="bg-yellow-100 border-2 border-yellow-300 rounded-2xl px-6 py-4 flex items-center gap-4">
      <div className="w-12 h-12 bg-yellow-200 rounded-xl flex items-center justify-center text-2xl">
        🎁
      </div>
      <div>
        <p className="font-bold text-yellow-800">Checkpoint Reward</p>
        <p className="text-xs text-yellow-600">+50 XP</p>
      </div>
    </div>
  </div>
)}
```

---

## Key Requirements Summary

1. ✅ Fix lesson ordering bug (sort by topic order first, then lesson order)
2. ✅ Replace large cards with small circular nodes (64x64px / w-16 h-16)
3. ✅ Implement winding/snake path layout (alternating left/right)
4. ✅ Add SVG dashed path with gradient
5. ✅ State-based styling (completed=green, current=orange+pulse, unlocked=blue, locked=gray)
6. ✅ Compact label cards next to nodes
7. ✅ Responsive and mobile-friendly
8. ✅ Keep existing data fetching and navigation logic

---

## Files to Modify

1. `server/routes/lessons.ts` - Fix ordering bug
2. `client/src/pages/Lessons.tsx` - Implement new winding path design
3. `client/src/index.css` (optional) - Add pulse animation if not in Tailwind

---

## Testing Checklist

- [ ] Lessons display in correct order (Topic 1 lessons, then Topic 2 lessons)
- [ ] Completed lessons show green with checkmark
- [ ] Current lesson shows orange with pulse animation and START badge
- [ ] Locked lessons show gray with lock icon
- [ ] Nodes alternate left/right in winding pattern
- [ ] SVG path is visible behind nodes
- [ ] Clicking unlocked/current lessons navigates to lesson
- [ ] Mobile responsive (path scales appropriately)
