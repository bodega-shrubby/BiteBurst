# Replit Agent Prompt 2: Lesson Content Page
## Priority: Do This AFTER Prompt 1 (Schema & API Migration)

---

## Overview

Implement a new **Lesson Content Page** (also called "Knowledge Snack") that displays educational content BEFORE quiz questions begin. This replaces the old "intro" state with a rich, engaging learning experience.

### Prerequisites
- ✅ Prompt 1 completed (schema & API migration)
- ✅ `lesson-content` question type exists in enum
- ✅ `contentVariants` column exists on lesson_steps

---

## 1. User Flow

```
Child clicks lesson → Lesson Content Page (Step 1) → "Let's Go!" → Quiz Questions (Steps 2+) → Completion
```

1. **Step 1** is always `questionType: 'lesson-content'` - the learning content
2. **Steps 2+** are quiz questions (multiple-choice, true-false, etc.)
3. Child reads the content, then clicks "Let's Go!" to start the quiz

---

## 2. Responsive Design Specifications

### Breakpoints:

| Size | Width | Layout |
|------|-------|--------|
| Mobile | <768px | Single column, stacked |
| Tablet | 768-1023px | Split view: mascot left (40%), cards right (60%) |
| Desktop | ≥1024px | Split view: mascot left (33%), 2x2 card grid right (67%) |

---

## 3. Component Specifications

### Header (All Sizes)

```
┌─────────────────────────────────────────────────────────┐
│  [X]  ████████████░░░░░░░░░░░░░░░░  1/6    ⭐⭐⭐      │
│       ← Progress Bar (orange gradient) →                │
└─────────────────────────────────────────────────────────┘
```

- **Close button (X)**:
  - Size: w-10 h-10 (mobile), w-12 h-12 (tablet+)
  - Style: rounded-full, bg-gray-100
  - Hover: bg-red-100, icon turns red

- **Progress bar**:
  - Height: h-4 (mobile), h-5 (tablet+)
  - Background: bg-gray-200 rounded-full
  - Fill: `bg-gradient-to-r from-yellow-400 to-orange-500`
  - Shows "1/6" label centered in white text

- **Lives (Stars)**:
  - Container: bg-yellow-50, border-2 border-yellow-200, rounded-full, px-2 py-1
  - Stars: ⭐ emoji, animate-bounce with staggered delay (0s, 0.1s, 0.2s)
  - Animation duration: 2s

### Mascot Section

```
         ✨
    ⭐  ┌────────┐  💫
        │   ⚡   │
        │        │
        └────────┘
      ╭────────────╮
      │ Brainy Bolt│
      ╰────────────╯
```

- **Glow effect**: Absolute positioned div behind mascot
  - Size: Same as mascot circle
  - Style: bg-orange-300/30, blur-xl, animate-pulse

- **Sparkles**: Positioned around mascot
  - ✨ at top-right, ⭐ at top-left, 💫 at bottom-right
  - Animation: animate-pulse with staggered delays

- **Main circle**:
  - Mobile: w-24 h-24
  - Tablet: w-32 h-32
  - Desktop: w-40 h-40
  - Style: rounded-full, border-4 border-white, shadow-xl
  - Background: `bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500`
  - Glow: `box-shadow: 0 0 30px rgba(255, 106, 0, 0.4)`
  - Animation: animate-bounce with duration 3s

- **Name badge**:
  - Position: absolute, -bottom-3, centered
  - Style: bg-white, rounded-full, border-2 border-orange-300, shadow-md
  - Text: font-bold, text-orange-600

### Title Section

```
      ╭──────────────────────╮
      │ 🌟 LESSON TIME! 🌟  │  ← Bouncing badge
      ╰──────────────────────╯

   Why Breakfast is Your
      SUPERPOWER! 💪           ← Gradient text
```

- **Badge**:
  - Style: bg-gradient-to-r from-orange-500 to-yellow-500
  - Text: white, font-bold, text-xs (mobile), text-sm (tablet+)
  - Animation: animate-bounce

- **Title**:
  - Font: font-black
  - Size: text-xl (mobile), text-2xl (tablet), text-3xl (desktop)
  - "SUPERPOWER" word: `text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500`

