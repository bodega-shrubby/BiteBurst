import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

import { CharacterAvatar } from "@/components/dashboard/CharacterAvatar";
import StatisticsGrid from "@/components/dashboard/StatisticsGrid";
import XPProgressBar from "@/components/dashboard/XPProgressBar";
import TodaysJourney from "@/components/dashboard/TodaysJourney";
import BadgesShelf from "@/components/dashboard/BadgesShelf";
import OniMascotCard from "@/components/dashboard/OniMascotCard";
import ContinueLearning from "@/components/dashboard/ContinueLearning";
import TodaysActivity from "@/components/dashboard/TodaysActivity";
import BottomNavigation from "@/components/BottomNavigation";
import Sidebar from "@/components/Sidebar";

import oniTheOrangeImage from "@assets/Mascots/Oni_the_orange.png";
import oniCelebrateImage from "@assets/Mascots/Oni_celebrate.png";

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

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      <div className="confetti-particle">🎉</div>
      <div className="confetti-particle">✨</div>
      <div className="confetti-particle">🎊</div>
      <div className="confetti-particle">⭐</div>
      <div className="confetti-particle">🌟</div>
      <div className="confetti-particle">💫</div>
      <div className="confetti-particle">🎉</div>
      <div className="confetti-particle">✨</div>
      <div className="confetti-particle">🎊</div>
    </div>
  );
}

interface BadgeToastProps {
  badge: { code: string; name: string };
  isVisible: boolean;
  onClose: () => void;
}

function BadgeToast({ badge, isVisible, onClose }: BadgeToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 toast-enter pointer-events-none">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm pointer-events-auto">
        <div className="text-2xl animate-bounce">🏆</div>
        <div>
          <p className="font-bold text-sm">New Badge Unlocked!</p>
          <p className="text-sm opacity-90">{badge.name}</p>
        </div>
      </div>
    </div>
  );
}

interface XPBurstProps {
  amount: number;
  visible: boolean;
  onComplete: () => void;
}

