import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import oniTheOrangeImage from "@assets/Mascots/Oni_the_orange.png";

export default function MascotIntroStep() {
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    setLocation("/profile/account");
  };

  return (
    <OnboardingLayout step={1} totalSteps={11}>
      <div className="flex flex-col h-full min-h-[calc(100vh-120px)]">
        
        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
          
          {/* Speech Bubble */}
          <div className="flex justify-center mb-4">
            <div className="relative bg-white border-2 border-gray-200 rounded-3xl p-6 max-w-xs shadow-lg">
              <p className="text-lg font-medium text-gray-800">
                Hi, I'm Oni the Orange!
              </p>
              {/* Speech bubble tail */}
              <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2">
                <div className="w-6 h-6 bg-white border-l-2 border-b-2 border-gray-200 transform rotate-[-45deg]"></div>
              </div>
            </div>
          </div>

          {/* Mascot Image - 2x Larger */}
          <div className="flex justify-center">
            <img 
              src={oniTheOrangeImage} 
              alt="Oni the Orange mascot" 
              className="w-64 h-64 object-contain"
            />
          </div>

        </div>

        {/* Continue Button - Fixed at Bottom */}
        <div className="mt-auto pb-6">
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