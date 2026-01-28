import { useState } from "react";
import { useLocation } from "wouter";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const countryOptions = [
  {
    id: "uk",
    flag: "🇬🇧",
    title: "United Kingdom",
    subtitle: "Key Stages curriculum",
  },
  {
    id: "us",
    flag: "🇺🇸",
    title: "United States",
    subtitle: "K-8 Grades curriculum",
  },
];

export default function CurriculumStep() {
  const [, setLocation] = useLocation();
  const { profile, updateProfile } = useOnboardingContext();
  const [selectedCountry, setSelectedCountry] = useState(profile.curriculumCountry || "");

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    updateProfile({ curriculumCountry: country });
  };

  const handleContinue = () => {
    if (selectedCountry) {
      setLocation("/profile/age");
    }
  };

  return (
    <OnboardingLayout step={4} totalSteps={11}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        <div className="flex-1 space-y-6">
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            Where does {profile.displayName || "your child"} go to school?
          </h1>

          <div className="space-y-4">
            {countryOptions.map((option) => (
              <Card
                key={option.id}
                onClick={() => handleCountrySelect(option.id)}
                className={cn(
                  "p-5 cursor-pointer transition-all duration-200 border-2",
                  selectedCountry === option.id
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-gray-200 hover:border-orange-300 hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{option.flag}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{option.title}</h3>
                    <p className="text-sm text-gray-600">{option.subtitle}</p>
                  </div>
                  {selectedCountry === option.id && (
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            💡 We'll match lessons to {profile.displayName || "your child"}'s school curriculum!
          </p>
        </div>

        {selectedCountry && (
          <div className="mt-auto pb-6 flex justify-center">
            <Button
              onClick={handleContinue}
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