function XPBurst({ amount, visible, onComplete }: XPBurstProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="xp-burst-animation">
        <span className="text-5xl font-black text-orange-500 drop-shadow-lg">
          +{amount} XP
        </span>
      </div>
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
      <div className="p-4 md:p-6 lg:p-8 space-y-6 md:ml-[200px]">
        <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
        <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
        <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

export default function DashboardRedesign() {
  const { user, session, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [xpBurst, setXpBurst] = useState<{ amount: number; visible: boolean }>({ amount: 0, visible: false });
  const [showConfetti, setShowConfetti] = useState(false);
  const [badgeToast, setBadgeToast] = useState<{ badge: { code: string; name: string }; visible: boolean } | null>(null);
  const [hasGoalCelebrated, setHasGoalCelebrated] = useState(false);

  const handleXpBurst = useCallback((amount: number) => {
    setXpBurst({ amount, visible: true });
  }, []);

  const handleBadgeUnlock = useCallback((badge: { code: string; name: string }) => {
    setBadgeToast({ badge, visible: true });
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

  useEffect(() => {
    if (dailySummary && !hasGoalCelebrated && dailySummary.xp_today >= dailySummary.xp_goal) {
      setHasGoalCelebrated(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [dailySummary, hasGoalCelebrated]);

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    setLocation('/login');
    return <div>Redirecting to login...</div>;
  }


  if (error || (!isLoading && !dailySummary)) {
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

  if (!dailySummary) {
    return null;
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
        {/* TWO-COLUMN LAYOUT */}
        <div className="flex justify-center">
          <div className="flex max-w-[1100px] w-full">

            {/* LEFT: Main Content Column */}
            <div className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 space-y-6 pb-32">
              {/* 1. AVATAR/GREETING SECTION */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-6">
                  <div className="w-[100px] h-[100px] bg-gradient-to-br from-orange-500 to-orange-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg flex-shrink-0">
                    <CharacterAvatar size="lg" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-extrabold text-gray-800">
                      Hey <span className="text-orange-500">{dailySummary.user.display_name}</span>! 🌟
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Ready to fuel your body and get moving?
                    </p>
                    <span className="inline-block bg-orange-50 text-orange-500 px-4 py-1.5 rounded-full text-sm font-bold mt-2">
                      🍊 Health Hero 🏃
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. STATISTICS GRID - 4 columns */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* XP Today */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-[46px] h-[46px] rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{dailySummary.xp_today}</div>
                      <div className="text-sm text-gray-500 font-medium">XP Today</div>
                    </div>
                  </div>
                </div>

                {/* Active Minutes */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-[46px] h-[46px] rounded-xl bg-gradient-to-br from-[#E8F4FD] to-[#BBDEFB] flex items-center justify-center">
                      <span className="text-2xl">🏃</span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">45</div>
                      <div className="text-sm text-gray-500 font-medium">Active Min</div>
                    </div>
                  </div>
                </div>

                {/* Day Streak */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-[46px] h-[46px] rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{dailySummary.streak_days}</div>
                      <div className="text-sm text-gray-500 font-medium">Day Streak</div>
                    </div>
                  </div>
                </div>

                {/* Level */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-[46px] h-[46px] rounded-xl bg-gradient-to-br from-[#E8F4FD] to-[#B3E5FC] flex items-center justify-center">
                      <span className="text-2xl">⭐</span>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{dailySummary.user.level}</div>
                      <div className="text-sm text-gray-500 font-medium">Level</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. CONTINUE LEARNING */}
              <ContinueLearning />

              {/* 4. QUICK LOG - Two buttons only */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-xl mb-5">
                  Quick Log
                </h3>

                <div className="flex gap-4">
                  {/* Log Food Button - Orange theme */}
                  <button
                    onClick={() => setLocation('/food-log')}
                    className="flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-500 hover:to-orange-400 hover:text-white text-orange-600 transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <span className="text-4xl">🍎</span>
                    <span className="font-bold text-base">Log Food</span>
                  </button>

                  {/* Log Exercise Button - Blue theme */}
                  <button
                    onClick={() => setLocation('/activity-log')}
                    className="flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-[#4A90D9] hover:to-[#7AB8F5] hover:text-white text-[#2E6BB5] transition-all hover:shadow-lg hover:-translate-y-1"
                  >
                    <span className="text-4xl">🏃</span>
                    <span className="font-bold text-base">Log Exercise</span>
                  </button>
                </div>
              </div>

              {/* MOBILE ONLY: Show sidebar content stacked below */}
              <div className="lg:hidden space-y-6">
                {/* Oni Mascot Card - Mobile */}
                <OniMascotCard 
                  userName={dailySummary.user.display_name}
                  message={greeting}
                />

                {/* Daily XP Goal - Mobile */}
                <XPProgressBar 
                  xpToday={dailySummary.xp_today} 
                  xpGoal={dailySummary.xp_goal} 
                />

                {/* Today's Journey - Mobile */}
                <TodaysJourney 
                  milestones={dailySummary.milestones} 
                  onTaskComplete={handleXpBurst}
                />

                {/* Today's Activity - Mobile */}
                <TodaysActivity 
                  recentLogs={dailySummary.recent_logs.map((log: any) => ({
                    id: log.id,
                    type: log.type,
                    summary: log.summary,
                    xpAwarded: log.xpAwarded,
                  }))}
                />

                {/* Badges - Mobile */}
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
                  onBadgeUnlock={handleBadgeUnlock}
                />

                {/* Ad Placement - Mobile */}
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
                  <div className="text-sm font-semibold text-gray-400">Ad Placement</div>
                  <div className="text-xs text-gray-300 mt-1">320 x 50</div>
                </div>
              </div>
            </div>

            {/* RIGHT: Sidebar Column (desktop only) */}
            <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">

              {/* 1. Oni Mascot Card - TOP OF SIDEBAR */}
              <OniMascotCard 
                userName={dailySummary.user.display_name}
                message={greeting}
              />

              {/* 2. Daily XP Goal */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold">Daily XP Goal</span>
                  </div>
                  <span className="text-sm">
                    <span className="text-orange-500 font-bold">{dailySummary.xp_today}</span> / {dailySummary.xp_goal}
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min((dailySummary.xp_today / dailySummary.xp_goal) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-center text-sm text-orange-500 mt-2 font-medium">
                  {dailySummary.xp_goal - dailySummary.xp_today > 0 
                    ? `${dailySummary.xp_goal - dailySummary.xp_today} XP to go!`
                    : "🎉 Goal reached!"}
                </p>
              </div>

              {/* 3. Today's Journey */}
              <TodaysJourney 
                milestones={dailySummary.milestones} 
                onTaskComplete={handleXpBurst}
              />

              {/* 4. Today's Activity */}
              <TodaysActivity 
                recentLogs={dailySummary.recent_logs.map((log: any) => ({
                  id: log.id,
                  type: log.type,
                  summary: log.summary,
                  xpAwarded: log.xpAwarded,
                }))}
              />

              {/* 5. Badges & Rewards */}
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
                onBadgeUnlock={handleBadgeUnlock}
              />

              {/* 6. Ad Placement Placeholder */}
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <div className="text-sm font-semibold text-gray-400">Ad Placement</div>
                <div className="text-xs text-gray-300 mt-1">300 x 250</div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNavigation />

      {/* Celebrations */}
      {showConfetti && <Confetti />}
      
      {badgeToast && (
        <BadgeToast
          badge={badgeToast.badge}
          isVisible={badgeToast.visible}
          onClose={() => setBadgeToast(null)}
        />
      )}
      
      {/* XP Burst Animation */}
      <XPBurst 
        amount={xpBurst.amount} 
        visible={xpBurst.visible}
        onComplete={() => setXpBurst({ ...xpBurst, visible: false })}
      />
    </div>
  );
}
