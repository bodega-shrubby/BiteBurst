# Bug Fix: Ordering Questions Show Same Text for All Items

## Problem
When displaying `ordering` type questions (sequence or sorting), all items show the same text (the first item's text) instead of their unique text values.

**Screenshot shows:** "Wake Up" displayed 3 times
**Database has:** "☀️ Wake Up", "🥣 Eat Breakfast", "🏫 Go to School"

## Database Content Structure (Verified Correct)
```json
{
  "isSequence": true,
  "items": [
    {"text": "☀️ Wake Up", "correctOrder": 1},
    {"text": "🥣 Eat Breakfast", "correctOrder": 2},
    {"text": "🏫 Go to School", "correctOrder": 3}
  ]
}
```

For bucket sorting (non-sequence):
```json
{
  "buckets": ["Pure Water 💧", "Sugar Bomb 💣"],
  "items": [
    {"text": "🚰 Tap Water", "correctBucket": "Pure Water 💧"},
    {"text": "🧃 Fruit Juice Carton", "correctBucket": "Sugar Bomb 💣"}
  ]
}
```

## Root Cause
The frontend component rendering ordering questions is likely:
1. Using the wrong variable in the map function (using index 0 for all items)
2. Not properly destructuring the item object
3. Using a stale reference instead of the current item in the loop

## Where to Look
Search for components handling:
- `question_type === 'ordering'`
- `questionType === 'ordering'`
- Files with names like: `OrderingQuestion.tsx`, `SortingQuestion.tsx`, `LessonStep.tsx`, `QuestionRenderer.tsx`

## Common Bug Pattern
```tsx
// ❌ WRONG - Using items[0] instead of item
{items.map((item, index) => (
  <DraggableItem key={index}>
    {items[0].text}  // BUG: Always shows first item
  </DraggableItem>
))}

// ✅ CORRECT - Using the current item from map
{items.map((item, index) => (
  <DraggableItem key={index}>
    {item.text}  // Shows each item's unique text
  </DraggableItem>
))}
```

## Fix Required
1. Find the ordering/sorting question component
2. Ensure the `.map()` callback uses the current `item` parameter, not `items[0]` or a fixed reference
3. Verify both sequence ordering (`isSequence: true`) AND bucket sorting work correctly
4. Test with questions that have 2, 3, or more items

## Test Cases After Fix
1. **L1-03-Q01** (Sequence): Should show "☀️ Wake Up", "🥣 Eat Breakfast", "🏫 Go to School"
2. **L1-03-Q04** (Sequence): Should show "🏋️ Exercise Hard", "🍗 Eat Good Food", "😴 Sleep to Repair"
3. **L1-01-Q06** (Buckets): Should show "🏃‍♀️ Jump Rope", "🧘 Sitting Quietly" in sortable buckets
4. **L2-01-Q05** (Buckets): Should show "🚰 Tap Water", "🧃 Fruit Juice Carton"

## Additional Check
Also verify the `matching` question type works correctly - it uses a similar `pairs` array:
```json
{
  "pairs": [
    {"left": "☀️ Hot Sun", "right": "💧 Cool Water"},
    {"left": "❄️ Cold Snow", "right": "☕ Warm Tea"}
  ]
}
```
