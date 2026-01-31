import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Settings, Pencil } from "lucide-react";

import { CharacterAvatar } from "@/components/dashboard/CharacterAvatar";
import LessonHero from "@/components/dashboard/LessonHero";
import StatisticsGrid from "@/components/dashboard/StatisticsGrid";
import XPProgressBar from "@/components/dashboard/XPProgressBar";
import TodaysJourney from "@/components/dashboard/TodaysJourney";
import BadgesShelf from "@/components/dashboard/BadgesShelf";
import BottomNavigation from "@/components/BottomNavigation";
import Sidebar from "@/components/Sidebar";

import oniTheOrangeImage from "@assets/Mascots/Oni_the_orange.png";

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

function HeartsDisplay({ hearts = 3, maxHearts = 5 }: { hearts?: number; maxHearts?: number }) {
  return (
    <div className="flex items-center space-x-0.5" title="Hearts - keep learning!">
      {Array.from({ length: maxHearts }).map((_, i) => (
        <span 
          key={i} 
          className={`text-base transition-all duration-200 ${
            i < hearts ? 'opacity-100 scale-100' : 'opacity-30 scale-90'
          }`}
        >
          {i < hearts ? '❤️' : '🤍'}
        </span>
      ))}
    </div>
  );
}

function getMascotGreeting(displayName: string, xpToday: number, xpGoal: number): string {
  const hour = new Date().getHours();
  const percentToGoal = (xpToday / xpGoal) * 100;
  
  if (xpToday >= xpGoal) {
    return `You did it, ${displayName}! Goal crushed! 🎉`;
  }
  
  if (percentToGoal >= 80) {
    return `So close! Just ${xpGoal - xpToday} XP to go! 🎯`;
  }
  
  if (percentToGoal >= 50) {
    return `You're halfway there! Keep it up! 💪`;
  }
  
  if (xpToday > 0) {
    return `Great start! Let's keep going! 🚀`;
  }
  
  if (hour < 12) {
    return `Good morning, ${displayName}! Ready to start? ☀️`;
  } else if (hour < 17) {
    return `Hey ${displayName}! Ready for a healthy snack? 🍎`;
  } else if (hour < 22) {
    return `Evening, ${displayName}! How was your day? 🌙`;
  }
  
  return `Still up? Log before bed! 😴`;
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="h-48 bg-gradient-to-b from-[#E8E0F0] to-[#DDD6E8] animate-pulse" />
      <div className="h-32 bg-[#1A1B4B] animate-pulse" />
      <div className="p-4 space-y-4">
        <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
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
        <div className="text-center space-y-4 max-w-3xl">
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

  const greeting = getMascotGreeting(
    dailySummary.user.display_name,
    dailySummary.xp_today,
    dailySummary.xp_goal
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Sidebar for tablet/desktop */}
      <Sidebar />
      
      {/* Main content - offset for sidebar on larger screens */}
      <div className="md:ml-[200px]">
        {/* 1. AVATAR HERO SECTION - Light lavender background */}
        <div 
          className="w-full py-8 px-4 flex flex-col items-center"
          style={{ background: 'linear-gradient(180deg, #E8E0F0 0%, #DDD6E8 100%)' }}
        >
          <div className="relative">
            <CharacterAvatar size="lg" />
            <button 
              className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Edit avatar"
            >
              <Pencil className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 2. USER INFO BAR - Dark navy blue */}
        <div 
          className="text-white py-5 px-4 text-center"
          style={{ backgroundColor: '#1A1B4B' }}
        >
          <h1 className="text-2xl font-bold">{dailySummary.user.display_name}</h1>
          <p className="text-gray-400 text-sm mt-1">
            @{dailySummary.user.display_name.toLowerCase().replace(/\s+/g, '')}
          </p>
          
          {/* Level Badge */}
          <div className="flex justify-center mt-3">
            <span className="bg-[#FF6A00] text-white text-sm font-bold px-4 py-1.5 rounded-full">
              Level {dailySummary.user.level}
            </span>
          </div>
          
          {/* Level Progress */}
          <div className="max-w-[240px] mx-auto mt-4 space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Lvl {dailySummary.user.level}</span>
              <span>{dailySummary.user.lifetime_xp % 100} / 100 XP</span>
              <span>Lvl {dailySummary.user.level + 1}</span>
            </div>
            <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#FF6A00] h-2 rounded-full transition-all duration-500"
                style={{ width: `${dailySummary.user.lifetime_xp % 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3. STATUS BAR - Streak, Hearts, Settings - FULL WIDTH */}
        <div className="w-full bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-center space-x-6">
            {/* Streak Pill */}
            <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2.5 rounded-full">
              <span className="text-xl lg:text-2xl">🔥</span>
              <span className="text-sm lg:text-base font-bold text-orange-600">
                {dailySummary.streak_days} day streak
              </span>
            </div>
            
            {/* Hearts */}
            <HeartsDisplay hearts={3} maxHearts={5} />
            
            {/* Settings */}
            <button 
              className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* CONSTRAINED CONTENT AREA - Cards and content below */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6 pb-32">
          {/* 4. MASCOT GREETING */}
          <div className="flex items-center space-x-4">
            <img 
              src={oniTheOrangeImage}
              alt="Oni mascot"
              className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
            />
            <div className="bg-gray-100 rounded-2xl px-5 py-3 flex-1">
              <p className="text-sm lg:text-base font-medium text-gray-800">{greeting}</p>
            </div>
          </div>
          {/* 5. LESSON HERO - PRIMARY CTA */}
          <LessonHero />

          {/* 6. STATISTICS GRID */}
          <StatisticsGrid 
            streakDays={dailySummary.streak_days}
            totalXP={dailySummary.user.lifetime_xp}
            league="Bronze"
            bestStreak={dailySummary.best_streak}
          />

          {/* 7. DAILY XP PROGRESS */}
          <XPProgressBar 
            xpToday={dailySummary.xp_today} 
            xpGoal={dailySummary.xp_goal} 
          />

          {/* 8. TODAY'S JOURNEY */}
          <TodaysJourney 
            milestones={dailySummary.milestones} 
            onTaskComplete={handleXpBurst} 
          />

          {/* 9. QUICK LOG - DEMOTED (smaller, secondary) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 lg:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Quick Log</h3>
              <span className="text-sm text-gray-400">Tap to log</span>
            </div>
            
            {/* Quick emoji buttons */}
            <div className="flex flex-wrap gap-3 mb-5">
              {['🍎', '🥦', '🍞', '🧃', '⚽', '🧘', '🏃'].map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setLocation(i < 4 ? '/food-log' : '/activity-log')}
                  className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl lg:text-3xl hover:bg-orange-50 hover:scale-105 transition-all"
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            {/* Outline buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setLocation('/food-log')}
                className="flex-1 border-2 border-[#FF6A00] text-[#FF6A00] py-3 lg:py-4 rounded-xl text-base lg:text-lg font-bold hover:bg-orange-50 transition-colors"
              >
                Log Food
              </button>
              <button
                onClick={() => setLocation('/activity-log')}
                className="flex-1 border-2 border-[#FF6A00] text-[#FF6A00] py-3 lg:py-4 rounded-xl text-base lg:text-lg font-bold hover:bg-orange-50 transition-colors"
              >
                Log Activity
              </button>
            </div>
          </div>

          {/* 10. BADGES PREVIEW */}
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

      {/* Bottom Navigation - Mobile only */}
      <BottomNavigation />
    </div>
  );
}
