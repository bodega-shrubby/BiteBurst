# FIX: Mascots Not Alternating Sides

## The Bug

The mascot position uses `isEven` which is based on `renderIndex`. But since each lesson group has 4 items (3 levels + 1 treasure chest), **every Level 1 always lands on an even renderIndex**:

```
Group 1: L1 (index 0, EVEN), L2 (index 1), L3 (index 2), Treasure (index 3)
Group 2: L1 (index 4, EVEN), L2 (index 5), L3 (index 6), Treasure (index 7)
Group 3: L1 (index 8, EVEN), L2 (index 9), L3 (index 10), Treasure (index 11)
```

Result: ALL mascots appear on the RIGHT side because `isEven` is always `true` for Level 1.

## The Fix

Use `groupIndex` to alternate mascot position instead of `isEven`:
- `groupIndex % 2 === 0` (even groups): mascot on RIGHT
- `groupIndex % 2 === 1` (odd groups): mascot on LEFT

---

## File: `client/src/components/LessonJourney.tsx`

### Find these lines (around 227-235):

```typescript
{levelIndex === 0 && !isEven && (
  <div className={`w-20 h-20 transition-all flex-shrink-0 ${lesson.state === 'locked' ? 'grayscale opacity-50' : ''}`}>
    <img
      src={getMascotImage(group.mascotId)}
      alt={`${group.baseName} mascot`}
      className="w-full h-full object-contain drop-shadow-lg"
    />
  </div>
)}
```

### Replace with (use groupIndex instead of isEven):

```typescript
{levelIndex === 0 && groupIndex % 2 === 1 && (
  <div className={`w-20 h-20 transition-all flex-shrink-0 ${lesson.state === 'locked' ? 'grayscale opacity-50' : ''}`}>
    <img
      src={getMascotImage(group.mascotId)}
      alt={`${group.baseName} mascot`}
      className="w-full h-full object-contain drop-shadow-lg"
    />
  </div>
)}
```

---

### Find these lines (around 263-271):

```typescript
{levelIndex === 0 && isEven && (
  <div className={`w-20 h-20 transition-all flex-shrink-0 ${lesson.state === 'locked' ? 'grayscale opacity-50' : ''}`}>
    <img
      src={getMascotImage(group.mascotId)}
      alt={`${group.baseName} mascot`}
      className="w-full h-full object-contain drop-shadow-lg"
    />
  </div>
)}
```

### Replace with (use groupIndex instead of isEven):

```typescript
{levelIndex === 0 && groupIndex % 2 === 0 && (
  <div className={`w-20 h-20 transition-all flex-shrink-0 ${lesson.state === 'locked' ? 'grayscale opacity-50' : ''}`}>
    <img
      src={getMascotImage(group.mascotId)}
      alt={`${group.baseName} mascot`}
      className="w-full h-full object-contain drop-shadow-lg"
    />
  </div>
)}
```

---

## Summary of Changes

| Line | Old Code | New Code |
|------|----------|----------|
| ~227 | `levelIndex === 0 && !isEven` | `levelIndex === 0 && groupIndex % 2 === 1` |
| ~263 | `levelIndex === 0 && isEven` | `levelIndex === 0 && groupIndex % 2 === 0` |

---

## Expected Result

```
Morning Energy Boost (groupIndex=0, EVEN) → Mascot on RIGHT
Power-Up Snacks (groupIndex=1, ODD) → Mascot on LEFT
Super Foods (groupIndex=2, EVEN) → Mascot on RIGHT
```
