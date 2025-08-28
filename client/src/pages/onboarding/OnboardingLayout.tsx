import { useLocation, useRoute } from "wouter";
import { ChevronLeft } from "lucide-react";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  canGoBack?: boolean;
  onBack?: () => void;
}

const STEPS = [
  { path: "/start", name: "Welcome" },
  { path: "/profile/name", name: "Name" },
  { path: "/profile/age", name: "Age" },
  { path: "/profile/goal", name: "Goal" },
  { path: "/profile/avatar", name: "Avatar" },
  { path: "/profile/email", name: "Email" },
  { path: "/profile/password", name: "Password" },
  { path: "/profile/consent", name: "Consent" },
  { path: "/profile/review", name: "Review" }
];

export default function OnboardingLayout({ 
  children, 
  step, 
  totalSteps, 
  canGoBack = true,
  onBack 
}: OnboardingLayoutProps) {
  const [, setLocation] = useLocation();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (step > 0) {
      const previousPath = STEPS[step - 1]?.path;
      if (previousPath) {
        setLocation(previousPath);
      }
    }
  };

  const progress = step > 0 ? (step / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      {step > 0 && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
          <div className="max-w-md mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              {canGoBack && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: 'var(--bb-header, #FF6A00)'
                    }}
                    aria-label={`Progress: ${Math.round(progress)}%`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-md mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}