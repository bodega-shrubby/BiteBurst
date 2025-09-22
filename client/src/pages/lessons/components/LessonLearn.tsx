import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface LessonLearnProps {
  title?: string;
  body: string | string[];
  actionLabel?: string;
  onContinue: () => void;
  // Legacy support
  message?: string;
}

export default function LessonLearn({ 
  title,
  body,
  actionLabel = "Continue",
  onContinue,
  // Legacy support
  message
}: LessonLearnProps) {
  // Support legacy message prop for backward compatibility
  const content = body || message || "";
  
  return (
    <div className="space-y-6">
      {/* Learn card */}
      <div 
        className="p-6 rounded-2xl border border-blue-200"
        style={{ backgroundColor: '#E8F2FF' }}
        role="region"
        aria-live="polite"
        data-testid="learn-card"
      >
        <div className="flex items-start space-x-4">
          {/* Info icon */}
          <Info 
            className="w-8 h-8 mt-1 flex-shrink-0" 
            style={{ color: '#0B4C8C' }}
            aria-hidden="true" 
          />
          
          {/* Learn content */}
          <div className="flex-1">
            {title && (
              <h3 
                className="font-bold text-lg mb-3"
                style={{ color: '#0B4C8C' }}
              >
                {title}
              </h3>
            )}
            <div 
              className="text-lg leading-relaxed"
              style={{ color: '#0B4C8C' }}
            >
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
                <p>{content}</p>
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
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}