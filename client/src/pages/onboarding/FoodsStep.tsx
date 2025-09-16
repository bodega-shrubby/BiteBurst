import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

const FOOD_OPTIONS = [
  "🥗 Salad", "🍲 Soup", "🍛 Rice + Curry", "🥘 Biryani", "🌮 Tacos", "🌯 Burrito",
  "🍣 Sushi", "🍜 Noodles", "🥟 Dumplings", "🥙 Wraps", "🥩 Grilled Meat/Fish", 
  "🥪 Sandwich", "🍝 Pasta", "🍕 Pizza", "🍔 Burger", "🍟 Fries", "🥞 Pancakes", 
  "🍳 Eggs", "🥖 Bread/Rolls", "🍦 Ice Cream", "🍫 Chocolate", "🍩 Donuts"
];

// Utility function to strip emoji and get clean text
const stripEmoji = (text: string): string => {
  return text.replace(/^[^\s]+\s/, "").trim();
};

export default function FoodsStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [selectedFoods, setSelectedFoods] = useState<string[]>(profile.favorite_foods || []);
  
  const toggleFood = (food: string) => {
    const cleanFood = stripEmoji(food);
    setSelectedFoods(prev => {
      if (prev.includes(cleanFood)) {
        return prev.filter(f => f !== cleanFood);
      } else {
        return [...prev, cleanFood];
      }
    });
  };

  const handleNext = () => {
    if (selectedFoods.length > 0) {
      updateProfile({ favorite_foods: selectedFoods });
      setLocation("/profile/preferences/sports");
    }
  };

  const isSelected = (food: string): boolean => {
    const cleanFood = stripEmoji(food);
    return selectedFoods.includes(cleanFood);
  };

  return (
    <OnboardingLayout step={8} totalSteps={14}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            What foods do you enjoy eating?
          </h1>

          {/* Food Selection Grid */}
          <div className="grid grid-cols-2 gap-3">
            {FOOD_OPTIONS.map((food) => (
              <button
                key={food}
                onClick={() => toggleFood(food)}
                className={`relative flex items-center justify-center gap-2 p-4 text-center rounded-xl border-2 transition-all duration-200 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  isSelected(food)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ minHeight: '80px' }}
                data-testid={`food-${stripEmoji(food).toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="text-sm font-medium text-gray-800 text-center leading-tight">
                  {food}
                </span>
                {isSelected(food) && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Selection Count */}
          {selectedFoods.length > 0 && (
            <p className="text-sm text-gray-600 text-center">
              {selectedFoods.length} food{selectedFoods.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Next Button - Fixed at Bottom */}
        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            disabled={selectedFoods.length === 0}
            className="w-full text-white font-bold text-lg rounded-full transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: selectedFoods.length > 0 ? 'var(--bb-header, #FF6A00)' : '#9CA3AF',
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