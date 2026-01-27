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
    active: 'bg-orange-100',
    text: 'text-orange-600',
    icon: 'text-orange-600',
    inactive: 'text-gray-400',
    dot: 'bg-orange-600'
  },
  green: {
    active: 'bg-green-100',
    text: 'text-green-600',
    icon: 'text-green-600',
    inactive: 'text-gray-400',
    dot: 'bg-green-600'
  },
  purple: {
    active: 'bg-purple-100',
    text: 'text-purple-600',
    icon: 'text-purple-600',
    inactive: 'text-gray-400',
    dot: 'bg-purple-600'
  },
  yellow: {
    active: 'bg-yellow-100',
    text: 'text-yellow-600',
    icon: 'text-yellow-600',
    inactive: 'text-gray-400',
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
            ? `${colors.active} scale-110 shadow-lg` 
            : 'hover:bg-gray-50 scale-100'
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
            ${active ? `w-7 h-7 ${colors.icon}` : `w-6 h-6 ${colors.inactive}`}
          `}
          strokeWidth={active ? 3 : 2}
        />
        <span className={`
          text-xs mt-1 transition-all duration-200
          ${active ? `font-bold ${colors.text}` : 'font-medium text-gray-500'}
        `}>
          {item.label}
        </span>
      </button>
    );
  };

  const isLogActive = location.includes('/log') || location === '/food-log' || location === '/activity-log';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50 pb-safe">
      <div className="max-w-md mx-auto relative flex items-center justify-between px-4 h-20">
        
        <div className="flex items-center space-x-2">
          {NAV_ITEMS.left.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </div>

        <button
          onClick={() => setLocation('/food-log')}
          className={`
            absolute left-1/2 transform -translate-x-1/2 -top-8
            flex flex-col items-center justify-center
            w-16 h-16
            bg-gradient-to-br from-orange-500 to-orange-600
            rounded-2xl
            shadow-2xl shadow-orange-300
            hover:scale-110 hover:from-orange-600 hover:to-orange-700
            active:scale-95
            transition-all duration-200
            border-4 border-white
            ${isLogActive ? 'ring-4 ring-orange-200' : ''}
          `}
          aria-label="Log food or activity"
        >
          <Plus className="w-8 h-8 text-white" strokeWidth={3} />
          <span className="text-[10px] font-bold text-white mt-0.5">LOG</span>
        </button>

        <div className="flex items-center space-x-2">
          {NAV_ITEMS.right.map((item) => (
            <NavButton key={item.id} item={item} />
          ))}
        </div>

      </div>
    </nav>
  );
}
