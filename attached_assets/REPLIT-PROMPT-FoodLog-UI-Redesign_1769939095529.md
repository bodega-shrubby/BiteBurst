# BiteBurst Food Log UI Redesign - Replit Implementation Prompt

## Overview

Redesign the Food Log screens to improve the UI with a cleaner, more kid-friendly design inspired by Duolingo and popular children's apps. The app is optimized for **iPad** (landscape orientation).

**Reference Wireframe:** See `biteburst-food-log-ipad-final.html` for the visual design.

---

## Design System

### Colors

```css
/* Background */
--bg-primary: #F5F5F7;        /* Light gray page background */
--bg-white: #FFFFFF;          /* Card backgrounds */

/* Text */
--text-primary: #1C1C1E;      /* Main text - near black */
--text-secondary: #8E8E93;    /* Secondary/muted text */
--text-placeholder: #C7C7CC;  /* Input placeholders */

/* Borders */
--border-light: #E5E5EA;      /* Subtle borders */

/* Accent Colors - Meal Types */
--breakfast-accent: #FF9500;  /* Orange */
--lunch-accent: #34C759;      /* Green */
--dinner-accent: #AF52DE;     /* Purple */
--snack-accent: #007AFF;      /* Blue */

/* Accent Colors - Food Categories */
--fruits-accent: #FF3B30;     /* Red */
--snacks-accent: #FFCC00;     /* Yellow */
--veggies-accent: #34C759;    /* Green */
--drinks-accent: #007AFF;     /* Blue */
--bread-accent: #FF9500;      /* Orange */
--dairy-accent: #AF52DE;      /* Purple */

/* UI Colors */
--success: #34C759;           /* Green - selected states, badges */
--primary-action: #34C759;    /* Green - primary buttons */
--secondary-action: #FF6B35;  /* Orange - secondary buttons, links */
--header-gradient-start: #FF6B35;
--header-gradient-end: #FF8F5C;
```

### Typography

- **Headings:** System font, 800 weight (extra bold)
- **Body:** System font, 600-700 weight
- **Small text:** System font, 600 weight

### Card Style (Duolingo-inspired)

All cards follow this pattern:
- **Background:** Pure white (`#FFFFFF`)
- **Border-radius:** 18-24px
- **Shadow:** `0 2px 8px rgba(0,0,0,0.08)` (subtle)
- **Left border:** 5-6px solid accent color (color-coded by type)
- **No gradient backgrounds on cards**

---

## Screen 1: Meal Type Selection

### Component: `MealTypeScreen.tsx`

### Layout
- **Grid:** 2x2 square cards, centered on screen
- **Max width:** 560px
- **Gap:** 24px between cards
- **Cards are square** (use `aspect-ratio: 1`)

### Meal Cards

Each card contains:
1. **Emoji** (72px) - The visual hero
2. **Meal name** (24px, bold)
3. **Time range** (15px, gray)

**Meal Types & Emojis:**
| Meal | Emoji | Time | Accent Color |
|------|-------|------|--------------|
| Breakfast | 🥞 | 6am - 10am | Orange `#FF9500` |
| Lunch | 🥪 | 11am - 2pm | Green `#34C759` |
| Dinner | 🍝 | 5pm - 9pm | Purple `#AF52DE` |
| Snack | 🍎 | Anytime! | Blue `#007AFF` |

### Card Styling

```css
.meal-card {
  background: white;
  border-radius: 24px;
  border-left: 6px solid [ACCENT_COLOR];
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.meal-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.meal-card:active {
  transform: scale(0.98);
}
```

### "NOW!" Badge

- Show on the recommended meal based on current time
- Position: absolute, top-right corner (`top: -12px, right: -12px`)
- Background: `#34C759` (green)
- Pulse animation
- Text: "NOW!" (13px, 800 weight)

### Skip Link

Below the grid:
- Text: "Not sure which meal?"
- Link: "Just log food without meal type"
- Color: `#FF6B35` (orange)

---

## Screen 2: Category Selection

### Component: `CategoryScreen.tsx`

### Layout
- **Grid:** 3x2 cards
- **Max width:** 640px
- **Gap:** 20px

### Meal Summary Card

Show at top when items are selected:
- White background with orange left border (`#FF9500`)
- Contains:
  - Title: "✨ Your [Meal Name]"
  - Selected items as pills (emoji + name)
  - Balance indicator showing represented categories
  - "Balanced!" badge (green) when 3+ categories selected

### Category Cards

**Categories & Emojis:**
| Category | Emoji | Accent Color |
|----------|-------|--------------|
| Fruits | 🍎 | Red `#FF3B30` |
| Snacks | 🧀 | Yellow `#FFCC00` |
| Veggies | 🥦 | Green `#34C759` |
| Drinks | 💧 | Blue `#007AFF` |
| Bread & Grains | 🍞 | Orange `#FF9500` |
| Dairy | 🥛 | Purple `#AF52DE` |

### Card Styling

```css
.category-card {
  background: white;
  border-radius: 18px;
  border-left: 5px solid [ACCENT_COLOR];
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 24px 16px;
  text-align: center;
}
```

### Item Count Badge

- Show when items selected from category
- Position: absolute, top-right (`top: -8px, right: -8px`)
- Green circle with white border
- Display count number

### "Type what you ate" Button

