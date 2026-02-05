import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";

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

export default function ChildAgeStep() {
  const [, setLocation] = useLocation();
  const { profile, updateProfile } = useAddChildContext();
  const [selectedAge, setSelectedAge] = useState<number | null>(profile.age || null);

  const handleAgeSelect = (age: number) => {
    setSelectedAge(age);
    updateProfile({ age });
  };

  return (
    <AddChildLayout step={2} totalSteps={9}>
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            How old is {profile.name || "your child"}?
          </h1>

          <div className="grid grid-cols-3 gap-3">
            {ageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAgeSelect(option.value)}
                className={`px-4 py-4 text-lg font-bold rounded-2xl border-2 transition-all duration-200 hover:scale-[0.98] ${
                  selectedAge === option.value
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                {option.value}
              </button>
            ))}
          </div>
        </div>

        {selectedAge && (
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
