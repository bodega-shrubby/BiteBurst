import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

export default function ConsentStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [hasConsent, setHasConsent] = useState(profile.hasParentConsent || false);

  const handleNext = () => {
    if (hasConsent) {
      updateProfile({ hasParentConsent: true });
      setLocation("/profile/review");
    }
  };

  return (
    <OnboardingLayout step={13} totalSteps={14}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            Almost ready!
          </h1>

          {/* Consent Section */}
          <div className="space-y-6">
            <div className="bg-orange-50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    id="consent-checkbox"
                    checked={hasConsent}
                    onChange={(e) => setHasConsent(e.target.checked)}
                    className="w-5 h-5 text-orange-600 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                    style={{ minWidth: '20px', minHeight: '20px' }}
                  />
                </div>
                <label 
                  htmlFor="consent-checkbox" 
                  className="text-gray-700 text-lg leading-relaxed cursor-pointer"
                >
                  <strong>I have permission to create this account.</strong>
                  <br />
                  <span className="text-base">
                    If you're under 18, make sure a parent or guardian says it's okay to use BiteBurst.
                  </span>
                </label>
              </div>
            </div>

            {/* Terms and Privacy */}
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>
                By continuing, you agree to BiteBurst's{" "}
                <a href="#" className="text-orange-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-orange-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Next Button - Fixed at Bottom */}
        <div className="mt-auto pb-6 flex justify-center">
          <Button
            onClick={handleNext}
            disabled={!hasConsent}
            className="max-w-[366px] w-full text-white h-12 text-base font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: hasConsent ? '#FF6A00' : '#9CA3AF',
              borderRadius: '13px'
            }}
          >
            Continue
          </Button>
        </div>

      </div>
    </OnboardingLayout>
  );
}