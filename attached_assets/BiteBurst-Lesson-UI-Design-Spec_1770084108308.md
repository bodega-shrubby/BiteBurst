# BiteBurst Lesson UI/UX Design Specification

## Overview
This document outlines the comprehensive redesign of the BiteBurst lesson experience, focusing on improved visual hierarchy, enhanced engagement/delight, clearer feedback mechanisms, and central mascot integration.

---

## 🎭 Mascot System: Oni the Orange

### Emotional States & Triggers

| State | Image | Trigger | Animation | Message Style |
|-------|-------|---------|-----------|---------------|
| **Thinking** | `Oni_the_orange.png` | Question displayed | Gentle pulse | Curious expression |
| **Celebrate** | `Oni_celebrate.png` | Correct answer | Bounce + sparkles | Excited praise |
| **Hint** | `Oni_hint.png` | After 2nd wrong answer | Glow pulse (blue) | Helpful guidance |
| **Oops** | `Oni_oops.png` | First wrong answer | Wiggle | Encouraging "try again" |
| **Sad** | `Oni_sad.png` | Multiple wrong + low bursts | Subtle sway | Supportive |
| **Proud** | `Oni_proud.png` | Lesson complete | Trophy bounce | Celebratory |
| **Groove** | `Oni_groove.png` | XP milestone reached | Dance animation | Fun celebration |
| **Love** | `Oni_love.png` | Streak maintained | Heart pulse | Appreciation |

### Mascot Placement Rules

**Mobile:**
- Centered above the question
- Size: 96px × 96px (w-24 h-24)
- Maintains visibility during scroll

**Desktop:**
- Main view: Centered above question (same as mobile)
- Right sidebar: Larger companion view (128px × 128px)
- Sidebar mascot provides contextual tips and encouragement

---

## 📱 Screen States & Flows

### 1. Question States

#### Multiple Choice
```
┌─────────────────────────────────┐
│  [X]  ████████░░░░░  ⭐⭐⭐⭐⭐     │  Header
├─────────────────────────────────┤
│            🍊                    │  Mascot (thinking)
│         [Oni_thinking]           │
│                                  │
│   "Which food gives you         │  Question
│    energy to run and play?"     │
│                                  │
│  ┌─────────────────────────┐    │  Options
│  │ 🍎  Apple               │    │  (tap to select)
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 🍕  Pizza        ●      │    │  Selected state
│  └─────────────────────────┘    │  (orange border)
│  ┌─────────────────────────┐    │
│  │ 🍬  Candy               │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │        CHECK            │    │  CTA Button
│  └─────────────────────────┘    │  (enabled when selected)
└─────────────────────────────────┘
```

#### True/False
- Same layout as multiple choice
- Only 2 options: ✅ True / ❌ False
- Larger touch targets for younger users

#### Drag & Drop (NEW)
```
┌─────────────────────────────────┐
│  [X]  ████████░░░░░  ⭐⭐⭐⭐⭐     │
├─────────────────────────────────┤
│            🍊                    │
│       [Oni_happy]                │
│                                  │
│   "Match each food to its       │
│         superpower!"             │
│                                  │
│  ┌─────────────────────────┐    │  Hint bubble
│  │ 💡 Drag or tap each     │    │  (blue background)
│  │    food, then tap its   │    │
│  │    benefit!             │    │
│  └─────────────────────────┘    │
│                                  │
│  Foods:                          │
│  ┌─────┐ ┌─────┐ ┌─────┐       │  Draggable items
│  │🥕   │ │🍌 ✓│ │🥛   │       │  (✓ = placed)
│  └─────┘ └─────┘ └─────┘       │
│                                  │
│  Superpowers:                    │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐    │  Drop zones
│  │    💪 Strong Bones     │    │  (dashed border)
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘    │
│  ┌───────────────────────┐      │  Filled zone
│  │ 🍌 → ⚡ Quick Energy  │      │  (solid green border)
│  └───────────────────────┘      │
│                                  │
│       1 of 3 matched             │  Progress indicator
│                                  │
│  ┌─────────────────────────┐    │
│  │        CHECK            │    │  Disabled until complete
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

#### Fill in the Blank (NEW)
```
┌─────────────────────────────────┐
│  [X]  ████████░░░░░  ⭐⭐⭐⭐⭐     │
├─────────────────────────────────┤
│            🍊                    │
│       [Oni_thinking]             │
│                                  │
│   Complete the sentence:         │
│                                  │
│  ┌─────────────────────────┐    │  Sentence display
│  │ "Your body uses         │    │  (gray background)
│  │  [_energy_] from food   │    │  Blank shows selection
│  │  to grow strong!"       │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │ 📝 Choose the word      │    │
│  │    that fits!           │    │
│  └─────────────────────────┘    │
│                                  │
│   (energy)  (magic)  (sleep)    │  Word pills
│      ●                           │  (orange = selected)
│                                  │
│  ┌─────────────────────────┐    │
│  │        CHECK            │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

