import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

interface ChildOnboardingProfile {
  name: string;
  username: string;
  yearGroup: string;
  curriculumId: string;
  goal: string;
  avatar: string;
  favoriteFruits: string[];
  favoriteVeggies: string[];
  favoriteFoods: string[];
  favoriteSports: string[];
}

interface AddChildContextType {
  profile: ChildOnboardingProfile;
  updateProfile: (updates: Partial<ChildOnboardingProfile>) => void;
  resetProfile: () => void;
  curriculumCountry: 'uk' | 'us';
}

const defaultProfile: ChildOnboardingProfile = {
  name: "",
  username: "",
  yearGroup: "",
  curriculumId: "",
  goal: "",
  avatar: "🧒",
  favoriteFruits: [],
  favoriteVeggies: [],
  favoriteFoods: [],
  favoriteSports: [],
};

const AddChildContext = createContext<AddChildContextType | undefined>(undefined);

export function AddChildProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ChildOnboardingProfile>(defaultProfile);

  const { data: subscription } = useQuery<{ curriculumCountry: 'uk' | 'us' }>({
    queryKey: ['/api/subscription'],
  });

  const curriculumCountry = subscription?.curriculumCountry || 'us';

  const updateProfile = (updates: Partial<ChildOnboardingProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return (
    <AddChildContext.Provider value={{ profile, updateProfile, resetProfile, curriculumCountry }}>
      {children}
    </AddChildContext.Provider>
  );
}

export function useAddChildContext() {
  const context = useContext(AddChildContext);
  if (!context) {
    throw new Error("useAddChildContext must be used within an AddChildProvider");
  }
  return context;
}
