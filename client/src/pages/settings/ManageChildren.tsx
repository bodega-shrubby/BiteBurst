import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, Edit2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Child {
  id: string;
  name: string;
  username: string;
  avatar: string;
  yearGroup: string;
  curriculumId: string;
  goal?: string;
  xp: number;
  streak: number;
  isActive: boolean;
}

interface SubscriptionResponse {
  plan: 'free' | 'individual' | 'family';
  childrenLimit: number;
  childrenCount: number;
  curriculumCountry: 'uk' | 'us';
  children: Child[];
}

export default function ManageChildren() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: subscription, isLoading } = useQuery<SubscriptionResponse>({
    queryKey: ['/api/subscription'],
  });

  const switchChildMutation = useMutation({
    mutationFn: async (childId: string) => {
      return apiRequest(`/api/children/${childId}/switch`, {
        method: 'POST',
        body: {},
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription'] });
      toast({
        title: "Switched Profile",
        description: "Now learning as this child.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to switch profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatYearGroup = (yearGroup: string) => {
    if (yearGroup.startsWith('year-')) {
      return yearGroup.replace('year-', 'Year ');
    }
    if (yearGroup.startsWith('grade-')) {
      return yearGroup.replace('grade-', 'Grade ');
    }
    return yearGroup;
  };

  const getAvatarBgColor = (index: number) => {
    const colors = ['bg-orange-100', 'bg-pink-100', 'bg-blue-100', 'bg-green-100'];
    return colors[index % colors.length];
  };

  const getAvatarBorderColor = (index: number) => {
    const colors = ['border-orange-300', 'border-pink-200', 'border-blue-200', 'border-green-200'];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const children = subscription?.children || [];
  const childrenLimit = subscription?.childrenLimit || 4;
  const canAddMore = children.length < childrenLimit;
  const curriculumLabel = subscription?.curriculumCountry === 'uk' ? 'UK Curriculum' : 'US Curriculum';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <main className="md:ml-[200px] pb-20 md:pb-8">
        <div className="max-w-xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-3 mb-6">
            <button 
              onClick={() => setLocation('/settings')}
              className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Children</h1>
          </div>

          <div className="bg-purple-50 rounded-2xl p-4 mb-6 flex items-center justify-between border border-purple-100">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
              <div>
                <p className="font-semibold text-purple-800">Family Plan</p>
                <p className="text-sm text-purple-600">{children.length} of {childrenLimit} children added</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-white text-purple-600 px-2 py-1 rounded-full border border-purple-200">
                {subscription?.curriculumCountry === 'uk' ? '🇬🇧' : '🇺🇸'} {curriculumLabel}
              </span>
              <div className="w-20 bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${(children.length / childrenLimit) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {children.map((child, index) => (
              <div 
                key={child.id}
                className={`bg-white rounded-2xl border-2 p-4 cursor-pointer transition hover:-translate-y-0.5 ${
                  child.isActive 
                    ? 'border-orange-500 shadow-sm shadow-orange-100' 
                    : 'border-gray-200 hover:border-orange-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className={`w-14 h-14 ${getAvatarBgColor(index)} rounded-full flex items-center justify-center border-2 ${getAvatarBorderColor(index)}`}>
                        <span className="text-2xl">{child.avatar === 'child' ? '🧒' : child.avatar}</span>
                      </div>
                      {child.isActive && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{child.name}</p>
                      <p className="text-sm text-gray-500">
                        @{child.username} • <span className="text-orange-600 font-medium">{formatYearGroup(child.yearGroup)}</span>
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {child.streak > 0 && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                            🔥 {child.streak} day streak
                          </span>
                        )}
                        {child.streak === 0 && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                            No streak
                          </span>
                        )}
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                          {child.xp} XP
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {child.isActive ? (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Active</span>
                    ) : (
                      <button 
                        onClick={() => switchChildMutation.mutate(child.id)}
                        disabled={switchChildMutation.isPending}
                        className="text-sm text-orange-500 font-medium hover:text-orange-600 px-3 py-1 rounded-full border border-orange-200 hover:bg-orange-50 transition disabled:opacity-50"
                      >
                        {switchChildMutation.isPending ? '...' : 'Switch'}
                      </button>
                    )}
                    <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition">
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {canAddMore && (
            <button
              onClick={() => setLocation('/settings/children/add/name')}
              className="w-full bg-white rounded-2xl border-2 border-dashed border-gray-300 p-5 hover:border-orange-300 hover:bg-orange-50 transition group"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-orange-100 rounded-full flex items-center justify-center transition">
                  <span className="text-2xl text-gray-400 group-hover:text-orange-500">+</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-700 group-hover:text-orange-600">Add Another Child</p>
                  <p className="text-sm text-gray-500">{childrenLimit - children.length} spot{childrenLimit - children.length !== 1 ? 's' : ''} remaining</p>
                </div>
              </div>
            </button>
          )}

          <div className="mt-6 bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <span className="text-lg">💡</span>
              <div>
                <p className="font-medium text-blue-800 text-sm">About Year Groups</p>
                <p className="text-sm text-blue-600 mt-1">
                  Year groups are based on the {curriculumLabel} you selected. Each child's lessons are tailored to their specific year group.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
