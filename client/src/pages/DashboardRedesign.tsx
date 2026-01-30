import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Pencil } from "lucide-react";

import { CharacterAvatar } from "@/components/dashboard/CharacterAvatar";
import LessonHero from "@/components/dashboard/LessonHero";
import XPProgressBar from "@/components/dashboard/XPProgressBar";
import TodaysJourney from "@/components/dashboard/TodaysJourney";
import BadgesShelf from "@/components/dashboard/BadgesShelf";
import BottomNavigation from "@/components/BottomNavigation";
import Sidebar from "@/components/Sidebar";

interface DailySummaryV2 {
  xp_today: number;
  xp_goal: number;
  streak_days: number;
  best_streak: number;
  has_food_today: boolean;
  has_activity_today: boolean;
  milestones: Array<{
    id: string;
    title: string;
    reward: number;
    completed: boolean;
  }>;
  badges: {
    earned: Array<{
      code: string;
      name: string;
      description: string;
    }>;
    locked: Array<{
      code: string;
      name: string;
      description: string;
    }>;
  };
  recent_logs: Array<{
    id: string;
    type: 'food' | 'activity';
    summary: string;
    ts: string;
    xpAwarded?: number;
    feedback?: string | null;
  }>;
  user: {
    lifetime_xp: number;
    level: number;
    goal: 'energy' | 'focus' | 'strength';
    display_name: string;
  };
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="md:ml-[200px] py-6 md:py-8 px-4 md:px-8 lg:px-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-48 bg-green-200 rounded-2xl animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse mx-auto w-48" />
          <div className="h-40 bg-white rounded-2xl animate-pulse" />
          <div className="h-48 bg-white rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardRedesign() {
  const { user, session, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [xpBurst, setXpBurst] = useState<{ amount: number; visible: boolean }>({ amount: 0, visible: false });

  const handleXpBurst = useCallback((amount: number) => {
    setXpBurst({ amount, visible: true });
  }, []);

  const { data: dailySummary, isLoading, error } = useQuery<DailySummaryV2>({
    queryKey: ['/api/user', user?.id, 'daily-summary'],
    queryFn: async () => {
      if (!user?.id || !session?.access_token) throw new Error('No user ID or session');
      const response = await fetch(`/api/user/${user.id}/daily-summary`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });
      if (!response.ok) throw new Error('Failed to fetch daily summary');
      return response.json();
    },
    enabled: !!user?.id && !!session?.access_token,
    refetchInterval: 30000,
  });

  const { data: badgeData } = useQuery({
    queryKey: ['/api/user', user?.id, 'badges'],
    queryFn: async () => {
      if (!user?.id || !session?.access_token) throw new Error('No user ID or session');
      const response = await fetch(`/api/user/${user.id}/badges`, {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        }
      });
      if (!response.ok) throw new Error('Failed to fetch badges');
      return response.json();
    },
    enabled: !!user?.id && !!session?.access_token,
  });

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    setLocation('/login');
    return <div>Redirecting to login...</div>;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !dailySummary) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">🍊</div>
          <h2 className="text-xl font-bold text-gray-900">Oops! Something went wrong</h2>
          <p className="text-gray-600">We couldn't load your dashboard right now.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#FF6A00] text-white rounded-xl font-bold hover:bg-[#E55A00] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar for tablet/desktop */}
      <Sidebar />
      
      {/* Main content - offset for sidebar on larger screens */}
      <div className="md:ml-[200px] py-6 md:py-8 px-4 md:px-8 lg:px-12">
        {/* Centered content container - Duolingo style */}
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* 1. AVATAR CARD - Teal/Cyan background like Duolingo */}
          <div className="bg-[#58CC02] rounded-2xl p-8 relative">
            <div className="flex justify-center">
              <div className="w-32 h-32 lg:w-40 lg:h-40">
                <CharacterAvatar size="lg" />
              </div>
            </div>
            <button 
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              aria-label="Edit avatar"
            >
              <Pencil className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* 2. USER INFO */}
          <div className="text-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{dailySummary.user.display_name}</h1>
            <p className="text-gray-500 text-base mt-1">
              @{dailySummary.user.display_name.toLowerCase().replace(/\s+/g, '')}
            </p>
            <p className="text-gray-400 text-sm mt-1">Level {dailySummary.user.level}</p>
          </div>

          {/* 3. CONTINUE LEARNING - PRIMARY CTA */}
          <LessonHero />

          {/* 4. STATISTICS - Duolingo 2x2 Grid */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Day Streak */}
              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-3xl">🔥</span>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{dailySummary.streak_days}</div>
                  <div className="text-sm text-gray-500">Day streak</div>
                </div>
              </div>
              
              {/* Total XP */}
              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-3xl">⚡</span>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{dailySummary.user.lifetime_xp}</div>
                  <div className="text-sm text-gray-500">Total XP</div>
                </div>
              </div>
              
              {/* Current League */}
              <div 
                className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setLocation('/leaderboard')}
              >
                <span className="text-3xl">🏆</span>
                <div>
                  <div className="text-xl font-bold text-[#FF6A00]">Bronze</div>
                  <div className="text-sm text-gray-500">Current league</div>
                </div>
              </div>
              
              {/* Best Streak */}
              <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <span className="text-3xl">🏅</span>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{dailySummary.best_streak}</div>
                  <div className="text-sm text-gray-500">Best streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. DAILY XP PROGRESS */}
          <XPProgressBar 
            xpToday={dailySummary.xp_today} 
            xpGoal={dailySummary.xp_goal} 
          />

          {/* 6. TODAY'S JOURNEY */}
          <TodaysJourney 
            milestones={dailySummary.milestones} 
            onTaskComplete={handleXpBurst} 
          />

          {/* 7. QUICK LOG */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Quick Log</h2>
              <span className="text-sm text-gray-400">Tap to log</span>
            </div>
            
            {/* Quick emoji buttons */}
            <div className="flex flex-wrap gap-3 mb-5">
              {['🍎', '🥦', '🍞', '🧃', '⚽', '🧘', '🏃'].map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setLocation(i < 4 ? '/food-log' : '/activity-log')}
                  className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl hover:bg-orange-50 hover:scale-105 transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            {/* Outline buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setLocation('/food-log')}
                className="flex-1 border-2 border-[#FF6A00] text-[#FF6A00] py-3 rounded-xl text-base font-bold hover:bg-orange-50 transition-colors"
              >
                Log Food
              </button>
              <button
                onClick={() => setLocation('/activity-log')}
                className="flex-1 border-2 border-[#FF6A00] text-[#FF6A00] py-3 rounded-xl text-base font-bold hover:bg-orange-50 transition-colors"
              >
                Log Activity
              </button>
            </div>
          </div>

          {/* 8. BADGES & ACHIEVEMENTS */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
              <button 
                onClick={() => setLocation('/achievements')}
                className="text-[#1CB0F6] font-bold text-sm uppercase tracking-wide hover:text-[#0A91D3]"
              >
                View All
              </button>
            </div>
            <BadgesShelf
              earnedBadges={badgeData?.earned?.map((badge: any) => ({
                code: badge.code,
                name: badge.name,
                description: badge.description || '',
                emoji: badge.emoji,
                isNew: badge.isNew,
              })) || dailySummary.badges.earned}
              lockedBadges={badgeData?.locked?.map((badge: any) => ({
                code: badge.code,
                name: badge.name,
                description: badge.description || '',
                emoji: badge.emoji,
                progress: badge.progress,
              })) || dailySummary.badges.locked}
            />
          </div>

        </div>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNavigation />
    </div>
  );
}
