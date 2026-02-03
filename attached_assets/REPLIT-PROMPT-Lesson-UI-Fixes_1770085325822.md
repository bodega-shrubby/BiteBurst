# Replit Agent Prompt: BiteBurst Lesson UI Fixes

## Context
The lesson UI has been partially implemented but is missing critical visual elements and polish compared to the wireframe specifications. This prompt provides specific fixes needed to match the Duolingo-inspired design.

**Reference wireframes:** Located in `/wireframes/` folder - open `index.html` to navigate all screens.

---

## TASK 1: Add Attempt Counter Component (Critical)

**File:** `client/src/pages/lessons/components/LessonIncorrect.tsx`

**Problem:** Users can't see which attempt they're on (1, 2, or 3).

**Solution:** Add visual attempt counter showing 3 dots.

```tsx
// Add this component inside LessonIncorrect.tsx
function AttemptIndicator({ current, max = 3 }: { current: number; max?: number }) {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <span className="text-sm text-gray-500">
        {current >= max ? 'Last chance!' : `Attempt ${current} of ${max}`}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < current ? 'bg-red-400' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

**Add to the component render, before the Try Again button:**
```tsx
<AttemptIndicator current={attemptNumber} max={3} />
```

---

## TASK 2: Display Wrong Answer with Strikethrough (Critical)

**File:** `client/src/pages/lessons/components/LessonIncorrect.tsx`

**Problem:** Users don't see what they selected when they get it wrong.

**Solution:**
1. Add `selectedAnswer` and `selectedAnswerText` props to component
2. Display the wrong answer with strikethrough styling

**Update interface:**
```tsx
interface LessonIncorrectProps {
  message: string;
  hint?: string;
  attemptNumber: number;
  onTryAgain: () => void;
  canTryAgain: boolean;
  selectedAnswer?: string;      // ADD THIS
  selectedAnswerText?: string;  // ADD THIS
  selectedAnswerEmoji?: string; // ADD THIS
}
```

**Add after the mascot, before the feedback banner:**
```tsx
{/* User's Wrong Answer Display */}
{selectedAnswerText && (
  <div className="p-4 rounded-2xl border-2 border-red-300 bg-red-50">
    <div className="flex items-center justify-center gap-3">
      <span className="text-red-500 text-xl">✗</span>
      {selectedAnswerEmoji && (
        <span className="text-2xl">{selectedAnswerEmoji}</span>
      )}
      <span className="text-lg font-medium text-gray-700 line-through">
        {selectedAnswerText}
      </span>
    </div>
  </div>
)}
```

**Update LessonPlayer.tsx** to pass these props when rendering LessonIncorrect.

---

## TASK 3: Fix Success Banner Color (Critical)

**File:** `client/src/pages/lessons/components/LessonSuccess.tsx`

**Problem:** Line 217 shows `bg-blue-500` but should be green.

**Fix:** Change line 217 from:
```tsx
<div className="bg-blue-500 text-white p-4 rounded-xl text-center">
```
To:
```tsx
<div className="bg-green-500 text-white p-4 rounded-xl text-center">
```

---

## TASK 4: Create LessonComplete Component (Critical)

**File:** Create new `client/src/pages/lessons/components/LessonComplete.tsx`

**Problem:** Current complete screen is basic, missing stats, achievements, confetti.

**Solution:** Create dedicated component:

```tsx
import { Button } from '@/components/ui/button';
import oniProudImage from '@assets/Mascots/Oni_proud.png';

interface LessonCompleteProps {
  lessonTitle: string;
  totalXp: number;
  correctAnswers: number;
  totalQuestions: number;
  streakDays?: number;
  achievement?: {
    title: string;
    description: string;
  };
  onContinue: () => void;
  onBackToDashboard: () => void;
}

