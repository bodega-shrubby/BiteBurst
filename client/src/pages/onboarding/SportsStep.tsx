import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";

const SPORTS_OPTIONS = [
  "⚽ Football (Soccer)",
  "🏀 Basketball",
  "🏉 Rugby",
  "🏑 Hockey",
  "🎾 Tennis",
  "🏐 Netball",
  "🏏 Cricket",
  "🏃 Athletics/Running",
  "🚴 Cycling",
  "🏊 Swimming",
  "🥊 Boxing/Martial Arts",
  "🕺 Dancing",
  "🏂 Snowboarding",
  "⛷️ Skiing",
  "🏐 Volleyball"
];

// Utility function to strip emoji and get clean text
const stripEmoji = (text: string): string => {
  return text.replace(/^[^\s]+\s/, "").trim();
};

export default function SportsStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [selectedSports, setSelectedSports] = useState<string[]>(profile.favorite_sports || []);
  
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
    if (selectedSports.length > 0) {
      updateProfile({ favorite_sports: selectedSports });
      setLocation("/profile/avatar");
    }
  };

  const isSelected = (sport: string): boolean => {
    const cleanSport = stripEmoji(sport);
    return selectedSports.includes(cleanSport);
  };

  return (
    <OnboardingLayout step={9} totalSteps={14}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Title */}
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            What do you love to do most?
          </h1>

          {/* Sports Selection Grid */}
          <div className="grid grid-cols-2 gap-3">
            {SPORTS_OPTIONS.map((sport) => (
              <button
                key={sport}
                onClick={() => toggleSport(sport)}
                className={`relative flex items-center justify-center gap-2 p-4 text-center rounded-xl border-2 transition-all duration-200 hover:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                  isSelected(sport)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                style={{ minHeight: '80px' }}
                data-testid={`sport-${stripEmoji(sport).toLowerCase().replace(/\s+/g, '-')}`}
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

          {/* Selection Count */}
          {selectedSports.length > 0 && (
            <p className="text-sm text-gray-600 text-center">
              {selectedSports.length} sport{selectedSports.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

        {/* Next Button - Fixed at Bottom */}
        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            disabled={selectedSports.length === 0}
            className="w-full text-white font-bold text-lg rounded-full transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: selectedSports.length > 0 ? 'var(--bb-header, #FF6A00)' : '#9CA3AF',
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