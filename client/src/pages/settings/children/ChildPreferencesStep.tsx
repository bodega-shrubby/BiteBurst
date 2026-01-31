import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";

const FOOD_OPTIONS = [
  "🍎 Apple", "🍌 Banana", "🍊 Orange", "🍓 Strawberry", "🍇 Grapes", "🥭 Mango",
  "🥕 Carrot", "🥦 Broccoli", "🥒 Cucumber", "🌽 Corn", "🍅 Tomato", "🥬 Lettuce",
  "🍕 Pizza", "🍔 Burger", "🍝 Pasta", "🍛 Rice", "🥗 Salad", "🌮 Tacos"
];

const SPORT_OPTIONS = [
  "⚽ Football", "🏀 Basketball", "🎾 Tennis", "🏊 Swimming", 
  "🚴 Cycling", "🏃 Running", "🤸 Gymnastics", "⚾ Baseball"
];

type TabType = 'foods' | 'sports';

export default function ChildPreferencesStep() {
  const [, setLocation] = useLocation();
  const { profile, updateProfile } = useAddChildContext();
  const [activeTab, setActiveTab] = useState<TabType>('foods');
  const [selectedFoods, setSelectedFoods] = useState<string[]>(profile.favoriteFoods || []);
  const [selectedSports, setSelectedSports] = useState<string[]>(profile.favoriteSports || []);

  const toggleFood = (food: string) => {
    const cleanFood = food.replace(/^[^\s]+\s/, "").trim();
    setSelectedFoods(prev => 
      prev.includes(cleanFood) 
        ? prev.filter(f => f !== cleanFood)
        : [...prev, cleanFood]
    );
  };

  const toggleSport = (sport: string) => {
    const cleanSport = sport.replace(/^[^\s]+\s/, "").trim();
    setSelectedSports(prev => 
      prev.includes(cleanSport) 
        ? prev.filter(s => s !== cleanSport)
        : [...prev, cleanSport]
    );
  };

  const handleNext = () => {
    updateProfile({
      favoriteFoods: selectedFoods,
      favoriteSports: selectedSports,
    });
    setLocation("/settings/children/add/review");
  };

  return (
    <AddChildLayout step={5} totalSteps={6}>
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            What does {profile.name} enjoy?
          </h1>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab('foods')}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                activeTab === 'foods' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Favorite Foods
            </button>
            <button
              onClick={() => setActiveTab('sports')}
              className={`flex-1 py-3 rounded-xl font-semibold transition ${
                activeTab === 'sports' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Favorite Sports
            </button>
          </div>

          {activeTab === 'foods' && (
            <div className="grid grid-cols-3 gap-2">
              {FOOD_OPTIONS.map((food) => {
                const cleanFood = food.replace(/^[^\s]+\s/, "").trim();
                const isSelected = selectedFoods.includes(cleanFood);
                return (
                  <button
                    key={food}
                    onClick={() => toggleFood(food)}
                    className={`relative p-3 rounded-xl text-sm font-medium transition ${
                      isSelected
                        ? 'bg-orange-100 text-orange-700 border-2 border-orange-500'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {food}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'sports' && (
            <div className="grid grid-cols-2 gap-3">
              {SPORT_OPTIONS.map((sport) => {
                const cleanSport = sport.replace(/^[^\s]+\s/, "").trim();
                const isSelected = selectedSports.includes(cleanSport);
                return (
                  <button
                    key={sport}
                    onClick={() => toggleSport(sport)}
                    className={`relative p-4 rounded-xl text-sm font-medium transition ${
                      isSelected
                        ? 'bg-orange-100 text-orange-700 border-2 border-orange-500'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {sport}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-sm text-gray-500 text-center">
            Selected: {selectedFoods.length} foods, {selectedSports.length} sports
          </p>
        </div>

        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition"
          >
            NEXT
          </Button>
        </div>
      </div>
    </AddChildLayout>
  );
}