export default function LessonComplete({
  lessonTitle,
  totalXp,
  correctAnswers,
  totalQuestions,
  streakDays,
  achievement,
  onContinue,
  onBackToDashboard
}: LessonCompleteProps) {
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-yellow-50 to-white relative overflow-hidden">
      {/* Confetti Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-4 left-8 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🎊</span>
        <span className="absolute top-4 right-8 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</span>
        <span className="absolute top-12 left-1/4 text-xl animate-bounce" style={{ animationDelay: '0.4s' }}>⭐</span>
        <span className="absolute top-12 right-1/4 text-xl animate-bounce" style={{ animationDelay: '0.6s' }}>✨</span>
        <span className="absolute top-20 left-12 text-lg animate-bounce" style={{ animationDelay: '0.3s' }}>🌟</span>
        <span className="absolute top-20 right-12 text-lg animate-bounce" style={{ animationDelay: '0.5s' }}>🎊</span>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 relative z-10">
        {/* Celebrating Mascot */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <img
              src={oniProudImage}
              alt="Oni Celebrating"
              className="w-32 h-32 object-contain mascot-celebrate"
            />
            <span className="absolute -top-2 -right-2 text-3xl">🎉</span>
            <span className="absolute -bottom-1 -left-2 text-2xl">⭐</span>
          </div>
        </div>

        {/* Completion Message */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Lesson Complete!</h1>
          <p className="text-orange-600 font-medium">Amazing work, you're a star! ⭐</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-orange-100 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500">{totalXp}</div>
              <div className="text-xs text-gray-500">Total XP</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">{correctAnswers}/{totalQuestions}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-500">{accuracy}%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
          </div>
        </div>

        {/* Achievement Unlocked (Optional) */}
        {achievement && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="text-xs opacity-80">Achievement Unlocked!</p>
                <p className="font-bold">{achievement.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Streak Bonus */}
        {streakDays && streakDays > 1 && (
          <div className="flex items-center justify-center gap-3 bg-orange-50 rounded-xl p-3 mb-6">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-bold text-orange-600">{streakDays} Day Streak!</p>
              <p className="text-xs text-orange-500">+5 bonus XP</p>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onContinue}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg uppercase tracking-wide shadow-lg hover:from-orange-600 hover:to-orange-700"
          >
            Continue Learning
          </Button>
          <Button
            onClick={onBackToDashboard}
            variant="ghost"
            className="w-full py-3 rounded-2xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**Update LessonPlayer.tsx** to use this component instead of inline complete screen.

---

## TASK 5: Enhance True/False Button Layout (Important)

**File:** `client/src/pages/lessons/components/LessonAsking.tsx`

**Problem:** True/False uses same layout as multiple choice, should be large side-by-side buttons.

**Replace the `renderTrueFalse` function:**

```tsx
const renderTrueFalse = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* TRUE Button */}
      <button
        onClick={() => onAnswerSelect('true')}
        disabled={isSubmitting}
        className={`
          p-6 rounded-3xl border-4 transition-all duration-200
          flex flex-col items-center justify-center gap-2 min-h-[140px]
          ${selectedAnswer === 'true'
            ? 'border-green-500 bg-green-50 shadow-lg scale-105'
            : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-25'
          }
          ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
        `}
        data-testid="option-true"
      >
        <span className="text-5xl">✓</span>
        <span className="text-xl font-bold text-gray-900">TRUE</span>
      </button>

      {/* FALSE Button */}
      <button
        onClick={() => onAnswerSelect('false')}
        disabled={isSubmitting}
        className={`
          p-6 rounded-3xl border-4 transition-all duration-200
          flex flex-col items-center justify-center gap-2 min-h-[140px]
          ${selectedAnswer === 'false'
            ? 'border-red-500 bg-red-50 shadow-lg scale-105'
            : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-25'
          }
          ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
        `}
        data-testid="option-false"
      >
        <span className="text-5xl">✗</span>
        <span className="text-xl font-bold text-gray-900">FALSE</span>
      </button>
    </div>
  );
};
```

---

## TASK 6: Add Confetti to Success Screen (Important)

**File:** `client/src/pages/lessons/components/LessonSuccess.tsx`

**Problem:** No confetti animation despite CSS existing.

**Add at the top of the component return, inside the outer div:**

```tsx
{/* Confetti Overlay */}
<div className="absolute inset-0 pointer-events-none overflow-hidden">
  <span className="absolute top-0 left-1/4 text-2xl animate-ping" style={{ animationDuration: '1.5s' }}>🎊</span>
  <span className="absolute top-2 right-1/4 text-xl animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}>✨</span>
  <span className="absolute top-4 left-1/3 text-lg animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }}>⭐</span>
  <span className="absolute top-6 right-1/3 text-2xl animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.9s' }}>🎉</span>
</div>
```

**Also add `relative overflow-hidden` to the outer container div.**

---

## TASK 7: Enhance LessonLearn with Correct Answer (Important)

**File:** `client/src/pages/lessons/components/LessonLearn.tsx`

**Problem:** Doesn't show the correct answer, just educational text.

**Update interface:**
```tsx
interface LessonLearnProps {
  title?: string;
  body: string | string[];
  actionLabel?: string;
  onContinue: () => void;
  xpEarned?: number;
  message?: string;
  correctAnswer?: string;       // ADD
  correctAnswerEmoji?: string;  // ADD
  funFact?: string;             // ADD
}
```

**Add after the mascot, before the learn card:**
```tsx
{/* Correct Answer Reveal */}
{correctAnswer && (
  <div className="flex items-center gap-3 p-4 bg-green-100 rounded-xl border border-green-300 mb-4">
    <span className="text-green-500 text-xl">✓</span>
    {correctAnswerEmoji && <span className="text-2xl">{correctAnswerEmoji}</span>}
    <div>
      <span className="font-medium text-gray-900">{correctAnswer}</span>
      <p className="text-xs text-green-600">This is the correct answer!</p>
    </div>
  </div>
)}
```

**Add after the educational content, before the encouraging message:**
```tsx
{/* Fun Fact Callout */}
{funFact && (
  <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-xl border border-yellow-200 mt-4">
    <span className="text-lg">⭐</span>
    <div>
      <p className="text-xs font-semibold text-yellow-800">Fun Fact!</p>
      <p className="text-xs text-yellow-700">{funFact}</p>
    </div>
  </div>
)}
```

---

## TASK 8: Add Shake Animation on Wrong Answer (Important)

**File:** `client/src/pages/lessons/components/LessonIncorrect.tsx`

**Problem:** Mascot should shake when wrong answer is shown.

**Add state for animation:**
```tsx
const [shouldShake, setShouldShake] = useState(true);

useEffect(() => {
  // Reset shake on new attempt
  setShouldShake(true);
  const timer = setTimeout(() => setShouldShake(false), 500);
  return () => clearTimeout(timer);
}, [attemptNumber]);
```

**Update mascot img className:**
```tsx
<img
  src={mascotImage}
  alt={isHintMode ? "Oni giving hint" : "Oni encouraging"}
  className={`w-24 h-24 object-contain ${mascotClass} ${shouldShake && !isHintMode ? 'animate-shake' : ''}`}
/>
```

**Add to tokens.css if not present:**
```css
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
.animate-shake { animation: shake 0.5s ease-in-out; }
```

---

## TASK 9: Enhance Multiple Choice Option Styling (Medium)

**File:** `client/src/pages/lessons/components/LessonAsking.tsx`

**Problem:** Options look basic, need larger touch targets and better selection state.

**In `renderMultipleChoice`, update the button className:**

```tsx
className={`
  w-full p-5 rounded-3xl border-3 text-left transition-all duration-200
  ${selectedAnswer === option.id
    ? 'border-orange-500 bg-orange-50 shadow-lg transform scale-[1.02]'
    : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md hover:bg-orange-25'
  }
  ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
`}
```

**Also increase emoji size:**
```tsx
{option.emoji && (
  <span className="text-3xl" role="img" aria-hidden="true">
    {option.emoji}
  </span>
)}
```

---

## TASK 10: Add Progress Bar Gradient (Minor)

**File:** `client/src/pages/lessons/components/ProgressBar.tsx`

**Problem:** Solid color instead of gradient.

**Change the progress fill background from solid to gradient:**
```tsx
className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
```

---

## TASK 11: Export LessonComplete from Index (Required)

**File:** `client/src/pages/lessons/components/index.ts`

**Add export:**
```tsx
export { default as LessonComplete } from './LessonComplete';
```

---

## TASK 12: Update LessonPlayer to Pass New Props (Required)

**File:** `client/src/pages/lessons/LessonPlayer.tsx`

**Track correct answer count:**
```tsx
const [correctAnswerCount, setCorrectAnswerCount] = useState(0);

// In submitAnswerMutation onSuccess when response.correct:
setCorrectAnswerCount(prev => prev + 1);
```

**Pass selectedAnswer info to LessonIncorrect:**
```tsx
{lessonState === 'incorrect' && currentStep && (
  <LessonIncorrect
    message={tryAgainMessage || "Not quite right. Try again!"}
    hint={getStepFeedbackMessage(currentStep, 'hint_after_2')}
    attemptNumber={currentAttempt}
    onTryAgain={handleTryAgain}
    canTryAgain={true}
    selectedAnswer={selectedAnswer}
    selectedAnswerText={getSelectedAnswerText(currentStep, selectedAnswer)}
    selectedAnswerEmoji={getSelectedAnswerEmoji(currentStep, selectedAnswer)}
  />
)}
```

**Add helper functions:**
```tsx
const getSelectedAnswerText = (step: LessonStep, answerId: string | null): string | undefined => {
  if (!answerId || !step.content.options) return undefined;
  const option = step.content.options.find(opt =>
    typeof opt === 'string' ? opt === answerId : opt.id === answerId
  );
  if (!option) return answerId;
  return typeof option === 'string' ? option : option.text;
};

const getSelectedAnswerEmoji = (step: LessonStep, answerId: string | null): string | undefined => {
  if (!answerId || !step.content.options) return undefined;
  const option = step.content.options.find(opt =>
    typeof opt === 'object' && opt.id === answerId
  );
  return option && typeof option === 'object' ? option.emoji : undefined;
};
```

**Use LessonComplete component for complete state:**
```tsx
import { LessonComplete } from './components';

// Replace the inline complete screen with:
if (lessonState === 'complete') {
  return (
    <LessonComplete
      lessonTitle={lessonData.title}
      totalXp={totalXpEarned}
      correctAnswers={correctAnswerCount}
      totalQuestions={lessonData.totalSteps}
      streakDays={7} // TODO: Get from user data
      onContinue={handleClose}
      onBackToDashboard={handleClose}
    />
  );
}
```

---

## Testing Checklist

After implementing all tasks, verify:

- [ ] Attempt counter shows 1/2/3 dots on incorrect screen
- [ ] Wrong answer displays with strikethrough on incorrect screen
- [ ] Success banner is green, not blue
- [ ] Lesson complete shows stats grid (XP, correct count, accuracy)
- [ ] Confetti emojis animate on success and complete screens
- [ ] True/False shows large side-by-side buttons
- [ ] Multiple choice options have enhanced styling with shadows
- [ ] Progress bar has yellow-to-orange gradient
- [ ] Mascot shakes on wrong answer (first attempt)
- [ ] LessonLearn shows correct answer at top

---

## File Summary

| File | Action | Priority |
|------|--------|----------|
| `LessonIncorrect.tsx` | Major update | Critical |
| `LessonSuccess.tsx` | Minor fixes | Critical |
| `LessonComplete.tsx` | Create new | Critical |
| `LessonAsking.tsx` | Medium update | Important |
| `LessonLearn.tsx` | Medium update | Important |
| `LessonPlayer.tsx` | Update props & state | Required |
| `components/index.ts` | Add export | Required |
| `ProgressBar.tsx` | Minor fix | Minor |
| `tokens.css` | Add shake animation | Minor |