#### Matching Pairs (NEW)
```
┌─────────────────────────────────┐
│  [X]  ████████░░░░░  ⭐⭐⭐⭐⭐     │
├─────────────────────────────────┤
│            🍊                    │
│       [Oni_happy]                │
│                                  │
│      "Match the pairs!"          │
│                                  │
│  ┌─────────────────────────┐    │
│  │ 🎯 Tap a food, then     │    │
│  │    tap what it helps!   │    │
│  └─────────────────────────┘    │
│                                  │
│    Foods    │    Benefits       │
│  ┌───────┐  │  ┌───────┐       │
│  │🥕 ●  │──┼──│ 👀    │       │  Line drawn when matched
│  └───────┘  │  └───────┘       │
│  ┌───────┐  │  ┌───────┐       │
│  │🍌 ✓  │══╪══│ ⚡ ✓  │       │  Green = matched
│  └───────┘  │  └───────┘       │
│  ┌───────┐  │  ┌───────┐       │
│  │🥛     │  │  │ 💪    │       │
│  └───────┘  │  └───────┘       │
│                                  │
│   1 of 3 matched                 │
│   Selected: Carrots              │
│                                  │
│  ┌─────────────────────────┐    │
│  │        CHECK            │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

---

### 2. Feedback States

#### Correct Answer
```
┌─────────────────────────────────┐
│  [X]  ████████░░░░░  ⭐⭐⭐⭐⭐     │
├─────────────────────────────────┤
│         ✨ 🍊 ✨                │  Mascot celebrates
│      [Oni_celebrate]             │  with sparkles
│           ⭐                     │
│                                  │
│   "Which one needs water?"       │
│                                  │
│  ┌─────────────────────────┐    │
│  │ ✓  👧 Little Girl       │    │  Correct option
│  └─────────────────────────┘    │  (green border + check)
│                                  │
│  ┌─────────────────────────┐    │  Success message
│  │ 🎉 Correct! Amazing!    │    │  (green background)
│  │                         │    │
│  │ You are alive, so you   │    │
│  │ need water. Teddy bears │    │
│  │ are toys!               │    │
│  └─────────────────────────┘    │
│                                  │
│       ┌──────────────┐          │  XP reward
│       │  +10 XP  ✨  │          │  (animated bounce)
│       └──────────────┘          │
│                                  │
│  ┌─────────────────────────┐    │
│  │    ✓  Nice!             │    │  Success banner
│  └─────────────────────────┘    │  (blue background)
│                                  │
│  ┌─────────────────────────┐    │
│  │       CONTINUE          │    │  Green CTA
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

