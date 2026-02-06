import oniCelebrateImage from '@assets/Mascots/Oni_celebrate.png';
import { FeedbackType, LessonStep } from '../types';

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
    if ((step.questionType === 'multiple-choice' || step.questionType === 'fill-blank') && step.content.options) {
      const objOptions = step.content.options.filter((opt): opt is { id: string; text: string; emoji?: string; correct?: boolean } => typeof opt !== 'string');
      return objOptions.find(opt => opt.correct || opt.id === selectedAnswer);
    }
    if (step.questionType === 'label-reading' && step.content.labelOptions) {
      return step.content.labelOptions.find(opt => opt.correct || opt.id === selectedAnswer);
    }
    return null;
  };

  const correctOption = getCorrectOption();

  const renderOrderingSuccess = () => {
    if (!step.content.orderingItems) return null;
    
    const sortedItems = [...step.content.orderingItems].sort((a, b) => a.correctOrder - b.correctOrder);
    
    return (
      <div className="space-y-4">
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
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-green-200">
            <div className="flex items-start gap-3">
              <div>
                <p className="font-bold text-green-700">Perfect order!</p>
                <p className="text-gray-600 mt-1 text-sm">
                  {getFeedbackText(step.content.feedback, 'success')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const correctAnswerText = correctOption
    ? ('text' in correctOption ? correctOption.text : 'name' in correctOption ? (correctOption as any).name : selectedAnswer)
    : step.content.correctAnswer !== undefined
      ? String(step.content.correctAnswer)
      : selectedAnswer;

  const correctAnswerEmoji = correctOption && typeof correctOption === 'object' && 'emoji' in correctOption ? correctOption.emoji : undefined;

  return (
    <div className="min-h-[400px] rounded-3xl bg-gradient-to-b from-green-50 to-emerald-100 p-6 relative overflow-hidden">
      <div className="max-w-md mx-auto space-y-5 relative z-10">
        {/* Celebrating Mascot */}
        <div className="relative flex justify-center pt-2">
          <div className="relative">
            <img
              src={oniCelebrateImage}
              alt="Celebrating!"
              className="w-32 h-32 object-contain animate-bounce"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>

        {/* Question Recap */}
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            {step.question}
          </p>
        </div>

        {/* Success Content */}
        {step.questionType === 'matching' || (step.questionType === 'tap-pair' && step.content.pairs) ? (
          (() => {
            const pairs = step.content.matchingPairs || step.content.pairs || [];
            return (
              <div className="space-y-4">
                <div className="space-y-3">
                  {pairs.map((pair, index) => (
                    <div key={index} className="bg-white p-3 rounded-xl border border-green-200 text-left">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-800">{pair.left}</span>
                        <span className="text-green-600">→</span>
                        <span className="text-sm text-gray-600">{pair.right}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {getFeedbackText(step.content.feedback, 'success') && (
                  <div className="bg-white rounded-2xl p-5 shadow-lg border border-green-200">
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="font-bold text-green-700">Perfect matches!</p>
                        <p className="text-gray-600 mt-1 text-sm whitespace-pre-line">
                          {getFeedbackText(step.content.feedback, 'success')?.replace(/\\n/g, '\n')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        ) : step.questionType === 'ordering' ? (
          renderOrderingSuccess()
        ) : (
          <div className="space-y-4">
            {/* Correct Answer Card - PROMINENT */}
            <div className="bg-green-500 rounded-2xl p-6 shadow-xl border-4 border-green-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-500 text-2xl font-bold">✓</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {correctAnswerEmoji && (
                      <span className="text-2xl">{correctAnswerEmoji}</span>
                    )}
                    <p className="text-white font-bold text-xl">{correctAnswerText}</p>
                  </div>
                  <p className="text-green-100 text-sm">This is the correct answer!</p>
                </div>
              </div>
            </div>

            {/* Explanation Card */}
            {getFeedbackText(step.content.feedback, 'success') && (
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-green-200">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-bold text-green-700">Correct! You're amazing!</p>
                    <p className="text-gray-600 mt-1 text-sm">
                      {getFeedbackText(step.content.feedback, 'success')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* XP Badge - Large & Animated */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-orange-400 to-yellow-400 px-8 py-3 rounded-full shadow-lg animate-pulse">
            <span className="text-white font-bold text-2xl">+{xpEarned} XP</span>
          </div>
        </div>

        {/* CTA Button */}
        {showContinueButton && (
          <div className="pt-2">
            <button
              onClick={onContinue}
              className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-2xl shadow-lg transition-all duration-200"
              data-testid="continue-button"
            >
              CONTINUE →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
