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
  locale: string;
  activeChildId?: string;
  children: Array<{
    id: string;
    name: string;
    username: string;
    avatar: string;
    age: number;
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
  const localeLabel = subscription?.locale === 'en-US' ? 'US' : 'UK';

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
                <div>
                  <p className="font-semibold text-gray-900">Manage Children</p>
                  <p className="text-sm text-gray-500">Add, edit, or switch profiles</p>
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
              <div>
                <p className="font-semibold text-gray-900">Parent Settings</p>
                <p className="text-sm text-gray-500">Edit name, avatar & learning goal</p>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={() => setLocation('/settings/notifications')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition text-left"
            >
              <div>
                <p className="font-semibold text-gray-900">Notifications</p>
                <p className="text-sm text-gray-500">Manage reminders & alerts</p>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={() => setLocation('/settings/subscription')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition text-left"
            >
              <div>
                <p className="font-semibold text-gray-900">Subscription</p>
                <p className="text-sm text-gray-500">View plan & billing</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  {getPlanLabel(subscription?.plan || 'free')}
                </span>
                <span className="text-gray-400">→</span>
              </div>
            </button>
          </div>

          <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              onClick={() => window.open('mailto:support@biteburst.app', '_blank')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition text-left"
            >
              <div className="flex items-center space-x-3">
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <p className="font-semibold text-gray-900">Help & Support</p>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 cursor-pointer transition text-left"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <p className="font-semibold text-red-500">Log Out</p>
              </div>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            <p>BiteBurst v1.0 • {localeLabel} English</p>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
