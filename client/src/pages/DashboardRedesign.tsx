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
import RecentLogsList from "@/components/dashboard/RecentLogsList";
import BottomNavigation from "@/components/BottomNavigation";
import Sidebar from "@/components/Sidebar";

import oniTheOrangeImage from "@assets/Mascots/Oni_the_orange.png";
import oniCelebrateImage from "@assets/Mascots/Oni_celebrate.png";
import oniHintImage from "@assets/Mascots/Oni_hint.png";
import FloatingMascot from "@/components/FloatingMascot";

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

        {/* TWO-COLUMN LAYOUT for content below status bar */}
        <div className="flex justify-center">
          <div className="flex max-w-[1100px] w-full">

            {/* LEFT: Main Content Column */}
            <div className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 space-y-6 pb-32">
              {/* 4. MASCOT GREETING - Enhanced with Animation */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={dailySummary.xp_today >= dailySummary.xp_goal ? oniCelebrateImage : oniTheOrangeImage}
                    alt="Oni mascot"
                    className="w-14 h-14 lg:w-16 lg:h-16 object-contain animate-mascot-float drop-shadow-lg"
                  />
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-black/10 rounded-full blur-sm animate-shadow-float" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-5 py-3 flex-1 animate-bubble-appear">
                  <p className="text-sm lg:text-base font-medium text-gray-800">{greeting}</p>
                </div>
              </div>

              {/* 5. STATISTICS GRID - MOVED UP */}
              <div>
                <h2 className="font-bold text-xl mb-4">Statistics</h2>
                <div className="grid grid-cols-2 gap-5">
                  {/* Day Streak */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">🔥</span>
                      <div>
                        <div className="text-4xl font-bold text-gray-900">{dailySummary.streak_days}</div>
                        <div className="text-sm text-gray-500 font-medium">Day streak</div>
                      </div>
                    </div>
                  </div>

                  {/* Total XP */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">⚡</span>
                      <div>
                        <div className="text-4xl font-bold text-gray-900">{dailySummary.user.lifetime_xp}</div>
                        <div className="text-sm text-gray-500 font-medium">Total XP</div>
                      </div>
                    </div>
                  </div>

                  {/* League */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">🥉</span>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">Bronze</div>
                        <div className="text-sm text-gray-500 font-medium">League</div>
                      </div>
                    </div>
                  </div>

                  {/* Best Streak */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition min-h-[140px] flex flex-col justify-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-4xl">🏅</span>
                      <div>
                        <div className="text-4xl font-bold text-gray-900">{dailySummary.best_streak}</div>
                        <div className="text-sm text-gray-500 font-medium">Best Streak</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. LESSON HERO - PRIMARY CTA */}
              <LessonHero />

              {/* 7. QUICK LOG - Larger Grid */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-xl">Quick Log</h3>
                  <span className="text-sm text-gray-400">Tap to log</span>
                </div>

                {/* 4-column emoji grid with larger items */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {['🍎', '🥦', '🍞', '🧃', '⚽', '🧘', '🏃', '🚴'].map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => setLocation(i < 4 ? '/food-log' : '/activity-log')}
                      className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-4xl hover:bg-orange-50 hover:scale-105 cursor-pointer transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Larger buttons */}
                <div className="grid grid-cols-2 gap-5">
                  <button
                    onClick={() => setLocation('/food-log')}
                    className="border-2 border-orange-500 text-orange-500 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition"
                  >
                    Log Food
                  </button>
                  <button
                    onClick={() => setLocation('/activity-log')}
                    className="border-2 border-orange-500 text-orange-500 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition"
                  >
                    Log Activity
                  </button>
                </div>
              </div>

              {/* 8. RECENT ACTIVITY - with AI feedback dropdown (main column for all screens) */}
              <RecentLogsList logs={dailySummary.recent_logs} />

              {/* MOBILE ONLY: Show sidebar content stacked below */}
              <div className="lg:hidden space-y-6">
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
              </div>
            </div>

            {/* RIGHT: Sidebar Column (desktop only) */}
            <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">

              {/* Large Floating Oni Mascot */}
              <div className="flex justify-center mb-2">
                <FloatingMascot
                  src={dailySummary.xp_today >= dailySummary.xp_goal ? oniCelebrateImage : oniHintImage}
                  alt="Oni the Orange"
                  size="lg"
                  showSpeechBubble={dailySummary.xp_today === 0}
                  speechText="Ready to learn? 🍊"
                />
              </div>

              {/* Daily XP Goal */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">⚡</span>
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

              {/* Today's Journey */}
              <TodaysJourney 
                milestones={dailySummary.milestones} 
                onTaskComplete={handleXpBurst}
              />

              {/* Today's Activity */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Today's Activity</h3>
                {dailySummary.recent_logs.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-5xl mb-3">🍊</div>
                    <p className="font-bold text-gray-800">No activity yet today</p>
                    <p className="text-sm text-gray-500">Time to fuel up! 🍎</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dailySummary.recent_logs.slice(0, 3).map((log: any, i: number) => (
                      <div key={i} className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-0">
                        <span className="text-xl">{log.type === 'food' ? '🍽️' : '🏃'}</span>
                        <span className="text-sm flex-1 truncate">{log.summary}</span>
                        {log.xpAwarded && (
                          <span className="text-xs text-orange-500 font-bold">+{log.xpAwarded} XP</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="space-y-2 mt-4">
                  <button
                    onClick={() => setLocation('/food-log')}
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
                  >
                    🍽️ Log a Meal
                  </button>
                  <button
                    onClick={() => setLocation('/activity-log')}
                    className="w-full border-2 border-orange-200 text-orange-500 py-3 rounded-xl font-bold hover:bg-orange-50 transition"
                  >
                    ⚽ Log Activity
                  </button>
                </div>
              </div>

              {/* Badges & Rewards */}
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
