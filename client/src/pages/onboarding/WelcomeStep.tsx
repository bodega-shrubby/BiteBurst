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
        <div className="space-y-4 pt-8">
          <Button
            onClick={handleGetStarted}
            className="w-full text-white font-bold text-lg rounded-full transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            style={{ 
              backgroundColor: 'var(--bb-header, #FF6A00)',
              height: 'var(--tap, 56px)'
            }}
          >
            Get Started
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSignIn}
            className="w-full font-bold text-lg rounded-full border-2 transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            style={{ 
              height: 'var(--tap, 56px)',
              borderColor: 'var(--bb-outline, #E5E5E5)'
            }}
          >
            I already have an account
          </Button>
        </div>

      </div>
    </OnboardingLayout>
  );
}