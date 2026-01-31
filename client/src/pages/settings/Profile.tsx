import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ProfileData {
  id: string;
  displayName: string;
  email: string;
  parentEmail?: string;
  avatarId?: string;
  yearGroup?: string;
  goal?: string;
}

const AVATAR_OPTIONS = [
  { value: '🧒', label: 'Kid' },
  { value: '👧', label: 'Girl' },
  { value: '👦', label: 'Boy' },
  { value: '🧒🏽', label: 'Kid 2' },
  { value: '👧🏽', label: 'Girl 2' },
  { value: '👦🏽', label: 'Boy 2' },
];

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🧒");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const { data: profile, isLoading } = useQuery<ProfileData>({
    queryKey: ['/api/profile'],
  });

  useEffect(() => {
    if (profile) {
      setName(profile.displayName || "");
      setEmail(profile.email || "");
      setSelectedAvatar(profile.avatarId || "🧒");
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { displayName?: string; avatarId?: string }) => {
      return apiRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({
      displayName: name,
      avatarId: selectedAvatar,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">Avatar</label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center border-2 border-orange-200">
                  <span className="text-4xl">{selectedAvatar}</span>
                </div>
                <button 
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-orange-600 transition"
                >
                  <span className="text-sm">✏️</span>
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tap to change avatar</p>
                <p className="text-xs text-gray-400 mt-1">Choose from fun characters!</p>
              </div>
            </div>

            {showAvatarPicker && (
              <div className="mt-4 grid grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar.value}
                    onClick={() => {
                      setSelectedAvatar(avatar.value);
                      setShowAvatarPicker(false);
                    }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition ${
                      selectedAvatar === avatar.value 
                        ? 'bg-orange-100 border-2 border-orange-500' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {avatar.value}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Account Details</h2>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
          </div>

          <Button 
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition shadow-sm mb-6"
          >
            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex flex-col space-y-3">
              <button className="text-sm text-gray-500 hover:text-gray-700 transition">
                Export My Data
              </button>
              <button className="text-sm text-red-500 hover:text-red-700 transition">
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
