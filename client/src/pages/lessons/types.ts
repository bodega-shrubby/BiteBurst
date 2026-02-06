export type FeedbackType = string | {
  success?: string;
  hint_after_2?: string;
  motivating_fail?: string;
};

export interface LessonStep {
  id: string;
  stepNumber: number;
  questionType: 'multiple-choice' | 'true-false' | 'matching' | 'label-reading' | 'ordering' | 'tap-pair' | 'fill-blank' | 'lesson-content';
  question: string;
  content: {
    options?: Array<{ id: string; text: string; emoji?: string; correct?: boolean }> | string[];
    correctAnswer?: string | boolean;
    correctPair?: string[];
    feedback?: FeedbackType;
    matchingPairs?: Array<{ left: string; right: string }>;
    pairs?: Array<{ id?: string; left: string; right: string }>;
    labelOptions?: Array<{ id: string; name: string; sugar: string; fiber: string; protein: string; correct?: boolean }>;
    orderingItems?: Array<{ id: string; text: string; correctOrder: number }>;
    items?: Array<{ id: string; text: string; category: string }>;
    blanks?: Array<{ id: string; correctAnswer: string; hint?: string; acceptableAnswers?: string[] }>;
    sentence?: string;
    rememberCards?: Array<{ title: string; content: string; emoji?: string }>;
  };
  xpReward: number;
  mascotAction?: string;
}
