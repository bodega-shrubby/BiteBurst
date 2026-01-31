import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";

const SPORT_OPTIONS = [
  "⚽ Football", "🏀 Basketball", "🎾 Tennis", "🏊 Swimming", 
  "🚴 Cycling", "🏃 Running", "🤸 Gymnastics", "⚾ Baseball",
  "🏐 Volleyball", "🏓 Table Tennis", "🎳 Bowling", "⛳ Golf",
  "🥋 Martial Arts", "💃 Dancing", "🧘 Yoga", "🛹 Skateboarding"
];

const stripEmoji = (text: string): string => {
  return text.replace(/^[^\s]+\s/, "").trim();
};

export default function ChildSportsStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useAddChildContext();
  const [selectedSports, setSelectedSports] = useState<string[]>(profile.favoriteSports || []);
  
  const toggleSport = (sport: string) => {
    const cleanSport = stripEmoji(sport);
    setSelectedSports(prev => {
      if (prev.includes(cleanSport)) {
        return prev.filter(s => s !== cleanSport);
      } else {
        return [...prev, cleanSport];
      }
    });
  };

  const handleNext = () => {
    updateProfile({ favoriteSports: selectedSports });
    setLocation("/settings/children/add/avatar");
  };

  const isSelected = (sport: string): boolean => {
    const cleanSport = stripEmoji(sport);
    return selectedSports.includes(cleanSport);
  };

  return (
    <AddChildLayout step={7} totalSteps={9}>
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            What sports does {profile.name} like?
          </h1>

          <div className="grid grid-cols-2 gap-3">
            {SPORT_OPTIONS.map((sport) => (
              <button
                key={sport}
                onClick={() => toggleSport(sport)}
                className={`relative flex items-center justify-center gap-2 p-4 text-center rounded-xl border-2 transition-all duration-200 hover:scale-[0.98] ${
                  isSelected(sport)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ minHeight: '72px' }}
              >
                <span className="text-sm font-medium text-gray-800 text-center leading-tight">
                  {sport}
                </span>
                {isSelected(sport) && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {selectedSports.length > 0 && (
            <p className="text-sm text-gray-600 text-center">
              {selectedSports.length} sport{selectedSports.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            disabled={selectedSports.length === 0}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
          >
            NEXT
          </Button>
        </div>
      </div>
    </AddChildLayout>
  );
}
