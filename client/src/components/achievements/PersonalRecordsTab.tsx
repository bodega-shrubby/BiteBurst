import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Flame, TrendingUp } from 'lucide-react';
import type { PersonalRecords } from '@/utils/badges';

interface PersonalRecordsTabProps {
  isActive: boolean;
}

interface RecordTile {
  id: string;
  title: string;
  icon: string;
  value: number;
  subtitle: string;
  gradient: string;
  iconComponent?: React.ReactNode;
}

export default function PersonalRecordsTab({ isActive }: PersonalRecordsTabProps) {
  const { user } = useAuth();

  // Fetch user badge data for records
  const { data: userData, isLoading } = useQuery<{ records: PersonalRecords }>({
    queryKey: [`/api/user/${user?.id}/badges`],
    enabled: !!user && isActive,
    select: (data: any) => ({ records: data.records }),
  });

  if (!isActive) return null;

  if (isLoading || !userData) {
    return (
      <div
        role="tabpanel"
        id="records-panel"
        aria-labelledby="records-tab"
        className="space-y-6"
      >
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-3xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  const records = userData.records;

  const recordTiles: RecordTile[] = [
    {
      id: 'longestStreak',
      title: 'Longest Streak',
      icon: '🔥',
      value: records.longestStreak,
      subtitle: 'consecutive days',
      gradient: 'from-gray-800 via-gray-700 to-gray-600',
      iconComponent: <Flame className="w-8 h-8 text-orange-300" />
    },
    {
      id: 'dailyXpBest',
      title: 'Daily XP Record',
      icon: '🏆',
      value: records.dailyXpBest,
      subtitle: 'XP in one day',
      gradient: 'from-slate-800 via-slate-700 to-slate-600',
      iconComponent: <Trophy className="w-8 h-8 text-yellow-300" />
    }
  ];

  // Add Best Week Rank if available (future enhancement)
  const bestWeekRank = (records as any).bestWeekRank;
  if (bestWeekRank) {
    recordTiles.push({
      id: 'bestWeekRank',
      title: 'Best Week Rank',
      icon: '🏅',
      value: bestWeekRank,
      subtitle: 'highest position',
      gradient: 'from-zinc-800 via-zinc-700 to-zinc-600',
      iconComponent: <TrendingUp className="w-8 h-8 text-blue-400" />
    });
  }

  return (
    <div
      role="tabpanel"
      id="records-panel"
      aria-labelledby="records-tab"
      className="space-y-6"
    >
      {/* Introduction */}
      <div className="text-center space-y-2">
        <h2 className="text-lg font-bold text-gray-900">Your Personal Bests</h2>
        <p className="text-sm text-gray-600">
          Track your achievements and see how far you've come
        </p>
      </div>

      {/* Record Tiles */}
      <div className="grid grid-cols-1 gap-6">
        {recordTiles.map((tile) => (
          <div
            key={tile.id}
            className={`
              relative bg-gradient-to-br ${tile.gradient} rounded-3xl p-6 text-white
              shadow-lg hover:shadow-xl transition-all duration-300
              transform hover:-translate-y-1
            `}
            style={{
              background: `linear-gradient(135deg, ${tile.gradient.replace('from-', '').replace('via-', '').replace('to-', '')})`,
              filter: 'brightness(1.05)',
            }}
          >
            {/* Background decorative elements */}
            <div className="absolute top-4 right-4 opacity-20 text-6xl">
              {tile.icon}
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/10 rounded-3xl blur-sm"></div>
            
            {/* Content */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-3">
                {tile.iconComponent}
                <h3 className="text-lg font-bold">{tile.title}</h3>
              </div>
              
              <div className="space-y-1">
                <div className="text-4xl font-black tracking-tight">
                  {tile.value.toLocaleString()}
                </div>
                <div className="text-sm opacity-90 font-medium">
                  {tile.subtitle}
                </div>
              </div>
              
              {/* Future: Add record date if available */}
              {/* <div className="text-xs opacity-75 mt-2">
                Set on December 15, 2024
              </div> */}
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500 transform skew-x-12"></div>
          </div>
        ))}
      </div>

      {/* Empty state for future records */}
      {recordTiles.length === 2 && (
        <div className="text-center py-8 space-y-3 opacity-60">
          <div className="text-3xl">🌟</div>
          <p className="text-sm text-gray-600">
            More records coming soon as you continue your journey!
          </p>
        </div>
      )}
    </div>
  );
}