import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Settings, Flame, Camera, Plus } from "lucide-react";
import QuickLogModal from "@/components/QuickLogModal";

// Import mascot image
import mascotImage from "@assets/9ef8e8fe-158e-4518-bd1c-1325863aebca_1756365757940.png";

interface DashboardData {
  user: {
    id: string;
    displayName: string;
    goal: 'energy' | 'focus' | 'strength';
    xp: number;
    streak: number;
    avatarId: string;
  };
  todayXp: number;
  dailyGoal: number;
  streakData: {
    current: number;
    longest: number;
    lastActive: string;
  };
  badges: Array<{
    badgeId: string;
    awardedAt: string;
  }>;
  todayLogs: Array<{
    id: string;
    type: 'food' | 'activity';
    content: any;
    xpAwarded: number;
    ts: string;
  }>;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [quickLogModal, setQuickLogModal] = useState<{
    isOpen: boolean;
    type: 'food' | 'activity';
    emoji?: string;
  }>({ isOpen: false, type: 'food' });

  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard'],
    enabled: !!user,
  });

  if (authLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    // Redirect to login if not authenticated
    window.location.href = '/login';
    return <div>Redirecting to login...</div>;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <img 
            src={mascotImage} 
            alt="BiteBurst Mascot" 
            className="w-20 h-20 mx-auto mb-4 rounded-full"
          />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const goalEmojis = {
    energy: '⚡',
    focus: '🧠',
    strength: '💪'
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={mascotImage} 
              alt="BiteBurst Mascot" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Good morning, {dashboardData.user.displayName}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-gray-600" />
            <Settings className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-600">{getCurrentDate()}</span>
          <div className="flex items-center space-x-1">
            {dashboardData.streakData.current > 0 && (
              <Flame className="w-4 h-4 text-orange-500" />
            )}
            <span className="text-sm text-gray-600">
              Day {dashboardData.streakData.current} of your streak
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6 pb-24">
        {/* Progress Overview Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#FF6A00] mb-4">Today's Progress</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* XP Meter */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#EAEAEA"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#FF6A00"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(dashboardData.todayXp / dashboardData.dailyGoal) * 226} 226`}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">
                    {dashboardData.todayXp}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">XP Today</p>
              <p className="text-xs text-gray-500">Goal: {dashboardData.dailyGoal}</p>
            </div>

            {/* Streak Counter */}
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2 flex items-center justify-center">
                <Flame className="w-12 h-12 text-orange-500" />
                <span className="absolute text-lg font-bold text-white">
                  {dashboardData.streakData.current}
                </span>
              </div>
              <p className="text-sm text-gray-600">Day Streak</p>
              <p className="text-xs text-gray-500">Best: {dashboardData.streakData.longest}</p>
            </div>
          </div>
        </div>

        {/* Goal Snapshot Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#FF6A00] mb-4">Your Goal</h2>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">{goalEmojis[dashboardData.user.goal]}</span>
            <div>
              <h3 className="font-semibold text-gray-900 capitalize">
                {dashboardData.user.goal}
              </h3>
              <p className="text-sm text-gray-600">
                {dashboardData.user.goal === 'energy' && "Fuel your day with balanced nutrition"}
                {dashboardData.user.goal === 'focus' && "Sharpen your mind with brain-boosting foods"}
                {dashboardData.user.goal === 'strength' && "Build power with protein and movement"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Log Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#FF6A00] mb-4">Quick Log</h2>
          <p className="text-sm text-gray-600 mb-4">Tap, snap, go!</p>
          
          {/* Food Chips */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Food</p>
            <div className="flex space-x-2">
              {['🍎', '🥦', '🍞', '🧃'].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setQuickLogModal({ isOpen: true, type: 'food', emoji })}
                  className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center text-2xl hover:bg-orange-50 hover:border-orange-200 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Chips */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Activity</p>
            <div className="flex space-x-2">
              {[
                { emoji: '⚽', activity: 'soccer' },
                { emoji: '🧘', activity: 'yoga' },
                { emoji: '🏃', activity: 'run' },
                { emoji: '🎯', activity: 'drills' }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => window.location.href = `/activity-log?activity=${item.activity}`}
                  className="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center text-2xl hover:bg-orange-50 hover:border-orange-200 transition-colors"
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Logging Buttons */}
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => window.location.href = '/food-log'}
              className="max-w-[366px] w-full bg-[#FF6A00] text-white h-12 flex items-center justify-center space-x-2 font-bold uppercase tracking-wider hover:bg-[#E55A00] transition-colors mx-auto"
              style={{ borderRadius: '13px' }}
            >
              <span>🍎</span>
              <span>Log Your Meal</span>
            </button>
            
            <button 
              onClick={() => window.location.href = '/activity-log'}
              className="max-w-[366px] w-full bg-white text-[#FF6A00] border-2 border-[#FF6A00] h-12 flex items-center justify-center space-x-2 font-bold uppercase tracking-wider hover:bg-orange-50 transition-colors mx-auto"
              style={{ borderRadius: '13px' }}
            >
              <span>⚽</span>
              <span>Log Activity</span>
            </button>
          </div>
        </div>

        {/* Today's Journey Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#FF6A00] mb-4">Today's Journey</h2>
          <div className="space-y-3">
            {[
              { task: "Log one fruit", completed: false, xp: 10 },
              { task: "Move for 15 minutes", completed: false, xp: 20 },
              { task: "Drink water", completed: true, xp: 5 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    className="w-5 h-5 text-orange-500 rounded"
                    readOnly
                  />
                  <span className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {item.task}
                  </span>
                </div>
                <span className="text-sm font-semibold text-orange-500">+{item.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Badges & Rewards Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#FF6A00] mb-4">Badges & Rewards</h2>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">🏆</span>
                </div>
                <p className="text-xs text-gray-500 text-center mt-1">Badge {index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {[
            { icon: "🏠", label: "Home", active: true },
            { icon: "📝", label: "Log", active: false },
            { icon: "🎯", label: "Goals", active: false },
            { icon: "🏆", label: "Badges", active: false },
            { icon: "⋯", label: "More", active: false },
          ].map((item, index) => (
            <button
              key={index}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-colors ${
                item.active 
                  ? 'bg-orange-50 text-[#FF6A00]' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Quick Log Modal */}
      <QuickLogModal
        isOpen={quickLogModal.isOpen}
        onClose={() => setQuickLogModal({ isOpen: false, type: 'food' })}
        type={quickLogModal.type}
        initialEmoji={quickLogModal.emoji}
      />
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-40 h-5 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Content Skeleton */}
      <main className="px-4 py-6 space-y-6 pb-24">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Nav Skeleton */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center py-2 px-4">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="w-8 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}