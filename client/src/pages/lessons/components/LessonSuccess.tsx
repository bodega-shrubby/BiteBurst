import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import sunnyCelebrateImage from '@assets/Mascots/sunny_celebrate.png';

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

  // Special handling for matching game success
  const renderMatchingSuccess = () => {
    if (!step.content.matchingPairs) return null;
    
    const matchingFeedback = {
      '🥦 Broccoli': 'Keeps your body strong for the whole match.',
      '🥣 Yogurt with berries': 'Helps your muscles recover after playing.',
      '🥚 Boiled egg': 'Builds strength so you can kick harder.'
    };
    
    return (
      <div className="space-y-4">
        <div className="text-lg font-bold text-green-800 mb-3">
          ✅ Nice! Perfect matches!
        </div>
        
        {/* Show each correct match with its specific feedback */}
        <div className="space-y-3">
          {step.content.matchingPairs.map((pair, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-xl border border-green-200 text-left"
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-gray-800">{pair.left}</span>
                <span className="text-green-600">→</span>
                <span className="text-sm text-gray-600">{pair.right}</span>
              </div>
              <div className="text-sm text-green-700 pl-2">
                {matchingFeedback[pair.left as keyof typeof matchingFeedback]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Sunny Celebrating */}
      <div className="flex justify-center">
        <img 
          src={sunnyCelebrateImage} 
          alt="Sunny Celebrating" 
          className="w-24 h-24 object-contain animate-bounce"
        />
      </div>

      {/* Success Content */}
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {step.question}
        </h2>
        
        {step.questionType === 'matching' ? (
          <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
            {renderMatchingSuccess()}
          </div>
        ) : (
          <>
            {/* Show correct answer highlighted for non-matching questions */}
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
            
            {/* Feedback */}
            {step.content.feedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">
                  {step.content.feedback}
                </p>
              </div>
            )}
          </>
        )}
      </div>

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