import { BookOpen, Medal, Plus, User, MoreHorizontal, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location === '/' || location === '/dashboard' || location === '/home';
    }
    return location.startsWith(path);
  };

  const isLogActive = location.includes('/log') || location === '/food-log' || location === '/activity-log';

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50">
      <div 
        className="flex justify-around items-center py-2 relative"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
      >
        {/* Lessons */}
        <button
          onClick={() => setLocation('/lessons')}
          className={`flex flex-col items-center px-3 py-1 min-w-[56px] ${
            location.startsWith('/lessons') ? 'text-[#FF6A00]' : 'text-gray-500'
          }`}
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Lessons</span>
        </button>

        {/* Champs */}
        <button
          onClick={() => setLocation('/leaderboard')}
          className={`flex flex-col items-center px-3 py-1 min-w-[56px] ${
            location.startsWith('/leaderboard') ? 'text-[#FF6A00]' : 'text-gray-500'
          }`}
        >
          <Medal className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Champs</span>
        </button>

        {/* LOG - Center prominent button */}
        <button
          onClick={() => setLocation('/food-log')}
          className="flex flex-col items-center"
        >
          <div className={`
            w-14 h-14 bg-[#FF6A00] rounded-full flex items-center justify-center -mt-6 shadow-lg
            ${isLogActive ? 'ring-4 ring-orange-200' : ''}
          `}>
            <Plus className="w-7 h-7 text-white" strokeWidth={3} />
          </div>
          <span className="text-xs text-gray-500 mt-1 font-medium">LOG</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setLocation('/dashboard')}
          className={`flex flex-col items-center px-3 py-1 min-w-[56px] ${
            isActive('/dashboard') ? 'text-[#FF6A00]' : 'text-gray-500'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </button>

        {/* More */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={`flex flex-col items-center px-3 py-1 min-w-[56px] ${moreOpen ? 'text-[#FF6A00]' : 'text-gray-500'}`}
        >
          <MoreHorizontal className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">More</span>
        </button>

        {/* More dropdown */}
        {moreOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setMoreOpen(false)}
            />
            <div className="absolute bottom-full right-2 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[150px] z-50">
              <button
                onClick={() => { setLocation('/achievements'); setMoreOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Achievements</span>
              </button>
              <button
                onClick={() => { setLocation('/streak'); setMoreOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Streak</span>
              </button>
              <button
                onClick={() => { handleLogout(); setMoreOpen(false); }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
