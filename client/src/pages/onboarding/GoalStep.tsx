import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

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

export default function GoalStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [selectedGoal, setSelectedGoal] = useState(profile.goal || "");

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    updateProfile({ goal });
  };

  return (
    <OnboardingLayout step={4} totalSteps={13}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            Pick your main goal
          </h1>

          {/* Goal Selection Cards */}
          <div className="space-y-4">
            {GOAL_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleGoalSelect(option.value)}
                className={`w-full flex flex-col items-center gap-3 p-6 text-center rounded-2xl border-2 transition-all duration-200 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  selectedGoal === option.value
                    ? 'text-white border-orange-500'
                    : 'text-black border-gray-200 hover:border-gray-300'
                }`}
                style={{ 
                  minHeight: '120px',
                  backgroundColor: selectedGoal === option.value ? 'var(--bb-header, #FF6A00)' : 'white'
                }}
              >
                <div className="text-4xl">{option.emoji}</div>
                <div>
                  <div className="text-xl font-bold">{option.label}</div>
                  <div className={`text-sm mt-1 ${selectedGoal === option.value ? 'text-orange-100' : 'text-gray-600'}`}>
                    {option.description}
                  </div>
                </div>
                {selectedGoal === option.value && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center">
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
        {selectedGoal && (
          <div className="mt-auto pb-6">
            <Button
              onClick={() => {
                updateProfile({ goal: selectedGoal });
                setLocation("/profile/preferences/fruits");
              }}
              className="w-full text-white font-bold text-lg rounded-full transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              style={{ 
                backgroundColor: 'var(--bb-header, #FF6A00)',
                height: 'var(--tap, 56px)'
              }}
            >
              Next
            </Button>
          </div>
        )}

      </div>
    </OnboardingLayout>
  );
}