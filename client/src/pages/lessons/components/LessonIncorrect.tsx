import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface LessonIncorrectProps {
  message: string;
  onTryAgain: () => void;
  canTryAgain: boolean;
}

export default function LessonIncorrect({ 
  message, 
  onTryAgain, 
  canTryAgain 
}: LessonIncorrectProps) {
  return (
    <div className="space-y-4">
      {/* Try-again banner */}
      <div 
        className="p-4 rounded-2xl border border-red-200 bg-red-50"
        role="alert"
        aria-live="assertive"
        data-testid="incorrect-banner"
      >
        <div className="flex items-start space-x-3">
          {/* Warning icon */}
          <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" aria-hidden="true" />
          
          {/* Message content */}
          <div className="flex-1">
            <p className="text-red-800 font-medium text-base leading-relaxed">
              {message}
            </p>
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