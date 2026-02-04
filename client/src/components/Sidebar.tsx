import { BookOpen, Medal, MoreHorizontal, Settings, HelpCircle, LogOut, Apple, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { CharacterAvatar } from '@/components/dashboard/CharacterAvatar';

interface NavItem {
  id: string;
  label: string;
  icon: typeof BookOpen;
  path: string;
  isPrimary?: boolean;
}

const NAV_ITEMS_TOP: NavItem[] = [
  { id: 'lessons', label: 'Lessons', icon: BookOpen, path: '/lessons' },
  { id: 'champs', label: 'Champs', icon: Medal, path: '/leaderboard' },
];


export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [logHoverOpen, setLogHoverOpen] = useState(false);
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location === '/' || location === '/dashboard' || location === '/home';
    }
    return location.startsWith(path);
  };

  const isLogActive = location === '/food-log' || location === '/activity-log';

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-[200px] bg-white border-r border-gray-200 flex-col z-40">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🍊</span>
          <span className="text-lg font-bold text-[#FF6A00]">BiteBurst</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-3 space-y-1">
        {/* LOG CTA Button - Primary Action */}
        <div 
          className="relative mb-3"
          onMouseEnter={() => setLogHoverOpen(true)}
          onMouseLeave={() => setLogHoverOpen(false)}
        >
          <button
            className={`
              w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl
              bg-gradient-to-r from-[#FF8A00] to-[#FF5500] text-white font-semibold
              shadow-lg shadow-orange-300/40 hover:shadow-orange-400/50
              transform transition-all duration-200 hover:scale-[1.02]
              ${isLogActive ? 'ring-2 ring-orange-300 ring-offset-2' : ''}
            `}
          >
            <div className={`
              w-6 h-6 rounded-lg flex items-center justify-center font-bold text-lg
              bg-white/20 backdrop-blur-sm
              transform transition-transform duration-200
              ${logHoverOpen ? 'rotate-90' : ''}
            `}>
              +
            </div>
            <span className="text-sm">LOG</span>
          </button>

          {/* Hover dropdown */}
          {logHoverOpen && (
            <div className="absolute left-full top-0 ml-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[160px] z-50">
              <button
                onClick={() => { setLocation('/food-log'); setLogHoverOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition-colors"
              >
                <Apple className="w-5 h-5 text-green-500 fill-green-500" />
                <span className="text-sm font-medium">Food</span>
              </button>
              <button
                onClick={() => { setLocation('/activity-log'); setLogHoverOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
              >
                <Dumbbell className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Activity</span>
              </button>
            </div>
          )}
        </div>

        {/* Top nav items (Lessons, Champs) */}
        {NAV_ITEMS_TOP.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setLocation(item.path)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50"
            >
              <Icon className={`w-5 h-5 ${item.id === 'lessons' ? 'text-red-500 fill-red-500' : item.id === 'champs' ? 'text-black fill-yellow-500' : 'text-gray-500'}`} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}

        {/* Profile button with user avatar */}
        <button
          type="button"
          onClick={() => setLocation('/dashboard')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50"
        >
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
            <CharacterAvatar size="sm" />
          </div>
          <span className="text-sm">Profile</span>
        </button>

        {/* More dropdown */}
        <div className="relative">
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
            <span className="text-sm">More</span>
          </button>

          {/* Dropdown menu - shows on click */}
          {moreOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={() => { setLocation('/settings'); setMoreOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              <button
                onClick={() => { setLocation('/help'); setMoreOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Help & Support</span>
              </button>
              <button
                onClick={() => { handleLogout(); setMoreOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
