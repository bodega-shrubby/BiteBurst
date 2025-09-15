import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

export default function EmailStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [email, setEmail] = useState(profile.email || "");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false); // Required field, so invalid by default

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  useEffect(() => {
    const errorMessage = validateEmail(email);
    setError(errorMessage);
    setIsValid(!errorMessage);
  }, [email]);

  const handleNext = () => {
    if (isValid) {
      updateProfile({ email: email.trim() });
      setLocation("/profile/password");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleNext();
    }
  };

  return (
    <OnboardingLayout step={6} totalSteps={9}>
      <div className="space-y-8">
        
        {/* Title */}
        <h1 
          className="font-extrabold text-3xl leading-tight"
          style={{ color: 'var(--bb-text, #000000)' }}
        >
          What's your email?
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 leading-relaxed">
          We'll send you updates about your progress and new features.
        </p>

        {/* Email Input */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="your@email.com"
              className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
              style={{ height: '56px' }}
              aria-describedby={error ? "email-error" : undefined}
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
              id="email-error"
              className="text-red-500 text-sm"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          )}
        </div>

        {/* Next Button */}
        <div className="pt-8 flex justify-center">
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