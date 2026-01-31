import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";

const FRUIT_OPTIONS = [
  "🍎 Apple", "🍌 Banana", "🍇 Grapes", "🍊 Orange", "🍓 Strawberry", "🥭 Mango",
  "🍍 Pineapple", "🍑 Peach", "🍐 Pear", "🍉 Watermelon", "🫐 Blueberries", 
  "🍒 Cherries", "🍋 Lemon", "🍈 Melon", "🍏 Green Apple", "🥝 Kiwi"
];

const stripEmoji = (text: string): string => {
  return text.replace(/^[^\s]+\s/, "").trim();
};

export default function ChildFruitsStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useAddChildContext();
  const [selectedFruits, setSelectedFruits] = useState<string[]>(profile.favoriteFruits || []);
  
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
    updateProfile({ favoriteFruits: selectedFruits });
    setLocation("/settings/children/add/veggies");
  };

  const isSelected = (fruit: string): boolean => {
    const cleanFruit = stripEmoji(fruit);
    return selectedFruits.includes(cleanFruit);
  };

  return (
    <AddChildLayout step={4} totalSteps={9}>
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            Which fruits does {profile.name} love?
          </h1>

          <div className="grid grid-cols-2 gap-3">
            {FRUIT_OPTIONS.map((fruit) => (
              <button
                key={fruit}
                onClick={() => toggleFruit(fruit)}
                className={`relative flex items-center justify-center gap-2 p-4 text-center rounded-xl border-2 transition-all duration-200 hover:scale-[0.98] ${
                  isSelected(fruit)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ minHeight: '72px' }}
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

          {selectedFruits.length > 0 && (
            <p className="text-sm text-gray-600 text-center">
              {selectedFruits.length} fruit{selectedFruits.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            disabled={selectedFruits.length === 0}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
          >
            NEXT
          </Button>
        </div>
      </div>
    </AddChildLayout>
  );
}
