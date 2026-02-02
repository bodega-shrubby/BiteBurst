# BiteBurst Success & Feedback Screen Redesign - Replit Prompt

## Overview
Redesign the Success.tsx and Feedback.tsx pages to match the approved wireframes EXACTLY. The design should create a celebratory, Duolingo-inspired experience for children (ages 6-14).

---

## CRITICAL: Must Match These Wireframe Designs Exactly

### Key Design Elements (DO NOT DEVIATE):

1. **Oni the Orange mascot** at the top (celebrating) - NOT any other mascot
2. **"What you logged" card** with MULTIPLE food/activity emojis, each with:
   - Individual bouncing emoji cards
   - Labels underneath each emoji (e.g., "Apple", "Carrots", "Milk")
   - Gradient backgrounds on each card
3. **XP Card** with glowing animation and animated progress bar
4. **Streak badge** centered with double fire emojis
5. **Secondary mascot speech bubble** (Captain Carrot for food / Coach Flex for activity)
   - Mini avatar ABOVE the speech bubble
   - Personalized feedback message inside bubble

---

## File Changes Required

### 1. Update `client/src/pages/Feedback.tsx`

The Feedback page needs these specific changes to match the wireframes:

#### A. Import the correct mascots:
```tsx
import oniCelebrateImage from '@assets/Mascots/Oni_celebrate.png';
import oniProudImage from '@assets/Mascots/Oni_proud.png';
import captainCarrotImage from '@assets/Mascots/CaptainCarrot.png';
import coachFlexImage from '@assets/Mascots/CoachFlex.png';
```

#### B. Theme configuration (already correct in code):
```tsx
const isActivity = (logData as any)?.type === 'activity';

const theme = isActivity ? {
  headerBg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  cardBorder: 'border-blue-200',
  accentBg: 'from-blue-50 to-indigo-50',
  accentColor: 'text-blue-500',
  // ... etc
} : {
  headerBg: 'bg-gradient-to-r from-orange-500 to-orange-600',
  // ... etc
};
```

#### C. FIX THE "What you logged" CARD - Must show labels under each emoji:

**CURRENT CODE (WRONG):**
```tsx
<div className="flex flex-wrap gap-3 justify-center">
  {logData.content.emojis.map((emoji: string, index: number) => (
    <div key={index} className="text-center">
      <div className={`w-16 h-16 ... rounded-xl flex items-center justify-center border-2`}>
        <span className="text-3xl">{emoji}</span>
      </div>
    </div>
  ))}
</div>
```

**CORRECT CODE (MATCH WIREFRAME):**
```tsx
<div className="flex flex-wrap gap-4 justify-center">
  {logData.content.emojis.map((emoji: string, index: number) => {
    // Get label for emoji
    const emojiLabels: Record<string, string> = {
      '🍎': 'Apple', '🥕': 'Carrots', '🥛': 'Milk', '🥪': 'Sandwich',
      '🍌': 'Banana', '🥦': 'Broccoli', '🍊': 'Orange', '🥗': 'Salad',
      '⚽': 'Soccer', '🏃': 'Running', '🚴': 'Cycling', '🏊': 'Swimming',
      '🏀': 'Basketball', '🎾': 'Tennis', '💃': 'Dancing', '🧘': 'Yoga'
    };
    const label = emojiLabels[emoji] || 'Food';

    return (
      <div key={index} className="text-center bb-emoji-bounce" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className={`w-16 h-16 bg-gradient-to-br ${isActivity ? 'from-blue-50 to-blue-100 border-blue-300' : 'from-orange-50 to-orange-100 border-orange-300'} rounded-2xl flex items-center justify-center border-2 shadow-md`}>
          <span className="text-4xl">{emoji}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1.5 font-medium">{label}</p>
      </div>
    );
  })}
</div>
```

#### D. FIX THE SPEECH BUBBLE SECTION - Mini avatar must be ABOVE bubble:

