import { BookOpen, Medal, User, MoreHorizontal, Settings, HelpCircle, LogOut, Apple, Dumbbell } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  id: string;
  label: string;
  icon: typeof BookOpen;
  path: string;
  isPrimary?: boolean;
}

const NAV_ITEMS_TOP: NavItem[] = [
  { id: 'lessons', label: 'Lessons', icon: BookOpen, path: '/lessons', isPrimary: true },
  { id: 'champs', label: 'Champs', icon: Medal, path: '/leaderboard' },
];

const NAV_ITEMS_BOTTOM: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: User, path: '/dashboard' },
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
        {/* Top nav items (Lessons, Champs) */}
        {NAV_ITEMS_TOP.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => setLocation(item.path)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                transition-all duration-200
                ${active
                  ? 'bg-orange-50 text-[#FF6A00] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
                }
                ${item.isPrimary && !active ? 'border-2 border-orange-200 bg-orange-50/50' : ''}
              `}
            >
              <Icon className={`w-5 h-5 ${item.id === 'lessons' ? 'text-red-500 fill-red-500' : item.id === 'champs' ? 'text-yellow-500 fill-yellow-500' : active ? 'text-[#FF6A00]' : 'text-gray-500'}`} />
              <span className="text-sm">{item.label}</span>
              {item.isPrimary && (
                <span className="ml-auto text-xs bg-[#FF6A00] text-white px-2 py-0.5 rounded-full">
                  NEW
                </span>
              )}
            </button>
          );
        })}

        {/* LOG button with hover dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => setLogHoverOpen(true)}
          onMouseLeave={() => setLogHoverOpen(false)}
        >
          <button
            className={`
              w-full flex items-center space-x-3 px-4 py-3 rounded-xl
              transition-all duration-200
              ${isLogActive
                ? 'bg-orange-50 text-[#FF6A00] font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            {/* 3D + sign */}
            <div className={`
              w-6 h-6 rounded-lg flex items-center justify-center font-bold text-lg
              bg-gradient-to-br from-[#FF8A00] to-[#FF5500] text-white
              shadow-md shadow-orange-300/50
              transform transition-transform duration-200
              ${logHoverOpen ? 'scale-110 rotate-90' : ''}
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
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-[#FF6A00] transition-colors"
              >
                <Apple className="w-5 h-5" />
                <span className="text-sm font-medium">Food</span>
              </button>
              <button
                onClick={() => { setLocation('/activity-log'); setLogHoverOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-[#FF6A00] transition-colors"
              >
                <Dumbbell className="w-5 h-5" />
                <span className="text-sm font-medium">Activity</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom nav items (Profile) */}
        {NAV_ITEMS_BOTTOM.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.id}
              onClick={() => setLocation(item.path)}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                transition-all duration-200
                ${active
                  ? 'bg-orange-50 text-[#FF6A00] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-[#FF6A00]' : 'text-gray-500'}`} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* More dropdown at bottom */}
      <div className="mt-auto p-3 border-t border-gray-100 relative">
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
          <span className="text-sm">More</span>
        </button>

        {/* Dropdown menu - shows on click */}
        {moreOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
            <button
              onClick={() => { setLocation('/settings'); setMoreOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
            <button
              onClick={() => { setLocation('/achievements'); setMoreOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              <Medal className="w-4 h-4" />
              <span className="text-sm">Achievements</span>
            </button>
            <button
              onClick={() => { setLocation('/streak'); setMoreOpen(false); }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm">Streak</span>
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
    </aside>
  );
}
