# BiteBurst Mascots Integration - Replit Agent Prompt

## Overview
Add animated mascot characters to BiteBurst to create an engaging, friendly learning experience. The main mascot "Oni the Orange" should appear as a large floating animated character on the Dashboard, similar to how Sparkli.ai displays their pink mascot. Professor Bloop should appear on the Lessons page to guide learning.

## Available Mascot Assets

### Main Mascot: Oni the Orange
Located in `/public/mascots/` (copy from project Mascots folder):

| File | Description | Use Case |
|------|-------------|----------|
| `Oni_the_Orange.png` | Default pose, playful running | Dashboard hero, general use |
| `Oni_celebrate.png` | Jumping with confetti | Success states, achievements |
| `Oni_groove.png` | Dancing/grooving | Fun interactions |
| `Oni_hint.png` | Pointing, thoughtful | Giving tips, hints |
| `Oni_love.png` | Showing love/hearts | Positive feedback |
| `Oni_oops.png` | Surprised/mistake | Wrong answers |
| `Oni_proud.png` | Proud pose | Completing lessons |
| `Oni_sad.png` | Sad expression | Losing streak, encouragement |

### Supporting Mascots
| File | Description | Use Case |
|------|-------------|----------|
| `ProfessorBloop.png` | Professor character | Lessons page, teaching |
| `AppleBuddy.png` | Apple character | Fruit lessons |
| `CaptainCarrot.png` | Carrot superhero | Veggie lessons |
| `HydroHero.png` | Water character | Hydration lessons |
| `CoachFlex.png` | Fitness coach | Sports/exercise lessons |
| `BrainyBolt.png` | Brain character | Knowledge/quiz sections |
| `DanceStar.png` | Dancing character | Active breaks |
| `SnackTwins.png` | Twin snack characters | Snack/food lessons |
| `YumYum.png` | Food character | General food lessons |

---

## Part 1: Dashboard - Floating Animated Oni

### Design Reference
Similar to Sparkli.ai's floating pink mascot - a large character that:
- Floats/bobs gently up and down
- Has a subtle shadow that moves with it
- Positioned to the right side of the content
- Large enough to be eye-catching but not overwhelming
- Feels alive and welcoming

### Component: FloatingMascot

**File:** `client/src/components/FloatingMascot.tsx`

```tsx
import { useState, useEffect } from 'react';

interface FloatingMascotProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'left' | 'right' | 'center';
  className?: string;
  onClick?: () => void;
  showSpeechBubble?: boolean;
  speechText?: string;
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-48 h-48',
  xl: 'w-64 h-64', // Large floating mascot
};

export default function FloatingMascot({
  src,
  alt,
  size = 'lg',
  position = 'right',
  className = '',
  onClick,
  showSpeechBubble = false,
  speechText = '',
}: FloatingMascotProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl px-4 py-2 shadow-lg border border-gray-200 whitespace-nowrap z-10">
          <p className="text-sm font-medium text-gray-800">{speechText}</p>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-200 rotate-45" />
        </div>
      )}

      {/* Floating Mascot */}
      <div
        className={`
          ${sizeClasses[size]}
          animate-float
          cursor-pointer
          transition-transform duration-300
          ${isHovered ? 'scale-110' : 'scale-100'}
        `}
        onClick={onClick}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </div>

      {/* Floating Shadow */}
      <div
        className={`
          absolute bottom-0 left-1/2 transform -translate-x-1/2
          bg-black/10 rounded-full blur-md
          animate-shadow-float
          ${size === 'xl' ? 'w-32 h-4' : size === 'lg' ? 'w-24 h-3' : 'w-16 h-2'}
        `}
      />
    </div>
  );
}
```

### CSS Animations

**Add to `client/src/index.css` or create `client/src/styles/animations.css`:**

