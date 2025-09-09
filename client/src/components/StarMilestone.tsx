import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StarMilestoneProps {
  y: number;
  index: number;
  isUnlocked?: boolean;
}

export default function StarMilestone({ y, index, isUnlocked = false }: StarMilestoneProps) {
  const [showEntrance, setShowEntrance] = useState(false);

  // Entrance animation with stagger
  useEffect(() => {
    const timer = setTimeout(() => setShowEntrance(true), index * 40);
    return () => clearTimeout(timer);
  }, [index]);

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nodeClasses = `
    absolute w-[72px] h-[72px] rounded-full transition-all duration-300 left-1/2 transform -translate-x-1/2
    ${showEntrance && !prefersReducedMotion ? 'opacity-100 translate-y-0' : !prefersReducedMotion ? 'opacity-0 translate-y-4' : 'opacity-100'}
  `;

  const bgColor = isUnlocked ? '#FCD34D' : '#E5E7EB'; // Yellow when unlocked, gray when locked
  const starColor = isUnlocked ? '#F59E0B' : '#9CA3AF';

  return (
    <div
      className="absolute"
      style={{ 
        top: y,
        transform: 'translateY(-36px)' // Center the 72px node
      }}
    >
      <div
        className={nodeClasses}
        style={{ 
          backgroundColor: bgColor,
          border: `3px solid ${starColor}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        {/* Inner circle with star */}
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center m-1 relative">
          <Star 
            className={`w-8 h-8 ${isUnlocked ? 'text-amber-500 fill-current' : 'text-gray-400'}`} 
          />
        </div>
      </div>

      {/* Milestone label */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs font-medium text-gray-600 max-w-[80px] leading-tight">
          Milestone
        </div>
      </div>
    </div>
  );
}