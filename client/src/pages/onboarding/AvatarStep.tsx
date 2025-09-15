import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";
import mascotImage from "@assets/ChatGPT Image Jun 20, 2025 at 04_16_09 PM_1750421779759.png";

const AVATAR_OPTIONS = [
  { 
    value: "mascot-happy", 
    image: mascotImage,
    label: "Happy Orange"
  },
  { 
    value: "mascot-cool", 
    image: mascotImage, // We'll use the same image for now
    label: "Cool Orange"
  },
  { 
    value: "mascot-strong", 
    image: mascotImage,
    label: "Strong Orange"
  },
  { 
    value: "mascot-smart", 
    image: mascotImage,
    label: "Smart Orange"
  },
  { 
    value: "mascot-energetic", 
    image: mascotImage,
    label: "Energetic Orange"
  },
  { 
    value: "mascot-friendly", 
    image: mascotImage,
    label: "Friendly Orange"
  }
];

export default function AvatarStep() {
  const [, setLocation] = useLocation();
  const { updateProfile, profile } = useOnboardingContext();
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || "");

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  const handleNext = () => {
    if (selectedAvatar) {
      updateProfile({ avatar: selectedAvatar });
      setLocation("/profile/email");
    }
  };

  return (
    <OnboardingLayout step={5} totalSteps={9}>
      <div className="space-y-8">
        
        {/* Title */}
        <h1 
          className="font-extrabold text-3xl leading-tight"
          style={{ color: 'var(--bb-text, #000000)' }}
        >
          Choose your avatar
        </h1>

        {/* Avatar Grid */}
        <div className="grid grid-cols-3 gap-4">
          {AVATAR_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAvatarSelect(option.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 hover:scale-[0.95] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                selectedAvatar === option.value
                  ? 'bg-orange-50'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              style={{ minHeight: '100px' }}
            >
              <div 
                className={`relative w-16 h-16 rounded-full overflow-hidden border-3 transition-all duration-200 ${
                  selectedAvatar === option.value
                    ? 'border-orange-500'
                    : 'border-gray-200'
                }`}
                style={{
                  borderColor: selectedAvatar === option.value ? 'var(--bb-header, #FF6A00)' : '#E5E7EB',
                  borderWidth: selectedAvatar === option.value ? '3px' : '2px'
                }}
              >
                <img 
                  src={option.image} 
                  alt={option.label}
                  className="w-full h-full object-cover"
                />
                {selectedAvatar === option.value && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <span className={`text-xs text-center font-medium ${
                selectedAvatar === option.value ? 'text-orange-600' : 'text-gray-600'
              }`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {/* Next Button */}
        <div className="pt-4 flex justify-center">
          <Button
            onClick={handleNext}
            disabled={!selectedAvatar}
            className="max-w-[366px] w-full text-white h-12 text-base font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: selectedAvatar ? '#FF6A00' : '#9CA3AF',
              borderRadius: '13px'
            }}
          >
            Next
          </Button>
        </div>

      </div>
    </OnboardingLayout>
  );
}