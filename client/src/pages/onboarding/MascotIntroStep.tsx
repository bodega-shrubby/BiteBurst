import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import sunnySliceImage from "@assets/Mascots/SunnySlice.png";

export default function MascotIntroStep() {
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    setLocation("/profile/name");
  };

  return (
    <OnboardingLayout step={1} totalSteps={8}>
      <div className="text-center space-y-8">
        
        {/* Speech Bubble */}
        <div className="flex justify-center">
          <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-6 max-w-xs shadow-lg">
            <p className="text-lg font-medium text-gray-800">
              Hi, I'm Sunny Slice!
            </p>
            {/* Speech bubble tail */}
            <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2">
              <div className="w-6 h-6 bg-white border-l-2 border-b-2 border-gray-200 transform rotate-[-45deg]"></div>
            </div>
          </div>
        </div>

        {/* Mascot Image */}
        <div className="flex justify-center py-8">
          <img 
            src={sunnySliceImage} 
            alt="Sunny Slice mascot" 
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Continue Button */}
        <div className="pt-8">
          <Button
            onClick={handleContinue}
            className="w-full text-white font-bold text-lg rounded-full transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            style={{ 
              backgroundColor: 'var(--bb-header, #FF6A00)',
              height: 'var(--tap, 56px)'
            }}
            data-testid="button-continue"
          >
            CONTINUE
          </Button>
        </div>

      </div>
    </OnboardingLayout>
  );
}