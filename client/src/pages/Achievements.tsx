import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Sparkles } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import ProgressStrip from '../components/achievements/ProgressStrip';
import BadgeFilters from '../components/achievements/BadgeFilters';
import BadgeCard from '../components/achievements/BadgeCard';
import BadgeModal from '../components/achievements/BadgeModal';
import PersonalRecords from '../components/achievements/PersonalRecords';
import { 
  mergeBadgeData, 
  filterBadgesByCategory, 
  type BadgeVM, 
  type BadgeCatalog, 
  type UserBadgeData 
} from '@/utils/badges';

export default function Achievements() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState<BadgeVM | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch badge catalog
  const { data: catalog = [] } = useQuery<BadgeCatalog[]>({
    queryKey: ['/api/badges'],
    enabled: !!user,
  });

  // Fetch user badge data
  const { data: userData, isLoading } = useQuery<UserBadgeData>({
    queryKey: [`/api/user/${user?.id}/badges`],
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30s for live progress
  });

  // Merge catalog with user data
  const badges = catalog.length && userData ? mergeBadgeData(catalog, userData) : [];
  const filteredBadges = filterBadgesByCategory(badges, selectedCategory);

  // Handle celebration for new unlocks
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const justUnlocked = urlParams.get('justUnlocked');
    
    if (justUnlocked && badges.some(b => b.code === justUnlocked)) {
      setShowCelebration(true);
      // Remove query param
      window.history.replaceState({}, '', '/achievements');
      
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [badges]);

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-20 p-4">
          <div className="max-w-md mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-48 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse w-full h-32 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const earnedCount = badges.filter(b => b.status === 'earned').length;
  const totalCount = badges.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center space-y-4 animate-bounce">
            <div className="text-6xl">🎉</div>
            <div className="text-2xl font-bold text-white">Badge Unlocked!</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-20 p-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Achievements
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Collect stickers by eating smart and moving daily
            </p>
          </div>
          
          <ProgressStrip 
            earnedCount={earnedCount}
            totalCount={totalCount}
            badges={badges}
          />
          
          <BadgeFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Personal Records */}
      <PersonalRecords records={userData.records} />

      {/* Badge Grid */}
      <main className="p-4 pb-24">
        <div className="max-w-md mx-auto">
          {filteredBadges.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="text-4xl">🏆</div>
              <h2 className="text-xl font-bold text-gray-900">
                No badges in this category
              </h2>
              <p className="text-gray-600">
                Try a different filter to see more badges
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredBadges.map((badge) => (
                <BadgeCard
                  key={badge.code}
                  badge={badge}
                  onClick={() => setSelectedBadge(badge)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Badge Modal */}
      <BadgeModal
        badge={selectedBadge}
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />

      <BottomNavigation />
    </div>
  );
}