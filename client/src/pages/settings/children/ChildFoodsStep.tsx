import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";

const FOOD_OPTIONS = [
  "🍕 Pizza", "🍔 Burger", "🌮 Tacos", "🍝 Pasta", "🍛 Curry", "🍜 Noodles",
  "🥗 Salad", "🥪 Sandwich", "🍲 Soup", "🍣 Sushi", "🥞 Pancakes", 
  "🧇 Waffles", "🥐 Croissant", "🍱 Bento", "🌯 Wrap", "🥙 Pita"
];

const stripEmoji = (text: string): string => {
  return text.replace(/^[^\s]+\s/, "").trim();
};

export default function ChildFoodsStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useAddChildContext();
  const [selectedFoods, setSelectedFoods] = useState<string[]>(profile.favoriteFoods || []);
  
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
    updateProfile({ favoriteFoods: selectedFoods });
    setLocation("/settings/children/add/sports");
  };

  const isSelected = (food: string): boolean => {
    const cleanFood = stripEmoji(food);
    return selectedFoods.includes(cleanFood);
  };

  return (
    <AddChildLayout step={6} totalSteps={9}>
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            What foods does {profile.name} enjoy?
          </h1>

          <div className="grid grid-cols-2 gap-3">
            {FOOD_OPTIONS.map((food) => (
              <button
                key={food}
                onClick={() => toggleFood(food)}
                className={`relative flex items-center justify-center gap-2 p-4 text-center rounded-xl border-2 transition-all duration-200 hover:scale-[0.98] ${
                  isSelected(food)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ minHeight: '72px' }}
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

          {selectedFoods.length > 0 && (
            <p className="text-sm text-gray-600 text-center">
              {selectedFoods.length} food{selectedFoods.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            disabled={selectedFoods.length === 0}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
          >
            NEXT
          </Button>
        </div>
      </div>
    </AddChildLayout>
  );
}
