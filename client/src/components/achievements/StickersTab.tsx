import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import ProgressStrip from './ProgressStrip';
import BadgeFilters from './BadgeFilters';
import BadgeCard from './BadgeCard';
import BadgeModal from './BadgeModal';
import { 
  mergeBadgeData, 
  filterBadgesByCategory, 
  type BadgeVM, 
  type BadgeCatalog, 
  type UserBadgeData 
} from '@/utils/badges';

interface StickersTabProps {
  isActive: boolean;
}

export default function StickersTab({ isActive }: StickersTabProps) {
  const { user } = useAuth();
  // Get persisted filter from sessionStorage or default to 'All'
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('achievements-filter') || 'All';
    }
    return 'All';
  });
  const [selectedBadge, setSelectedBadge] = useState<BadgeVM | null>(null);
  const [highlightedBadge, setHighlightedBadge] = useState<string | null>(null);

  // Listen for highlight events from celebration
  useEffect(() => {
    const handleHighlight = (event: CustomEvent) => {
      const { badgeCode } = event.detail;
      setHighlightedBadge(badgeCode);
      setTimeout(() => setHighlightedBadge(null), 1500);
    };

    window.addEventListener('highlightBadge', handleHighlight as EventListener);
    return () => window.removeEventListener('highlightBadge', handleHighlight as EventListener);
  }, []);

  // Persist filter selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('achievements-filter', category);
    }
  };

  // Fetch badge catalog
  const { data: catalog = [] } = useQuery<BadgeCatalog[]>({
    queryKey: ['/api/badges'],
    enabled: !!user && isActive,
  });

  // Fetch user badge data
  const { data: userData, isLoading } = useQuery<UserBadgeData>({
    queryKey: [`/api/user/${user?.id}/badges`],
    enabled: !!user && isActive,
    refetchInterval: 30000, // Refresh every 30s for live progress
  });

  // Merge catalog with user data
  const badges = catalog.length && userData ? mergeBadgeData(catalog, userData) : [];
  const filteredBadges = filterBadgesByCategory(badges, selectedCategory);

  if (!isActive) return null;

  if (isLoading || !userData) {
    return (
      <div
        role="tabpanel"
        id="stickers-panel"
        aria-labelledby="stickers-tab"
        className="space-y-6"
      >
        {/* Loading skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="w-full h-6 bg-gray-200 rounded"></div>
          <div className="w-full h-2 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-16 h-8 bg-gray-200 rounded-full"></div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-full h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const earnedCount = badges.filter(b => b.status === 'earned').length;
  const totalCount = badges.length;

  return (
    <div
      role="tabpanel"
      id="stickers-panel"
      aria-labelledby="stickers-tab"
      className="space-y-6"
    >
      {/* Progress Strip */}
      <ProgressStrip 
        earnedCount={earnedCount}
        totalCount={totalCount}
        badges={badges}
        onHighlightBadge={(badgeCode) => {
          setHighlightedBadge(badgeCode);
          // Clear highlight after 1.5 seconds
          setTimeout(() => setHighlightedBadge(null), 1500);
        }}
      />
      
      {/* Badge Filters */}
      <BadgeFilters
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Badge Grid */}
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
              isHighlighted={highlightedBadge === badge.code}
            />
          ))}
        </div>
      )}

      {/* Badge Modal */}
      <BadgeModal
        badge={selectedBadge}
        isOpen={!!selectedBadge}
        onClose={() => setSelectedBadge(null)}
      />
    </div>
  );
}