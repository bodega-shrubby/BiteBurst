import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SubscriptionResponse {
  plan: 'free' | 'individual' | 'family';
  childrenLimit: number;
  childrenCount: number;
}

export default function Subscription() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [familySize, setFamilySize] = useState(3);

  const { data: subscription, isLoading } = useQuery<SubscriptionResponse>({
    queryKey: ['/api/subscription'],
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async (data: { plan: string; childrenLimit?: number }) => {
      return apiRequest('/api/subscription', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      toast({
        title: "Subscription Updated!",
        description: variables.plan === 'family' 
          ? "You can now add up to " + (variables.childrenLimit || 4) + " children." 
          : "Your plan has been updated successfully.",
      });
      setSelectedPlan(null);
      
      // Redirect to Manage Children if upgraded to Family Plan
      if (variables.plan === 'family') {
        setTimeout(() => setLocation('/settings/children'), 500);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChoosePlan = (plan: string) => {
    setSelectedPlan(plan);
    if (plan !== 'family') {
      updateSubscriptionMutation.mutate({ plan });
    }
  };

  const handleConfirmFamily = () => {
    updateSubscriptionMutation.mutate({ 
      plan: 'family', 
      childrenLimit: familySize 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || 'free';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="md:ml-[200px] pb-20 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-6">
            <button 
              onClick={() => setLocation('/settings')}
              className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
          </div>

          <div className="bg-gray-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-lg">🍊</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {currentPlan === 'free' ? 'Free Plan' : 
                   currentPlan === 'individual' ? 'Individual Plan' : 'Family Plan'}
                </p>
                <p className="text-sm text-gray-500">
                  {currentPlan === 'free' ? "You're on the free plan" : "Your current plan"}
                </p>
              </div>
            </div>
            <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">Current</span>
          </div>

          {currentPlan === 'free' && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Upgrade to BiteBurst Pro</h2>
                <p className="text-gray-500">Unlock the full learning experience for your family</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div 
                  onClick={() => handleChoosePlan('individual')}
                  className={`bg-white rounded-2xl border-2 p-5 cursor-pointer hover:border-orange-300 transition ${
                    selectedPlan === 'individual' ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Individual</h3>
                    <p className="text-sm text-gray-500">1 child</p>
                  </div>

                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-900">$4.50</span>
                    <span className="text-gray-500">/month</span>
                  </div>

                  <Button 
                    className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition"
                    disabled={updateSubscriptionMutation.isPending}
                  >
                    {updateSubscriptionMutation.isPending && selectedPlan === 'individual' 
                      ? 'Processing...' 
                      : 'Choose Plan'}
                  </Button>
                </div>

                <div 
                  onClick={() => setSelectedPlan('family')}
                  className={`bg-white rounded-2xl border-2 p-5 cursor-pointer relative overflow-hidden ${
                    selectedPlan === 'family' ? 'border-orange-500' : 'border-gray-200'
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                    BEST VALUE
                  </div>

                  <div className="text-center mb-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Family</h3>
                    <p className="text-sm text-gray-500">2-4 children</p>
                  </div>

                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-900">$7.99</span>
                    <span className="text-gray-500">/month</span>
                    <p className="text-xs text-green-600 mt-1">Save up to 55%</p>
                  </div>

                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan('family');
                    }}
                    className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition"
                  >
                    Choose Plan
                  </Button>

                  {selectedPlan === 'family' && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <label className="text-sm text-gray-600 mb-2 block">How many children?</label>
                      <div className="flex space-x-2 mb-3">
                        {[2, 3, 4].map((num) => (
                          <button
                            key={num}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFamilySize(num);
                            }}
                            className={`flex-1 py-2 rounded-lg transition ${
                              familySize === num 
                                ? 'bg-orange-500 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmFamily();
                        }}
                        className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition"
                        disabled={updateSubscriptionMutation.isPending}
                      >
                        {updateSubscriptionMutation.isPending ? 'Processing...' : 'Confirm Family Plan'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">What's included with Pro</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🚫</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ad-free experience</p>
                  <p className="text-sm text-gray-500">No interruptions during lessons. Just pure learning fun!</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">♾️</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Unlimited bursts</p>
                  <p className="text-sm text-gray-500">No caps on retries or practice sessions. Learn at your own pace.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🎯</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Personalized practice</p>
                  <p className="text-sm text-gray-500">Lessons adapt to each child's knowledge gaps for better retention.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Parent progress tracking</p>
                  <p className="text-sm text-gray-500">See habits learned, progress made, and areas to focus on.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
              Have questions? See our FAQ →
            </a>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Cancel anytime. By subscribing you agree to our{' '}
              <a href="#" className="underline hover:text-gray-600">Terms</a> and{' '}
              <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>
            </p>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