### Speech Bubble

```
           ▲
    ┌─────────────────────┐
    │ Hey superstar! ⚡   │
    │ Your body is like   │
    │ a race car! 🏎️     │
    └─────────────────────┘
```

- Style: bg-white, rounded-2xl, border-2 border-orange-200, shadow-lg
- Triangle: CSS border trick or clip-path
- Text: text-gray-700, text-center, font-medium
- Max width: max-w-xs

### Learning Cards

Each card:
```
┌────────────────────────────────────┐
│ ┌────┐  Your Body is Like a Car!  │
│ │ 🚗 │  🏎️                        │
│ └────┘  When you sleep, your body │
│         uses up all its energy... │
└────────────────────────────────────┘
```

**Mobile/Tablet (horizontal layout):**
- Icon box: w-12 h-12 (mobile), w-14 h-14 (tablet)
- Layout: flex, gap-3

**Desktop (centered layout):**
- Icon box: w-20 h-20, centered
- Layout: text-center

**Icon box colors:**
| Topic | Gradient | Border |
|-------|----------|--------|
| blue | `from-blue-400 to-blue-500` | `border-blue-200` |
| green | `from-green-400 to-green-500` | `border-green-200` |
| yellow | `from-yellow-400 to-orange-400` | `border-yellow-200` |
| cyan | `from-cyan-400 to-blue-400` | `border-cyan-200` |

**Card styling:**
- Background: bg-white
- Border: border-2, colored by topic
- Radius: rounded-2xl
- Padding: p-4 (mobile), p-5 (tablet+)
- Shadow: shadow-lg
- Hover: shadow-xl, -translate-y-1 (lift effect)

### Remember Box

```
┌──────────────────────────────────────┐
│ 💡 REMEMBER! 🧠                      │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ ✓  Breakfast fills your tank!  │  │
│ └────────────────────────────────┘  │
│ ┌────────────────────────────────┐  │
│ │ ✓  Good food = lasting energy! │  │
│ └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

**Container:**
- Background: `bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-50`
- Border: border-2 border-yellow-300
- Radius: rounded-3xl
- Padding: p-4 (mobile), p-5 (tablet), p-6 (desktop)

**Header:**
- 💡 and 🧠 emojis with animate-bounce
- Text: font-black, text-orange-700

**List items (mobile/tablet):**
- Layout: vertical list, space-y-2
- Item: flex, bg-white/70, rounded-xl, px-3 py-2
- Checkmark: w-6 h-6, bg-green-400, rounded-full, centered ✓

**Grid items (desktop):**
- Layout: grid-cols-3, gap-3
- Item: flex-col, text-center
- Checkmark: w-8 h-8

### Footer (CTA)

```
┌──────────────────────────────────────┐
│    ┌────────────────────────────┐    │
│    │     LET'S GO! 🚀           │    │
│    └────────────────────────────┘    │
│       Tap to start the quiz! ✨      │
└──────────────────────────────────────┘
```

**Container:**
- Position: sticky bottom-0
- Background: bg-white/95, backdrop-blur-sm
- Border: border-t-2 border-orange-100
- Padding: p-4

**Button:**
- Height: h-12 (mobile), h-14 (tablet/desktop)
- Background: `bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400`
- Hover: from-orange-600, via-orange-500, to-yellow-500
- Text: white, font-black, uppercase, tracking-wide
- Radius: rounded-2xl
- Shadow: shadow-lg
- Glow: `box-shadow: 0 0 20px rgba(255, 106, 0, 0.3)`
- 🚀 emoji: animate-bounce
- Active: scale-95

**Helper text:**
- Text: text-gray-400, text-xs, text-center, mt-2

---

## 4. Data Structure

### Content Structure (from `lesson_steps.content`):

```typescript
interface LessonContentData {
  title: string;
  intro?: {
    greeting: string;
    message: string;
  };
  sections: Array<{
    emoji: string;
    color: 'blue' | 'green' | 'yellow' | 'cyan' | 'orange';
    heading: string;
    subEmoji: string;
    text: string;
  }>;
  keyPoints: string[];
  mascotMessage: string;
}
```

### Example Content:

```json
{
  "title": "Why Breakfast is Your SUPERPOWER!",
  "intro": {
    "greeting": "Hey there, superstar!",
    "message": "Did you know your body is like a race car? 🏎️ Let's learn about the fuel that powers you!"
  },
  "sections": [
    {
      "emoji": "🚗",
      "color": "blue",
      "heading": "Your Body is Like a Car!",
      "subEmoji": "🏎️",
      "text": "When you sleep, your body uses up all its energy. When you wake up, your tank is EMPTY!"
    },
    {
      "emoji": "⛽",
      "color": "green",
      "heading": "Breakfast Fills Your Tank!",
      "subEmoji": "🔋",
      "text": "Breakfast gives your body ENERGY to run, play, and think super fast!"
    },
    {
      "emoji": "🍌",
      "color": "yellow",
      "heading": "Super Fuel vs Quick Fuel!",
      "subEmoji": "⚡",
      "text": "Super fuel (toast, cereal, fruit) lasts longer than quick fuel (sweets)!"
    },
    {
      "emoji": "💧",
      "color": "cyan",
      "heading": "Water Wakes Your Brain!",
      "subEmoji": "🧠",
      "text": "Your body gets thirsty while you sleep. Water helps wake up your BRAIN!"
    }
  ],
  "keyPoints": [
    "Breakfast fills your energy tank!",
    "Good food = energy that LASTS!",
    "Water wakes up your brain!"
  ],
  "mascotMessage": "Now you know why breakfast is so important! Let's see what you learned! 🎉"
}
```

---

## 5. Implementation

### Create New Component: `client/src/pages/lessons/components/LessonContent.tsx`

```tsx
import React from 'react';

