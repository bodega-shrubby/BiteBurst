import { Lock } from 'lucide-react';
import { getBadgeIcon, getProgressPercentage, type BadgeVM } from '@/utils/badges';

interface BadgeCardProps {
  badge: BadgeVM;
  onClick: () => void;
}

export default function BadgeCard({ badge, onClick }: BadgeCardProps) {
  const isEarned = badge.status === 'earned';
  const progress = getProgressPercentage(badge);
  const icon = getBadgeIcon(badge);

  return (
    <button
      onClick={onClick}
      data-badge-code={badge.code}
      className={`
        relative w-full rounded-2xl border-2 p-4 text-center transition-all duration-200
        min-h-[140px] flex flex-col items-center justify-center space-y-2
        ${isEarned 
          ? 'border-orange-200 bg-gradient-to-b from-orange-50 to-orange-100 hover:shadow-lg hover:scale-105 shadow-sm' 
          : 'border-gray-300 border-dashed bg-gray-50 hover:bg-gray-100'
        }
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
        min-h-[44px] min-w-[44px]
      `}
      aria-label={`${badge.name} badge${isEarned ? ' - earned' : ' - locked'}`}
    >
      {/* Earned ribbon */}
      {isEarned && (
        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
          Earned
        </div>
      )}

      {/* Badge icon */}
      <div className={`text-3xl ${isEarned ? '' : 'grayscale opacity-50'}`}>
        {icon}
      </div>

      {/* Lock icon for locked badges */}
      {!isEarned && (
        <div className="absolute top-2 left-2">
          <Lock size={16} className="text-gray-400" />
        </div>
      )}

      {/* Badge name */}
      <div className={`font-semibold text-sm ${isEarned ? 'text-gray-900' : 'text-gray-600'}`}>
        {badge.name}
      </div>

      {/* Progress or personal record value */}
      {!isEarned && badge.current !== undefined && badge.threshold && (
        <div className="text-xs text-gray-500">
          {badge.current}/{badge.threshold}
        </div>
      )}

      {/* Personal record display value */}
      {isEarned && badge.displayValue !== undefined && (
        <div className="text-lg font-bold text-orange-600">
          {badge.displayValue}
        </div>
      )}

      {/* Progress bar for locked badges */}
      {!isEarned && badge.current !== undefined && badge.threshold && (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className="bg-orange-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </button>
  );
}