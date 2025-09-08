import { Home, PlusCircle, Target, Award, MoreHorizontal } from 'lucide-react';
import { useLocation } from 'wouter';

interface BottomNavigationProps {
  className?: string;
}

export default function BottomNavigation({ className = '' }: BottomNavigationProps) {
  const [location, setLocation] = useLocation();
  
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/dashboard',
      isActive: location === '/dashboard' || location === '/home'
    },
    {
      id: 'log',
      label: 'Log',
      icon: PlusCircle,
      path: '/food-log', // Default to food log, could be expanded to a log selection modal
      isActive: location.includes('/log')
    },
    {
      id: 'goals',
      label: 'Goals',
      icon: Target,
      path: '/goals', // Future goals management page
      isActive: location === '/goals'
    },
    {
      id: 'badges',
      label: 'Badges',
      icon: Award,
      path: '/badges', // Future badges gallery page
      isActive: location === '/badges'
    },
    {
      id: 'more',
      label: 'More',
      icon: MoreHorizontal,
      path: '/profile', // Future profile/settings page
      isActive: location === '/profile' || location === '/settings'
    }
  ];
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 ${className}`}>
      <div className="max-w-md mx-auto">
        <nav className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setLocation(item.path)}
                className={`
                  flex flex-col items-center space-y-1 py-2 px-3 rounded-lg
                  transition-all duration-200 min-h-[44px] min-w-[44px]
                  ${item.isActive 
                    ? 'text-[#FF6A00] bg-orange-50' 
                    : 'text-gray-600 hover:text-[#FF6A00] hover:bg-orange-50'
                  }
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
                `}
                aria-label={item.label}
              >
                <IconComponent 
                  size={20} 
                  className={`transition-colors ${item.isActive ? 'text-[#FF6A00]' : ''}`}
                />
                <span 
                  className={`text-xs font-medium transition-colors ${
                    item.isActive ? 'text-[#FF6A00]' : ''
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}