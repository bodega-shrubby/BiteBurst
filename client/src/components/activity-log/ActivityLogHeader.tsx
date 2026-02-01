import { useLocation } from 'wouter';

interface ActivityLogHeaderProps {
  streak?: number;
  totalXp?: number;
  weeklyActivityMinutes?: number;
}

export default function ActivityLogHeader({ 
  streak = 0, 
  totalXp = 0, 
  weeklyActivityMinutes = 0 
}: ActivityLogHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <header className="sticky top-0 z-30">
      <div
        className="px-6 py-6"
        style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}
      >
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={() => setLocation('/dashboard')}
            className="text-white/80 hover:text-white text-sm flex items-center space-x-1"
          >
            <span>←</span>
            <span>Back</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold text-white">Log Your Activity</h1>
        <p className="text-orange-100 text-sm mt-1">What did you do today?</p>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🔥</span>
            <div>
              <div className="text-base font-bold text-gray-900">{streak}</div>
              <div className="text-xs text-gray-500">Streak</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">⭐</span>
            <div>
              <div className="text-base font-bold text-gray-700">{totalXp} XP</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏃</span>
            <div>
              <div className="text-base font-bold text-gray-700">{weeklyActivityMinutes} min</div>
              <div className="text-xs text-gray-500">This Week</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
