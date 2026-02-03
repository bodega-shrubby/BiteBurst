import { Button } from "@/components/ui/button";
import oniSadImage from '@assets/Mascots/Oni_sad.png';

interface LessonLearnProps {
  title?: string;
  body: string | string[];
  actionLabel?: string;
  onContinue: () => void;
  xpEarned?: number;
  message?: string;
  correctAnswer?: string;
  correctAnswerEmoji?: string;
}

export default function LessonLearn({ 
  title,
  body,
  actionLabel = "Got It! Continue",
  onContinue,
  xpEarned = 0,
  message,
  correctAnswer,
  correctAnswerEmoji
}: LessonLearnProps) {
  const content = body || message || "";
  
  return (
    <div className="min-h-[400px] rounded-3xl bg-gradient-to-b from-purple-50 to-white p-6">
      <div className="max-w-md mx-auto space-y-5">
        {/* Teaching Mode Mascot */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-purple-400 rounded-full flex items-center justify-center shadow-lg border-4 border-purple-500">
            <img
              src={oniSadImage}
              alt="Oni teaching"
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>
        <p className="text-center text-xs text-gray-500">[Teaching mode]</p>

        {/* Learning Moment Header */}
        <div className="text-center">
          <p className="text-purple-600 font-semibold text-sm">Let's learn together!</p>
          <h2 className="text-lg font-bold text-gray-900">
            {title || "Learning Time"}
          </h2>
        </div>

        {/* Correct Answer Reveal */}
        {correctAnswer && (
          <div className="flex items-center gap-3 p-4 bg-green-100 rounded-xl border border-green-300">
            <span className="text-green-500 text-xl">✓</span>
            {correctAnswerEmoji && <span className="text-2xl">{correctAnswerEmoji}</span>}
            <div>
              <span className="font-medium text-gray-900">{correctAnswer}</span>
              <p className="text-xs text-green-600">This is the correct answer!</p>
            </div>
          </div>
        )}

        {/* Learn card with gradient */}
        <div
          className="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50 space-y-4"
          role="region"
          aria-live="polite"
          data-testid="learn-card"
        >
          {/* Educational Explanation */}
          <div className="text-gray-700 space-y-3">
            {Array.isArray(content) ? (
              <ul className="space-y-2 list-disc list-inside text-sm">
                {content.map((item, index) => (
                  <li key={index} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            ) : typeof content === 'string' && (content.includes('🥦') || content.includes('🥣') || content.includes('🥚') || content.includes('\n')) ? (
              <div className="space-y-2 text-sm">
                {content.split('\n').map((line, index) => (
                  <div key={index} className="leading-relaxed">
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <p className="leading-relaxed text-sm">{content}</p>
            )}
          </div>

        </div>


        {/* Encouraging message */}
        <p className="text-center text-gray-600 text-sm">
          Don't worry - everyone learns differently! Let's move on. 💪
        </p>

        {/* Partial XP */}
        {xpEarned > 0 && (
          <div className="flex items-center justify-center">
            <div className="px-4 py-2 bg-gray-100 rounded-full border border-gray-200">
              <span className="text-gray-600 font-medium">+{xpEarned} XP</span>
              <span className="ml-1 text-sm text-gray-400">(for learning)</span>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <Button
          onClick={onContinue}
          className="w-full h-14 text-base font-bold uppercase tracking-wider rounded-2xl bg-purple-500 hover:bg-purple-600 text-white"
          data-testid="continue-button"
        >
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}
