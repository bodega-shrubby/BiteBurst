import { Link } from 'wouter';

const FOOD_BADGES = [
  { id: 'first-log', emoji: '🌟', name: 'First Log', earned: true },
  { id: 'breakfast-champ', emoji: '🥞', name: 'Breakfast Champ', earned: false },
  { id: 'veggie-lover', emoji: '🥦', name: 'Veggie Lover', earned: false },
  { id: 'fruit-explorer', emoji: '🍎', name: 'Fruit Explorer', earned: true },
];

interface FoodLogBadgesProps {
  badges?: typeof FOOD_BADGES;
}

export default function FoodLogBadges({ badges = FOOD_BADGES }: FoodLogBadgesProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base text-gray-800">🏆 Food Badges</h3>
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
