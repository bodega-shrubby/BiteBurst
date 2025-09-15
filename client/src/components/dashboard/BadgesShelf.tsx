import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Badge {
  code: string;
  name: string;
  description: string;
}

interface BadgesShelfProps {
  earnedBadges: Badge[];
  lockedBadges: Badge[];
  className?: string;
  onBadgeUnlock?: (badge: Badge) => void; // For celebration animations
}

interface BadgeModalProps {
  badge: Badge;
  isEarned: boolean;
  isOpen: boolean;
  onClose: () => void;
}

function BadgeModal({ badge, isEarned, isOpen, onClose }: BadgeModalProps) {
  if (!isOpen) return null;
  
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
            <div className={`text-6xl mb-3 ${isEarned ? '' : 'grayscale opacity-50'}`}>
              🏆
            </div>
            <h3 id="badge-title" className="text-xl font-bold text-gray-900">
              {badge.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
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
            <div className="text-green-600 font-semibold">
              ✅ Earned!
            </div>
          ) : (
            <div className="text-gray-500 font-semibold">
              🔒 Locked
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

export default function BadgesShelf({ 
  earnedBadges, 
  lockedBadges, 
  className = '',
  onBadgeUnlock 
}: BadgesShelfProps) {
  const [selectedBadge, setSelectedBadge] = useState<{ badge: Badge; isEarned: boolean } | null>(null);
  
  const handleBadgeClick = (badge: Badge, isEarned: boolean) => {
    setSelectedBadge({ badge, isEarned });
  };
  
  const BadgeItem = ({ badge, isEarned }: { badge: Badge; isEarned: boolean }) => (
    <button
      onClick={() => handleBadgeClick(badge, isEarned)}
      className={`
        flex-shrink-0 w-16 h-20 rounded-2xl border-2 transition-all duration-200
        flex flex-col items-center justify-center p-2 space-y-1
        min-h-[44px] min-w-[44px]
        ${isEarned 
          ? 'border-orange-200 bg-gradient-to-b from-orange-50 to-orange-100 hover:shadow-lg hover:scale-105' 
          : 'border-gray-300 border-dashed bg-gray-50 hover:bg-gray-100'
        }
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
      `}
      aria-label={`${badge.name} badge${isEarned ? ' - earned' : ' - locked'}`}
    >
      <div className={`text-2xl ${isEarned ? '' : 'grayscale opacity-50'}`}>
        🏆
      </div>
      {!isEarned && <Lock size={12} className="text-gray-400" />}
      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
        {badge.name.split(' ')[0]} {/* Show first word */}
      </span>
    </button>
  );
  
  const hasAnyBadges = earnedBadges.length > 0 || lockedBadges.length > 0;
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <h2 className="text-xs font-bold text-black mb-4">Badges & Rewards</h2>
      
      {!hasAnyBadges ? (
        <div className="text-center py-8 space-y-3">
          <div className="text-4xl">✨</div>
          <p className="text-gray-600">
            Unlock your first badge by logging today!
          </p>
        </div>
      ) : (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {/* Earned badges first */}
          {earnedBadges.map((badge) => (
            <BadgeItem key={badge.code} badge={badge} isEarned={true} />
          ))}
          
          {/* Then locked badges */}
          {lockedBadges.slice(0, 8).map((badge) => (
            <BadgeItem key={badge.code} badge={badge} isEarned={false} />
          ))}
        </div>
      )}
      
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