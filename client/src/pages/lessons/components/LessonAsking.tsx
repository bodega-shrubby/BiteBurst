import { Button } from '@/components/ui/button';

interface LessonStep {
  id: string;
  stepNumber: number;
  questionType: 'multiple-choice' | 'true-false' | 'matching';
  question: string;
  content: {
    options?: Array<{ id: string; text: string; emoji?: string; correct?: boolean }>;
    correctAnswer?: string | boolean;
    feedback?: string;
    matchingPairs?: Array<{ left: string; right: string }>;
  };
  xpReward: number;
  mascotAction?: string;
}

interface LessonAskingProps {
  step: LessonStep;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  onCheck: () => void;
  isSubmitting: boolean;
  canCheck: boolean;
}

export default function LessonAsking({
  step,
  selectedAnswer,
  onAnswerSelect,
  onCheck,
  isSubmitting,
  canCheck
}: LessonAskingProps) {
  
  const renderMultipleChoice = () => {
    if (!step.content.options) return null;
    
    return (
      <div className="space-y-3">
        {step.content.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswerSelect(option.id)}
            disabled={isSubmitting}
            className={`
              w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${selectedAnswer === option.id
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-25'
              }
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            data-testid={`option-${option.id}`}
          >
            <div className="flex items-center space-x-3">
              {option.emoji && (
                <span className="text-2xl" role="img" aria-hidden="true">
                  {option.emoji}
                </span>
              )}
              <span className="text-lg font-medium text-gray-900">
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderTrueFalse = () => {
    const options = [
      { id: 'true', text: 'True', emoji: '✅' },
      { id: 'false', text: 'False', emoji: '❌' }
    ];

    return (
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onAnswerSelect(option.id)}
            disabled={isSubmitting}
            className={`
              w-full p-4 rounded-2xl border-2 text-left transition-all duration-200
              ${selectedAnswer === option.id
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-25'
              }
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            data-testid={`option-${option.id}`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl" role="img" aria-hidden="true">
                {option.emoji}
              </span>
              <span className="text-lg font-medium text-gray-900">
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderMatching = () => {
    // For now, simplified matching - will enhance in later task
    if (!step.content.matchingPairs) return null;
    
    return (
      <div className="text-center text-gray-600 p-8">
        <p>Matching game coming soon!</p>
        <p className="text-sm mt-2">This will be implemented in the next task.</p>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Mascot Placeholder */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-200">
          <span className="text-3xl">🍊</span>
          <span className="sr-only">Mascot placeholder</span>
        </div>
      </div>

      {/* Question */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {step.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {step.questionType === 'multiple-choice' && renderMultipleChoice()}
        {step.questionType === 'true-false' && renderTrueFalse()}
        {step.questionType === 'matching' && renderMatching()}
      </div>

      {/* Check Button */}
      <div className="pt-4">
        <Button
          onClick={onCheck}
          disabled={!canCheck || isSubmitting}
          className={`
            w-full h-12 text-base font-bold uppercase tracking-wider
            ${canCheck && !isSubmitting
              ? 'bg-[#FF6A00] hover:bg-[#E55A00] text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          data-testid="check-button"
        >
          {isSubmitting ? 'Checking...' : 'Check'}
        </Button>
      </div>
    </div>
  );
}