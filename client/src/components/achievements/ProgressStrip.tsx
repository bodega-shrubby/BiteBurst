import { ChevronRight } from 'lucide-react';
import { getNextUnlocks, getProgressPercentage, getBadgeIcon, type BadgeVM } from '@/utils/badges';

interface HighlightCallback {
  (badgeCode: string): void;
}

interface ProgressStripProps {
  earnedCount: number;
  totalCount: number;
  badges: BadgeVM[];
  onHighlightBadge?: HighlightCallback;
}

export default function ProgressStrip({ earnedCount, totalCount, badges, onHighlightBadge }: ProgressStripProps) {
  const progressPercentage = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;
  const nextUnlocks = getNextUnlocks(badges);

  return (
    <div className="space-y-3">
      {/* Badge Count & Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Badges: {earnedCount} / {totalCount}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Next Unlocks */}
      {nextUnlocks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Next unlocks</h3>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {nextUnlocks.map((badge) => {
              const progress = getProgressPercentage(badge);
              return (
                <button
                  key={badge.code}
                  className="flex-shrink-0 flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm hover:bg-orange-50 hover:border-orange-200 transition-colors cursor-pointer"
                  onClick={() => {
                    // Scroll to badge in grid and highlight it
                    const element = document.querySelector(`[data-badge-code="${badge.code}"]`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      // Trigger highlight effect
                      onHighlightBadge?.(badge.code);
                    }
                  }}
                >
                  <span className="text-lg">{getBadgeIcon(badge).split('💎')[0]}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{badge.name}</div>
                    <div className="text-gray-500">
                      {badge.current || 0}/{badge.threshold} ({progress}%)
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}