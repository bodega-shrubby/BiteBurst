import React, { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingProfile {
  displayName: string;
  ageBracket: string;
  goal: string;
  avatar: string;
  email?: string;
  password?: string;
  hasParentConsent: boolean;
}

interface OnboardingContextType {
  profile: OnboardingProfile;
  updateProfile: (updates: Partial<OnboardingProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: OnboardingProfile = {
  displayName: "",
  ageBracket: "",
  goal: "",
  avatar: "",
  email: "",
  password: "",
  hasParentConsent: false,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<OnboardingProfile>(defaultProfile);

  const updateProfile = (updates: Partial<OnboardingProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return (
    <OnboardingContext.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboardingContext() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboardingContext must be used within an OnboardingProvider");
  }
  return context;
}