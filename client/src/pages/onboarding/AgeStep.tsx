import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

interface YearGroupOption {
  id: string;
  label: string;
  curriculumId: string;
}

const getYearGroupOptions = (country: 'uk' | 'us'): YearGroupOption[] => {
  if (country === 'uk') {
    return [
      { id: 'year-2', label: 'Year 2', curriculumId: 'uk-ks1' },
      { id: 'year-3', label: 'Year 3', curriculumId: 'uk-ks2' },
      { id: 'year-4', label: 'Year 4', curriculumId: 'uk-ks2' },
      { id: 'year-5', label: 'Year 5', curriculumId: 'uk-ks2' },
      { id: 'year-6', label: 'Year 6', curriculumId: 'uk-ks2' },
      { id: 'year-7', label: 'Year 7', curriculumId: 'uk-ks3' },
      { id: 'year-8', label: 'Year 8', curriculumId: 'uk-ks3' },
      { id: 'year-9', label: 'Year 9', curriculumId: 'uk-ks3' },
    ];
  } else {
    return [
      { id: 'grade-1', label: 'Grade 1', curriculumId: 'us-k2' },
      { id: 'grade-2', label: 'Grade 2', curriculumId: 'us-k2' },
      { id: 'grade-3', label: 'Grade 3', curriculumId: 'us-35' },
      { id: 'grade-4', label: 'Grade 4', curriculumId: 'us-35' },
      { id: 'grade-5', label: 'Grade 5', curriculumId: 'us-35' },
      { id: 'grade-6', label: 'Grade 6', curriculumId: 'us-68' },
      { id: 'grade-7', label: 'Grade 7', curriculumId: 'us-68' },
      { id: 'grade-8', label: 'Grade 8', curriculumId: 'us-68' },
    ];
  }
};

export default function AgeStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [selectedYearGroup, setSelectedYearGroup] = useState(profile.yearGroup || "");

  useEffect(() => {
    if (!profile.curriculumCountry) {
      setLocation("/profile/curriculum");
    }
  }, [profile.curriculumCountry, setLocation]);

  const yearGroupOptions = useMemo(() => {
    return getYearGroupOptions(profile.curriculumCountry as 'uk' | 'us');
  }, [profile.curriculumCountry]);

  const handleYearGroupSelect = (option: YearGroupOption) => {
    setSelectedYearGroup(option.id);
    updateProfile({ 
      yearGroup: option.id,
      curriculum: option.curriculumId 
    });
  };

  const questionText = profile.curriculumCountry === "uk" 
    ? "What year group is your child in?"
    : "What grade is your child in?";

  return (
    <OnboardingLayout step={5} totalSteps={11}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        <div className="flex-1 space-y-6">
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            {questionText}
          </h1>

          <div className="grid grid-cols-2 gap-3">
            {yearGroupOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleYearGroupSelect(option)}
                className={`flex items-center justify-center px-4 py-4 text-lg font-bold rounded-2xl border-2 transition-all duration-200 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  selectedYearGroup === option.id
                    ? 'text-white border-orange-500'
                    : 'text-gray-800 border-gray-200 hover:border-gray-300'
                }`}
                style={{ 
                  minHeight: '72px',
                  backgroundColor: selectedYearGroup === option.id ? 'var(--bb-header, #FF6A00)' : 'white'
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {selectedYearGroup && (
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
