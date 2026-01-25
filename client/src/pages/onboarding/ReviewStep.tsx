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

const CURRICULUM_LABELS = {
  "us-common-core": "🇺🇸 American",
  "uk-ks2-ks3": "🇬🇧 British"
};

const maskEmail = (email: string) => {
  if (!email) return "";
  const [localPart, domain] = email.split("@");
  if (!localPart || !domain) return email;
  const masked = localPart.charAt(0) + "***";
  return `${masked}@${domain}`;
};

export default function ReviewStep() {
  const [, setLocation] = useLocation();
  const { profile, resetProfile } = useOnboardingContext();
  const [isCreating, setIsCreating] = useState(false);

  const createProfileMutation = useMutation({
    mutationFn: async () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Parent-first signup: parent email for auth, child profile data
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parentEmail: profile.parentEmail || profile.email,
          password: profile.password,
          parentConsent: profile.hasParentConsent,
          childName: profile.displayName,
          age: profile.ageBracket,
          curriculum: profile.curriculum || "us-common-core",
          goal: profile.goal,
          avatarId: profile.avatar,
          timezone,
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Signup failed");
      }

      return data;
    },
    onSuccess: async (data) => {
      if (data.session) {
        const { supabase } = await import("@/lib/supabase");
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }
      
      resetProfile();
      setLocation("/dashboard");
    },
    onError: (error) => {
      console.error("Account creation failed:", error);
      setIsCreating(false);
    }
  });

  const handleCreateProfile = () => {
    setIsCreating(true);
    createProfileMutation.mutate();
  };

  return (
    <OnboardingLayout step={11} totalSteps={11} canGoBack={!isCreating}>
      <div className="space-y-8">
        
        {/* Title */}
        <h1 
          className="font-extrabold text-3xl leading-tight text-center"
          style={{ color: 'var(--bb-text, #000000)' }}
        >
          You're all set!
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
              <span className="text-gray-600">Curriculum</span>
              <span className="font-medium">{CURRICULUM_LABELS[profile.curriculum as keyof typeof CURRICULUM_LABELS] || "Not set"}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Goal</span>
              <span className="font-medium">{GOAL_LABELS[profile.goal as keyof typeof GOAL_LABELS]}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Email</span>
              <span className="font-medium text-sm">{maskEmail(profile.parentEmail || profile.email || "")}</span>
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
            Let's start building healthy habits together!
          </p>
        </div>

        {/* Create Profile Button */}
        <div className="pt-4 flex justify-center">
          <Button
            onClick={handleCreateProfile}
            disabled={isCreating || createProfileMutation.isPending}
            className="max-w-[366px] w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white h-12 text-base font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: '13px' }}
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