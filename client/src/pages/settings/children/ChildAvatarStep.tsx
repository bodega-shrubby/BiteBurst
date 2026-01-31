import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";

const AVATAR_OPTIONS = [
  { value: '🧒', label: 'Kid' },
  { value: '👧', label: 'Girl' },
  { value: '👦', label: 'Boy' },
  { value: '🧒🏽', label: 'Kid 2' },
  { value: '👧🏽', label: 'Girl 2' },
  { value: '👦🏽', label: 'Boy 2' },
  { value: '🧒🏿', label: 'Kid 3' },
  { value: '👧🏿', label: 'Girl 3' },
  { value: '👦🏿', label: 'Boy 3' },
  { value: '🦸', label: 'Hero' },
  { value: '🧙', label: 'Wizard' },
  { value: '🦊', label: 'Fox' },
];

export default function ChildAvatarStep() {
  const [, setLocation] = useLocation();
  const { profile, updateProfile } = useAddChildContext();
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar || "🧒");

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
    updateProfile({ avatar });
  };

  return (
    <AddChildLayout step={8} totalSteps={9}>
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            Choose {profile.name}'s avatar
          </h1>

          <div className="grid grid-cols-4 gap-3">
            {AVATAR_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAvatarSelect(option.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 hover:scale-[0.95] ${
                  selectedAvatar === option.value
                    ? 'bg-orange-100 border-2 border-orange-500'
                    : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                <span className="text-3xl">{option.value}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pb-6">
          <Button
            onClick={() => setLocation("/settings/children/add/review")}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition"
          >
            NEXT
          </Button>
        </div>
      </div>
    </AddChildLayout>
  );
}
