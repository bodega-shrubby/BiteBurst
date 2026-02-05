import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

const ageOptions = [
  { value: 6, label: "6 years old" },
  { value: 7, label: "7 years old" },
  { value: 8, label: "8 years old" },
  { value: 9, label: "9 years old" },
  { value: 10, label: "10 years old" },
  { value: 11, label: "11 years old" },
  { value: 12, label: "12 years old" },
  { value: 13, label: "13 years old" },
  { value: 14, label: "14 years old" },
];

export default function AgeStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [selectedAge, setSelectedAge] = useState<number | null>(profile.age || null);

  useEffect(() => {
    if (!profile.locale) {
      setLocation("/profile/location");
    }
  }, [profile.locale, setLocation]);

  const handleAgeSelect = (age: number) => {
    setSelectedAge(age);
    updateProfile({ age });
  };

  return (
    <OnboardingLayout step={5} totalSteps={11}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        <div className="flex-1 space-y-6">
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            How old is {profile.displayName || "your child"}?
          </h1>

          <div className="grid grid-cols-3 gap-3">
            {ageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAgeSelect(option.value)}
                className={`flex items-center justify-center px-4 py-4 text-lg font-bold rounded-2xl border-2 transition-all duration-200 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  selectedAge === option.value
                    ? 'text-white border-orange-500'
                    : 'text-gray-800 border-gray-200 hover:border-gray-300'
                }`}
                style={{ 
                  minHeight: '72px',
                  backgroundColor: selectedAge === option.value ? 'var(--bb-header, #FF6A00)' : 'white'
                }}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>

        {selectedAge && (
          <div className="mt-auto pb-6 flex justify-center">
            <Button
              onClick={() => {
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