**CORRECT LAYOUT (MATCH WIREFRAME):**
```tsx
{/* AI Message Card - Captain Carrot / Coach Flex */}
<div className="bb-slide-up" style={{ animationDelay: '0.9s' }}>
  {/* Mini mascot avatar - CENTERED ABOVE BUBBLE */}
  <div className="flex justify-center mb-2">
    <div className={`w-14 h-14 ${isActivity ? 'bg-gradient-to-br from-blue-400 to-blue-500' : 'bg-gradient-to-br from-orange-400 to-orange-500'} rounded-full border-4 border-white shadow-lg overflow-hidden`}>
      <img
        src={tipMascot}
        alt={tipName}
        className="w-full h-full object-cover"
      />
    </div>
  </div>

  {/* Speech bubble with pointer pointing UP to mascot */}
  <div className={`relative bg-white rounded-3xl border-2 ${isActivity ? 'border-blue-100' : 'border-orange-100'} shadow-lg p-5 bb-bubble-appear`}>
    {/* Triangle pointer pointing UP */}
    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white"></div>
    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] ${isActivity ? 'border-b-blue-100' : 'border-b-orange-100'}`}></div>

    <h3 className="font-bold text-gray-800 mb-3 text-center text-lg">
      {tipName} says:
    </h3>

    {isLoading ? (
      <div className="text-center text-gray-500 py-4">
        <div className={`animate-spin w-6 h-6 border-3 ${isActivity ? 'border-blue-500' : 'border-orange-500'} border-t-transparent rounded-full mx-auto mb-2`}></div>
        <p className="text-sm">Getting your personalized feedback...</p>
      </div>
    ) : feedback ? (
      <div>
        <p className="text-gray-700 text-center leading-relaxed">
          {typewriterText || feedback}
          {isTyping && <span className="inline-block w-0.5 h-5 bg-gray-700 ml-0.5 animate-pulse"></span>}
        </p>
        <p className="text-center mt-3">
          <span className={`font-bold ${isActivity ? 'text-blue-500' : 'text-orange-500'}`}>
            {isActivity ? 'Keep it up, champion!' : 'SUPER COMBO!'}
          </span> {isActivity ? '🏆' : '⭐'}
        </p>
      </div>
    ) : (
      <div>
        <p className="text-gray-700 text-center leading-relaxed">
          {isActivity
            ? "Great job staying active! Exercise makes you stronger and happier!"
            : "Wow! Those foods give you energy, help your eyes, and make your bones strong!"}
        </p>
        <p className="text-center mt-3">
          <span className={`font-bold ${isActivity ? 'text-blue-500' : 'text-orange-500'}`}>
            {isActivity ? 'Keep it up, champion!' : 'SUPER COMBO!'}
          </span> {isActivity ? '🏆' : '⭐'}
        </p>
      </div>
    )}
  </div>
