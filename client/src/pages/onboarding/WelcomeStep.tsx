import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import biteBurstTextImage from "@assets/F2D3D9CF-D739-4DA8-ACEC-83E301F2A76E_1750932035557.png";
import mascotImage from "@assets/ChatGPT Image Jun 20, 2025 at 04_16_09 PM_1750421779759.png";
import OnboardingLayout from "./OnboardingLayout";

export default function WelcomeStep() {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setLocation("/profile/name");
  };

  const handleSignIn = () => {
    // Redirect to existing auth flow
    window.location.href = "/api/login";
  };

  return (
    <OnboardingLayout step={0} totalSteps={7} canGoBack={false}>
      <div className="text-center space-y-8">
        
        {/* Logo and Mascot */}
        <div className="flex items-center justify-center mb-12 -space-x-4">
          <img 
            src={mascotImage} 
            alt="BiteBurst Mascot" 
            className="w-24 h-24 object-contain"
          />
          <img 
            src={biteBurstTextImage} 
            alt="BiteBurst" 
            className="h-28 object-contain"
          />
        </div>

        {/* Welcome Text */}
        <div className="space-y-4">
          <h1 
            className="font-extrabold text-3xl leading-tight"
            style={{ color: 'var(--bb-text, #000000)' }}
          >
            Welcome to BiteBurst!
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The fun way to build healthy eating and movement habits
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-8 flex flex-col items-center">
          <Button
            onClick={handleGetStarted}
            className="max-w-[366px] w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white h-12 text-base font-bold uppercase tracking-wider"
            style={{ borderRadius: '13px' }}
          >
            Get Started
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSignIn}
            className="max-w-[366px] w-full border-2 border-[#FF6A00] text-[#FF6A00] hover:bg-orange-50 h-12 text-base font-bold uppercase tracking-wider"
            style={{ borderRadius: '13px' }}
          >
            I already have an account
          </Button>
        </div>

      </div>
    </OnboardingLayout>
  );
}