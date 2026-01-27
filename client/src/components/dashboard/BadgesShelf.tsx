import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface Badge {
  code: string;
  name: string;
  emoji?: string;
  description: string;
  progress?: {
    current: number;
    total: number;
  };
  earnedAt?: string | null;
  isNew?: boolean;
}

interface BadgesShelfProps {
  earnedBadges: Badge[];
  lockedBadges: Badge[];
  className?: string;
  onBadgeUnlock?: (badge: Badge) => void;
}

interface BadgeModalProps {
  badge: Badge;
  isEarned: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const BADGE_EMOJIS: Record<string, string> = {
  'first-log': '🌟',
  'streak-3': '🔥',
  'streak-7': '🔥',
  'streak-30': '🔥',
  'fruit-fighter': '🍎',
  'veggie-victor': '🥦',
  'water-warrior': '💧',
  'move-master': '🏃',
  'breakfast-champion': '🍳',
  'snack-smart': '🥜',
  'rainbow-eater': '🌈',
  'super-logger': '📝',
};

function getBadgeEmoji(code: string, emoji?: string): string {
  return emoji || BADGE_EMOJIS[code] || '🏆';
}

function BadgeModal({ badge, isEarned, isOpen, onClose }: BadgeModalProps) {
  if (!isOpen) return null;
  
  const emoji = getBadgeEmoji(badge.code, badge.emoji);
  const progressPercent = badge.progress 
    ? (badge.progress.current / badge.progress.total) * 100 
    : 0;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="badge-title"
        aria-describedby="badge-description"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="text-center flex-1">
            <div className={`text-6xl mb-3 relative inline-block ${isEarned ? 'animate-bounce-in' : ''}`}>
              <span style={{ opacity: isEarned ? 1 : 0.4 }}>{emoji}</span>
              {isEarned && (
                <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-40 -z-10 animate-pulse-glow" />
              )}
            </div>
            <h3 id="badge-title" className="text-xl font-bold text-gray-900">
              {badge.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="text-center space-y-3">
          <p id="badge-description" className="text-gray-600">
            {badge.description}
          </p>
          
          {isEarned ? (
            <div className="text-green-600 font-bold flex items-center justify-center gap-1">
              <span className="text-lg">✓</span> Earned!
            </div>
          ) : badge.progress ? (
            <div className="space-y-2">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-sm text-orange-600 font-bold">
                {badge.progress.current}/{badge.progress.total} completed
              </p>
            </div>
          ) : (
            <div className="text-gray-500 font-semibold flex items-center justify-center gap-1">
              <span>🔒</span> Locked
            </div>
          )}
        </div>
        
        <Button
          onClick={onClose}
          className="w-full mt-4 bg-[#FF6A00] hover:bg-[#E55A00]"
        >
          Got it!
        </Button>
      </div>
    </div>
  );
}

function BadgeCard({ badge, isEarned, onClick }: { badge: Badge; isEarned: boolean; onClick: () => void }) {
  const emoji = getBadgeEmoji(badge.code, badge.emoji);
  const hasProgress = badge.progress && badge.progress.total > 0;
  const progressPercent = hasProgress 
    ? Math.min((badge.progress!.current / badge.progress!.total) * 100, 100) 
    : 0;
  const hasAnyProgress = hasProgress && badge.progress!.current > 0;
  
  // Check if badge is NEW (earned in last 24 hours)
  const isNewBadge = isEarned && badge.isNew;

  return (
    <button 
      onClick={onClick}
      className={`
        relative aspect-square flex flex-col items-center justify-center
        rounded-2xl border-2 p-3 transition-all duration-300
        ${isEarned 
          ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-orange-300 shadow-lg scale-105' 
          : 'bg-gray-50 border-gray-200'
        }
        hover:scale-110 active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
      `}
      aria-label={`${badge.name} badge${isEarned ? ' - earned' : ' - locked'}`}
    >
      {/* NEW Indicator for recently earned badges */}
      {isNewBadge && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-bounce">
            NEW
          </div>
        </div>
      )}
      
      {/* Badge Icon with Progress Ring */}
      <div className="relative mb-1">
        {isEarned ? (
          <div className="relative">
            <span className="text-3xl block relative z-10">
              {emoji}
            </span>
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-lg opacity-50 -z-10 animate-pulse-slow" />
            {/* Sparkles */}
            <div className="absolute inset-0 -z-10">
              <span className="absolute -top-1 -right-1 text-yellow-400 text-xs animate-sparkle-1">✨</span>
              <span className="absolute -bottom-1 -left-1 text-yellow-400 text-xs animate-sparkle-2">✨</span>
            </div>
          </div>
        ) : (
          <div className="relative w-12 h-12 flex items-center justify-center">
            {/* Faded Emoji with better opacity */}
            <span 
              className="text-3xl absolute z-10"
              style={{ 
                opacity: hasAnyProgress ? 0.5 : 0.25,
                filter: hasAnyProgress ? 'none' : 'grayscale(100%)'
              }}
            >
              {emoji}
            </span>
            
            {/* Circular Progress Ring */}
            {hasAnyProgress ? (
              <svg 
                className="absolute inset-0 w-full h-full -rotate-90" 
                viewBox="0 0 40 40"
              >
                {/* Background Circle */}
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                {/* Progress Circle */}
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="none"
                  stroke="#FF6A00"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercent * 1.13} 113`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
            ) : (
              /* Lock Icon for 0 progress */
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full opacity-60">
                <span className="text-xl">🔒</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Badge Name */}
      <span className={`
        text-xs font-semibold text-center line-clamp-1 mb-1
        ${isEarned ? 'text-gray-900' : 'text-gray-600'}
      `}>
        {badge.name}
      </span>

      {/* Progress Text or Checkmark */}
      {isEarned ? (
        <div className="flex items-center space-x-1">
          <span className="text-green-600 text-xs">✓</span>
          <span className="text-xs text-green-600 font-bold">Earned</span>
        </div>
      ) : badge.progress ? (
        <span className="text-xs font-bold text-orange-600">
          {badge.progress.current}/{badge.progress.total}
        </span>
      ) : (
        <span className="text-xs text-gray-400">Locked</span>
      )}
    </button>
  );
}

export default function BadgesShelf({ 
  earnedBadges, 
  lockedBadges, 
  className = '',
  onBadgeUnlock 
}: BadgesShelfProps) {
  const [, setLocation] = useLocation();
  const [selectedBadge, setSelectedBadge] = useState<{ badge: Badge; isEarned: boolean } | null>(null);
  
  const handleBadgeClick = (badge: Badge, isEarned: boolean) => {
    setSelectedBadge({ badge, isEarned });
  };
  
  const hasAnyBadges = earnedBadges.length > 0 || lockedBadges.length > 0;
  const allBadges = [...earnedBadges.map(b => ({ ...b, earned: true })), ...lockedBadges.map(b => ({ ...b, earned: false }))].slice(0, 8);
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Badges & Rewards</h2>
        <button 
          onClick={() => setLocation('/achievements')}
          className="text-orange-600 font-semibold text-sm hover:text-orange-700 min-h-[44px] px-2 flex items-center"
        >
          View All →
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-bold text-gray-900">
            {earnedBadges.length}/{earnedBadges.length + lockedBadges.length}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700"
            style={{ 
              width: `${earnedBadges.length + lockedBadges.length > 0 
                ? (earnedBadges.length / (earnedBadges.length + lockedBadges.length)) * 100 
                : 0}%` 
            }}
          />
        </div>
      </div>
      
      {!hasAnyBadges ? (
        <div className="text-center py-8 space-y-3">
          <div className="text-4xl">✨</div>
          <p className="text-gray-600">
            Unlock your first badge by logging today!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {allBadges.map((badge) => (
            <BadgeCard 
              key={badge.code} 
              badge={badge} 
              isEarned={badge.earned}
              onClick={() => handleBadgeClick(badge, badge.earned)}
            />
          ))}
        </div>
      )}

      {/* Encouragement Text */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          🎯 Keep logging to unlock more badges!
        </p>
      </div>
      
      {/* Badge Modal */}
      <BadgeModal
        badge={selectedBadge?.badge || { code: '', name: '', description: '' }}
        isEarned={selectedBadge?.isEarned || false}
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
}