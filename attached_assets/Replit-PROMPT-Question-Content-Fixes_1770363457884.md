# BiteBurst Question & Lesson Content Fixes

## Overview
This prompt addresses critical issues found during testing of the Morning Energy Boost lessons. These fixes must be applied to ALL current and future lessons.

---

## 🚨 ISSUE 1: Fill-in-Blank Questions Need Options

### Problem
Fill-in-blank questions currently require typing the answer. For kids ages 6-14, this should be multiple choice with word options.

### Current Structure (WRONG)
```json
{
  "sentence": "In the morning, your energy _____ is empty!",
  "correctAnswers": ["tank", "Tank"],
  "hint": "Think about what a car needs..."
}
```

### Required Structure (CORRECT)
```json
{
  "question_type": "fill-blank",
  "content": {
    "sentence": "In the morning, your energy _____ is empty!",
    "options": [
      { "id": "a", "text": "tank", "correct": true },
      { "id": "b", "text": "wheel", "correct": false },
      { "id": "c", "text": "water", "correct": false },
      { "id": "d", "text": "bed", "correct": false }
    ],
    "successFeedback": "That's right! Your energy TANK needs breakfast fuel, just like a car needs petrol! ⛽",
    "incorrectFeedback": "Not quite! Think about what a car fills up at a petrol station - its tank! Your body has an energy tank too.",
    "hint": "Hint: What does a car fill up at a petrol station?"
  }
}
```

### Frontend Component Update
Update `FillBlankQuestion.tsx` to render options as tappable buttons instead of a text input:

```tsx
// FillBlankQuestion.tsx
export function FillBlankQuestion({ content, onAnswer }) {
  const [selectedOption, setSelectedOption] = useState(null);

  // Parse the sentence to show before/after the blank
  const [beforeBlank, afterBlank] = content.sentence.split('_____');

  return (
    <div className="fill-blank-container">
      {/* Display sentence with blank highlighted */}
      <p className="sentence">
        {beforeBlank}
        <span className="blank-slot">
          {selectedOption ? selectedOption.text : '_____'}
        </span>
        {afterBlank}
      </p>

      {/* Word options as buttons */}
      <div className="options-grid grid grid-cols-2 gap-3 mt-6">
        {content.options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedOption(option)}
            className={`option-btn p-4 rounded-xl text-lg font-medium
              ${selectedOption?.id === option.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-800'}
            `}
          >
            {option.text}
          </button>
        ))}
      </div>

      {/* Submit button */}
      <button
        onClick={() => onAnswer(selectedOption?.correct)}
        disabled={!selectedOption}
        className="submit-btn mt-4"
      >
        Check Answer
      </button>
    </div>
  );
}
```

---

## 🚨 ISSUE 2: Standardized Feedback Messages

### Problem
Questions have inconsistent feedback fields: some use `feedback`, others use `explanation`, `mascotReaction`, etc.

### Required Structure for ALL Question Types
Every question MUST have these three fields:

```json
{
  "successFeedback": "2-3 sentence educational message explaining WHY this is correct",
  "incorrectFeedback": "2-3 sentence educational message explaining WHY this is wrong and teaching the concept",
  "hint": "A helpful clue shown after 2nd incorrect attempt"
}
```

### Examples by Question Type

#### Multiple Choice
```json
{
  "question_type": "multiple-choice",
  "question": "Which breakfast gives you energy that lasts ALL morning?",
  "content": {
    "options": [
      { "id": "a", "text": "Toast with banana", "emoji": "🍞🍌", "correct": true },
      { "id": "b", "text": "Sweets", "emoji": "🍬", "correct": false },
      { "id": "c", "text": "Chocolate bar", "emoji": "🍫", "correct": false },
      { "id": "d", "text": "Fizzy drink", "emoji": "🥤", "correct": false }
    ],
    "successFeedback": "Amazing! Toast with banana gives you LASTING energy! The bread has slow-release energy and the banana adds natural sugars plus potassium. This combo keeps you powered up all morning! 🌟",
    "incorrectFeedback": "Not quite! Sweets, chocolate and fizzy drinks give you QUICK energy that runs out fast. Then you feel tired and hungry again. Toast with banana gives LASTING energy that stays with you!",
    "hint": "Think about which food comes from nature and fills you up, not just tastes sweet!"
  }
}
```

#### True/False
```json
{
  "question_type": "true-false",
  "question": "Eating sweets for breakfast gives you energy that lasts all morning.",
  "content": {
    "statement": "Eating sweets for breakfast gives you energy that lasts all morning.",
    "correctAnswer": false,
    "successFeedback": "You got it! Sweets give you a quick energy BURST but it disappears fast. That's why eating sweets makes you feel tired later. Your body needs foods like toast and cereal for lasting energy! ⚡",
    "incorrectFeedback": "Actually, sweets give QUICK energy that runs out fast! After eating sweets, you might feel great for 30 minutes, then suddenly feel tired and hungry. We need LASTING energy from foods like toast!",
    "hint": "Think about how you feel 1 hour after eating sweets vs. eating toast."
  }
}
```

#### Tap-Pair (Matching)
```json
{
  "question_type": "tap-pair",
  "question": "Match each food to the type of energy it gives:",
  "content": {
    "pairs": [
      { "id": "1", "left": "🍞 Toast", "right": "Lasting Energy" },
      { "id": "2", "left": "🍫 Chocolate", "right": "Quick Energy" },
      { "id": "3", "left": "🥣 Cereal", "right": "Lasting Energy" },
      { "id": "4", "left": "🍭 Lollipop", "right": "Quick Energy" }
    ],
    "successFeedback": "Perfect matching! You really understand your fuels now! Toast and cereal = slow-burning fuel that lasts. Chocolate and lollipops = quick fuel that runs out fast. Always choose lasting energy for meals! 🏆",
    "incorrectFeedback": "Let's think about this differently! Foods from nature (bread, cereal) give LASTING energy because they take time to digest. Sugary treats give QUICK energy because sugar enters your blood fast but leaves just as fast!",
    "hint": "Natural foods = lasting. Sugary foods = quick."
  }
}
```

#### Ordering
```json
{
  "question_type": "ordering",
  "question": "Put these in order: What happens to your body from bedtime to breakfast?",
  "content": {
    "orderingItems": [
      { "id": "a", "text": "You go to sleep", "correctOrder": 1 },
      { "id": "b", "text": "Your body uses up energy while sleeping", "correctOrder": 2 },
      { "id": "c", "text": "You wake up with an empty tank", "correctOrder": 3 },
      { "id": "d", "text": "You eat breakfast to fill your tank", "correctOrder": 4 }
    ],
    "successFeedback": "You've got the breakfast cycle perfect! Sleep uses energy → you wake up empty → breakfast refuels you. That's why 'breakfast' means 'breaking the fast' - you haven't eaten all night! 🌙➡️🌅➡️🍳",
    "incorrectFeedback": "Think about the journey: First you go to bed, then your body works all night (breathing, growing), so by morning your energy is used up, then breakfast fills you back up!",
    "hint": "Start with bedtime and end with eating. What happens while you sleep?"
  }
}
```

---

## 🚨 ISSUE 3: Remember Cards (9 cards in 3x3 grid)

### Problem
Lessons are missing remember cards. Only Morning Energy Boost Level 1 has `keyPoints` (4 items). All lessons need 9 remember cards for a 3x3 grid.

### Required Structure
The `lesson-content` step (step 1 of each lesson) MUST include:

```json
{
  "question_type": "lesson-content",
  "content": {
    "title": "Why Breakfast is Your Superpower!",
    "mascotMessage": "Let me tell you about the amazing power of breakfast!",
    "sections": [
      {
        "heading": "Your Body is Like a Car",
        "text": "When you sleep, your body uses up all its energy. When you wake up, your tank is EMPTY!",
        "emoji": "🚗"
      },
      // ... more sections
    ],
    "rememberCards": [
      { "id": 1, "emoji": "⛽", "text": "Breakfast fills your energy tank" },
      { "id": 2, "emoji": "🍞", "text": "Toast gives lasting energy" },
      { "id": 3, "emoji": "🥣", "text": "Cereal is great morning fuel" },
      { "id": 4, "emoji": "💧", "text": "Water wakes up your brain" },
      { "id": 5, "emoji": "🍌", "text": "Fruit adds natural energy" },
      { "id": 6, "emoji": "🚫", "text": "Sweets give quick energy only" },
      { "id": 7, "emoji": "😴", "text": "No breakfast = tired morning" },
      { "id": 8, "emoji": "🧠", "text": "Breakfast helps you think" },
      { "id": 9, "emoji": "💪", "text": "Breakfast makes you stronger" }
    ]
  }
}
```

### Frontend Component
```tsx
// RememberCards.tsx
export function RememberCards({ cards }) {
  // If less than 9 cards, use 2x2 grid (4 cards)
  const gridCols = cards.length >= 9 ? 'grid-cols-3' : 'grid-cols-2';
  const displayCards = cards.length >= 9 ? cards.slice(0, 9) : cards.slice(0, 4);

  return (
    <div className="remember-section mt-8">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>💡</span> Remember!
      </h3>
      <div className={`grid ${gridCols} gap-3`}>
        {displayCards.map((card) => (
          <div
            key={card.id}
            className="remember-card p-4 bg-gradient-to-br from-yellow-50 to-orange-50
                       rounded-xl border-2 border-yellow-200 text-center"
          >
            <span className="text-3xl mb-2 block">{card.emoji}</span>
            <p className="text-sm font-medium text-gray-700">{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🚨 ISSUE 4: Three-Attempt Flow with Hints

### Problem
Currently after 1 wrong attempt, the answer is given. The flow should be:
1. **Incorrect Attempt 1** → "Try again!" message (no hint yet)
2. **Incorrect Attempt 2** → "Try again!" message WITH hint
3. **Incorrect Attempt 3** → Show `incorrectFeedback` and correct answer, then move on

### Frontend Implementation

```tsx
// QuestionHandler.tsx
export function QuestionHandler({ question, onComplete }) {
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      // Show success feedback and continue
      onComplete({
        correct: true,
        attempts: attempts + 1,
        feedback: question.content.successFeedback
      });
      return;
    }

    // Incorrect answer
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts === 1) {
      // First wrong attempt - just show "Try again"
      showTryAgainModal("Oops! That's not quite right. Try again! 🤔");
    } else if (newAttempts === 2) {
      // Second wrong attempt - show hint
      setShowHint(true);
      showTryAgainModal(`Almost there! Here's a hint: ${question.content.hint}`);
    } else if (newAttempts >= 3) {
      // Third wrong attempt - show answer and feedback
      setShowAnswer(true);
      onComplete({
        correct: false,
        attempts: newAttempts,
        feedback: question.content.incorrectFeedback
      });
    }
  };

  return (
    <div className="question-container">
      {/* Question component based on type */}
      <QuestionComponent
        question={question}
        onAnswer={handleAnswer}
        disabled={showAnswer}
      />

      {/* Hint banner - shown after 2nd attempt */}
      {showHint && !showAnswer && (
        <div className="hint-banner mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
          <p className="text-blue-800">
            <span className="font-bold">💡 Hint:</span> {question.content.hint}
          </p>
        </div>
      )}

      {/* Attempts indicator */}
      <div className="attempts-indicator mt-4 flex gap-2">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`w-3 h-3 rounded-full ${
              num <= attempts ? 'bg-red-400' : 'bg-gray-200'
            }`}
          />
        ))}
        <span className="text-sm text-gray-500 ml-2">
          {3 - attempts} {3 - attempts === 1 ? 'try' : 'tries'} left
        </span>
      </div>
    </div>
  );
}
```

### Try Again Modal
```tsx
// TryAgainModal.tsx
export function TryAgainModal({ message, onClose, showHint }) {
  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="modal-content bg-white rounded-2xl p-6 max-w-sm mx-4 text-center">
        <div className="text-6xl mb-4">🤔</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Not quite!</h3>
        <p className="text-gray-600 mb-4">{message}</p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-primary-500 text-white rounded-xl font-semibold"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
```

---

## 🚨 ISSUE 5: Fix Match-the-Food (tap-pair) Question

### Problem
The tap-pair question in Level 3 isn't working correctly.

### Check Current Data Structure
The `tap-pair` content should have:

```json
{
  "question_type": "tap-pair",
  "content": {
    "pairs": [
      { "id": "1", "left": "🍞 Toast", "right": "Lasting Energy" },
      { "id": "2", "left": "🍫 Chocolate", "right": "Quick Energy" }
    ],
    "successFeedback": "...",
    "incorrectFeedback": "...",
    "hint": "..."
  }
}
```

### Frontend Component Fix
```tsx
// TapPairQuestion.tsx
export function TapPairQuestion({ content, onAnswer }) {
  const [leftItems, setLeftItems] = useState(
    content.pairs.map(p => ({ id: `${p.id}-left`, text: p.left, pairId: p.id }))
  );
  const [rightItems, setRightItems] = useState(
    shuffleArray(content.pairs.map(p => ({ id: `${p.id}-right`, text: p.right, pairId: p.id })))
  );
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);

  const handleLeftClick = (item) => {
    if (matchedPairs.includes(item.pairId)) return;
    setSelectedLeft(item);

    if (selectedRight) {
      checkMatch(item, selectedRight);
    }
  };

  const handleRightClick = (item) => {
    if (matchedPairs.includes(item.pairId)) return;
    setSelectedRight(item);

    if (selectedLeft) {
      checkMatch(selectedLeft, item);
    }
  };

  const checkMatch = (left, right) => {
    if (left.pairId === right.pairId) {
      // Correct match!
      setMatchedPairs([...matchedPairs, left.pairId]);
      playSuccessSound();
    } else {
      // Wrong match - shake animation
      playErrorSound();
    }

    // Reset selections
    setSelectedLeft(null);
    setSelectedRight(null);

    // Check if all matched
    if (matchedPairs.length + 1 === content.pairs.length) {
      onAnswer(true);
    }
  };

  return (
    <div className="tap-pair-container">
      <div className="flex gap-8">
        {/* Left column */}
        <div className="flex-1 space-y-3">
          {leftItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLeftClick(item)}
              disabled={matchedPairs.includes(item.pairId)}
              className={`w-full p-4 rounded-xl text-left text-lg
                ${matchedPairs.includes(item.pairId)
                  ? 'bg-green-100 border-green-400 opacity-60'
                  : selectedLeft?.id === item.id
                    ? 'bg-primary-100 border-primary-500 border-2'
                    : 'bg-gray-100 border-gray-200 border-2'}
              `}
            >
              {item.text}
            </button>
          ))}
        </div>

        {/* Right column */}
        <div className="flex-1 space-y-3">
          {rightItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleRightClick(item)}
              disabled={matchedPairs.includes(item.pairId)}
              className={`w-full p-4 rounded-xl text-left text-lg
                ${matchedPairs.includes(item.pairId)
                  ? 'bg-green-100 border-green-400 opacity-60'
                  : selectedRight?.id === item.id
                    ? 'bg-primary-100 border-primary-500 border-2'
                    : 'bg-gray-100 border-gray-200 border-2'}
              `}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-4 text-center text-gray-600">
        {matchedPairs.length} / {content.pairs.length} matched
      </div>
    </div>
  );
}
```

---

## 🚨 ISSUE 6: Power-Up Snacks Missing Lesson Content

### Problem
Power-Up Snacks lessons have minimal lesson-content without proper sections or remember cards.

### Required Update
Update ALL lesson-content steps for Power-Up Snacks (and verify Super Foods) to include:
- Rich `sections` array with heading, text, emoji
- `rememberCards` array with 9 cards

---

## Database Updates Required

### SQL to Fix Fill-in-Blank Questions

```sql
-- Update fill-blank questions to include options
-- Morning Energy Boost Level 3, Step 1
UPDATE lesson_steps
SET content = '{
  "sentence": "When you sleep, your body uses up energy. In the morning, your energy _____ is empty!",
  "options": [
    { "id": "a", "text": "tank", "correct": true },
    { "id": "b", "text": "wheel", "correct": false },
    { "id": "c", "text": "water", "correct": false },
    { "id": "d", "text": "bed", "correct": false }
  ],
  "successFeedback": "TANK! You got it! Your energy tank needs breakfast fuel, just like a car needs petrol to go! ⛽",
  "incorrectFeedback": "Think about a car at a petrol station - it fills up its TANK! Your body has an energy tank too, and breakfast fills it up!",
  "hint": "What does a car fill up at a petrol station?"
}'::jsonb
WHERE lesson_id = 'age6-t1-L1-morning-energy-boost-hard'
AND step_number = 1;
```

### SQL to Add Remember Cards

```sql
-- Update Morning Energy Boost Level 1 lesson content with remember cards
UPDATE lesson_steps
SET content = content || '{
  "rememberCards": [
    { "id": 1, "emoji": "⛽", "text": "Breakfast fills your energy tank" },
    { "id": 2, "emoji": "🍞", "text": "Toast gives lasting energy" },
    { "id": 3, "emoji": "🥣", "text": "Cereal is great morning fuel" },
    { "id": 4, "emoji": "💧", "text": "Water wakes up your brain" },
    { "id": 5, "emoji": "🍌", "text": "Banana adds natural energy" },
    { "id": 6, "emoji": "🚫", "text": "Sweets give quick energy only" },
    { "id": 7, "emoji": "😴", "text": "No breakfast = tired morning" },
    { "id": 8, "emoji": "🧠", "text": "Breakfast helps you think" },
    { "id": 9, "emoji": "💪", "text": "Breakfast makes you stronger" }
  ]
}'::jsonb
WHERE lesson_id = 'age6-t1-L1-morning-energy-boost'
AND question_type = 'lesson-content';
```

---

## Implementation Checklist

### Frontend Changes
- [ ] Update `FillBlankQuestion.tsx` to show options as buttons
- [ ] Create `RememberCards.tsx` component with 3x3 or 2x2 grid
- [ ] Update `QuestionHandler.tsx` with 3-attempt flow
- [ ] Create `TryAgainModal.tsx` with hint support
- [ ] Fix `TapPairQuestion.tsx` matching logic
- [ ] Update `LessonContent.tsx` to render remember cards

### Database Updates
- [ ] Add options to ALL fill-blank questions (Morning Energy Boost L3, Power-Up L2 & L3, Super Foods L2 & L3)
- [ ] Add `successFeedback`, `incorrectFeedback`, `hint` to ALL questions
- [ ] Add `rememberCards` (9 cards) to ALL lesson-content steps
- [ ] Fix Power-Up Snacks lesson content with proper sections structure

### Testing
- [ ] Test fill-blank questions show 4 word options
- [ ] Test 3-attempt flow works correctly
- [ ] Test hint appears on 2nd wrong attempt
- [ ] Test remember cards display in 3x3 grid
- [ ] Test tap-pair matching works correctly
- [ ] Test all lessons display proper content

---

## Priority Order

1. **CRITICAL**: Fix 3-attempt flow (affects all questions)
2. **CRITICAL**: Add options to fill-blank questions
3. **HIGH**: Fix tap-pair matching logic
4. **HIGH**: Add remember cards to all lessons
5. **MEDIUM**: Standardize feedback messages
6. **MEDIUM**: Enrich Power-Up lesson content