#### Incorrect + Hint (After 2nd attempt)
```
┌─────────────────────────────────┐
│  [X]  ████████░░░░░  ⭐⭐⭐⭐░     │  Lost 1 burst
├─────────────────────────────────┤
│            🍊                    │
│        [Oni_hint]                │  Blue glow pulse
│           💡                     │
│                                  │
│   "A robot needs to eat an      │
│    apple to get energy."        │
│                                  │
│  ┌─────────────────────────┐    │  Hint bubble
│  │ 💡 Think about it...    │    │  (blue background)
│  │                         │    │
│  │ Does a robot have a     │    │
│  │ tummy to digest food? 🤖│    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │ ✗  ✅ True              │    │  Wrong selection
│  └─────────────────────────┘    │  (red border + X)
│  ┌─────────────────────────┐    │
│  │    ❌ False             │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │      TRY AGAIN          │    │  Orange CTA
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

#### Try Again (After 1st attempt)
```
┌─────────────────────────────────┐
│  [X]  ████████░░░░░  ⭐⭐⭐░░     │  Bursts reduced
├─────────────────────────────────┤
│            🍊                    │
│        [Oni_oops]                │  Wiggle animation
│                                  │
│  ┌─────────────────────────┐    │  Encouragement
│  │ 🤔 Not quite!           │    │  (light red bg)
│  │                         │    │
│  │ Robots plug into the    │    │
│  │ wall. You plug into     │    │
│  │ food!                   │    │
│  └─────────────────────────┘    │
│                                  │
│   "A robot needs to eat an      │
│    apple to get energy."        │
│                                  │
│  ┌─────────────────────────┐    │
│  │    ✅ True              │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │    ❌ False             │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │        CHECK            │    │  Disabled
│  └─────────────────────────┘    │
│                                  │
│  Select a new answer to continue │
└─────────────────────────────────┘
```

#### Learn Card (After 3rd attempt)
```
┌─────────────────────────────────┐
│  [X]  ████████░░░░░  ⭐⭐░░░     │
├─────────────────────────────────┤
│            🍊                    │
│       [Oni_happy]                │  Supportive
│                                  │
│  ┌─────────────────────────┐    │  Learn card
│  │ 📚 Let's Learn!         │    │  (indigo/blue bg)
│  │                         │    │
│  │ 🤖 Robots get energy    │    │
│  │    from electricity -   │    │
│  │    they plug into walls!│    │
│  │                         │    │
│  │ 👧 Humans get energy    │    │
│  │    from food - we eat   │    │
│  │    to fuel our bodies!  │    │
│  │                         │    │
│  │ 🍎 When you eat healthy │    │
│  │    foods, your body     │    │
│  │    turns them into      │    │
│  │    energy!              │    │
│  └─────────────────────────┘    │
│                                  │
│  Don't worry - everyone learns  │
│  differently! Let's move on. 💪 │
│                                  │
│       ┌──────────────┐          │
│       │   +5 XP  ✨  │          │  Reduced XP
│       └──────────────┘          │
│                                  │
│  ┌─────────────────────────┐    │
│  │       CONTINUE          │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

---

### 3. Lesson Complete
```
┌─────────────────────────────────┐
│                                  │
│            🎉                    │  Big celebration emoji
│                                  │
│      LESSON COMPLETE!            │
│                                  │
│   Amazing work, Nutrition        │
│        Champion!                 │
│                                  │
│         ✨ 🍊 ✨                │
│      [Oni_proud] 🏆             │  Trophy mascot
│                                  │
│  ┌─────┐  ┌─────┐  ┌─────┐     │  Stats grid
│  │ ⚡  │  │ 🎯  │  │ 🔥  │     │
│  │ 85  │  │ 90% │  │  5  │     │
│  │ XP  │  │ Acc │  │ Day │     │
│  └─────┘  └─────┘  └─────┘     │
│                                  │
│  ┌─────────────────────────┐    │  Achievement
│  │ 🏆 Achievement Unlocked!│    │  (gold gradient)
│  │    Energy Expert Badge  │    │
│  └─────────────────────────┘    │
│                                  │
│  ┌─────────────────────────┐    │
│  │   CONTINUE LEARNING     │    │  Green CTA
│  └─────────────────────────┘    │
│                                  │
│    Share Your Achievement 📤    │  Share link
│                                  │
└─────────────────────────────────┘
```

