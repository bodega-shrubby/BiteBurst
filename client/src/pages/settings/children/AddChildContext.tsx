import { createContext, useContext, useState, ReactNode } from "react";

interface ChildOnboardingProfile {
  name: string;
  username: string;
  age: number | null; // Child's age 6-14
  locale: string; // 'en-GB' or 'en-US'
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
}

const defaultProfile: ChildOnboardingProfile = {
  name: "",
  username: "",
  age: null,
  locale: "en-GB", // Default to UK English
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

  const updateProfile = (updates: Partial<ChildOnboardingProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return (
    <AddChildContext.Provider value={{ profile, updateProfile, resetProfile }}>
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