```css
/* Floating Animation - Gentle bobbing up and down */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

/* Shadow Animation - Shrinks when mascot floats up */
@keyframes shadow-float {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateX(-50%) scale(0.8);
    opacity: 0.15;
  }
}

/* Bounce Animation - For celebrations */
@keyframes bounce-mascot {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(-5deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-10px) rotate(5deg);
  }
}

/* Wiggle Animation - For hints/attention */
@keyframes wiggle {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

/* Pulse Glow - For interactive states */
@keyframes pulse-glow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(255, 106, 0, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 25px rgba(255, 106, 0, 0.6));
  }
}

/* Utility Classes */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-shadow-float {
  animation: shadow-float 3s ease-in-out infinite;
}

.animate-bounce-mascot {
  animation: bounce-mascot 1s ease-in-out;
}

.animate-wiggle {
  animation: wiggle 0.5s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

### Tailwind Config Update

**Add to `tailwind.config.js`:**

```javascript
module.exports = {
  theme: {
    extend: {
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shadow-float': 'shadow-float 3s ease-in-out infinite',
        'bounce-mascot': 'bounce-mascot 1s ease-in-out',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'shadow-float': {
          '0%, 100%': { transform: 'translateX(-50%) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translateX(-50%) scale(0.8)', opacity: '0.15' },
        },
        'bounce-mascot': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) rotate(-5deg)' },
          '50%': { transform: 'translateY(0) rotate(0deg)' },
          '75%': { transform: 'translateY(-10px) rotate(5deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
      },
    },
  },
};
```

### Dashboard Integration

**File:** `client/src/pages/DashboardRedesign.tsx`

Add the floating Oni to the right sidebar or as a fixed position element:

```tsx
import FloatingMascot from '@/components/FloatingMascot';

// Inside the Dashboard component, in the right sidebar area:

{/* Large Floating Oni */}
<div className="relative mb-6">
  <FloatingMascot
    src="/mascots/Oni_the_Orange.png"
    alt="Oni the Orange"
    size="xl"
    showSpeechBubble={showGreeting}
    speechText={getGreeting()} // "Hey there! Ready to learn?" etc.
    onClick={() => handleMascotClick()}
  />
</div>

// Or as a fixed floating element on the right side:
<div className="fixed bottom-8 right-8 z-40 hidden lg:block">
  <FloatingMascot
    src="/mascots/Oni_the_Orange.png"
    alt="Oni the Orange"
    size="xl"
    showSpeechBubble={showTip}
    speechText={currentTip}
    onClick={() => setShowTipModal(true)}
  />
</div>
```

### Dynamic Mascot States

```tsx
// Hook for managing mascot state
function useMascotState() {
  const [mascotPose, setMascotPose] = useState('Oni_the_Orange.png');
  const [speechText, setSpeechText] = useState('');

  const mascotPoses = {
    default: 'Oni_the_Orange.png',
    celebrate: 'Oni_celebrate.png',
    hint: 'Oni_hint.png',
    proud: 'Oni_proud.png',
    sad: 'Oni_sad.png',
    oops: 'Oni_oops.png',
    love: 'Oni_love.png',
    groove: 'Oni_groove.png',
  };

  const greetings = [
    "Hey there! Ready to learn? 🍊",
    "Let's make today awesome!",
    "You're doing great!",
    "Time for some fun learning!",
    "I believe in you! 💪",
  ];

  const celebrate = () => {
    setMascotPose(mascotPoses.celebrate);
    setSpeechText("Amazing job! 🎉");
    setTimeout(() => setMascotPose(mascotPoses.default), 3000);
  };

  const showHint = (hint: string) => {
    setMascotPose(mascotPoses.hint);
    setSpeechText(hint);
  };

  const showEncouragement = () => {
    setMascotPose(mascotPoses.proud);
    setSpeechText("Keep going, you've got this!");
  };

  return {
    mascotPose,
    speechText,
    celebrate,
    showHint,
    showEncouragement,
    setMascotPose,
    setSpeechText,
    greetings,
  };
}
```

---

## Part 2: Lessons Page - Professor Bloop

### Design
Professor Bloop appears on the Lessons page as a teaching guide:
- Smaller than the Dashboard Oni
- Positioned in the lesson content area or sidebar
- Provides tips, hints, and encouragement during lessons
- Can animate/react to user progress

### Component: LessonMascot

**File:** `client/src/components/LessonMascot.tsx`

```tsx
interface LessonMascotProps {
  type: 'professor' | 'topic'; // Professor for general, topic for food-specific
  topicMascot?: string; // e.g., 'CaptainCarrot', 'AppleBuddy'
  message?: string;
  mood?: 'happy' | 'thinking' | 'celebrating' | 'encouraging';
  size?: 'sm' | 'md' | 'lg';
  position?: 'inline' | 'sidebar' | 'floating';
}

