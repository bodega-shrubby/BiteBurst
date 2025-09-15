import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";

interface StreakData {
  current: number;
  longest: number;
  lastActive: string | null;
}

export default function Streak() {
  const { user } = useAuth();
  const [location, setLocation] = useState(window.location.pathname);

  const { data: streakData, isLoading } = useQuery<StreakData>({
    queryKey: ['/api/user', user?.id, 'streak'],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      const response = await fetch(`/api/user/${user.id}/streak`, {
        credentials: 'include',
        headers: {
          'x-session-id': localStorage.getItem('sessionId') || ''
        }
      });
      if (!response.ok) throw new Error('Failed to fetch streak data');
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Generate week data (past 7 days)
  const generateWeekData = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate();
      const isToday = i === 0;
      const isCompleted = i <= (streakData?.current || 0) - 1;
      
      weekData.push({
        dayName,
        dayNumber,
        isToday,
        isCompleted: isCompleted && (streakData?.current || 0) > 0
      });
    }
    
    return weekData;
  };

  const weekData = generateWeekData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-20 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Streak</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 max-w-md mx-auto text-center space-y-8">
        {/* Large Flame Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-t from-orange-400 via-orange-500 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-t from-red-500 via-orange-500 to-yellow-300 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-t from-yellow-300 via-yellow-400 to-yellow-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-32 h-32 bg-orange-300 rounded-full blur-xl opacity-30 -z-10"></div>
          </div>
        </div>

        {/* Streak Number */}
        <div className="space-y-2">
          <div className="text-8xl font-bold text-orange-500">
            {streakData?.current || 0}
          </div>
          <h2 className="text-2xl font-bold text-orange-600">
            day streak
          </h2>
        </div>

        {/* Weekly Calendar */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mx-4">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 font-medium mb-2">
                  {day.dayName}
                </div>
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    ${day.isCompleted 
                      ? 'bg-orange-500 text-white' 
                      : day.isToday 
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }
                  `}
                >
                  {day.isCompleted ? '✓' : day.dayNumber}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-4">
            Practice each day so your streak won't reset
          </div>
        </div>

        {/* Best Streak */}
        {(streakData?.longest || 0) > (streakData?.current || 0) && (
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 mx-4">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="text-2xl">🏆</span>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {streakData?.longest || 0}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Best streak
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="px-4">
          <p className="text-lg text-gray-700 leading-relaxed">
            {(streakData?.current || 0) === 0 
              ? "Start your healthy habit streak today! Log your first meal or activity."
              : (streakData?.current || 0) === 1
                ? "Great start! Keep going to build your streak."
                : `Amazing! You're building healthy habits ${streakData?.current} days in a row.`
            }
          </p>
        </div>

        {/* Action Button */}
        <div className="px-4 pt-4">
          <button
            onClick={() => window.location.href = '/food-log'}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg text-lg"
            data-testid="button-log-now"
          >
            LOG NOW
          </button>
        </div>
      </main>
    </div>
  );
}