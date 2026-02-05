import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AddChildLayout from "./AddChildLayout";
import { useAddChildContext } from "./AddChildContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ChildReviewStep() {
  const [, setLocation] = useLocation();
  const { profile, resetProfile } = useAddChildContext();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createChildMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/children', {
        method: 'POST',
        body: {
          name: profile.name,
          username: profile.username,
          avatar: profile.avatar,
          age: profile.age,
          locale: profile.locale,
          goal: profile.goal,
          favoriteFruits: profile.favoriteFruits,
          favoriteVeggies: profile.favoriteVeggies,
          favoriteFoods: profile.favoriteFoods,
          favoriteSports: profile.favoriteSports,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      queryClient.invalidateQueries({ queryKey: ['/api/children'] });
      toast({
        title: "Child Added!",
        description: `${profile.name} has been added to your family.`,
      });
      resetProfile();
      setLocation('/settings/children');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to add child. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    createChildMutation.mutate();
  };

  const getGoalLabel = (goal: string) => {
    switch (goal) {
      case 'energy': return '⚡ Energy';
      case 'focus': return '🧠 Focus';
      case 'strength': return '💪 Strength';
      default: return goal;
    }
  };

  const getLocaleLabel = (locale: string) => {
    switch (locale) {
      case 'en-GB': return '🇬🇧 United Kingdom';
      case 'en-US': return '🇺🇸 United States';
      default: return locale;
    }
  };

  return (
    <AddChildLayout step={9} totalSteps={9}>
      <div className="flex flex-col h-full min-h-[calc(100vh-200px)]">
        <div className="flex-1 space-y-6">
          <h1 className="font-extrabold text-3xl text-gray-900">
            Review {profile.name}'s Profile
          </h1>

          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-300">
                <span className="text-4xl">{profile.avatar}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-sm text-gray-500">@{profile.username}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Age</span>
                <span className="font-medium text-gray-900">{profile.age} years old</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium text-gray-900">{getLocaleLabel(profile.locale)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Goal</span>
                <span className="font-medium text-gray-900">{getGoalLabel(profile.goal)}</span>
              </div>

              {profile.favoriteFoods.length > 0 && (
                <div>
                  <span className="text-gray-600">Favorite Foods</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.favoriteFoods.slice(0, 5).map((food) => (
                      <span key={food} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        {food}
                      </span>
                    ))}
                    {profile.favoriteFoods.length > 5 && (
                      <span className="text-xs text-gray-500">+{profile.favoriteFoods.length - 5} more</span>
                    )}
                  </div>
                </div>
              )}

              {profile.favoriteSports.length > 0 && (
                <div>
                  <span className="text-gray-600">Favorite Sports</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {profile.favoriteSports.map((sport) => (
                      <span key={sport} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {sport}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <div className="flex items-start space-x-3">
              <span className="text-lg">🎉</span>
              <div>
                <p className="font-medium text-green-800 text-sm">Ready to learn!</p>
                <p className="text-sm text-green-600 mt-1">
                  {profile.name}'s lessons will be personalized based on their age and preferences.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pb-6">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || createChildMutation.isPending}
            className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isSubmitting || createChildMutation.isPending ? 'Adding...' : 'Add Child to Family'}
          </Button>
        </div>
      </div>
    </AddChildLayout>
  );
}
