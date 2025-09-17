import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Bell, Settings, UserPlus } from "lucide-react";

// Dashboard V2 Components
import MascotAvatar from "@/components/dashboard/MascotAvatar";
import StreakPill from "@/components/dashboard/StreakPill";
import XPDayRing from "@/components/dashboard/XPDayRing";
import QuickLogGrid from "@/components/dashboard/QuickLogGrid";
import TodaysJourney from "@/components/dashboard/TodaysJourney";
import BadgesShelf from "@/components/dashboard/BadgesShelf";
import RecentLogsList from "@/components/dashboard/RecentLogsList";
import BottomNavigation from "@/components/BottomNavigation";
import { CharacterAvatar } from "@/components/dashboard/CharacterAvatar";

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
  }>;
  user: {
    lifetime_xp: number;
    level: number;
    goal: 'energy' | 'focus' | 'strength';
    display_name: string;
  };
}

// Confetti Component for Goal Celebrations
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

// Toast Component for Badge Notifications
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

// Consistent header styling
const SECTION_HEADER = "text-xl font-bold text-gray-900";

export default function DashboardV2() {
  const { user, loading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();
  const [mascotState, setMascotState] = useState<'idle' | 'goalReached' | 'badgeUnlocked'>('idle');
  const [showConfetti, setShowConfetti] = useState(false);
  const [badgeToast, setBadgeToast] = useState<{ badge: { code: string; name: string }; visible: boolean } | null>(null);
  const [hasGoalCelebrated, setHasGoalCelebrated] = useState(false);

  const { data: dailySummary, isLoading, error } = useQuery<DailySummaryV2>({
    queryKey: ['/api/user', user?.id, 'daily-summary'],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      const response = await fetch(`/api/user/${user.id}/daily-summary`, {
        credentials: 'include',
        headers: {
          'x-session-id': localStorage.getItem('sessionId') || ''
        }
      });
      if (!response.ok) throw new Error('Failed to fetch daily summary');
      return response.json();
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch real badge data
  const { data: badgeData } = useQuery({
    queryKey: ['/api/user', user?.id, 'badges'],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      const response = await fetch(`/api/user/${user.id}/badges`, {
        credentials: 'include',
        headers: {
          'x-session-id': localStorage.getItem('sessionId') || ''
        }
      });
      if (!response.ok) throw new Error('Failed to fetch badges');
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Get all badge catalog for locked badges
  const { data: badgeCatalog } = useQuery({
    queryKey: ['/api/badges'],
    queryFn: async () => {
      const response = await fetch('/api/badges');
      if (!response.ok) throw new Error('Failed to fetch badge catalog');
      return response.json();
    },
  });

  // Handle goal completion celebration
  useEffect(() => {
    if (dailySummary && !hasGoalCelebrated) {
      if (dailySummary.xp_today >= dailySummary.xp_goal) {
        setHasGoalCelebrated(true);
        setMascotState('goalReached');
        setShowConfetti(true);
        
        // Reset after celebration
        setTimeout(() => {
          setShowConfetti(false);
          setMascotState('idle');
        }, 3000);
      }
    }
  }, [dailySummary?.xp_today, dailySummary?.xp_goal, hasGoalCelebrated]);

  const handleGoalReached = () => {
    if (!hasGoalCelebrated) {
      setHasGoalCelebrated(true);
      setMascotState('goalReached');
      setShowConfetti(true);
      
      setTimeout(() => {
        setShowConfetti(false);
        setMascotState('idle');
      }, 3000);
    }
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <MascotAvatar size="large" />
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
    <div className="min-h-screen bg-white">
      {/* Profile Header */}
      <header className="bg-gradient-to-b from-purple-300 to-purple-400 px-4 py-3 relative">
        <div className="max-w-md mx-auto">
          <div className="flex justify-end mb-4">
            {/* Settings Icon */}
            <button className="p-2 rounded-lg hover:bg-purple-500 transition-colors" data-testid="button-settings">
              <Settings className="w-6 h-6 text-white" />
            </button>
          </div>
          
          {/* Large Centered Character Avatar */}
          <div className="flex justify-center items-center">
            <CharacterAvatar size="lg" />
          </div>
        </div>
      </header>

      {/* Dark Profile Card */}
      <div className="relative z-10 mb-6">
        <div className="bg-neutral-900 rounded-none sm:rounded-2xl px-5 py-4 text-white shadow-xl" data-testid="profile-card">
          <h1 className="text-2xl font-bold text-center mb-2" data-testid="text-username">
            {dailySummary.user.display_name}
          </h1>
          <p className="text-neutral-400 text-center text-sm mb-4">
            @{dailySummary.user.display_name.toLowerCase()}
          </p>
          
          {/* Stats Chips */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <div className="bg-orange-500 px-3 py-1 rounded-full text-xs font-semibold">
              Level {dailySummary.user.level}
            </div>
            <div className="bg-orange-500 px-3 py-1 rounded-full text-xs font-semibold">
              {dailySummary.streak_days} day streak
            </div>
            <div className="bg-orange-500 px-3 py-1 rounded-full text-xs font-semibold">
              {dailySummary.xp_today} XP today
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6 pb-24 max-w-md mx-auto">
        {/* Invite Button */}
        <button className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors">
          <UserPlus className="w-5 h-5 text-orange-500" />
          <span className="text-orange-500 font-bold">Add Friends</span>
        </button>

        {/* Overview Section */}
        <div className="space-y-4">
          <h2 className={SECTION_HEADER} data-testid="header-overview">Overview</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Day Streak */}
            <button 
              onClick={() => setLocation('/streak')}
              className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">🔥</span>
                <span className="text-2xl font-bold text-orange-500">{dailySummary.streak_days}</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Day streak</div>
            </button>
            
            {/* Total XP */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">⚡</span>
                <span className="text-2xl font-bold text-orange-500">{dailySummary.user.lifetime_xp}</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Total XP</div>
            </div>
            
            {/* League */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">🥉</span>
                <span className="text-lg font-bold text-orange-600">Bronze</span>
              </div>
              <div className="text-sm text-gray-600 font-medium">League</div>
            </div>
            
            {/* Lesson Score */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">🎯</span>
                <span className="text-2xl font-bold text-orange-500">
                  {Math.round((dailySummary.xp_today / dailySummary.xp_goal) * 100)}
                </span>
              </div>
              <div className="text-sm text-gray-600 font-medium">Health Score</div>
            </div>
          </div>
        </div>

        {/* Friend Streaks Section */}
        <div className="space-y-4">
          <h2 className={SECTION_HEADER} data-testid="header-friend-streaks">Friend Streaks</h2>
          
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              {/* Active Friend */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-b from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">👩</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              
              {/* Empty Friend Slots */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">+</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Log Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <QuickLogGrid />
        </div>

        {/* Today's Journey */}
        <TodaysJourney milestones={dailySummary.milestones} />

        {/* Badges Shelf */}
        <BadgesShelf
          earnedBadges={badgeData?.earned?.map((badge: any) => ({
            code: badge.code,
            name: badgeCatalog?.find((b: any) => b.code === badge.code)?.name || badge.code,
            description: badgeCatalog?.find((b: any) => b.code === badge.code)?.description || ''
          })) || []}
          lockedBadges={badgeCatalog?.filter((badge: any) => 
            !badgeData?.earned?.some((earned: any) => earned.code === badge.code)
          ) || []}
          onBadgeUnlock={(badge) => {
            setMascotState('badgeUnlocked');
            setBadgeToast({ badge, visible: true });
            setTimeout(() => setMascotState('idle'), 2000);
          }}
        />

        {/* Achievements Feature Card */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🏅</span>
              <div>
                <h3 className={SECTION_HEADER} data-testid="header-achievements">Achievements</h3>
                <p className="text-sm text-gray-700">Collect stickers for healthy habits</p>
              </div>
            </div>
            <button 
              onClick={() => setLocation('/achievements')}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-md"
            >
              View All
            </button>
          </div>
          
          <div className="bg-white/60 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Badges earned:</span>
              <span className="font-bold text-gray-900">
                {badgeData?.earned?.length || 0} / {badgeCatalog?.length || 12}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${badgeCatalog?.length ? ((badgeData?.earned?.length || 0) / badgeCatalog.length) * 100 : 0}%` 
                }}
              />
            </div>
            
            <div className="text-center pt-2 text-xs text-gray-600">
              🎯 Keep logging to unlock more stickers!
            </div>
          </div>
        </div>

        {/* Leaderboard Feature Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h3 className={SECTION_HEADER} data-testid="header-weekly-champions">Weekly Champions</h3>
                <p className="text-sm text-gray-700">Compete with friends worldwide</p>
              </div>
            </div>
            <button 
              onClick={() => setLocation('/leaderboard')}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all transform hover:scale-105 shadow-md"
            >
              View League
            </button>
          </div>
          
          <div className="bg-white/60 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Your league:</span>
              <div className="flex items-center space-x-1">
                <span>🥉</span>
                <span className="font-semibold text-orange-700">Bronze League</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">This week's XP:</span>
              <span className="font-bold text-gray-900">{dailySummary.xp_today} XP</span>
            </div>
            
            <div className="text-center pt-2 text-xs text-gray-600">
              🎯 Top 10 advance to Silver League
            </div>
          </div>
        </div>

        {/* Recent Logs */}
        <RecentLogsList logs={dailySummary.recent_logs} />
      </main>

      {/* Bottom Navigation */}
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
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6 pb-24 max-w-md mx-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}