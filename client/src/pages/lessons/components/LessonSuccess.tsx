import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

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

interface LessonSuccessProps {
  step: LessonStep;
  selectedAnswer: string | null;
  xpEarned: number;
  onContinue: () => void;
  showContinueButton: boolean;
}

export default function LessonSuccess({
  step,
  selectedAnswer,
  xpEarned,
  onContinue,
  showContinueButton
}: LessonSuccessProps) {

  const getCorrectOption = () => {
    if (step.questionType === 'multiple-choice' && step.content.options) {
      return step.content.options.find(opt => opt.correct || opt.id === selectedAnswer);
    }
    return null;
  };

  const correctOption = getCorrectOption();

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Mascot Celebration Placeholder */}
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200 animate-bounce">
          <span className="text-3xl">🎉</span>
          <span className="sr-only">Mascot celebrating</span>
        </div>
      </div>

      {/* Question with Correct Answer Highlighted */}
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {step.question}
        </h2>
        
        {/* Show correct answer highlighted */}
        {correctOption && (
          <div className="p-4 rounded-2xl border-2 border-green-400 bg-green-50">
            <div className="flex items-center justify-center space-x-3">
              <Check className="w-6 h-6 text-green-600" />
              {correctOption.emoji && (
                <span className="text-2xl" role="img" aria-hidden="true">
                  {correctOption.emoji}
                </span>
              )}
              <span className="text-lg font-medium text-gray-900">
                {correctOption.text}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Feedback */}
      {step.content.feedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-gray-700 leading-relaxed">
            {step.content.feedback}
          </p>
        </div>
      )}

      {/* XP Animation */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-yellow-100 border border-yellow-300 rounded-full px-4 py-2">
          <span className="text-yellow-600 font-bold">+{xpEarned} XP</span>
          <span className="text-xl animate-pulse">✨</span>
        </div>
      </div>

      {/* Success Banner and Continue Button */}
      {showContinueButton && (
        <div className="space-y-4">
          {/* Green success banner */}
          <div className="bg-green-500 text-white p-4 rounded-xl text-center">
            <div className="flex items-center justify-center space-x-2">
              <Check className="w-6 h-6" />
              <span className="text-lg font-bold">Nice!</span>
            </div>
          </div>
          
          {/* Continue button */}
          <Button
            onClick={onContinue}
            className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base font-bold uppercase tracking-wider"
            data-testid="continue-button"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}