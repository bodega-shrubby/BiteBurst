import { Button } from "@/components/ui/button";
import oniHappyImage from '@assets/Mascots/Oni_the_orange.png';

interface LessonLearnProps {
  title?: string;
  body: string | string[];
  actionLabel?: string;
  onContinue: () => void;
  xpEarned?: number;
  message?: string;
}

export default function LessonLearn({ 
  title,
  body,
  actionLabel = "Continue",
  onContinue,
  xpEarned = 0,
  message
}: LessonLearnProps) {
  const content = body || message || "";
  
  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Supportive Mascot */}
      <div className="flex justify-center">
        <img
          src={oniHappyImage}
          alt="Oni encouraging"
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Learn card with gradient */}
      <div
        className="p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50"
        role="region"
        aria-live="polite"
        data-testid="learn-card"
      >
        <div className="flex items-start space-x-4">
          <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
            <span className="text-3xl">📚</span>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-indigo-800 text-lg mb-3">
              {title || "Let's Learn!"}
            </h3>
            <div className="text-indigo-700 space-y-2">
              {Array.isArray(content) ? (
                <ul className="space-y-2 list-disc list-inside">
                  {content.map((item, index) => (
                    <li key={index} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : typeof content === 'string' && (content.includes('🥦') || content.includes('🥣') || content.includes('🥚') || content.includes('\n')) ? (
                <div className="space-y-2">
                  {content.split('\n').map((line, index) => (
                    <div key={index} className="leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="leading-relaxed">{content}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Encouraging message */}
      <p className="text-center text-gray-600 text-sm">
        Don't worry - everyone learns differently! Let's move on. 💪
      </p>

      {/* Reduced XP still awarded */}
      {xpEarned > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 border border-yellow-300 rounded-full px-4 py-2">
            <span className="text-yellow-600 font-bold">+{xpEarned} XP</span>
            <span className="text-xl">✨</span>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <Button
        onClick={onContinue}
        className="w-full h-12 text-base font-bold uppercase tracking-wider bg-[#FF6A00] hover:bg-[#E55A00] text-white"
        data-testid="continue-button"
      >
        {actionLabel}
      </Button>
    </div>
  );
}
