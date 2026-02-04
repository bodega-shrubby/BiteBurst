import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { ChevronLeft, Check, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface StripePrice {
  product_id: string;
  product_name: string;
  product_description: string;
  product_metadata: any;
  price_id: string;
  unit_amount: number;
  currency: string;
  recurring: any;
}

interface SubscriptionResponse {
  subscription: any;
  plan: 'free' | 'individual' | 'family';
  childrenLimit: number;
}

export default function Subscription() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [familySize, setFamilySize] = useState(3);

  // Check for success/cancel in URL params
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const success = params.get('success');
    const canceled = params.get('canceled');
    const sessionId = params.get('session_id');

    if (success === 'true' && sessionId) {
      // Process the successful checkout
      processCheckoutSuccess(sessionId);
    } else if (canceled === 'true') {
      toast({
        title: "Checkout Cancelled",
        description: "You can upgrade anytime.",
      });
      // Clean up URL
      setLocation('/settings/subscription', { replace: true });
    }
  }, [searchString]);

  const processCheckoutSuccess = async (sessionId: string) => {
    try {
      const data = await apiRequest('/api/stripe/checkout-success', {
        method: 'POST',
        body: { sessionId },
      });
      
      if (data.success) {
        toast({
          title: "Subscription Activated!",
          description: data.plan === 'family' 
            ? `You can now add up to ${data.childrenLimit} children.`
            : "Your Pro plan is now active.",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription'] });
        
        // Redirect to Manage Children if upgraded to Family Plan
        if (data.plan === 'family') {
          setTimeout(() => setLocation('/settings/children'), 1000);
        } else {
          setLocation('/settings/subscription', { replace: true });
        }
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast({
        title: "Error",
        description: "There was an issue activating your subscription. Please contact support.",
        variant: "destructive",
      });
    }
  };

  // Fetch subscription status
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<SubscriptionResponse>({
    queryKey: ['/api/stripe/subscription'],
  });

  // Fetch Stripe prices
  const { data: pricesData, isLoading: pricesLoading } = useQuery<{ prices: StripePrice[] }>({
    queryKey: ['/api/stripe/prices'],
  });

  // Create checkout session mutation
  const checkoutMutation = useMutation({
    mutationFn: async (data: { priceId: string; childrenLimit: number }) => {
      const result = await apiRequest('/api/stripe/create-checkout-session', {
        method: 'POST',
        body: data,
      });
      console.log('Checkout session response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Checkout success, redirecting to:', data.url);
      if (data.url) {
        window.location.assign(data.url);
      } else {
        console.error('No URL in response:', data);
        toast({
          title: "Error",
          description: "No checkout URL received. Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create portal session mutation (for managing subscription)
  const portalMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/stripe/create-portal-session', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to open billing portal.",
        variant: "destructive",
      });
    },
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/stripe/cancel-subscription', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription'] });
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will end at the end of the billing period.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription.",
        variant: "destructive",
      });
    },
  });

  const handleChoosePlan = (planType: 'individual' | 'family', priceId: string) => {
    setSelectedPlan(planType);
    
    if (planType === 'individual') {
      checkoutMutation.mutate({ priceId, childrenLimit: 1 });
    }
  };

  const handleConfirmFamily = (priceId: string) => {
    checkoutMutation.mutate({ priceId, childrenLimit: familySize });
  };

  const handleManageSubscription = () => {
    portalMutation.mutate();
  };

  const handleCancelSubscription = () => {
    if (window.confirm("Are you sure you want to cancel your subscription? You'll lose access to Pro features at the end of your billing period.")) {
      cancelMutation.mutate();
    }
  };


  const currentPlan = subscription?.plan || 'free';
  const prices = pricesData?.prices || [];
  
  // Find individual and family prices from Stripe
  const individualPrice = prices.find(p => 
    p.product_metadata?.plan_type === 'individual' || 
    p.product_name?.toLowerCase().includes('individual')
  );
  const familyPrice = prices.find(p => 
    p.product_metadata?.plan_type === 'family' || 
    p.product_name?.toLowerCase().includes('family')
  );

  // Fallback display prices if Stripe prices not loaded yet
  const displayIndividualPrice = individualPrice ? (individualPrice.unit_amount / 100).toFixed(2) : '4.50';
  const displayFamilyPrice = familyPrice ? (familyPrice.unit_amount / 100).toFixed(2) : '7.99';

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
                <img src="/assets/mascot-orange.svg" alt="Oni" className="w-8 h-8" />
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
                  onClick={() => individualPrice && handleChoosePlan('individual', individualPrice.price_id)}
                  className={`bg-white rounded-2xl border-2 p-5 cursor-pointer hover:border-orange-300 transition ${
                    selectedPlan === 'individual' ? 'border-orange-500' : 'border-gray-200'
                  } ${!individualPrice ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-center mb-4">
                    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h3 className="font-bold text-gray-900">Individual</h3>
                    <p className="text-sm text-gray-500">1 child</p>
                  </div>

                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-900">${displayIndividualPrice}</span>
                    <span className="text-gray-500">/month</span>
                  </div>

                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (individualPrice) {
                        handleChoosePlan('individual', individualPrice.price_id);
                      }
                    }}
                    className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition"
                    disabled={checkoutMutation.isPending || !individualPrice}
                  >
                    {checkoutMutation.isPending && selectedPlan === 'individual' ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                    ) : (
                      'Choose Plan'
                    )}
                  </Button>
                </div>

                <div 
                  onClick={() => familyPrice && setSelectedPlan('family')}
                  className={`bg-white rounded-2xl border-2 p-5 cursor-pointer relative overflow-hidden ${
                    selectedPlan === 'family' ? 'border-orange-500' : 'border-gray-200'
                  } ${!familyPrice ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    <span className="text-3xl font-bold text-gray-900">${displayFamilyPrice}</span>
                    <span className="text-gray-500">/month</span>
                    <p className="text-xs text-green-600 mt-1">Save up to 55%</p>
                  </div>

                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan('family');
                    }}
                    className="w-full bg-orange-500 text-white font-semibold py-3 rounded-xl hover:bg-orange-600 transition"
                    disabled={!familyPrice}
                  >
                    Choose Plan
                  </Button>

                  {selectedPlan === 'family' && familyPrice && (
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
                          handleConfirmFamily(familyPrice.price_id);
                        }}
                        className="w-full bg-purple-600 text-white font-semibold py-3 rounded-xl hover:bg-purple-700 transition"
                        disabled={checkoutMutation.isPending}
                      >
                        {checkoutMutation.isPending ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                        ) : (
                          'Confirm Family Plan'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {prices.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-center">
                  <p className="text-sm text-yellow-800">
                    Subscription plans are being set up. Please check back in a moment.
                  </p>
                </div>
              )}
            </>
          )}

          {currentPlan !== 'free' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Change Your Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`rounded-2xl border-2 p-4 ${
                    currentPlan === 'individual' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 bg-white cursor-pointer hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">👤</span>
                      <h4 className="font-bold text-gray-900">Individual</h4>
                    </div>
                    {currentPlan === 'individual' && (
                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Current</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">1 child profile</p>
                  <p className="font-bold text-gray-900">${displayIndividualPrice}<span className="text-sm font-normal text-gray-500">/month</span></p>
                  {currentPlan !== 'individual' && (
                    <Button 
                      onClick={() => {
                        if (individualPrice) handleChoosePlan('individual', individualPrice.price_id);
                      }}
                      className="w-full mt-3 bg-orange-500 text-white hover:bg-orange-600"
                      disabled={checkoutMutation.isPending || !individualPrice}
                    >
                      {checkoutMutation.isPending && selectedPlan === 'individual' ? 'Processing...' : 'Switch to Individual'}
                    </Button>
                  )}
                </div>

                <div 
                  className={`rounded-2xl border-2 p-4 relative ${
                    currentPlan === 'family' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 bg-white cursor-pointer hover:border-purple-300'
                  }`}
                >
                  {currentPlan !== 'family' && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-bl-xl">
                      SAVE 55%
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">👨‍👩‍👧‍👦</span>
                      <h4 className="font-bold text-gray-900">Family</h4>
                    </div>
                    {currentPlan === 'family' && (
                      <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">Current</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">2-4 child profiles</p>
                  <p className="font-bold text-gray-900">${displayFamilyPrice}<span className="text-sm font-normal text-gray-500">/month</span></p>
                  {currentPlan !== 'family' && (
                    <>
                      {selectedPlan === 'family' ? (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <label className="text-sm text-gray-600 mb-2 block">How many children?</label>
                          <div className="flex space-x-2 mb-3">
                            {[2, 3, 4].map((num) => (
                              <button
                                key={num}
                                onClick={() => setFamilySize(num)}
                                className={`flex-1 py-2 rounded-lg transition ${
                                  familySize === num 
                                    ? 'bg-purple-500 text-white' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-purple-100'
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                          </div>
                          <Button 
                            onClick={() => {
                              if (familyPrice) handleConfirmFamily(familyPrice.price_id);
                            }}
                            className="w-full bg-purple-600 text-white hover:bg-purple-700"
                            disabled={checkoutMutation.isPending}
                          >
                            {checkoutMutation.isPending ? 'Processing...' : 'Upgrade to Family'}
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => setSelectedPlan('family')}
                          className="w-full mt-3 bg-purple-600 text-white hover:bg-purple-700"
                          disabled={!familyPrice}
                        >
                          Switch to Family
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
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

          {currentPlan !== 'free' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Manage Your Subscription</h3>
              <p className="text-sm text-gray-500 mb-4">
                Update your payment method, view invoices, or cancel your subscription.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={handleManageSubscription}
                  className="w-full bg-gray-900 text-white font-medium hover:bg-gray-800"
                  disabled={portalMutation.isPending}
                >
                  {portalMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Opening...</>
                  ) : (
                    <><ExternalLink className="w-4 h-4 mr-2" /> Manage Billing</>
                  )}
                </Button>
                <Button 
                  onClick={handleCancelSubscription}
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium"
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Subscription'}
                </Button>
              </div>
            </div>
          )}

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
