import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

const FRUIT_OPTIONS = [
  "🍎 Apple", "🍌 Banana", "🍇 Grapes", "🍊 Orange", "🍓 Strawberry", "🥭 Mango",
  "🍍 Pineapple", "🍑 Peach", "🍐 Pear", "🍉 Watermelon", "🫐 Blueberries", 
  "🍒 Cherries", "🍋 Lemon", "🍈 Melon", "🍏 Green Apple", "🥝 Kiwi"
];

// Utility function to strip emoji and get clean text
const stripEmoji = (text: string): string => {
  return text.replace(/^[^\s]+\s/, "").trim();
};

export default function FruitsStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [selectedFruits, setSelectedFruits] = useState<string[]>(profile.favorite_fruits || []);
  
  const toggleFruit = (fruit: string) => {
    const cleanFruit = stripEmoji(fruit);
    setSelectedFruits(prev => {
      if (prev.includes(cleanFruit)) {
        return prev.filter(f => f !== cleanFruit);
      } else {
        return [...prev, cleanFruit];
      }
    });
  };

  const handleNext = () => {
    if (selectedFruits.length > 0) {
      updateProfile({ favorite_fruits: selectedFruits });
      setLocation("/profile/preferences/veggies");
    }
  };

  const isSelected = (fruit: string): boolean => {
    const cleanFruit = stripEmoji(fruit);
    return selectedFruits.includes(cleanFruit);
  };

  return (
    <OnboardingLayout step={5} totalSteps={12}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            Which fruits do you love the most?
          </h1>

          {/* Fruit Selection Grid */}
          <div className="grid grid-cols-2 gap-3">
            {FRUIT_OPTIONS.map((fruit) => (
              <button
                key={fruit}
                onClick={() => toggleFruit(fruit)}
                className={`relative flex items-center justify-center gap-2 p-4 text-center rounded-xl border-2 transition-all duration-200 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  isSelected(fruit)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ minHeight: '80px' }}
                data-testid={`fruit-${stripEmoji(fruit).toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="text-sm font-medium text-gray-800 text-center leading-tight">
                  {fruit}
                </span>
                {isSelected(fruit) && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Selection Count */}
          {selectedFruits.length > 0 && (
            <p className="text-sm text-gray-600 text-center">
              {selectedFruits.length} fruit{selectedFruits.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Next Button - Fixed at Bottom */}
        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            disabled={selectedFruits.length === 0}
            className="w-full text-white font-bold text-lg rounded-full transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: selectedFruits.length > 0 ? 'var(--bb-header, #FF6A00)' : '#9CA3AF',
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