import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Settings } from "lucide-react";

// Dashboard V2 Components
import MascotAvatar from "@/components/dashboard/MascotAvatar";
import StreakPill from "@/components/dashboard/StreakPill";
import XPDayRing from "@/components/dashboard/XPDayRing";
import QuickLogGrid from "@/components/dashboard/QuickLogGrid";
import TodaysJourney from "@/components/dashboard/TodaysJourney";
import BadgesShelf from "@/components/dashboard/BadgesShelf";
import RecentLogsList from "@/components/dashboard/RecentLogsList";
import BottomNavigation from "@/components/BottomNavigation";

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
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 toast-enter">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 max-w-sm">
        <div className="text-2xl animate-bounce">🏆</div>
        <div>
          <p className="font-bold text-sm">New Badge Unlocked!</p>
          <p className="text-sm opacity-90">{badge.name}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardV2() {
  const { user, loading: authLoading } = useAuth();
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
    window.location.href = '/login';
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
      {/* Enhanced Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-20 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <MascotAvatar state={mascotState} size="medium" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {getCurrentGreeting()}, {dailySummary.user.display_name}
              </h1>
              <p className="text-sm text-gray-600">{getCurrentDate()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <StreakPill 
              streakDays={dailySummary.streak_days}
              onClick={() => {}} // Future: streak info modal
            />
            <Bell className="w-6 h-6 text-gray-600" />
            <Settings className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6 pb-24 max-w-md mx-auto">
        {/* XP Progress Ring */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
          <XPDayRing
            xpToday={dailySummary.xp_today}
            xpGoal={dailySummary.xp_goal}
            lifetimeXP={dailySummary.user.lifetime_xp}
            level={dailySummary.user.level}
            onGoalReached={handleGoalReached}
          />
          
          {/* Best Streak Display */}
          {dailySummary.best_streak > dailySummary.streak_days && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>🏆</span>
              <span>Best streak: {dailySummary.best_streak} days</span>
            </div>
          )}
        </div>

        {/* Goal Section */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[#FF6A00] mb-3">Your Goal</h2>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">
              {dailySummary.user.goal === 'energy' ? '⚡' : 
               dailySummary.user.goal === 'focus' ? '🧠' : '💪'}
            </span>
            <div>
              <h3 className="font-bold text-gray-900 capitalize mb-1">
                {dailySummary.user.goal}
              </h3>
              <p className="text-sm text-gray-700">
                {dailySummary.user.goal === 'energy' && "Fuel your day with balanced nutrition"}
                {dailySummary.user.goal === 'focus' && "Sharpen your mind with brain-boosting foods"}
                {dailySummary.user.goal === 'strength' && "Build power with protein and movement"}
              </p>
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
          earnedBadges={dailySummary.badges.earned}
          lockedBadges={dailySummary.badges.locked}
          onBadgeUnlock={(badge) => {
            setMascotState('badgeUnlocked');
            setBadgeToast({ badge, visible: true });
            setTimeout(() => setMascotState('idle'), 2000);
          }}
        />

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