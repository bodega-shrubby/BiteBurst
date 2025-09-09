import { Lock } from 'lucide-react';
import { getBadgeIcon, getProgressPercentage, type BadgeVM } from '@/utils/badges';

interface BadgeCardProps {
  badge: BadgeVM;
  onClick: () => void;
  isHighlighted?: boolean;
}

export default function BadgeCard({ badge, onClick, isHighlighted = false }: BadgeCardProps) {
  const isEarned = badge.status === 'earned';
  const progress = getProgressPercentage(badge);
  const icon = getBadgeIcon(badge);

  return (
    <button
      onClick={onClick}
      data-badge-code={badge.code}
      className={`
        relative w-full rounded-2xl p-4 text-center transition-all duration-200
        min-h-[130px] max-h-[140px] flex flex-col items-center justify-center space-y-2
        ${isEarned 
          ? 'border-2 border-orange-200 bg-gradient-to-br from-white via-orange-50 to-orange-100 hover:shadow-xl hover:scale-105 shadow-md' 
          : 'border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
        }
        ${isHighlighted 
          ? 'ring-4 ring-orange-400 ring-opacity-75 animate-pulse' 
          : ''
        }
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2
        overflow-hidden
      `}
      aria-label={`${badge.name} badge${isEarned ? ' - earned' : ' - locked'}`}
    >
      {/* Subtle shine effect for earned badges */}
      {isEarned && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
      )}

      {/* Earned ribbon */}
      {isEarned && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
          Earned
        </div>
      )}

      {/* Badge icon */}
      <div className={`text-3xl ${isEarned ? '' : 'grayscale opacity-50'}`}>
        {icon}
      </div>

      {/* Lock icon for locked badges */}
      {!isEarned && (
        <div className="absolute top-2 left-2 bg-white/80 rounded-full p-1">
          <Lock size={14} className="text-gray-500" />
        </div>
      )}

      {/* Badge name */}
      <div className={`font-semibold text-sm ${isEarned ? 'text-gray-900' : 'text-gray-600'}`}>
        {badge.name}
      </div>

      {/* Progress for locked badges */}
      {!isEarned && badge.current !== undefined && badge.threshold && (
        <div className="w-full space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs font-medium text-gray-600">
            {badge.current}/{badge.threshold}
          </div>
        </div>
      )}

      {/* One-off badge completed tag */}
      {!isEarned && badge.current === undefined && badge.threshold === undefined && (
        <div className="text-xs text-gray-500 font-medium">
          Complete to unlock
        </div>
      )}

      {/* Personal record display value */}
      {isEarned && badge.displayValue !== undefined && (
        <div className="text-xl font-bold text-orange-600">
          {badge.displayValue.toLocaleString()}
        </div>
      )}
    </button>
  );
}