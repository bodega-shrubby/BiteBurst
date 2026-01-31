import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";

export default function ChildNameStep() {
  const [, setLocation] = useLocation();
  const { profile, updateProfile } = useAddChildContext();
  const [name, setName] = useState(profile.name || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setName(profile.name || "");
  }, [profile.name]);

  const validateName = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      return "Name must be at least 2 characters";
    }
    if (trimmed.length > 20) {
      return "Name must be no more than 20 characters";
    }
    return "";
  };

  const handleNext = () => {
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    const username = name.toUpperCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
    updateProfile({ name: name.trim(), username });
    setLocation("/settings/children/add/year-group");
  };

  const handleChange = (value: string) => {
    setName(value);
    if (error) {
      setError(validateName(value));
    }
  };

  return (
    <AddChildLayout 
      step={1} 
      totalSteps={9}
      onBack={() => setLocation('/settings/children')}
    >
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            What's your child's name?
          </h1>

          <div>
            <Input
              type="text"
              placeholder="Enter their name"
              value={name}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:outline-none focus:border-orange-500"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>

        <div className="mt-auto pb-6">
          <Button
            onClick={handleNext}
            disabled={!name.trim()}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition disabled:opacity-50"
          >
            NEXT
          </Button>
        </div>
      </div>
    </AddChildLayout>
  );
}
