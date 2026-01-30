import React, { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingProfile {
  displayName: string;
  yearGroup: string; // e.g., "year-5", "grade-3"
  goal: string;
  curriculumCountry: string; // 'uk' or 'us'
  curriculum: string; // derived curriculum ID (e.g., 'uk-ks1', 'us-k2')
  avatar: string;
  email?: string;
  parentEmail?: string;
  password?: string;
  hasParentConsent: boolean;
  favorite_fruits?: string[];
  favorite_veggies?: string[];
  favorite_foods?: string[];
  favorite_sports?: string[];
}

interface OnboardingContextType {
  profile: OnboardingProfile;
  updateProfile: (updates: Partial<OnboardingProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: OnboardingProfile = {
  displayName: "",
  yearGroup: "",
  goal: "",
  curriculumCountry: "",
  curriculum: "",
  avatar: "",
  email: "",
  parentEmail: "",
  password: "",
  hasParentConsent: false,
  favorite_fruits: [],
  favorite_veggies: [],
  favorite_foods: [],
  favorite_sports: [],
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