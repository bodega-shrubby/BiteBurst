# Replit Agent Prompt: BiteBurst Lesson UI Redesign

## Overview
Redesign the lesson experience UI to improve visual hierarchy, engagement/delight, and feedback quality. The mascot (Oni the Orange) should be central to the experience, reacting to every answer with appropriate emotions.

**Reference Files:**
- Wireframes: `/BiteBurst-Lesson-Wireframes.jsx` (interactive React component showing all states)
- Design Spec: `/BiteBurst-Lesson-UI-Design-Spec.md` (detailed specifications)

---

## Current State Analysis

The existing lesson components are located in:
- `client/src/pages/lessons/LessonPlayer.tsx` - Main orchestrator
- `client/src/pages/lessons/components/LessonAsking.tsx` - Question display
- `client/src/pages/lessons/components/LessonIncorrect.tsx` - Incorrect feedback
- `client/src/pages/lessons/components/LessonSuccess.tsx` - Correct feedback
- `client/src/pages/lessons/components/LessonLearn.tsx` - Learn card
- `client/src/pages/lessons/components/ProgressBar.tsx` - Progress indicator

**Issues to Fix:**
1. Mascot doesn't react to answer states (always static)
2. `LessonIncorrect` is too basic - just a red banner with no hint
3. No visual differentiation between 1st, 2nd, 3rd wrong attempts
4. Success state lacks celebration energy
5. Hearts should be replaced with orange star bursts (brand consistency)

---

## Task 1: Update Header with Orange Star Bursts

Replace the hearts in `LessonPlayer.tsx` with orange star bursts matching the dashboard design.

### Implementation

**File:** `client/src/pages/lessons/LessonPlayer.tsx`

1. Remove the Heart import from lucide-react
2. Add the OrangeBurst component (copy from `DashboardRedesign.tsx`):

```tsx
function OrangeBurst({ filled = true, size = 20 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#FF6A00" : "#E5E5E5"}
      className={`transition-all duration-200 ${filled ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}
    >
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}
```

3. Replace the hearts display in the header with:

```tsx
<div className="flex items-center gap-0.5" title="Bursts remaining">
  {Array.from({ length: 5 }).map((_, i) => (
    <OrangeBurst key={i} filled={i < lives} size={20} />
  ))}
</div>
```

---

## Task 2: Enhanced Mascot System

Make the mascot react dynamically based on lesson state.

### Implementation

**File:** `client/src/pages/lessons/LessonPlayer.tsx`

1. Add state for mascot emotion:
```tsx
const [mascotEmotion, setMascotEmotion] = useState<string>('thinking');
```

2. Update mascot emotion when lesson state changes:
```tsx
useEffect(() => {
  switch (lessonState) {
    case 'asking':
      setMascotEmotion(currentAttempt === 1 ? 'thinking' : 'hint');
      break;
    case 'incorrect':
      setMascotEmotion(currentAttempt <= 2 ? 'oops' : 'hint');
      break;
    case 'learn':
      setMascotEmotion('happy');
      break;
    case 'success':
      setMascotEmotion('celebrate');
      break;
    case 'complete':
      setMascotEmotion('proud');
      break;
  }
}, [lessonState, currentAttempt]);
```

3. Pass `mascotEmotion` to child components for display.

### Mascot Image Mapping

Already exists in `LessonAsking.tsx` - ensure it's used:
```tsx
const getMascotImage = (emotion: string): string => {
  switch (emotion) {
    case 'celebrate': return oniCelebrateImage;
    case 'groove': return oniGrooveImage;
    case 'hint': return oniHintImage;
    case 'love': return oniLoveImage;
    case 'oops': return oniOopsImage;
    case 'proud': return oniProudImage;
    case 'sad': return oniSadImage;
    case 'thinking':
    default: return oniTheOrangeImage;
  }
};
```

### Mascot Animations

Add CSS animations in `client/src/styles/tokens.css`:

```css
/* Mascot emotion animations */
@keyframes mascot-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

@keyframes mascot-wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

@keyframes mascot-pulse-blue {
  0%, 100% { filter: drop-shadow(0 0 0 transparent); }
  50% { filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)); }
}

.mascot-celebrate { animation: mascot-bounce 0.6s ease-in-out infinite; }
.mascot-oops { animation: mascot-wiggle 0.4s ease-in-out; }
.mascot-hint { animation: mascot-pulse-blue 1.5s ease-in-out infinite; }
.mascot-proud { animation: mascot-bounce 0.8s ease-in-out infinite; }
```

---

## Task 3: Redesign LessonIncorrect Component

Transform the basic error banner into a rich feedback experience with hints.

### Implementation

**File:** `client/src/pages/lessons/components/LessonIncorrect.tsx`

Replace the entire component with:

```tsx
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lightbulb } from "lucide-react";
import oniOopsImage from '@assets/Mascots/Oni_oops.png';
import oniHintImage from '@assets/Mascots/Oni_hint.png';

