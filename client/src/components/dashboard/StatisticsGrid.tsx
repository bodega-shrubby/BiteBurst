import { useLocation } from 'wouter';

interface StatisticsGridProps {
  streakDays: number;
  totalXP: number;
  league: string;
  bestStreak: number;
}

export default function StatisticsGrid({ 
  streakDays, 
  totalXP, 
  league, 
  bestStreak 
}: StatisticsGridProps) {
  const [, setLocation] = useLocation();

  const stats = [
    {
      emoji: '🔥',
      value: streakDays,
      label: 'Day streak',
      onClick: () => setLocation('/streak'),
      isClickable: true,
    },
    {
      emoji: '⚡',
      value: totalXP,
      label: 'Total XP',
      onClick: undefined,
      isClickable: false,
    },
    {
      emoji: '🏆',
      value: league,
      label: 'League',
      onClick: () => setLocation('/leaderboard'),
      isClickable: true,
      isText: true,
    },
    {
      emoji: '🏅',
      value: bestStreak,
      label: 'Best Streak',
      onClick: undefined,
      isClickable: false,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-800 text-lg lg:text-xl">Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <button
            key={index}
            onClick={stat.onClick}
            disabled={!stat.isClickable}
            className={`
              bg-white rounded-xl border border-gray-200 p-5 lg:p-6 text-left
              transition-all duration-200
              ${stat.isClickable 
                ? 'hover:bg-gray-50 hover:border-gray-300 cursor-pointer active:scale-[0.98]' 
                : 'cursor-default'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl lg:text-3xl">{stat.emoji}</span>
              <div>
                <div className={`font-bold ${stat.isText ? 'text-lg lg:text-xl text-[#FF6A00]' : 'text-2xl lg:text-3xl text-gray-900'}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
