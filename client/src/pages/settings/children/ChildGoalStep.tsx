import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";

const GOAL_OPTIONS = [
  { 
    value: "energy", 
    label: "Energy", 
    emoji: "⚡",
    description: "Feel energized throughout the day"
  },
  { 
    value: "focus", 
    label: "Focus", 
    emoji: "🧠",
    description: "Stay sharp and focused at school"
  },
  { 
    value: "strength", 
    label: "Strength", 
    emoji: "💪",
    description: "Build strength for sports and activities"
  }
];

export default function ChildGoalStep() {
  const [, setLocation] = useLocation();
  const { profile, updateProfile } = useAddChildContext();
  const [selectedGoal, setSelectedGoal] = useState(profile.goal || "");

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    updateProfile({ goal });
  };

  return (
    <AddChildLayout step={3} totalSteps={9}>
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            Pick {profile.name}'s main goal
          </h1>

          <div className="space-y-4">
            {GOAL_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleGoalSelect(option.value)}
                className={`w-full flex flex-col items-center gap-3 p-6 text-center rounded-2xl border-2 transition-all duration-200 hover:scale-[0.98] ${
                  selectedGoal === option.value
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="text-4xl">{option.emoji}</div>
                <div>
                  <div className="text-xl font-bold">{option.label}</div>
                  <div className={`text-sm mt-1 ${selectedGoal === option.value ? 'text-orange-100' : 'text-gray-600'}`}>
                    {option.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedGoal && (
          <div className="mt-auto pb-6">
            <Button
              onClick={() => setLocation("/settings/children/add/fruits")}
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
