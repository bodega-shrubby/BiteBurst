import { X, ExternalLink, Download, Share2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { getBadgeIcon, getBadgeCTA, getProgressPercentage, type BadgeVM } from '@/utils/badges';
import { downloadBadgeImage, shareBadgeImage } from '@/utils/shareBadge';

interface BadgeModalProps {
  badge: BadgeVM | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BadgeModal({ badge, isOpen, onClose }: BadgeModalProps) {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  if (!isOpen || !badge) return null;

  const isEarned = badge.status === 'earned';
  const progress = getProgressPercentage(badge);
  const icon = getBadgeIcon(badge);
  const cta = getBadgeCTA(badge);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleCTAClick = () => {
    onClose();
    navigate(cta.route);
  };

  const handleDownloadBadge = async () => {
    try {
      await downloadBadgeImage(badge, user?.displayName);
    } catch (error) {
      console.error('Failed to download badge:', error);
    }
  };

  const handleShareBadge = async () => {
    try {
      await shareBadgeImage(badge, user?.displayName);
    } catch (error) {
      console.error('Failed to share badge:', error);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="badge-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 text-center border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Large badge icon */}
          <div className={`text-6xl mb-3 ${isEarned ? '' : 'grayscale opacity-50'}`}>
            {icon}
          </div>

          {/* Badge name and status */}
          <h2 id="badge-modal-title" className="text-xl font-bold text-gray-900 mb-1">
            {badge.name}
          </h2>
          
          <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            isEarned 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isEarned ? 'Earned' : 'Locked'}
          </div>

          {/* Personal record value */}
          {isEarned && badge.displayValue !== undefined && (
            <div className="mt-3">
              <div className="text-3xl font-bold text-orange-600">
                {badge.displayValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Your best</div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">About this badge</h3>
            <p className="text-gray-600 text-sm">
              {badge.description}
            </p>
          </div>

          {/* How to earn / Progress */}
          {!isEarned && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How to earn</h3>
              
              {badge.current !== undefined && badge.threshold && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {badge.current}/{badge.threshold}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {progress}% complete
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mt-2">
                {badge.code === 'STREAK_3' && 'Log food or activity for 3 days in a row'}
                {badge.code === 'STREAK_7' && 'Log food or activity for 7 days in a row'}
                {badge.code === 'STREAK_14' && 'Log food or activity for 14 days in a row'}
                {badge.code === 'STREAK_30' && 'Log food or activity for 30 days in a row'}
                {badge.code === 'FOOD_VARIETY_5' && 'Log 5 different types of fruits'}
                {badge.code === 'VEG_VARIETY_5' && 'Log 5 different types of vegetables'}
                {badge.code === 'ACTIVITY_10' && 'Log 10 different activities'}
                {badge.code === 'WATER_7' && 'Log water on 7 different days'}
                {badge.code === 'COMBO_DAY' && 'Log both food and activity on the same day'}
                {badge.code === 'FIRST_FOOD' && 'Log your first food item'}
                {badge.code === 'FIRST_ACTIVITY' && 'Log your first activity'}
              </p>
            </div>
          )}

          {/* Earned date */}
          {isEarned && badge.earnedAt && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Earned</h3>
              <p className="text-sm text-gray-600">
                {new Date(badge.earnedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Save/Share Badge (for earned badges) */}
            {isEarned && (
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadBadge}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                >
                  <Download size={16} />
                  <span>Save Badge</span>
                </button>
                
                {navigator.share && (
                  <button
                    onClick={handleShareBadge}
                    className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                  >
                    <Share2 size={16} />
                  </button>
                )}
              </div>
            )}

            {/* CTA Button (for locked badges) */}
            {!isEarned && (
              <button
                onClick={handleCTAClick}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                <span>{cta.text}</span>
                <ExternalLink size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}