import { useState, useEffect } from "react";
import oniOopsImage from '@assets/Mascots/Oni_oops.png';
import oniHintImage from '@assets/Mascots/Oni_hint.png';

function AttemptIndicator({ current, max = 3 }: { current: number; max?: number }) {
  return (
    <div className="flex items-center justify-center gap-2 my-3">
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
    <div className={`min-h-[400px] rounded-3xl p-6 ${isHintMode ? 'bg-gradient-to-b from-blue-50 to-white' : 'bg-gradient-to-b from-red-50 to-orange-50'}`}>
      <div className="max-w-md mx-auto space-y-5">
        {/* Mascot with animation */}
        <div className="relative flex justify-center pt-2">
          {isHintMode && (
            <span className="absolute -top-4 right-1/4 text-3xl animate-bounce">💡</span>
          )}
          <div className={`w-28 h-28 rounded-full ${isHintMode ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-orange-400 to-red-400'} p-1 shadow-xl ${shouldShake && !isHintMode ? 'animate-shake' : ''}`}>
            <img
              src={mascotImage}
              alt={isHintMode ? "Oni giving hint" : "Oni encouraging"}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        {/* Encouragement */}
        <div className="text-center">
          <p className={`font-bold text-xl ${isHintMode ? 'text-blue-600' : 'text-orange-600'}`}>
            {isHintMode ? "You've got this!" : "Let's learn together!"}
          </p>
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

        {/* Feedback Card */}
        <div
          className={`rounded-2xl p-5 shadow-lg border-2 ${
            isHintMode
              ? 'bg-blue-50 border-blue-300'
              : 'bg-white border-orange-200'
          }`}
          role="alert"
          aria-live="assertive"
          data-testid="incorrect-banner"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">
              {isHintMode ? '💡' : '🤔'}
            </span>
            <div className="flex-1">
              {isHintMode ? (
                <>
                  <p className="font-bold text-blue-800 mb-1">
                    Here's a hint!
                  </p>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    {hint}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold text-orange-800 mb-1">
                    Oops! Not quite right...
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {message || "Don't worry! Think about it and give it another try! 💪"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Attempt Indicator */}
        <AttemptIndicator current={attemptNumber} max={3} />

        {/* Encouragement Message */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Don't worry - everyone learns differently! You've got this. 💪
          </p>
        </div>

        {/* Try Again Button */}
        <div className="pt-2">
          <button
            onClick={onTryAgain}
            disabled={!canTryAgain}
            className={`
              w-full py-4 font-bold text-xl rounded-2xl shadow-lg
              transition-all duration-200
              ${isHintMode
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
              }
              ${!canTryAgain ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}
            `}
            data-testid="try-again-button"
          >
            {isHintMode ? 'GOT IT! CONTINUE' : 'TRY AGAIN'}
          </button>
        </div>
      </div>
    </div>
  );
}