---

## 🖥️ Desktop Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌─────────────┐  ┌────────────────────────────┐  ┌───────────────┐ │
│  │             │  │                            │  │               │ │
│  │  🍎 BiteBurst│  │     [LESSON CONTENT]      │  │    🍊         │ │
│  │             │  │                            │  │  [Oni_happy]  │ │
│  │  📚 Current │  │   Same layout as mobile    │  │               │ │
│  │     Lesson  │  │   but max-width: 500px     │  │ "Oni is here │ │
│  │             │  │   and centered             │  │  to help!"   │ │
│  │  🏠 Dashboard│  │                            │  │               │ │
│  │             │  │                            │  │ ┌───────────┐ │ │
│  │  🏆 Achieve-│  │                            │  │ │ 💡 Tip:   │ │ │
│  │     ments   │  │                            │  │ │ Take your │ │ │
│  │             │  │                            │  │ │ time!     │ │ │
│  │  ⚙️ Settings│  │                            │  │ └───────────┘ │ │
│  │             │  │                            │  │               │ │
│  │             │  │                            │  │ Progress:     │ │
│  │             │  │                            │  │ ████████░░    │ │
│  │             │  │                            │  │ 3 of 5 done   │ │
│  │             │  │                            │  │               │ │
│  └─────────────┘  └────────────────────────────┘  └───────────────┘ │
│    (264px)              (flexible)                    (288px)       │
│   Left Sidebar        Main Content              Right Companion     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Desktop-Specific Features

1. **Left Sidebar (264px)**
   - BiteBurst branding
   - Navigation to other app sections
   - Current lesson highlighted

2. **Main Content (flexible, max 500px)**
   - Identical layout to mobile
   - Centered for comfortable reading
   - Maintains mobile proportions

3. **Right Companion Panel (288px)**
   - Larger mascot display
   - Contextual tips that change with state
   - Daily progress tracker
   - Achievement previews

---

## 🎨 Color System

### Primary Palette
| Name | Hex | Usage |
|------|-----|-------|
| Orange Primary | `#FF7A00` | Brand, CTAs, selected states |
| Orange Hover | `#FF8D26` | Button hover states |
| Orange Light | `#FFD5B0` | Disabled backgrounds |

### Feedback Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success Green | `#22C55E` | Correct answers |
| Success Light | `#DCFCE7` | Success backgrounds |
| Error Red | `#EF4444` | Incorrect answers |
| Error Light | `#FEE2E2` | Error backgrounds |
| Hint Blue | `#3B82F6` | Hints, tips |
| Hint Light | `#DBEAFE` | Hint backgrounds |
| Learn Indigo | `#6366F1` | Learn cards |
| Learn Light | `#E0E7FF` | Learn card backgrounds |

### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| Black | `#111111` | Headings |
| Gray 900 | `#1E1E1E` | Body text |
| Gray 600 | `#6B7280` | Secondary text |
| Gray 200 | `#EEEEEE` | Borders, dividers |
| White | `#FFFFFF` | Backgrounds, cards |

---

## ✨ Animation Specifications

### Mascot Animations

| Animation | CSS Class | Duration | Easing | Description |
|-----------|-----------|----------|--------|-------------|
| Bounce | `animate-bounce` | 1s | ease-in-out | Success celebration |
| Pulse | `animate-pulse` | 2s | ease-in-out | Thinking, hints |
| Wiggle | `animate-wiggle` | 0.5s | ease-out | Oops/mistake |
| Sparkle | `animate-ping` | 1s | ease-out | Celebration accents |

### UI Animations

| Element | Animation | Trigger |
|---------|-----------|---------|
| XP Badge | Bounce + scale | On display |
| Option Select | Border + scale(1.02) | On tap |
| Success Banner | Slide up | After correct |
| Bursts | Pulse orange → gray | On loss |
| Progress Bar | Width transition | On progress |

