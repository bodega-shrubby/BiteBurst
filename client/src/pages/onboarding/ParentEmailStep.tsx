import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

export default function ParentEmailStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [parentEmail, setParentEmail] = useState(profile.parentEmail || "");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Parent email is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  useEffect(() => {
    const errorMessage = validateEmail(parentEmail);
    setError(errorMessage);
    setIsValid(!errorMessage);
  }, [parentEmail]);

  const handleNext = () => {
    if (isValid) {
      updateProfile({ parentEmail: parentEmail.trim() });
      setLocation("/profile/password");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleNext();
    }
  };

  return (
    <OnboardingLayout step={12} totalSteps={15}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        <div className="flex-1 space-y-8">
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            Parent's Email
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            We need a parent or guardian's email to keep them updated on your progress.
          </p>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="parent@email.com"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                style={{ height: '56px' }}
                aria-describedby={error ? "parent-email-error" : undefined}
              />
              {isValid && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            {error && (
              <p 
                id="parent-email-error"
                className="text-red-500 text-sm"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            )}
          </div>

          <div className="bg-orange-50 p-4 rounded-xl">
            <p className="text-sm text-orange-700">
              Your parent will receive updates about your achievements and can help you on your health journey!
            </p>
          </div>
        </div>

        <div className="mt-auto pb-6 flex justify-center">
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="max-w-[366px] w-full text-white h-12 text-base font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: isValid ? '#FF6A00' : '#9CA3AF',
              borderRadius: '13px'
            }}
          >
            Next
          </Button>
        </div>

      </div>
    </OnboardingLayout>
  );
}
