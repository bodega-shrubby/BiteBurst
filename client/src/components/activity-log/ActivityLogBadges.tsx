import { Link } from 'wouter';

const ACTIVITY_BADGES = [
  { id: 'first-move', emoji: '🏃', name: 'First Move', earned: true },
  { id: 'week-warrior', emoji: '🔥', name: 'Week Warrior', earned: false },
  { id: 'hour-hero', emoji: '⏱️', name: 'Hour Hero', earned: false },
  { id: 'diverse-mover', emoji: '🌟', name: 'Diverse Mover', earned: true },
];

interface ActivityLogBadgesProps {
  badges?: typeof ACTIVITY_BADGES;
}

export default function ActivityLogBadges({ badges = ACTIVITY_BADGES }: ActivityLogBadgesProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base text-gray-800">🏆 Activity Badges</h3>
        <Link href="/achievements" className="text-sm text-orange-500 font-medium hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {badges.map((badge) => (
          <div key={badge.id} className="text-center">
            <div className={`
              w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl
              ${badge.earned
                ? 'bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300'
                : 'bg-gray-100 opacity-40 grayscale'}
            `}>
              {badge.emoji}
            </div>
            <p className={`text-xs mt-1 ${badge.earned ? 'text-gray-700' : 'text-gray-400'}`}>
              {badge.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
