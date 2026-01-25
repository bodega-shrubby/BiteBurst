import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

const VEGGIE_OPTIONS = [
  "🥦 Broccoli", "🥕 Carrot", "🥒 Cucumber", "🍅 Tomato", "🌽 Corn", 
  "🥬 Lettuce", "🧅 Onion", "🥔 Potato", "🫑 Bell Pepper", "🥬 Spinach", 
  "🫛 Peas", "🥦 Cauliflower", "🍆 Aubergine"
];

// Utility function to strip emoji and get clean text
const stripEmoji = (text: string): string => {
  return text.replace(/^[^\s]+\s/, "").trim();
};

export default function VeggiesStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [selectedVeggies, setSelectedVeggies] = useState<string[]>(profile.favorite_veggies || []);
  
  const toggleVeggie = (veggie: string) => {
    const cleanVeggie = stripEmoji(veggie);
    setSelectedVeggies(prev => {
      if (prev.includes(cleanVeggie)) {
        return prev.filter(v => v !== cleanVeggie);
      } else {
        return [...prev, cleanVeggie];
      }
    });
  };

  const handleNext = () => {
    if (selectedVeggies.length > 0) {
      updateProfile({ favorite_veggies: selectedVeggies });
      setLocation("/profile/preferences/foods");
    }
  };

  const isSelected = (veggie: string): boolean => {
    const cleanVeggie = stripEmoji(veggie);
    return selectedVeggies.includes(cleanVeggie);
  };

  return (
    <OnboardingLayout step={8} totalSteps={11}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            Which veggies do you like?
          </h1>

          {/* Veggie Selection Grid */}
          <div className="grid grid-cols-2 gap-3">
            {VEGGIE_OPTIONS.map((veggie) => (
              <button
                key={veggie}
                onClick={() => toggleVeggie(veggie)}
                className={`relative flex items-center justify-center gap-2 p-4 text-center rounded-xl border-2 transition-all duration-200 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  isSelected(veggie)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ minHeight: '80px' }}
                data-testid={`veggie-${stripEmoji(veggie).toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="text-sm font-medium text-gray-800 text-center leading-tight">
                  {veggie}
                </span>
                {isSelected(veggie) && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Selection Count */}
          {selectedVeggies.length > 0 && (
            <p className="text-sm text-gray-600 text-center">
              {selectedVeggies.length} veggie{selectedVeggies.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Next Button - Fixed at Bottom */}
        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            disabled={selectedVeggies.length === 0}
            className="w-full text-white font-bold text-lg rounded-full transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: selectedVeggies.length > 0 ? 'var(--bb-header, #FF6A00)' : '#9CA3AF',
              height: 'var(--tap, 56px)'
            }}
            data-testid="button-next"
          >
            Next
          </Button>
        </div>

      </div>
    </OnboardingLayout>
  );
}