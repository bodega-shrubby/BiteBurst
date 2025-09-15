import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

const AGE_OPTIONS = [
  { value: "6-8", label: "6–8", emoji: "🧒" },
  { value: "9-11", label: "9–11", emoji: "👦" },
  { value: "12-14", label: "12–14", emoji: "👧" }
];

export default function AgeStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [selectedAge, setSelectedAge] = useState(profile.ageBracket || "");

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
    updateProfile({ ageBracket: age });
  };

  return (
    <OnboardingLayout step={3} totalSteps={13}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            How old are you?
          </h1>

          {/* Age Selection Chips */}
          <div className="space-y-4">
            {AGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAgeSelect(option.value)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-lg font-medium rounded-full border-2 transition-all duration-200 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  selectedAge === option.value
                    ? 'text-white border-orange-500'
                    : 'text-black border-gray-200 hover:border-gray-300'
                }`}
                style={{ 
                  minHeight: '56px',
                  backgroundColor: selectedAge === option.value ? 'var(--bb-header, #FF6A00)' : 'white'
                }}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="flex-1 text-left">{option.label}</span>
                {selectedAge === option.value && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Manual Next Button (backup) - Fixed at Bottom */}
        {selectedAge && (
          <div className="mt-auto pb-6 flex justify-center">
            <Button
              onClick={() => {
                updateProfile({ ageBracket: selectedAge });
                setLocation("/profile/goal");
              }}
              className="max-w-[366px] w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white h-12 text-base font-bold uppercase tracking-wider"
              style={{ borderRadius: '13px' }}
            >
              Next
            </Button>
          </div>
        )}

      </div>
    </OnboardingLayout>
  );
}