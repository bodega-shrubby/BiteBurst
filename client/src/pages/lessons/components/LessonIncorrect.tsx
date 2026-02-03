import { Button } from "@/components/ui/button";
import { AlertTriangle, Lightbulb } from "lucide-react";
import oniOopsImage from '@assets/Mascots/Oni_oops.png';
import oniHintImage from '@assets/Mascots/Oni_hint.png';

interface LessonIncorrectProps {
  message: string;
  hint?: string;
  attemptNumber: number;
  onTryAgain: () => void;
  canTryAgain: boolean;
}

export default function LessonIncorrect({
  message,
  hint,
  attemptNumber,
  onTryAgain,
  canTryAgain
}: LessonIncorrectProps) {
  const isHintMode = attemptNumber >= 2 && hint;
  const mascotImage = isHintMode ? oniHintImage : oniOopsImage;
  const mascotClass = isHintMode ? 'mascot-hint' : 'mascot-oops';

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Mascot */}
      <div className="flex justify-center">
        <img
          src={mascotImage}
          alt={isHintMode ? "Oni giving hint" : "Oni encouraging"}
          className={`w-24 h-24 object-contain ${mascotClass}`}
        />
      </div>

      {/* Feedback Banner */}
      <div
        className={`p-4 rounded-2xl border-2 ${
          isHintMode
            ? 'bg-blue-50 border-blue-200'
            : 'bg-red-50 border-red-200'
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
              className="w-6 h-6 mt-1 flex-shrink-0 text-red-600"
              aria-hidden="true"
            />
          )}

          <div className="flex-1">
            {isHintMode ? (
              <>
                <p className="font-semibold text-blue-800 mb-1">
                  💡 Think about it...
                </p>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {hint}
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-red-800 mb-1">
                  🤔 Not quite!
                </p>
                <p className="text-red-700 text-sm leading-relaxed">
                  {message}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Try Again Button */}
      <div className="pt-2">
        <Button
          onClick={onTryAgain}
          disabled={!canTryAgain}
          className={`
            w-full h-12 text-base font-bold uppercase tracking-wider
            ${canTryAgain
              ? 'bg-[#FF6A00] hover:bg-[#E55A00] text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
          data-testid="try-again-button"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