// Types
interface LessonSection {
  emoji: string;
  color: 'blue' | 'green' | 'yellow' | 'cyan' | 'orange';
  heading: string;
  subEmoji: string;
  text: string;
}

interface LessonContentProps {
  title: string;
  mascot: {
    name: string;
    emoji: string;
  };
  intro: {
    greeting: string;
    message: string;
  };
  sections: LessonSection[];
  keyPoints: string[];
  mascotMessage: string;
  currentStep: number;
  totalSteps: number;
  lives: number;
  onContinue: () => void;
  onClose: () => void;
}

// Color mappings
const colorMap: Record<string, { bg: string; border: string }> = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-400 to-blue-500',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-400 to-green-500',
    border: 'border-green-200',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-400 to-orange-400',
    border: 'border-yellow-200',
  },
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-400 to-blue-400',
    border: 'border-cyan-200',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-400 to-orange-500',
    border: 'border-orange-200',
  },
};

export function LessonContent({
  title,
  mascot,
  intro,
  sections,
  keyPoints,
  mascotMessage,
  currentStep,
  totalSteps,
  lives,
  onContinue,
  onClose,
}: LessonContentProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 via-yellow-50 to-white">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b-2 border-orange-100 px-4 py-3 z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-3 md:gap-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-all group"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Progress Bar */}
          <div className="flex-1 h-4 md:h-5 bg-gray-200 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] md:text-xs font-bold text-white drop-shadow-sm">
                {currentStep}/{totalSteps}
              </span>
            </div>
          </div>

          {/* Lives */}
          <div className="flex items-center gap-1 bg-yellow-50 px-2 md:px-4 py-1 md:py-2 rounded-full border-2 border-yellow-200">
            {[...Array(lives)].map((_, i) => (
              <span
                key={i}
                className="text-lg md:text-xl animate-bounce"
                style={{ animationDelay: `${i * 0.1}s`, animationDuration: '2s' }}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content - Responsive */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row min-h-full">

          {/* Left Side - Mascot */}
          <div className="w-full md:w-2/5 lg:w-1/3 p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 md:border-r-2 md:border-orange-100">
            {/* Mascot Avatar */}
            <div className="relative mb-4 md:mb-6">
              {/* Glow */}
              <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto rounded-full bg-orange-300/30 blur-xl animate-pulse" />

              {/* Sparkles */}
              <span className="absolute -top-2 -right-4 text-xl md:text-2xl animate-pulse">✨</span>
              <span className="absolute -top-1 left-0 text-lg md:text-xl animate-pulse" style={{ animationDelay: '0.3s' }}>⭐</span>
              <span className="absolute bottom-0 -right-2 text-base md:text-lg animate-pulse" style={{ animationDelay: '0.6s' }}>💫</span>

              {/* Circle */}
              <div
                className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500 border-4 border-white shadow-xl flex items-center justify-center animate-bounce"
                style={{ animationDuration: '3s', boxShadow: '0 0 30px rgba(255, 106, 0, 0.4)' }}
              >
                <span className="text-4xl md:text-5xl lg:text-7xl">{mascot.emoji}</span>
              </div>

              {/* Name Badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border-2 border-orange-300 shadow-md">
                <span className="text-xs md:text-sm font-bold text-orange-600">{mascot.name}</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mt-4">
              <div className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-1 rounded-full text-xs md:text-sm font-bold mb-2 md:mb-3 animate-bounce">
                🌟 LESSON TIME! 🌟
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-800 leading-tight">
                {title.includes('SUPERPOWER') ? (
                  <>
                    {title.split('SUPERPOWER')[0]}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500">
                      SUPERPOWER!
                    </span> 💪
                  </>
                ) : (
                  <>{title} 💪</>
                )}
              </h1>
            </div>

            {/* Speech Bubble */}
            <div className="mt-4 md:mt-6 bg-white rounded-2xl border-2 border-orange-200 p-3 md:p-4 shadow-lg max-w-xs relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[12px] border-l-transparent border-r-transparent border-b-orange-200" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-white" />
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-center font-medium">
                {intro.greeting} ⚡<br />
                {intro.message}
              </p>
            </div>
          </div>

          {/* Right Side - Cards */}
          <div className="w-full md:w-3/5 lg:w-2/3 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {/* Cards - Stack on mobile, 2-col grid on desktop */}
            <div className="space-y-3 md:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 max-w-2xl mx-auto">
              {sections.map((section, i) => {
                const colors = colorMap[section.color] || colorMap.orange;
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl border-2 ${colors.border} p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer`}
                  >
                    {/* Desktop: Centered layout */}
                    <div className="hidden lg:block text-center mb-3">
                      <div className={`w-16 h-16 mx-auto rounded-2xl ${colors.bg} flex items-center justify-center text-4xl shadow-md`}>
                        {section.emoji}
                      </div>
                    </div>
                    <h3 className="hidden lg:block font-extrabold text-gray-800 text-lg mb-2 text-center">
                      {section.heading} {section.subEmoji}
                    </h3>
                    <p className="hidden lg:block text-gray-600 text-base leading-relaxed text-center">
                      {section.text}
                    </p>

                    {/* Mobile/Tablet: Horizontal layout */}
                    <div className="lg:hidden flex gap-3 items-start">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${colors.bg} flex items-center justify-center text-2xl md:text-3xl shadow-md flex-shrink-0`}>
                        {section.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-extrabold text-gray-800 text-sm md:text-base mb-1">
                          {section.heading} {section.subEmoji}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                          {section.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Remember Box */}
            <div className="mt-4 md:mt-6 max-w-2xl mx-auto bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-50 rounded-3xl border-2 border-yellow-300 p-4 md:p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-3 lg:justify-center">
                <span className="text-xl md:text-2xl animate-bounce">💡</span>
                <h3 className="font-black text-orange-700 text-base md:text-lg lg:text-xl">REMEMBER!</h3>
                <span className="text-xl md:text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🧠</span>
              </div>

              {/* Mobile/Tablet: List */}
              <ul className="space-y-2 lg:hidden">
                {keyPoints.map((point, i) => (
                  <li key={i} className="flex items-center gap-3 bg-white/70 rounded-xl px-3 py-2">
                    <span className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center text-white text-sm font-bold">✓</span>
                    <span className="text-gray-700 text-sm md:text-base font-medium">{point}</span>
                  </li>
                ))}
              </ul>

              {/* Desktop: Grid */}
              <div className="hidden lg:grid grid-cols-3 gap-3">
                {keyPoints.map((point, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 bg-white/70 rounded-xl px-4 py-3 text-center">
                    <span className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg">✓</span>
                    <span className="text-gray-700 font-medium text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascot Message */}
            <p className="mt-4 text-center text-gray-500 text-sm italic">
              "{mascotMessage}"
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t-2 border-orange-100 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={onContinue}
            className="w-full h-12 md:h-14 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 hover:from-orange-600 hover:via-orange-500 hover:to-yellow-500 text-white font-black text-base md:text-lg uppercase tracking-wide rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
            style={{ boxShadow: '0 0 20px rgba(255, 106, 0, 0.3)' }}
          >
            <span>Let's Go!</span>
            <span className="text-xl md:text-2xl animate-bounce">🚀</span>
          </button>
          <p className="text-center text-gray-400 text-xs mt-2 font-medium">
            Tap to start the quiz! ✨
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LessonContent;
```

---

### Update LessonPlayer.tsx

**File:** `client/src/pages/lessons/LessonPlayer.tsx`

#### Add Import:
```tsx
import LessonContent from './components/LessonContent';
```

#### Update State Type:
```tsx
type LessonState = 'intro' | 'content' | 'asking' | 'incorrect' | 'learn' | 'success' | 'complete';
```

#### Add Logic to Handle lesson-content:

```tsx
function LessonPlayer() {
  const [state, setState] = useState<LessonState>('intro');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // ... other existing state ...

  const currentStep = lessonData?.steps[currentStepIndex];
  const isLessonContent = currentStep?.questionType === 'lesson-content';

  // When starting the lesson
  const handleStartLesson = () => {
    if (isLessonContent) {
      setState('content');
    } else {
      setState('asking');
    }
  };

  // When clicking "Let's Go!" on content page
  const handleContentContinue = () => {
    // Move to next step (quiz questions)
    setCurrentStepIndex(prev => prev + 1);
    setState('asking');
  };

  // Render lesson content page
  if (state === 'content' && isLessonContent) {
    const content = currentStep.content as any;
    return (
      <LessonContent
        title={content.title || lessonData.title}
        mascot={{
          name: lessonData.mascot?.name || 'Brainy Bolt',
          emoji: lessonData.mascot?.emoji || '⚡',
        }}
        intro={{
          greeting: content.intro?.greeting || 'Hey there, superstar!',
          message: content.intro?.message || lessonData.mascotIntro || 'Let\'s learn something amazing!',
        }}
        sections={content.sections || []}
        keyPoints={content.keyPoints || []}
        mascotMessage={content.mascotMessage || 'Great job! Now let\'s see what you learned!'}
        currentStep={currentStepIndex + 1}
        totalSteps={lessonData.totalSteps}
        lives={livesRemaining}
        onContinue={handleContentContinue}
        onClose={handleClose}
      />
    );
  }

  // ... rest of existing render logic (intro, asking, success, incorrect, learn, complete states) ...
}
```

---

## 6. Testing Checklist

After implementing, verify:

### Component Renders:
- [ ] Mobile layout (<768px) shows single column
- [ ] Tablet layout (768-1023px) shows 40/60 split
- [ ] Desktop layout (≥1024px) shows 33/67 split with 2x2 grid

### Animations:
- [ ] Mascot floats/bounces (3s duration)
- [ ] Stars bounce with staggered delay
- [ ] Sparkles pulse around mascot
- [ ] Badge bounces
- [ ] Rocket emoji bounces in CTA

### Interactivity:
- [ ] Close button hover turns red
- [ ] Cards lift on hover
- [ ] CTA button has glow effect
- [ ] CTA scales down on click (active:scale-95)

### Flow:
- [ ] Lesson starts on content page (step 1)
- [ ] "Let's Go!" advances to quiz (step 2)
- [ ] Progress bar shows correct step count
- [ ] Lives display matches user's lives

### Styling:
- [ ] Progress bar is orange gradient (NOT rainbow)
- [ ] Fonts are bold and readable
- [ ] Colors match specification
- [ ] Spacing is consistent

---

## Summary

| Component | File | Purpose |
|-----------|------|---------|
| LessonContent | `components/LessonContent.tsx` | New lesson content page |
| LessonPlayer | `pages/lessons/LessonPlayer.tsx` | Updated to handle `lesson-content` type |

**This prompt depends on Prompt 1 being completed first.**
