# Bug Fix: Answer Validation Not Working

## Problem
When submitting correct answers, the system returns `{"xpAwarded":0}` without a `correct` field, and the UI shows "Oops! Not quite right..." even for correct answers.

## Debug Logs Show
```
DEBUG - Answer submission: { lessonId: 'L1-02', stepId: 'L1-02-Q01', submittedAnswer: 'a' }
DEBUG - DB lesson step validation: {
  questionType: 'multiple-choice',
  hasCorrectPair: false,
  hasCorrectAnswer: true,  ← Database is correct!
  hasOptions: true
}
Response: {"xpAwarded":0,"stepId":"L1-02-Q01"}  ← Missing "correct" field, xpAwarded is 0
```

## Database Content Structure (Verified Correct)
```json
{
  "correctAnswer": "a",
  "options": [
    {"id": "a", "text": "🥣 Oatmeal", "isCorrect": true},
    {"id": "b", "text": "🍬 Candy Bar", "isCorrect": false},
    {"id": "c", "text": "🧊 Ice Cube", "isCorrect": false}
  ],
  "feedback": {
    "correct": "Power Up! ⚡ Oatmeal burns slowly...",
    "incorrect": "Candy gives a quick buzz but makes you crash..."
  }
}
```

## Root Cause
The answer validation logic in the `/api/lessons/answer` endpoint is not correctly:
1. Comparing `submittedAnswer` with `content.correctAnswer`
2. Returning the `correct: true/false` field in the response
3. Awarding XP for correct answers

## Fix Required
Find the answer validation code (likely in `server/routes/lessons.ts` or similar) and ensure:

### 1. For Multiple-Choice Questions
```typescript
// The comparison should be:
const isCorrect = submittedAnswer === step.content.correctAnswer;

// Response should include:
return {
  correct: isCorrect,
  xpAwarded: isCorrect ? step.xpReward : 0,
  stepId: stepId,
  feedback: isCorrect ? step.content.feedback?.correct : step.content.feedback?.incorrect
};
```

### 2. For Fill-Blank Questions
Same logic - compare `submittedAnswer` with `content.correctAnswer`

### 3. For Matching Questions
Check if `submittedAnswer` pairs match `content.pairs`

### 4. For Ordering Questions
Check if `submittedAnswer` order matches `content.items` with their `correctOrder` or `correctBucket`

## Search For
Look for code handling `/api/lessons/answer` POST endpoint. The validation logic might be checking for a different field name or structure.

## Expected Response Format
```json
{
  "correct": true,
  "xpAwarded": 10,
  "stepId": "L1-02-Q01",
  "feedback": "Power Up! ⚡ Oatmeal burns slowly, giving you steady energy for hours."
}
```
