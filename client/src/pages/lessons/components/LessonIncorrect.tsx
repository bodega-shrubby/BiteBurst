import { Button } from "@/components/ui/button";
import { AlertTriangle, Lightbulb } from "lucide-react";
import { useState, useEffect } from "react";
import oniOopsImage from '@assets/Mascots/Oni_oops.png';
import oniHintImage from '@assets/Mascots/Oni_hint.png';

function AttemptIndicator({ current, max = 3 }: { current: number; max?: number }) {
  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <span className="text-sm text-gray-500">
        {current >= max ? 'Last chance!' : `Attempt ${current} of ${max}`}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < current ? 'bg-red-400' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

interface LessonIncorrectProps {
  message: string;
  hint?: string;
  attemptNumber: number;
  onTryAgain: () => void;
  canTryAgain: boolean;
  selectedAnswer?: string;
  selectedAnswerText?: string;
  selectedAnswerEmoji?: string;
}

export default function LessonIncorrect({
  message,
  hint,
  attemptNumber,
  onTryAgain,
  canTryAgain,
  selectedAnswerText,
  selectedAnswerEmoji
}: LessonIncorrectProps) {
  const isHintMode = attemptNumber >= 2 && hint;
  const mascotImage = isHintMode ? oniHintImage : oniOopsImage;
  
  const [shouldShake, setShouldShake] = useState(true);

  useEffect(() => {
    setShouldShake(true);
    const timer = setTimeout(() => setShouldShake(false), 500);
    return () => clearTimeout(timer);
  }, [attemptNumber]);

  return (
    <div className={`min-h-[400px] rounded-3xl p-6 ${isHintMode ? 'bg-gradient-to-b from-blue-50 to-white' : 'bg-gradient-to-b from-red-50 to-white'}`}>
      <div className="max-w-md mx-auto space-y-5">
        {/* Mascot with shake animation */}
        <div className="flex justify-center relative">
          {isHintMode && (
            <span className="absolute -top-4 right-1/4 text-3xl animate-float">💡</span>
          )}
          <div className={`w-28 h-28 ${isHintMode ? 'bg-blue-400 border-blue-500' : 'bg-orange-400 border-orange-500'} rounded-full flex items-center justify-center shadow-lg border-4 ${shouldShake && !isHintMode ? 'animate-shake' : ''}`}>
            <img
              src={mascotImage}
              alt={isHintMode ? "Oni giving hint" : "Oni encouraging"}
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>

        {/* User's Wrong Answer Display */}
        {selectedAnswerText && (
          <div className="p-4 rounded-2xl border-2 border-red-300 bg-red-50">
            <div className="flex items-center justify-center gap-3">
              <span className="text-red-500 text-xl">✗</span>
              {selectedAnswerEmoji && (
                <span className="text-2xl">{selectedAnswerEmoji}</span>
              )}
              <span className="text-lg font-medium text-gray-700 line-through">
                {selectedAnswerText}
              </span>
            </div>
          </div>
        )}

        {/* Feedback Banner */}
        <div
          className={`p-4 rounded-2xl border-2 ${
            isHintMode
              ? 'bg-blue-100 border-blue-400'
              : 'bg-orange-50 border-orange-200'
          }`}
          role="alert"
          aria-live="assertive"
          data-testid="incorrect-banner"
        >
          <div className="flex items-start space-x-3">
            {isHintMode ? (
              <Lightbulb
                className="w-6 h-6 mt-1 flex-shrink-0 text-blue-600"
                aria-hidden="true"
              />
            ) : (
              <AlertTriangle
                className="w-6 h-6 mt-1 flex-shrink-0 text-orange-600"
                aria-hidden="true"
              />
            )}

            <div className="flex-1">
              {isHintMode ? (
                <>
                  <p className="font-semibold text-blue-800 mb-1">
                    💡 Here's a hint!
                  </p>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    {hint}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-orange-800 mb-1">
                    Oops! Not quite right...
                  </p>
                  <p className="text-orange-700 text-sm leading-relaxed">
                    {message || "Don't worry! Think about what makes something \"alive.\" Give it another try! 💪"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Attempt Indicator */}
        <AttemptIndicator current={attemptNumber} max={3} />

        {/* Status Banner */}
        <div className={`${isHintMode ? 'bg-blue-500' : 'bg-red-500'} text-white p-4 rounded-xl text-center`}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{isHintMode ? '💡' : '✗'}</span>
            <span className="text-lg font-bold">{isHintMode ? "You've got this!" : 'Oops!'}</span>
          </div>
        </div>

        {/* Try Again Button */}
        <div className="pt-2">
          <Button
            onClick={onTryAgain}
            disabled={!canTryAgain}
            className={`
              w-full h-14 text-base font-bold uppercase tracking-wider rounded-2xl
              ${isHintMode
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-[#FF6A00] hover:bg-[#E55A00] text-white'
              }
              ${!canTryAgain ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            data-testid="try-again-button"
          >
            {isHintMode ? 'Try One More Time' : 'Try Again'}
          </Button>
        </div>
      </div>
    </div>
  );
}