const mascotMap = {
  professor: '/mascots/ProfessorBloop.png',
  apple: '/mascots/AppleBuddy.png',
  carrot: '/mascots/CaptainCarrot.png',
  hydration: '/mascots/HydroHero.png',
  fitness: '/mascots/CoachFlex.png',
  brain: '/mascots/BrainyBolt.png',
  snacks: '/mascots/SnackTwins.png',
};

export default function LessonMascot({
  type = 'professor',
  topicMascot,
  message,
  mood = 'happy',
  size = 'md',
  position = 'inline',
}: LessonMascotProps) {
  const mascotSrc = type === 'topic' && topicMascot
    ? mascotMap[topicMascot as keyof typeof mascotMap]
    : mascotMap.professor;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const positionClasses = {
    inline: '',
    sidebar: 'sticky top-24',
    floating: 'fixed bottom-4 right-4 z-30',
  };

  return (
    <div className={`flex items-start space-x-3 ${positionClasses[position]}`}>
      {/* Mascot Image */}
      <div className={`${sizeClasses[size]} flex-shrink-0 animate-float`}>
        <img
          src={mascotSrc}
          alt="Lesson Guide"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Message Bubble */}
      {message && (
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 max-w-xs">
          <p className="text-sm text-gray-700">{message}</p>
        </div>
      )}
    </div>
  );
}
```

### Lessons Page Integration

**File:** `client/src/pages/Lessons.tsx`

```tsx
import LessonMascot from '@/components/LessonMascot';

// Add Professor Bloop to the lessons page

// Option 1: In the right sidebar
<div className="space-y-5">
  {/* Professor Bloop Guide */}
  <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
    <LessonMascot
      type="professor"
      message={getCurrentTip()}
      size="md"
    />
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-xs text-gray-500 font-medium">Professor's Tip</p>
      <p className="text-sm text-gray-700 mt-1">
        {currentLesson?.tip || "Take your time and have fun learning!"}
      </p>
    </div>
  </div>

  {/* Topic Lessons List */}
  ...
</div>

// Option 2: Inline with lesson content
<div className="lesson-intro mb-6">
  <LessonMascot
    type="professor"
    message={`Today we're learning about ${lessonTopic}!`}
    size="lg"
  />
</div>

// Option 3: Topic-specific mascot for food lessons
<LessonMascot
  type="topic"
  topicMascot={getTopicMascot(currentTopic)} // Returns 'carrot', 'apple', etc.
  message="Let's learn about vegetables!"
/>
```

### Topic-to-Mascot Mapping

```tsx
// Helper function to get appropriate mascot for lesson topic
function getTopicMascot(topic: string): string {
  const topicMascotMap: Record<string, string> = {
    fruits: 'apple',
    vegetables: 'carrot',
    veggies: 'carrot',
    hydration: 'hydration',
    water: 'hydration',
    exercise: 'fitness',
    sports: 'fitness',
    nutrition: 'professor',
    quiz: 'brain',
    snacks: 'snacks',
    protein: 'professor',
    carbs: 'professor',
  };

  const lowerTopic = topic.toLowerCase();
  for (const [key, mascot] of Object.entries(topicMascotMap)) {
    if (lowerTopic.includes(key)) {
      return mascot;
    }
  }
  return 'professor'; // Default to Professor Bloop
}
```

---

## Part 3: Mascot in Lesson Cards

Add small mascot icons to lesson cards for visual interest:

```tsx
// In the lesson card component
<div className="lesson-card bg-white rounded-2xl border border-gray-200 p-4">
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <h3 className="font-bold text-gray-900">{lesson.title}</h3>
      <p className="text-sm text-gray-500">{lesson.description}</p>
    </div>

    {/* Small topic mascot */}
    <div className="w-12 h-12 flex-shrink-0">
      <img
        src={`/mascots/${getTopicMascot(lesson.topic)}.png`}
        alt=""
        className="w-full h-full object-contain"
      />
    </div>
  </div>
