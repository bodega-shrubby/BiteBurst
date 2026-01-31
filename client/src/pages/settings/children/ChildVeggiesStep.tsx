import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";

const VEGGIE_OPTIONS = [
  "🥦 Broccoli", "🥕 Carrot", "🥒 Cucumber", "🍅 Tomato", "🌽 Corn", 
  "🥬 Lettuce", "🧅 Onion", "🥔 Potato", "🫑 Bell Pepper", "🥬 Spinach", 
  "🫛 Peas", "🥦 Cauliflower", "🍆 Aubergine"
];

const stripEmoji = (text: string): string => {
  return text.replace(/^[^\s]+\s/, "").trim();
};

export default function ChildVeggiesStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useAddChildContext();
  const [selectedVeggies, setSelectedVeggies] = useState<string[]>(profile.favoriteVeggies || []);
  
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
    updateProfile({ favoriteVeggies: selectedVeggies });
    setLocation("/settings/children/add/foods");
  };

  const isSelected = (veggie: string): boolean => {
    const cleanVeggie = stripEmoji(veggie);
    return selectedVeggies.includes(cleanVeggie);
  };

  return (
    <AddChildLayout step={5} totalSteps={9}>
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            Which veggies does {profile.name} like?
          </h1>

          <div className="grid grid-cols-2 gap-3">
            {VEGGIE_OPTIONS.map((veggie) => (
              <button
                key={veggie}
                onClick={() => toggleVeggie(veggie)}
                className={`relative flex items-center justify-center gap-2 p-4 text-center rounded-xl border-2 transition-all duration-200 hover:scale-[0.98] ${
                  isSelected(veggie)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ minHeight: '72px' }}
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

          {selectedVeggies.length > 0 && (
            <p className="text-sm text-gray-600 text-center">
              {selectedVeggies.length} veggie{selectedVeggies.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            disabled={selectedVeggies.length === 0}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
          >
            NEXT
          </Button>
        </div>
      </div>
    </AddChildLayout>
  );
}