interface LessonIncorrectProps {
  message: string;
  hint?: string;
  attemptNumber: number;
  onTryAgain: () => void;
  canTryAgain: boolean;
}

export default function LessonIncorrect({
  message,
  hint,
  attemptNumber,
  onTryAgain,
  canTryAgain
}: LessonIncorrectProps) {
  const isHintMode = attemptNumber >= 2 && hint;
  const mascotImage = isHintMode ? oniHintImage : oniOopsImage;
  const mascotClass = isHintMode ? 'mascot-hint' : 'mascot-oops';

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Mascot */}
      <div className="flex justify-center">
        <img
          src={mascotImage}
          alt={isHintMode ? "Oni giving hint" : "Oni encouraging"}
          className={`w-24 h-24 object-contain ${mascotClass}`}
        />
      </div>

      {/* Feedback Banner */}
      <div
        className={`p-4 rounded-2xl border-2 ${
          isHintMode
            ? 'bg-blue-50 border-blue-200'
            : 'bg-red-50 border-red-200'
        }`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-start space-x-3">
          {isHintMode ? (
            <Lightbulb
              className="w-6 h-6 mt-1 flex-shrink-0 text-blue-600"
              aria-hidden="true"
            />
          ) : (
            <AlertTriangle
              className="w-6 h-6 mt-1 flex-shrink-0 text-red-600"
              aria-hidden="true"
            />
          )}

          <div className="flex-1">
            {isHintMode ? (
              <>
                <p className="font-semibold text-blue-800 mb-1">
                  💡 Think about it...
                </p>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {hint}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-red-800 mb-1">
                  🤔 Not quite!
                </p>
                <p className="text-red-700 text-sm leading-relaxed">
                  {message}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Try Again Button */}
      <div className="pt-2">
        <Button
          onClick={onTryAgain}
          disabled={!canTryAgain}
          className={`
            w-full h-12 text-base font-bold uppercase tracking-wider
            ${canTryAgain
              ? 'bg-[#FF6A00] hover:bg-[#E55A00] text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
```

### Update LessonPlayer to pass new props:

```tsx
{lessonState === 'incorrect' && currentStep && (
  <LessonIncorrect
    message={tryAgainMessage || "Not quite right. Try again!"}
    hint={getStepFeedbackMessage(currentStep, 'hint_after_2')}
    attemptNumber={currentAttempt}
    onTryAgain={handleTryAgain}
    canTryAgain={true}
  />
)}
```

---

## Task 4: Enhance LessonSuccess Component

Add more celebration energy with mascot animation, confetti, and better visual feedback.

### Implementation

**File:** `client/src/pages/lessons/components/LessonSuccess.tsx`

Key changes:
1. Add celebrating mascot with bounce animation
2. Add sparkle effects around mascot
3. Animate XP badge with bounce
4. Add "Nice!" success banner

```tsx
// At the top of the component, add sparkles around mascot:
<div className="flex justify-center relative">
  <span className="absolute -top-2 -left-8 text-2xl animate-ping">✨</span>
  <span className="absolute -top-2 -right-8 text-2xl animate-ping delay-100">⭐</span>
  <img
    src={sunnyCelebrateImage}
    alt="Oni Celebrating"
    className="w-24 h-24 object-contain mascot-celebrate"
  />
  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xl animate-ping delay-200">🌟</span>
</div>
```

Update XP display with animation:

```tsx
<div className="text-center">
  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full px-6 py-3 shadow-lg animate-bounce">
    <span className="text-white font-bold text-xl">+{xpEarned} XP</span>
    <span className="text-2xl">✨</span>
  </div>
</div>
```

---

## Task 5: Enhance LessonLearn Component

Make the learn card more visually engaging and supportive.

### Implementation

**File:** `client/src/pages/lessons/components/LessonLearn.tsx`

Update styling:

```tsx
<div className="max-w-md mx-auto space-y-6">
  {/* Supportive Mascot */}
  <div className="flex justify-center">
    <img
      src={oniHappyImage}
      alt="Oni encouraging"
      className="w-24 h-24 object-contain"
    />
  </div>

  {/* Learn card with gradient */}
  <div
    className="p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50"
    role="region"
    aria-live="polite"
  >
    <div className="flex items-start space-x-4">
      <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
        <span className="text-3xl">📚</span>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-indigo-800 text-lg mb-3">
          Let's Learn!
        </h3>
        <div className="text-indigo-700 space-y-2">
          {/* Content rendering */}
        </div>
      </div>
    </div>
  </div>

  {/* Encouraging message */}
  <p className="text-center text-gray-600 text-sm">
    Don't worry - everyone learns differently! Let's move on. 💪
  </p>

  {/* Reduced XP still awarded */}
  <div className="text-center">
    <div className="inline-flex items-center space-x-2 bg-yellow-100 border border-yellow-300 rounded-full px-4 py-2">
      <span className="text-yellow-600 font-bold">+{xpEarned} XP</span>
      <span className="text-xl">✨</span>
    </div>
  </div>

  {/* Continue Button */}
  <Button
    onClick={onContinue}
    className="w-full h-12 text-base font-bold uppercase tracking-wider bg-[#FF6A00] hover:bg-[#E55A00] text-white"
  >
    Continue
  </Button>
</div>
```

---

## Task 6: Add Hint Banner to LessonAsking

When returning to the question after a wrong answer, show the hint at the top.

### Implementation

**File:** `client/src/pages/lessons/components/LessonAsking.tsx`

The banner prop already exists. Ensure it displays properly with the hint styling:

```tsx
{banner && banner.variant === 'tryAgain' && (
  <div
    className="p-4 rounded-2xl border-2 bg-blue-50 border-blue-200"
    role="alert"
    aria-live="polite"
  >
    <div className="flex items-start space-x-3">
      <span className="text-2xl">💡</span>
      <div className="flex-1">
        <p className="font-semibold text-blue-800 mb-1">Hint:</p>
        <p className="text-blue-700 text-sm leading-relaxed">
          {banner.text}
        </p>
      </div>
    </div>
  </div>
)}
```

---

## Task 7: Update LessonPlayer State Machine

Ensure proper flow between states with mascot emotions.

### State Flow

```
ASKING (mascot: thinking)
    ↓ Wrong Answer (1st)
INCORRECT (mascot: oops, message: tryAgain1)
    ↓ Click "Try Again"
ASKING (mascot: hint, banner: hint message)
    ↓ Wrong Answer (2nd)
INCORRECT (mascot: hint, message: hint_after_2)
    ↓ Click "Try Again"
ASKING (mascot: hint, banner: hint message)
    ↓ Wrong Answer (3rd)
LEARN (mascot: happy, educational content)
    ↓ Click "Continue"
[Next Step or COMPLETE]

ASKING → Correct Answer → SUCCESS (mascot: celebrate)
```

### Key Changes in LessonPlayer:

1. Track attempt number and use it for mascot emotion
2. Pass hint messages to LessonIncorrect based on attempt
3. Show hint banner in LessonAsking after failed attempts

---

## Task 8: Lesson Complete Celebration

Enhance the lesson complete screen with stats and achievements.

### Implementation

Update the complete state in `LessonPlayer.tsx`:

```tsx
if (lessonState === 'complete') {
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-orange-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Celebration emoji */}
        <div className="text-6xl">🎉</div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lesson Complete!</h1>
          <p className="text-gray-600">Amazing work, Nutrition Champion!</p>
        </div>

        {/* Proud Mascot */}
        <div className="flex justify-center">
          <img
            src={oniProudImage}
            alt="Oni Proud"
            className="w-32 h-32 object-contain mascot-proud"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">⚡</div>
            <div className="text-2xl font-bold text-orange-500">{totalXpEarned}</div>
            <div className="text-xs text-gray-500">XP Earned</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">🎯</div>
            <div className="text-2xl font-bold text-green-500">
              {Math.round((correctAnswers / totalQuestions) * 100)}%
            </div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-3xl mb-1">🔥</div>
            <div className="text-2xl font-bold text-red-500">{streakDays}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleClose}
          className="w-full bg-green-500 hover:bg-green-600 text-white h-14 text-lg font-bold rounded-2xl"
        >
          Continue Learning
        </Button>
      </div>
    </div>
  );
}
```

---

## Testing Checklist

After implementation, verify:

- [ ] Orange star bursts display correctly (filled = orange, empty = gray)
- [ ] Bursts decrease when wrong answers are given
- [ ] Mascot shows `thinking` emotion during questions
- [ ] Mascot shows `oops` emotion on first wrong answer
- [ ] Mascot shows `hint` emotion (with blue glow) on 2nd+ wrong answer
- [ ] Mascot shows `celebrate` emotion (bouncing) on correct answer
- [ ] Mascot shows `proud` emotion on lesson complete
- [ ] Hint banner appears when returning to question after wrong answer
- [ ] Learn card shows supportive message and reduced XP
- [ ] XP badge animates with bounce effect
- [ ] Success sparkles appear around mascot
- [ ] Lesson complete shows stats grid
- [ ] All animations respect `prefers-reduced-motion`

---

## File Summary

| File | Changes |
|------|---------|
| `LessonPlayer.tsx` | Replace hearts with bursts, add mascot emotion state, update complete screen |
| `LessonIncorrect.tsx` | Full redesign with mascot, hint mode, better styling |
| `LessonSuccess.tsx` | Add sparkles, animate XP, enhance celebration |
| `LessonLearn.tsx` | Add mascot, gradient styling, encouraging message |
| `LessonAsking.tsx` | Ensure hint banner displays with proper styling |
| `tokens.css` | Add mascot animation keyframes |

---

## Design Reference

See `/BiteBurst-Lesson-Wireframes.jsx` for interactive preview of all states.
See `/BiteBurst-Lesson-UI-Design-Spec.md` for detailed specifications including:
- ASCII wireframes for all screens
- Color codes and spacing
- Animation specifications
- Accessibility requirements
