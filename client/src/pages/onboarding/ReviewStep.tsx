import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import OnboardingLayout from "./OnboardingLayout";
import { useOnboardingContext } from "./OnboardingContext";
import mascotImage from "@assets/ChatGPT Image Jun 20, 2025 at 04_16_09 PM_1750421779759.png";

const GOAL_LABELS = {
  energy: "⚡ Energy",
  focus: "🧠 Focus",
  strength: "💪 Strength"
};

const AGE_LABELS = {
  "6-8": "6–8 years old",
  "9-11": "9–11 years old", 
  "12-14": "12–14 years old"
};

export default function ReviewStep() {
  const [, setLocation] = useLocation();
  const { profile, resetProfile } = useOnboardingContext();
  const [isCreating, setIsCreating] = useState(false);

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/profile/create", "POST", {
        username: profile.displayName,
        email: profile.email,
        password: profile.password,
        name: profile.displayName,
        ageBracket: profile.ageBracket,
        goal: profile.goal,
        avatar: profile.avatar,
        onboardingCompleted: true
      });
    },
    onSuccess: () => {
      resetProfile();
      // Redirect to Replit Auth login after profile creation
      window.location.href = "/api/login";
    },
    onError: (error) => {
      console.error("Account creation failed:", error);
      // Handle error - maybe show a toast or error message
    }
  });

  const handleCreateProfile = () => {
    setIsCreating(true);
    createProfileMutation.mutate();
  };

  return (
    <OnboardingLayout step={8} totalSteps={8} canGoBack={!isCreating}>
      <div className="space-y-8">
        
        {/* Title */}
        <h1 
          className="font-extrabold text-3xl leading-tight text-center"
          style={{ color: 'var(--bb-text, #000000)' }}
        >
          Create your account
        </h1>

        {/* Profile Summary Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 space-y-6">
          
          {/* Avatar */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-3 border-orange-500 mb-3">
              <img 
                src={mascotImage} 
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold">{profile.displayName}</h2>
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Age</span>
              <span className="font-medium">{AGE_LABELS[profile.ageBracket as keyof typeof AGE_LABELS]}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Goal</span>
              <span className="font-medium">{GOAL_LABELS[profile.goal as keyof typeof GOAL_LABELS]}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-sm">{profile.email}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Password</span>
              <span className="font-medium text-sm">••••••••</span>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center">
          <p className="text-lg text-gray-600 leading-relaxed">
            You're all set! Let's start building healthy habits together.
          </p>
        </div>

        {/* Create Profile Button */}
        <div className="pt-4">
          <Button
            onClick={handleCreateProfile}
            disabled={isCreating || createProfileMutation.isPending}
            className="w-full text-white font-bold text-lg rounded-full transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: 'var(--bb-header, #FF6A00)',
              height: 'var(--tap, 56px)'
            }}
          >
            {isCreating || createProfileMutation.isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </div>

        {/* Error Message */}
        {createProfileMutation.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 text-sm">
              Something went wrong. Please try again.
            </p>
          </div>
        )}

      </div>
    </OnboardingLayout>
  );
}