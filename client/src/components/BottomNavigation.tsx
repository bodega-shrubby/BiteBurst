import { Home, BookOpen, Trophy, Medal, Plus } from 'lucide-react';
import { useLocation } from 'wouter';

interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
  path: string;
  color: 'orange' | 'green' | 'purple' | 'yellow';
}

const NAV_ITEMS = {
  left: [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard', color: 'orange' as const }
  ],
  right: [
    { id: 'lesson', label: 'Learn', icon: BookOpen, path: '/lessons', color: 'green' as const },
    { id: 'achievements', label: 'Badges', icon: Trophy, path: '/achievements', color: 'purple' as const },
    { id: 'champs', label: 'Champs', icon: Medal, path: '/leaderboard', color: 'yellow' as const }
  ]
};

const COLOR_THEMES = {
  orange: {
    activeBg: 'bg-orange-100',
    activeText: 'text-orange-600',
    activeIcon: 'text-orange-600',
    inactiveBg: 'bg-orange-50',
    inactiveText: 'text-orange-400',
    inactiveIcon: 'text-orange-400',
    dot: 'bg-orange-600'
  },
  green: {
    activeBg: 'bg-green-100',
    activeText: 'text-green-600',
    activeIcon: 'text-green-600',
    inactiveBg: 'bg-green-50',
    inactiveText: 'text-green-400',
    inactiveIcon: 'text-green-400',
    dot: 'bg-green-600'
  },
  purple: {
    activeBg: 'bg-purple-100',
    activeText: 'text-purple-600',
    activeIcon: 'text-purple-600',
    inactiveBg: 'bg-purple-50',
    inactiveText: 'text-purple-400',
    inactiveIcon: 'text-purple-400',
    dot: 'bg-purple-600'
  },
  yellow: {
    activeBg: 'bg-yellow-100',
    activeText: 'text-yellow-600',
    activeIcon: 'text-yellow-600',
    inactiveBg: 'bg-yellow-50',
    inactiveText: 'text-yellow-400',
    inactiveIcon: 'text-yellow-400',
    dot: 'bg-yellow-600'
  }
};

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location === '/' || location === '/dashboard' || location === '/home';
    }
    return location.startsWith(path);
  };

  const NavButton = ({ item }: { item: NavItem }) => {
    const active = isActive(item.path);
    const Icon = item.icon;
    const colors = COLOR_THEMES[item.color];

    return (
      <button
        onClick={() => setLocation(item.path)}
        className={`
          relative flex flex-col items-center justify-center
          px-3 py-2 rounded-2xl min-w-[64px]
          transition-all duration-200
          ${active 
            ? `${colors.activeBg} scale-105 shadow-md` 
            : `${colors.inactiveBg}`
          }
          active:scale-95
        `}
        aria-label={item.label}
      >
        {active && (
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
            <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
          </div>
        )}

        <Icon 
          className={`
            transition-all duration-200
            ${active 
              ? `w-7 h-7 ${colors.activeIcon}` 
              : `w-6 h-6 ${colors.inactiveIcon}`
            }
          `}
          strokeWidth={active ? 2.5 : 2}
        />
        <span className={`
          text-xs mt-1 transition-all duration-200
          ${active 
            ? `font-bold ${colors.activeText}` 
            : `font-medium ${colors.inactiveText}`
          }
        `}>
          {item.label}
        </span>
      </button>
    );
  };

  const isLogActive = location.includes('/log') || location === '/food-log' || location === '/activity-log';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50">
      <div 
        className="max-w-md mx-auto flex items-center justify-center gap-1 px-2 h-20"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        {/* Home */}
        {NAV_ITEMS.left.map((item) => (
          <NavButton key={item.id} item={item} />
        ))}

        {/* Learn */}
        <NavButton item={NAV_ITEMS.right[0]} />

        {/* LOG BUTTON - Between Learn and Badges */}
        <button
          onClick={() => setLocation('/food-log')}
          className={`
            flex flex-col items-center justify-center
            w-14 h-14
            bg-gradient-to-br from-orange-500 to-orange-600
            rounded-2xl
            shadow-lg shadow-orange-300/50
            hover:scale-105 hover:from-orange-600 hover:to-orange-700
            active:scale-95
            transition-all duration-200
            ${isLogActive ? 'ring-4 ring-orange-200' : ''}
          `}
          aria-label="Log food or activity"
        >
          <Plus className="w-7 h-7 text-white" strokeWidth={3} />
          <span className="text-[9px] font-bold text-white">LOG</span>
        </button>

        {/* Badges */}
        <NavButton item={NAV_ITEMS.right[1]} />

        {/* Champs */}
        <NavButton item={NAV_ITEMS.right[2]} />
      </div>
    </nav>
  );
}
