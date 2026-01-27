import { useLocation } from 'wouter';
import { useState, MouseEvent as ReactMouseEvent } from 'react';
import { Home, BookOpen, Trophy, Medal, Plus } from 'lucide-react';
import { triggerHaptic } from './RippleButton';

interface BottomNavigationProps {
  className?: string;
}

const NAV_COLORS = {
  home: { bg: '#FF6A00', light: '#FFF7ED' },
  lessons: { bg: '#22C55E', light: '#F0FDF4' },
  achievements: { bg: '#A855F7', light: '#FAF5FF' },
  champs: { bg: '#EAB308', light: '#FEFCE8' },
};

interface Ripple {
  x: number;
  y: number;
  id: number;
}

export default function BottomNavigation({ className = '' }: BottomNavigationProps) {
  const [location, setLocation] = useLocation();
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [ripples, setRipples] = useState<(Ripple & { buttonId: string })[]>([]);
  
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/dashboard',
      color: NAV_COLORS.home,
      isActive: location === '/dashboard' || location === '/home'
    },
    {
      id: 'lessons',
      label: 'Learn',
      icon: BookOpen,
      path: '/lessons',
      color: NAV_COLORS.lessons,
      isActive: location === '/lessons' || location.startsWith('/lesson/')
    },
    {
      id: 'log',
      label: 'Log',
      icon: Plus,
      path: '/food-log',
      color: NAV_COLORS.home,
      isActive: location.includes('/log'),
      isHero: true
    },
    {
      id: 'achievements',
      label: 'Badges',
      icon: Medal,
      path: '/achievements',
      color: NAV_COLORS.achievements,
      isActive: location === '/achievements'
    },
    {
      id: 'champs',
      label: 'Champs',
      icon: Trophy,
      path: '/leaderboard',
      color: NAV_COLORS.champs,
      isActive: location === '/leaderboard'
    }
  ];
  
  const handleNavPress = (item: typeof navItems[0], e: ReactMouseEvent<HTMLButtonElement>) => {
    setPressedId(item.id);
    triggerHaptic('light');
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now(), buttonId: item.id };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
    
    setTimeout(() => {
      setPressedId(null);
      setLocation(item.path);
    }, 100);
  };
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom ${className}`}>
      <div className="max-w-md mx-auto">
        <nav className="grid grid-cols-5 px-2 py-2 items-end">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isPressed = pressedId === item.id;
            
            const buttonRipples = ripples.filter(r => r.buttonId === item.id);
            
            if (item.isHero) {
              return (
                <button
                  key={item.id}
                  onClick={(e) => handleNavPress(item, e)}
                  className={`
                    flex flex-col items-center justify-center -mt-6 relative overflow-visible
                    transition-all duration-200
                    ${isPressed ? 'scale-90' : 'hover:scale-110'}
                  `}
                  aria-label={item.label}
                  data-testid={`nav-${item.id}`}
                >
                  <div className={`
                    w-14 h-14 rounded-full flex items-center justify-center relative overflow-hidden
                    bg-gradient-to-br from-orange-400 to-orange-600
                    shadow-lg shadow-orange-300/50
                    border-4 border-white
                    transition-transform duration-150
                    ${isPressed ? 'scale-90' : ''}
                    ${item.isActive ? 'ring-4 ring-orange-200' : ''}
                  `}>
                    <Icon className="w-7 h-7 text-white stroke-[2.5]" />
                    {buttonRipples.map((ripple) => (
                      <span
                        key={ripple.id}
                        className="absolute bg-white/40 rounded-full animate-ripple pointer-events-none"
                        style={{
                          left: '50%',
                          top: '50%',
                          width: 20,
                          height: 20,
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-orange-600 mt-1">
                    {item.label}
                  </span>
                </button>
              );
            }
            
            return (
              <button
                key={item.id}
                onClick={(e) => handleNavPress(item, e)}
                className={`
                  flex flex-col items-center justify-center space-y-1 py-2 px-1 rounded-xl relative overflow-hidden
                  transition-all duration-200 min-h-[56px] w-full
                  ${isPressed ? 'scale-90' : ''}
                  ${item.isActive 
                    ? 'bg-opacity-100' 
                    : 'hover:bg-gray-50'
                  }
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
                `}
                style={item.isActive ? { backgroundColor: item.color.light } : {}}
                aria-label={item.label}
                data-testid={`nav-${item.id}`}
              >
                {buttonRipples.map((ripple) => (
                  <span
                    key={ripple.id}
                    className="absolute bg-gray-400/30 rounded-full animate-ripple pointer-events-none"
                    style={{
                      left: ripple.x,
                      top: ripple.y,
                      width: 20,
                      height: 20,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
                <div className={`
                  p-2 rounded-xl transition-all duration-200
                  ${item.isActive ? '' : ''}
                `}
                style={item.isActive ? { backgroundColor: item.color.bg } : {}}
                >
                  <Icon 
                    className={`w-6 h-6 transition-all duration-200 ${
                      item.isActive 
                        ? 'text-white scale-110' 
                        : 'text-gray-500'
                    }`}
                    strokeWidth={item.isActive ? 2.5 : 2}
                  />
                </div>
                <span 
                  className={`text-xs font-semibold transition-colors ${
                    item.isActive ? 'font-bold' : 'text-gray-600'
                  }`}
                  style={item.isActive ? { color: item.color.bg } : {}}
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
