import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

const UK_AGE_OPTIONS = [
  { value: "5-7", label: "Key Stage 1 (5-7 years)", emoji: "🧒", description: "Years 1-2" },
  { value: "7-11", label: "Key Stage 2 (7-11 years)", emoji: "👦", description: "Years 3-6" },
  { value: "11-14", label: "Key Stage 3 (11-14 years)", emoji: "👧", description: "Years 7-9" }
];

const US_AGE_OPTIONS = [
  { value: "5-7", label: "Grades K-2 (5-7 years)", emoji: "🧒", description: "Kindergarten to 2nd Grade" },
  { value: "7-11", label: "Grades 3-5 (7-11 years)", emoji: "👦", description: "3rd to 5th Grade" },
  { value: "11-14", label: "Grades 6-8 (11-14 years)", emoji: "👧", description: "Middle School" }
];

function deriveCurriculumId(country: string, ageBracket: string): string {
  if (country === "uk") {
    switch (ageBracket) {
      case "5-7": return "uk-ks1";
      case "7-11": return "uk-ks2";
      case "11-14": return "uk-ks3";
      default: return "uk-ks2";
    }
  } else {
    switch (ageBracket) {
      case "5-7": return "us-k2";
      case "7-11": return "us-35";
      case "11-14": return "us-68";
      default: return "us-35";
    }
  }
}

export default function AgeStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [selectedAge, setSelectedAge] = useState(profile.ageBracket || "");

  // Guard: Redirect to curriculum step if country not selected
  useEffect(() => {
    if (!profile.curriculumCountry) {
      setLocation("/profile/curriculum");
    }
  }, [profile.curriculumCountry, setLocation]);

  const ageOptions = useMemo(() => {
    return profile.curriculumCountry === "uk" ? UK_AGE_OPTIONS : US_AGE_OPTIONS;
  }, [profile.curriculumCountry]);

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
    const curriculumId = deriveCurriculumId(profile.curriculumCountry, age);
    updateProfile({ ageBracket: age, curriculum: curriculumId });
  };

  return (
    <OnboardingLayout step={5} totalSteps={11}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        <div className="flex-1 space-y-8">
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            What {profile.curriculumCountry === "uk" ? "year group" : "grade"} is {profile.displayName || 'your child'} in?
          </h1>

          <div className="space-y-4">
            {ageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAgeSelect(option.value)}
                className={`w-full flex items-center gap-4 px-6 py-4 text-lg font-medium rounded-2xl border-2 transition-all duration-200 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  selectedAge === option.value
                    ? 'text-white border-orange-500'
                    : 'text-black border-gray-200 hover:border-gray-300'
                }`}
                style={{ 
                  minHeight: '72px',
                  backgroundColor: selectedAge === option.value ? 'var(--bb-header, #FF6A00)' : 'white'
                }}
              >
                <span className="text-2xl">{option.emoji}</span>
                <div className="flex-1 text-left">
                  <div>{option.label}</div>
                  <div className={`text-sm ${selectedAge === option.value ? 'text-orange-100' : 'text-gray-500'}`}>
                    {option.description}
                  </div>
                </div>
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

        {selectedAge && (
          <div className="mt-auto pb-6 flex justify-center">
            <Button
              onClick={() => {
                const curriculumId = deriveCurriculumId(profile.curriculumCountry, selectedAge);
                updateProfile({ ageBracket: selectedAge, curriculum: curriculumId });
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