import { useEffect, useState } from 'react';
import mascotImage from '@assets/9ef8e8fe-158e-4518-bd1c-1325863aebca_1756365757940.png';

type MascotState = 'idle' | 'goalReached' | 'badgeUnlocked';

interface MascotAvatarProps {
  state?: MascotState;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export default function MascotAvatar({ 
  state = 'idle', 
  size = 'medium',
  onClick 
}: MascotAvatarProps) {
  const [animationClass, setAnimationClass] = useState('');
  
  useEffect(() => {
    // Reset animation
    setAnimationClass('');
    
    // Apply animation based on state
    const timer = setTimeout(() => {
      switch (state) {
        case 'goalReached':
          setAnimationClass('mascot-goal-celebration');
          break;
        case 'badgeUnlocked':
          setAnimationClass('mascot-badge-celebration');
          break;
        case 'idle':
        default:
          setAnimationClass('mascot-idle');
          break;
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [state]);
  
  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };
  
  return (
    <div 
      className={`relative inline-block ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      aria-label="BiteBurst mascot"
    >
      <img 
        src={mascotImage} 
        alt="BiteBurst Mascot" 
        className={`${sizeClasses[size]} rounded-full object-cover transition-transform duration-300 ${animationClass}`}
      />
      
      {/* Sparkle effects for celebrations */}
      {(state === 'goalReached' || state === 'badgeUnlocked') && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-2 -right-2 text-lg animate-bounce">✨</div>
          <div className="absolute -top-1 -left-2 text-sm animate-pulse" style={{ animationDelay: '0.3s' }}>✨</div>
          <div className="absolute -bottom-1 -right-1 text-sm animate-pulse" style={{ animationDelay: '0.6s' }}>✨</div>
          {state === 'badgeUnlocked' && (
            <>
              <div className="absolute top-1/2 -left-3 text-xs animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</div>
              <div className="absolute top-1/2 -right-3 text-xs animate-bounce" style={{ animationDelay: '0.4s' }}>🎉</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}