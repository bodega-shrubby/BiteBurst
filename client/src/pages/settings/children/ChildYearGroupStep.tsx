import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";

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

export default function ChildYearGroupStep() {
  const [, setLocation] = useLocation();
  const { profile, updateProfile, curriculumCountry } = useAddChildContext();
  const [selectedYearGroup, setSelectedYearGroup] = useState(profile.yearGroup || "");

  const yearGroupOptions = useMemo(() => {
    return getYearGroupOptions(curriculumCountry);
  }, [curriculumCountry]);

  const handleYearGroupSelect = (option: YearGroupOption) => {
    setSelectedYearGroup(option.id);
    updateProfile({
      yearGroup: option.id,
      curriculumId: option.curriculumId
    });
  };

  const questionText = curriculumCountry === "uk"
    ? "What year group is your child in?"
    : "What grade is your child in?";

  return (
    <AddChildLayout step={2} totalSteps={6}>
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            {questionText}
          </h1>
          <p className="text-gray-500">
            Based on {curriculumCountry === 'uk' ? 'UK' : 'US'} curriculum (inherited from family)
          </p>

          <div className="grid grid-cols-2 gap-3">
            {yearGroupOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleYearGroupSelect(option)}
                className={`px-4 py-4 text-lg font-bold rounded-2xl border-2 transition-all duration-200 hover:scale-[0.98] ${
                  selectedYearGroup === option.id
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {selectedYearGroup && (
          <div className="mt-auto pb-6">
            <Button
              onClick={() => setLocation("/settings/children/add/goal")}
              className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition"
            >
              NEXT
            </Button>
          </div>
        )}
      </div>
    </AddChildLayout>
  );
}