- Dashed border style
- Icon: 💬
- Located below category grid

### Bottom Bar

- Fixed at bottom
- "Done with [Meal]" button (green, right-aligned)

---

## Screen 3: Food Item Selection

### Component: `ItemSelectionScreen.tsx`

### Layout
- **Grid:** 6 columns
- **Max width:** 720px
- **Gap:** 16px

### Search Bar

- Simple text input (no camera button)
- Placeholder: "Search [category]..."
- Full width up to 480px, centered
- White background with subtle shadow
- Orange focus ring

### Item Count

- Text: "Tap to select • **X items** selected"
- Centered above grid
- Count number in green

### Food Item Cards

```css
.food-item {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.food-item.selected {
  background: #E8FAE8;  /* Light green */
  box-shadow: 0 0 0 3px #34C759;  /* Green ring */
}
```

### Selection Checkmark

- Appears when item is selected
- Green circle with white checkmark
- Position: top-right corner
- Animate in with scale/pop effect

### Bottom Bar

Contains:
1. **Left:** Summary showing selected items as pills
2. **Right:** Two buttons
   - "Add More" (secondary, outlined orange)
   - "Done with [Meal]" (primary, green filled)

---

## Apple Buddy Mascot

### Component: `AppleBuddyMascot.tsx` (new component)

Apple Buddy is the app's friendly mascot - a red apple character that provides tips and encouragement.

### Positioning
- Fixed position, bottom-right corner
- Floats with gentle up/down animation

### Visual
- 72px red apple emoji (🍎) in a gradient circle
- Gradient: `#FF6B6B` to `#EE5253`
- White border, soft shadow
- Label "Apple Buddy" below

### Tip Bubble

- White speech bubble above the mascot
- Shows contextual tips based on current screen
- Header: "💡 Tip from Apple Buddy!"
- Close button (×) in top-right
- Auto-hides after 10 seconds
- User can tap Apple Buddy to show/hide

### Tips by Screen

```javascript
const APPLE_BUDDY_TIPS = {
  mealType: "Logging meals helps you track your healthy eating journey! 🌟",
  categorySelection: "Try to eat from different food groups for a balanced meal! 🌈",
  fruits: "Fruits are packed with vitamins to keep you healthy and strong! 💪",
  veggies: "Veggies make you grow strong and give you superpowers! 🦸",
  dairy: "Dairy builds super strong bones! 🦴",
  bread: "Grains give you energy to play and learn! ⚡",
  drinks: "Water is the best drink for your body! 💧",
  snacks: "Healthy snacks give you power between meals! 🔋"
};
```

---

## Header Component

### Consistent across all screens

```jsx
<header className="header">
  <div className="header-left">
    <button className="back-btn" onClick={onBack}>←</button>
    <div className="header-text">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  </div>
  <div className="stats-row">
    <div className="stat-pill streak">🔥 {streak}</div>
    <div className="stat-pill xp">⭐ {totalXP}</div>
  </div>
</header>
```

### Styling

- Gradient background: orange (`#FF6B35` to `#FF8F5C`)
- Stat pills with gradient backgrounds
- Back button: white/transparent with rounded corners

---

## Breadcrumb Component

### Show on screens 2 and 3

Format: `Log Food › [Meal Type]` or `[Meal Type] › [Category]`

- Background: white
- Border-bottom: 1px solid `#E5E5EA`
- Active item: orange color
- Current item: bold, dark

---

## Animations

### Card Hover
```css
transform: translateY(-4px) to translateY(-6px);
box-shadow: increase intensity;
transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### Card Press
```css
transform: scale(0.98);
```

### Selection Checkmark
```css
@keyframes pop {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}
```

### Apple Buddy Float
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### NOW Badge Pulse
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

## Implementation Checklist

### Files to Modify:
- [ ] `client/src/components/food-log/MealTypeScreen.tsx` - 2x2 grid, new card styling
- [ ] `client/src/components/food-log/CategoryScreen.tsx` - 3x2 grid, new card styling
- [ ] `client/src/components/food-log/ItemSelectionScreen.tsx` - 6-column grid, remove XP display
- [ ] `client/src/components/food-log/MealSummaryCard.tsx` - Update styling
- [ ] `client/src/components/food-log/FoodLogBreadcrumb.tsx` - Update styling

### New Files to Create:
- [ ] `client/src/components/AppleBuddyMascot.tsx` - Floating mascot with tips

### Constants to Update:
- [ ] `client/src/constants/food-data.ts` - Update category emojis (Snacks: 🧀, Drinks: 💧)

### Key Changes Summary:
1. ✅ White cards with colored left borders (no gradients)
2. ✅ Meal type cards in 2x2 square grid
3. ✅ Category cards in 3x2 grid
4. ✅ Food items in 6-column grid
5. ✅ Remove XP display from food items
6. ✅ Add Apple Buddy mascot with floating tips
7. ✅ Update emojis: Snacks (🧀), Drinks (💧), Meals (🥞🥪🍝🍎)
8. ✅ Optimized for iPad landscape

---

## Notes

- **No photo/camera functionality** - Search is text-only
- **XP is awarded but not displayed** on food items - keep the focus on fun logging, not points
- **Apple Buddy** provides encouragement without being intrusive
- Design follows **iOS Human Interface Guidelines** color palette
- All touch targets are minimum **44x44px** for accessibility