### Confetti System
- Trigger: Lesson complete, achievements
- Duration: 2-3 seconds
- Particles: Stars, sparkles, food emojis
- Colors: Orange, yellow, green, blue

---

## 📐 Spacing & Typography

### Spacing Scale
```
4px   - Tight (icon gaps)
8px   - Small (element gaps)
12px  - Medium (option gaps)
16px  - Standard (section padding)
24px  - Large (card padding)
32px  - XL (major sections)
```

### Typography
```
Headings:    20px / Bold / Gray-900
Questions:   18px / Semibold / Gray-800
Body:        16px / Regular / Gray-700
Secondary:   14px / Regular / Gray-500
Small:       12px / Regular / Gray-400
```

### Border Radius
```
Small:   8px  (chips, pills)
Medium:  16px (cards, options)
Large:   24px (modals, banners)
Full:    9999px (buttons, avatars)
```

---

## 🔄 State Machine Flow

```
START
  │
  ▼
┌─────────────┐
│  ASKING     │ ◄──────────────────────────────────┐
│  (Question) │                                    │
└──────┬──────┘                                    │
       │                                           │
       │ User submits answer                       │
       ▼                                           │
   ┌───────┐                                       │
   │Correct│──YES──► SUCCESS ──► CONTINUE ─────────┤
   └───┬───┘         (XP: First try bonus)         │
       │                                           │
       NO (1st attempt)                            │
       │                                           │
       ▼                                           │
┌─────────────┐                                    │
│ INCORRECT   │ ──► TRY AGAIN ─────────────────────┤
│ (Oops msg)  │     (User selects new answer)      │
└──────┬──────┘                                    │
       │                                           │
       │ NO (2nd attempt)                          │
       ▼                                           │
┌─────────────┐                                    │
│ INCORRECT   │ ──► TRY AGAIN ─────────────────────┤
│ (With Hint) │     (User selects new answer)      │
└──────┬──────┘                                    │
       │                                           │
       │ NO (3rd attempt)                          │
       ▼                                           │
┌─────────────┐                                    │
│ LEARN CARD  │ ──► CONTINUE ──────────────────────┘
│ (Education) │     (XP: Reduced amount)
└─────────────┘

After all steps:
       │
       ▼
┌─────────────┐
│  COMPLETE   │
│ (Celebrate) │
└─────────────┘
```

---

## 📱 Touch Target Guidelines

- Minimum touch target: 44px × 44px
- Option buttons: Full width, 56px min height
- Close button: 44px × 44px
- Bursts: 20px each with 2px gap (orange star icons)

---

## ♿ Accessibility

### Requirements
- All interactive elements keyboard accessible
- Focus indicators visible (2px orange outline)
- Color alone doesn't convey information
- Screen reader announcements for state changes
- Reduced motion support (prefers-reduced-motion)

### ARIA Labels
- Questions: `role="heading" aria-level="2"`
- Options: `role="button" aria-pressed="true/false"`
- Progress: `role="progressbar" aria-valuenow`
- Bursts: `aria-label="X bursts remaining"`
- Feedback: `role="alert" aria-live="polite"`

---

## 🚀 Implementation Priority

### Phase 1: Core Feedback Enhancement
1. Update `LessonIncorrect` with hint display
2. Add mascot state switching in `LessonPlayer`
3. Enhance `LessonSuccess` celebration

### Phase 2: New Question Types
1. Implement Drag & Drop component
2. Implement Fill-in-the-Blank component
3. Enhance Matching pairs with visual connections

### Phase 3: Desktop Experience
1. Add responsive layout wrapper
2. Implement left sidebar navigation
3. Add right companion panel

### Phase 4: Polish & Animation
1. Add confetti system
2. Implement XP animation
3. Add mascot emotion transitions