</div>
```

#### E. XP CARD - Must have glowing animation:

```tsx
{/* XP Card */}
<div className={`bg-gradient-to-br ${theme.accentBg} rounded-3xl border-2 ${theme.cardBorder} shadow-xl p-5 bb-slide-up`} style={{ animationDelay: '0.5s' }}>
  <div className="text-center">
    <div ref={xpValueRef} className={`text-4xl font-black ${theme.accentColor} bb-xp-glow mb-1`}>
      +{awardXP} XP
    </div>
    <p className="text-gray-600 text-sm mb-4">Experience points earned!</p>

    {/* Progress Bar */}
    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
      <div
        ref={xpBarRef}
        className={`absolute inset-y-0 left-0 ${isActivity ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'} rounded-full transition-all duration-500`}
        style={{ width: '0%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
    </div>

    {/* Level indicators */}
    <div className="flex justify-between text-sm">
      <span ref={levelFromRef} className={`${isActivity ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-orange-100 text-orange-600 border-orange-200'} px-3 py-1 rounded-full font-bold border`}>
        {formatLevel(levelFromTotal(currentTotalXP).level + 1)}
      </span>
      <span ref={levelToRef} className={`${isActivity ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-orange-100 text-orange-600 border-orange-200'} px-3 py-1 rounded-full font-bold border`}>
        {formatLevel(levelFromTotal(currentTotalXP).level + 2)}
      </span>
    </div>
  </div>
</div>
```

#### F. WEEKLY PROGRESS CARD (Activity Only):

```tsx
{isActivity && (
  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border border-green-200 p-4 bb-slide-up" style={{ animationDelay: '0.6s' }}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎯</span>
        <div>
          <p className="font-bold text-gray-800 text-sm">Weekly Goal Progress</p>
          <p className="text-xs text-gray-500">{weeklyMinutes} / {weeklyGoal} minutes</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-green-600 font-black text-lg">{Math.round((weeklyMinutes / weeklyGoal) * 100)}%</p>
        <p className="text-xs text-gray-500">Keep going!</p>
      </div>
    </div>
    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full"
        style={{ width: `${Math.min((weeklyMinutes / weeklyGoal) * 100, 100)}%` }}
      />
    </div>
  </div>
)}
```

#### G. STREAK BADGE - Centered with double fire emojis:

```tsx
{/* Streak Badge */}
<div className="flex justify-center bb-slide-up" style={{ animationDelay: '0.7s' }}>
  <div className={`bg-gradient-to-r ${theme.streakBg} text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2`}>
    <span className="text-xl bb-flame-pulse">🔥</span>
    <span className="font-bold">{(user as any)?.streak || 5}-day streak!</span>
    <span className="text-xl bb-flame-pulse">🔥</span>
  </div>
</div>
```

---

### 2. CSS Animations in `client/src/styles/tokens.css`

Add these animations (some may already exist - check first):

```css
/* Emoji bounce with stagger support */
@keyframes bb-emoji-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.bb-emoji-bounce {
  animation: bb-emoji-bounce 0.6s ease-in-out infinite;
}

/* XP glow effect */
@keyframes bb-xp-glow {
  0%, 100% { text-shadow: 0 0 10px currentColor; }
  50% { text-shadow: 0 0 25px currentColor, 0 0 35px currentColor; }
}

.bb-xp-glow {
  animation: bb-xp-glow 1s ease-in-out infinite;
}

/* Flame pulse for streak badge */
@keyframes bb-flame-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.bb-flame-pulse {
  animation: bb-flame-pulse 0.5s ease-in-out infinite;
}

/* Slide up animation */
@keyframes bb-slide-up {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.bb-slide-up {
  animation: bb-slide-up 0.5s ease-out forwards;
}

/* Bubble appear */
@keyframes bb-bubble-appear {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.bb-bubble-appear {
  animation: bb-bubble-appear 0.4s ease-out forwards;
}

/* Star float animation */
@keyframes bb-star-float {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) rotate(180deg); opacity: 0; }
}

.bb-star-float {
  animation: bb-star-float 2s ease-out infinite;
}
```

---

### 3. Mascot Image Paths (use these exactly)

```
@assets/Mascots/Oni_celebrate.png    ← Main celebration (food)
@assets/Mascots/Oni_proud.png        ← Main celebration (activity - more energetic)
@assets/Mascots/CaptainCarrot.png    ← Food tips mascot
@assets/Mascots/CoachFlex.png        ← Activity tips mascot
```

---

## Complete Wireframe Reference

### Food Log Success Screen (Mobile):
```
┌─────────────────────────────────────┐
│ ← [orange header] AMAZING! 🎉  🔥5 │
├─────────────────────────────────────┤
│         ⭐  ✨  ⭐                   │
│    [ONI THE ORANGE BOUNCING]        │
│         🌟  ⭐                       │
│                                     │
│    "Awesome meal choice! 🍊"        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     What you logged:        │   │
│  │  ┌───┐  ┌───┐  ┌───┐       │   │
│  │  │🍎│  │🥕│  │🥛│          │   │
│  │  └───┘  └───┘  └───┘       │   │
│  │  Apple  Carrots  Milk       │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      +25 XP (glowing)       │   │
│  │  ████████████░░░░░░░░░░     │   │
│  │  [Lv 3]            [Lv 4]   │   │
│  └─────────────────────────────┘   │
│                                     │
│      🔥 5-day streak! 🔥           │
│                                     │
│         (🥕 avatar)                 │
│  ┌─────────────────────────────┐   │
│  │   Captain Carrot says:      │   │
│  │   "Wow! Apples give you     │   │
│  │   energy..." SUPER COMBO! ⭐ │   │
│  └─────────────────────────────┘   │
│                                     │
│  [═══ LOG ANOTHER MEAL ═══]        │
│  [ BACK TO DASHBOARD ]              │
└─────────────────────────────────────┘
```

### Activity Log Success Screen (Mobile):
Same layout but with:
- Blue/indigo gradient header
- "YOU CRUSHED IT! 💪" header text
- "Awesome workout! 💪" title
- Blue themed cards and borders
- Coach Flex instead of Captain Carrot
- "Keep it up, champion! 🏆" instead of "SUPER COMBO! ⭐"
- Activity emojis (⚽, 🏃, etc.) with duration/mood pills
- Weekly Progress card (shows minutes/goal progress)

---

## Checklist Before Submitting

- [ ] Oni the Orange (celebrate pose) is the main mascot at top
- [ ] Food emojis have LABELS underneath (Apple, Carrots, etc.)
- [ ] Each emoji card has gradient background and bounces
- [ ] XP number has glowing animation
- [ ] Progress bar animates when filling
- [ ] Streak badge has double fire emojis that pulse
- [ ] Captain Carrot mini avatar is ABOVE speech bubble (food)
- [ ] Coach Flex mini avatar is ABOVE speech bubble (activity)
- [ ] Speech bubble has triangle pointer pointing UP
- [ ] Blue theme for activity, orange theme for food
- [ ] Weekly Progress card appears for activity logs only (shows minutes/goal)
- [ ] "SUPER COMBO! ⭐" text appears in food feedback
- [ ] "Keep it up, champion! 🏆" text appears in activity feedback
- [ ] Confetti burst on page load (themed colors)
- [ ] All animations respect prefers-reduced-motion

---

## Quick Copy-Paste Fix for renderContent()

Replace the entire `renderContent()` function in Feedback.tsx with this:

```tsx
const renderContent = () => {
  const emojiLabels: Record<string, string> = {
    '🍎': 'Apple', '🥕': 'Carrots', '🥛': 'Milk', '🥪': 'Sandwich',
    '🍌': 'Banana', '🥦': 'Broccoli', '🍊': 'Orange', '🥗': 'Salad',
    '🥚': 'Eggs', '🍞': 'Bread', '🧀': 'Cheese', '🍗': 'Chicken',
    '🥑': 'Avocado', '🍇': 'Grapes', '🍓': 'Strawberry', '🥜': 'Nuts',
    '⚽': 'Soccer', '🏃': 'Running', '🚴': 'Cycling', '🏊': 'Swimming',
    '🏀': 'Basketball', '🎾': 'Tennis', '💃': 'Dancing', '🧘': 'Yoga',
    '🤸': 'Gymnastics', '⛹️': 'Sports', '🚶': 'Walking', '🧗': 'Climbing'
  };

  if (logData.entryMethod === 'emoji' && logData.content?.emojis) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {logData.content.emojis.map((emoji: string, index: number) => {
            const label = emojiLabels[emoji] || (isActivity ? 'Activity' : 'Food');
            return (
              <div
                key={index}
                className="text-center bb-emoji-bounce"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${isActivity ? 'from-blue-50 to-blue-100 border-blue-300' : 'from-orange-50 to-orange-100 border-orange-300'} rounded-2xl flex items-center justify-center border-2 shadow-md`}>
                  <span className="text-4xl">{emoji}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 font-medium">{label}</p>
              </div>
            );
          })}
        </div>

        {isActivity && (
          <div className="flex justify-center gap-3 pt-2">
            {logData.durationMin && (
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm">
                ⏱️ {logData.durationMin} min
              </span>
            )}
            {logData.mood && (
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm">
                😃 {logData.mood === 'happy' ? 'Felt great!' : logData.mood === 'ok' ? 'Okay' : 'Tired'}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  if (logData.entryMethod === 'text' && logData.content?.description) {
    return (
      <div className={`bg-gradient-to-br ${isActivity ? 'from-blue-50 to-blue-100 border-blue-300' : 'from-orange-50 to-orange-100 border-orange-300'} rounded-2xl px-6 py-4 border-2 text-center shadow-md`}>
        <span className="text-2xl mb-2 block">{isActivity ? '🏃' : '📝'}</span>
        <p className="text-lg font-medium text-gray-800">"{logData.content.description}"</p>
      </div>
    );
  }

  if (logData.entryMethod === 'photo') {
    return (
      <div className="text-center">
        {logData.content?.photoUrl ? (
          <img
            src={logData.content.photoUrl}
            alt="Logged photo"
            className={`w-32 h-32 object-cover rounded-2xl shadow-lg border-2 ${isActivity ? 'border-blue-300' : 'border-orange-300'} mx-auto`}
          />
        ) : (
          <div className={`w-32 h-32 bg-gradient-to-br ${isActivity ? 'from-blue-50 to-blue-100 border-blue-300' : 'from-orange-50 to-orange-100 border-orange-300'} rounded-2xl mx-auto flex items-center justify-center border-2 shadow-lg`}>
            <span className="text-4xl">📷</span>
          </div>
        )}
        <p className="text-sm text-gray-600 mt-2 font-medium">Photo logged!</p>
      </div>
    );
  }

  return null;
};
```

This will make the Feedback page match the wireframes EXACTLY.
