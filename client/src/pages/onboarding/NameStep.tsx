import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

export default function NameStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [name, setName] = useState(profile.displayName || "");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateName = (value: string) => {
    const trimmed = value.trim();
    
    if (trimmed.length < 2) {
      return "Name must be at least 2 characters";
    }
    if (trimmed.length > 20) {
      return "Name must be no more than 20 characters";
    }
    if (!/^[a-zA-Z\s-]+$/.test(trimmed)) {
      return "Name can only contain letters, spaces, and hyphens";
    }
    return "";
  };

  useEffect(() => {
    const errorMessage = validateName(name);
    setError(errorMessage);
    setIsValid(!errorMessage && name.trim().length > 0);
  }, [name]);

  const handleNext = () => {
    if (isValid) {
      updateProfile({ displayName: name.trim() });
      setLocation("/profile/age");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleNext();
    }
  };

  return (
    <OnboardingLayout step={2} totalSteps={12}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            What's your name?
          </h1>

          {/* Name Input */}
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                style={{ height: '56px' }}
                maxLength={20}
                autoFocus
                aria-describedby={error ? "name-error" : undefined}
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
                id="name-error"
                className="text-red-500 text-sm"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Next Button - Fixed at Bottom */}
        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="w-full text-white font-bold text-lg rounded-full transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: isValid ? 'var(--bb-header, #FF6A00)' : '#9CA3AF',
              height: 'var(--tap, 56px)'
            }}
          >
            Next
          </Button>
        </div>

      </div>
    </OnboardingLayout>
  );
}