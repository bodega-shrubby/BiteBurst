/**
 * Badge utilities for achievements system
 */

export interface BadgeCatalog {
  code: string;
  name: string;
  description: string;
  category: string;
  tier: number;
  threshold: number;
  rarity: string;
}

export interface BadgeProgress {
  code: string;
  current: number;
  threshold: number;
}

export interface EarnedBadge {
  code: string;
  earnedAt: string;
}

export interface PersonalRecords {
  dailyXpBest: number;
  longestStreak: number;
}

export interface BadgeVM extends Omit<BadgeCatalog, 'threshold'> {
  status: 'earned' | 'locked';
  current?: number;
  threshold?: number;
  displayValue?: number; // For PR badges
  earnedAt?: string;
}

export interface UserBadgeData {
  earned: EarnedBadge[];
  progress: BadgeProgress[];
  records: PersonalRecords;
}

/**
 * Merge badge catalog with user progress data
 */
export function mergeBadgeData(
  catalog: BadgeCatalog[],
  userData: UserBadgeData
): BadgeVM[] {
  const earnedMap = new Map(userData.earned.map(e => [e.code, e]));
  const progressMap = new Map(userData.progress.map(p => [p.code, p]));

  return catalog.map(badge => {
    const earned = earnedMap.get(badge.code);
    const progress = progressMap.get(badge.code);

    const vm: BadgeVM = {
      ...badge,
      status: earned ? 'earned' : 'locked',
      earnedAt: earned?.earnedAt
    };

    if (!earned && progress) {
      vm.current = progress.current;
      vm.threshold = progress.threshold;
    }

    // For personal record badges, show the actual value
    if (badge.code === 'PR_DAILY_XP') {
      vm.displayValue = userData.records.dailyXpBest;
    } else if (badge.code === 'PR_LONGEST_STREAK') {
      vm.displayValue = userData.records.longestStreak;
    }

    return vm;
  });
}

/**
 * Calculate progress percentage (0-100)
 */
export function getProgressPercentage(badge: BadgeVM): number {
  if (badge.status === 'earned') return 100;
  if (!badge.current || !badge.threshold) return 0;
  return Math.min(100, Math.round((badge.current / badge.threshold) * 100));
}

/**
 * Get next unlock suggestions (top 3 by progress percentage)
 */
export function getNextUnlocks(badges: BadgeVM[]): BadgeVM[] {
  return badges
    .filter(b => b.status === 'locked' && b.current !== undefined)
    .sort((a, b) => getProgressPercentage(b) - getProgressPercentage(a))
    .slice(0, 3);
}

/**
 * Filter badges by category
 */
export function filterBadgesByCategory(badges: BadgeVM[], category: string): BadgeVM[] {
  if (category === 'All') return badges;
  if (category === 'Records') {
    return badges.filter(b => b.code.startsWith('PR_'));
  }
  return badges.filter(b => {
    if (category === 'Streak') return b.category === 'streak';
    if (category === 'Food') return b.category === 'food';
    if (category === 'Water') return b.category === 'lifetime' && b.code.includes('WATER');
    if (category === 'Activity') return b.category === 'activity';
    if (category === 'Combo') return b.category === 'combo';
    return false;
  });
}

/**
 * Get contextual CTA for badge modal
 */
export function getBadgeCTA(badge: BadgeVM): { text: string; route: string } {
  if (badge.category === 'food') {
    if (badge.code === 'FOOD_VARIETY_5') {
      return { text: 'Log a new fruit', route: '/food-log?hint=fruit' };
    }
    if (badge.code === 'VEG_VARIETY_5') {
      return { text: 'Log a new vegetable', route: '/food-log?hint=vegetable' };
    }
    return { text: 'Log food', route: '/food-log' };
  }
  
  if (badge.category === 'activity') {
    return { text: 'Log an activity', route: '/activity-log' };
  }
  
  if (badge.category === 'lifetime' && badge.code.includes('WATER')) {
    return { text: 'Log water', route: '/food-log?hint=water' };
  }
  
  if (badge.category === 'combo') {
    return { text: 'Log food & activity', route: '/food-log' };
  }

  return { text: 'Keep going!', route: '/' };
}

/**
 * Get badge icon (hybrid food gem style)
 */
export function getBadgeIcon(badge: BadgeVM): string {
  const iconMap: Record<string, string> = {
    FIRST_FOOD: '🍎💎',
    FIRST_ACTIVITY: '⚽💎', 
    STREAK_3: '🔥💎',
    STREAK_7: '🌟💎',
    STREAK_14: '💪💎',
    STREAK_30: '🏆💎',
    FOOD_VARIETY_5: '🍓💎',
    VEG_VARIETY_5: '🥦💎',
    ACTIVITY_10: '🏃💎',
    COMBO_DAY: '⚡💎',
    WATER_7: '💧💎',
    PR_DAILY_XP: '🏆✨',
    PR_LONGEST_STREAK: '🔥👑'
  };
  
  return iconMap[badge.code] || '🏅💎';
}