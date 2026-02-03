import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import oniCelebrateImage from '@assets/Mascots/Oni_celebrate.png';

type FeedbackType = string | { success?: string; hint_after_2?: string; motivating_fail?: string };

function getFeedbackText(feedback: FeedbackType | undefined, type: 'success' | 'hint' | 'fail' = 'success'): string | undefined {
  if (!feedback) return undefined;
  if (typeof feedback === 'string') return feedback;
  switch (type) {
    case 'success': return feedback.success;
    case 'hint': return feedback.hint_after_2;
    case 'fail': return feedback.motivating_fail;
    default: return feedback.success;
  }
}

interface LessonStep {
  id: string;
  stepNumber: number;
  questionType: 'multiple-choice' | 'true-false' | 'matching' | 'label-reading' | 'ordering';
  question: string;
  content: {
    options?: Array<{ id: string; text: string; emoji?: string; correct?: boolean }>;
    correctAnswer?: string | boolean;
    feedback?: FeedbackType;
    matchingPairs?: Array<{ left: string; right: string }>;
    labelOptions?: Array<{ id: string; name: string; sugar: string; fiber: string; protein: string; correct?: boolean }>;
    orderingItems?: Array<{ id: string; text: string; correctOrder: number }>;
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
    if (step.questionType === 'label-reading' && step.content.labelOptions) {
      return step.content.labelOptions.find(opt => opt.correct || opt.id === selectedAnswer);
    }
    return null;
  };

  const correctOption = getCorrectOption();

  const renderMatchingSuccess = () => {
    if (!step.content.matchingPairs) return null;
    
    return (
      <div className="space-y-4">
        <div className="text-lg font-bold text-green-800 mb-3">
          ✅ Nice! Perfect matches!
        </div>
        
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
            </div>
          ))}
        </div>
        
        {getFeedbackText(step.content.feedback, 'success') && (
          <div className="bg-white p-3 rounded-xl border border-green-200 text-left">
            <div className="text-sm text-green-700 whitespace-pre-line">
              {getFeedbackText(step.content.feedback, 'success')?.replace(/\\n/g, '\n')}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderOrderingSuccess = () => {
    if (!step.content.orderingItems) return null;
    
    const sortedItems = [...step.content.orderingItems].sort((a, b) => a.correctOrder - b.correctOrder);
    
    return (
      <div className="space-y-4">
        <div className="text-lg font-bold text-green-800 mb-3">
          ✅ Nice! Perfect order!
        </div>
        
        <div className="space-y-2">
          {sortedItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-xl border border-green-200 text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-600">
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-gray-800">{item.text}</span>
              </div>
            </div>
          ))}
        </div>
        
        {getFeedbackText(step.content.feedback, 'success') && (
          <div className="bg-white p-3 rounded-xl border border-green-200 text-left">
            <div className="text-sm text-green-700">
              {getFeedbackText(step.content.feedback, 'success')}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[400px] rounded-3xl bg-gradient-to-b from-green-50 to-white p-6 relative overflow-hidden">
      {/* Confetti Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-0 left-1/4 text-2xl animate-ping" style={{ animationDuration: '1.5s' }}>🎊</span>
        <span className="absolute top-2 right-1/4 text-xl animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}>✨</span>
        <span className="absolute top-4 left-1/3 text-lg animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }}>⭐</span>
        <span className="absolute top-6 right-1/3 text-2xl animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.9s' }}>🎉</span>
      </div>

      <div className="max-w-md mx-auto space-y-5 relative z-10">
        {/* Celebrating Mascot with Sparkles */}
        <div className="flex justify-center relative">
          <span className="absolute -top-2 -left-8 text-2xl animate-ping" style={{ animationDuration: '1.5s' }}>✨</span>
          <span className="absolute -top-2 -right-8 text-2xl animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}>⭐</span>
          <div className="w-28 h-28 bg-orange-400 rounded-full flex items-center justify-center shadow-lg border-4 border-orange-500 mascot-celebrate">
            <img
              src={oniCelebrateImage}
              alt="Oni Celebrating"
              className="w-20 h-20 object-contain"
            />
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xl animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }}>🌟</span>
        </div>

        {/* Question Recap */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {step.question}
          </h2>
        </div>

        {/* Success Content */}
        {step.questionType === 'matching' ? (
          renderMatchingSuccess()
        ) : step.questionType === 'ordering' ? (
          renderOrderingSuccess()
        ) : (
          <div className="space-y-4">
            {/* Correct Answer Highlighted */}
            <div className="p-4 rounded-2xl border-2 border-green-400 bg-green-50">
              <div className="flex items-center justify-center gap-3">
                <span className="text-green-500 text-xl">✓</span>
                {correctOption && 'emoji' in correctOption && correctOption.emoji && (
                  <span className="text-2xl">{correctOption.emoji}</span>
                )}
                <span className="text-lg font-medium text-gray-900">
                  {correctOption && 'text' in correctOption ? correctOption.text : 
                   correctOption && 'name' in correctOption ? correctOption.name : selectedAnswer}
                </span>
              </div>
            </div>

            {/* Success Feedback Speech Bubble */}
            {getFeedbackText(step.content.feedback, 'success') && (
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
                <p className="text-green-800 font-semibold mb-2">🎉 Correct! You're amazing!</p>
                <p className="text-green-700 text-sm">
                  {getFeedbackText(step.content.feedback, 'success')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* XP Reward */}
        <div className="flex items-center justify-center">
          <div className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg mascot-celebrate">
            <span className="text-white font-bold text-xl">+{xpEarned} XP</span>
            <span className="ml-2 text-2xl">✨</span>
          </div>
        </div>

        {/* Success Banner - GREEN */}
        <div className="bg-green-500 text-white p-4 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2">
            <Check className="w-6 h-6" />
            <span className="text-lg font-bold">Nice!</span>
          </div>
        </div>

        {/* CTA Button */}
        {showContinueButton && (
          <Button
            onClick={onContinue}
            className="w-full h-14 text-base font-bold uppercase tracking-wider rounded-2xl bg-green-500 hover:bg-green-600 text-white"
            data-testid="continue-button"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
