import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface LessonLearnProps {
  message: string;
  onContinue: () => void;
}

export default function LessonLearn({ 
  message, 
  onContinue 
}: LessonLearnProps) {
  console.log('🎯 LessonLearn COMPONENT RENDERING with message:', message);
  return (
    <div className="space-y-6">
      {/* Learn card */}
      <div 
        className="p-6 rounded-2xl border border-blue-200 bg-blue-50"
        role="region"
        aria-live="polite"
        data-testid="learn-card"
      >
        <div className="flex items-start space-x-4">
          {/* Light bulb icon */}
          <Lightbulb className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" aria-hidden="true" />
          
          {/* Learn content */}
          <div className="flex-1">
            <div className="text-blue-900 text-lg leading-relaxed">
              {/* Handle bullet points if message contains them */}
              {message.includes('🥦') || message.includes('🥣') || message.includes('🥚') ? (
                <div className="space-y-2">
                  {message.split('\n').map((line, index) => (
                    <div key={index} className="leading-relaxed">
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <p>{message}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-2">
        <Button
          onClick={onContinue}
          className="w-full h-12 text-base font-bold uppercase tracking-wider bg-[#FF6A00] hover:bg-[#E55A00] text-white"
          data-testid="continue-button"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}