</div>
```

---

## Implementation Checklist

### Setup
- [ ] Copy mascot images from `Mascots/` folder to `client/public/mascots/`
- [ ] Add CSS animations to `index.css` or create `animations.css`
- [ ] Update `tailwind.config.js` with custom animations

### Components
- [ ] Create `FloatingMascot.tsx` component
- [ ] Create `LessonMascot.tsx` component
- [ ] Create `useMascotState` hook for dynamic states

### Dashboard Page
- [ ] Add large floating Oni to Dashboard
- [ ] Implement speech bubble with greetings
- [ ] Add hover/click interactions
- [ ] Add mascot state changes (celebrate, hint, etc.)

### Lessons Page
- [ ] Add Professor Bloop to right sidebar
- [ ] Add mascot tips/hints section
- [ ] Implement topic-specific mascots for different lesson types
- [ ] Add small mascot icons to lesson cards

### Testing
- [ ] Verify all mascot images load correctly
- [ ] Test floating animation performance
- [ ] Test responsive behavior (hide on mobile if needed)
- [ ] Test mascot state changes and speech bubbles

---

## Responsive Behavior

```tsx
// Hide large floating mascot on smaller screens
<div className="hidden lg:block">
  <FloatingMascot ... />
</div>

// Show smaller version on tablets
<div className="hidden md:block lg:hidden">
  <FloatingMascot size="md" ... />
</div>

// On mobile, show mascot inline instead of floating
<div className="block md:hidden">
  <LessonMascot type="professor" size="sm" position="inline" />
</div>
```

---

## File Structure

```
client/
├── public/
│   └── mascots/
│       ├── Oni_the_Orange.png
│       ├── Oni_celebrate.png
│       ├── Oni_groove.png
│       ├── Oni_hint.png
│       ├── Oni_love.png
│       ├── Oni_oops.png
│       ├── Oni_proud.png
│       ├── Oni_sad.png
│       ├── ProfessorBloop.png
│       ├── AppleBuddy.png
│       ├── CaptainCarrot.png
│       ├── HydroHero.png
│       ├── CoachFlex.png
│       ├── BrainyBolt.png
│       ├── DanceStar.png
│       ├── SnackTwins.png
│       └── YumYum.png
├── src/
│   ├── components/
│   │   ├── FloatingMascot.tsx
│   │   └── LessonMascot.tsx
│   ├── hooks/
│   │   └── useMascotState.ts
│   └── styles/
│       └── animations.css
```

---

## Mascot Personality Guide

### Oni the Orange - Main Mascot
- **Personality:** Energetic, encouraging, playful
- **Voice:** "Hey there!", "You've got this!", "Awesome job!"
- **Uses:** Dashboard, general encouragement, celebrations

### Professor Bloop - Teaching Guide
- **Personality:** Wise, patient, supportive
- **Voice:** "Let me explain...", "Here's a tip:", "Great question!"
- **Uses:** Lessons page, teaching moments, hints

### Topic Mascots
- **Captain Carrot:** Brave, adventurous (vegetable lessons)
- **Apple Buddy:** Friendly, sweet (fruit lessons)
- **Hydro Hero:** Cool, refreshing (hydration lessons)
- **Coach Flex:** Motivating, energetic (exercise lessons)
- **Brainy Bolt:** Smart, curious (quizzes, knowledge)
