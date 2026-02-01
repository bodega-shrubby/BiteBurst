import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Settings as SettingsIcon, HelpCircle, LogOut } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/useAuth";

interface SubscriptionResponse {
  plan: 'free' | 'individual' | 'family';
  childrenLimit: number;
  childrenCount: number;
  curriculumCountry: 'uk' | 'us';
  activeChildId?: string;
  children: Array<{
    id: string;
    name: string;
    username: string;
    avatar: string;
    yearGroup: string;
    isActive: boolean;
  }>;
}

export default function Settings() {
  const [, setLocation] = useLocation();
  const { logout, user } = useAuth();

  const { data: subscription } = useQuery<SubscriptionResponse>({
    queryKey: ['/api/subscription'],
  });

  const isFamilyPlan = subscription?.plan === 'family';
  const activeChild = subscription?.children?.find(c => c.isActive);
  const curriculumLabel = subscription?.curriculumCountry === 'uk' ? 'UK' : 'US';

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'family': return 'Family Pro';
      case 'individual': return 'Individual';
      default: return 'Free';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="md:ml-[200px] pb-20 md:pb-8">
        <div className="max-w-xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

          {isFamilyPlan && activeChild && (
            <div className="bg-gradient-to-r from-purple-50 to-orange-50 rounded-2xl border border-purple-200 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-orange-300 shadow-sm">
                    <span className="text-2xl">{activeChild.avatar === 'child' ? '🧒' : activeChild.avatar}</span>
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 font-medium">Currently learning as</p>
                    <p className="font-bold text-gray-900">{activeChild.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setLocation('/settings/children')}
                  className="text-sm text-orange-500 font-medium hover:text-orange-600"
                >
                  Switch →
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {isFamilyPlan && (
              <button
                onClick={() => setLocation('/settings/children')}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-lg">👨‍👩‍👧‍👦</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Manage Children</p>
                    <p className="text-sm text-gray-500">Add, edit, or switch profiles</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    {subscription?.childrenCount || 0} kids
                  </span>
                  <span className="text-gray-400">→</span>
                </div>
              </button>
            )}

            <button
              onClick={() => setLocation('/settings/profile')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Account Settings</p>
                  <p className="text-sm text-gray-500">Manage your email and password</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={() => setLocation('/settings/subscription')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">⭐</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Subscription</p>
                  <p className="text-sm text-gray-500">Manage your plan</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  {getPlanLabel(subscription?.plan || 'free')}
                </span>
                <span className="text-gray-400">→</span>
              </div>
            </button>

            <button
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">❓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Help & Support</p>
                  <p className="text-sm text-gray-500">FAQs and contact us</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 cursor-pointer transition text-left"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🚪</span>
                </div>
                <div>
                  <p className="font-semibold text-red-600">Log Out</p>
                  <p className="text-sm text-gray-500">Sign out of your account</p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">BiteBurst v1.0.0</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Privacy Policy</a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-xs text-gray-400 hover:text-gray-600">Terms of Service</a>
            </div>
          </div>

          {subscription?.plan === 'free' && (
            <div className="mt-8 p-4 bg-gray-100 rounded-xl text-center">
              <p className="text-xs text-gray-500">
                <strong>Tip:</strong> Upgrade to Family Plan to add multiple children and unlock all features.
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
