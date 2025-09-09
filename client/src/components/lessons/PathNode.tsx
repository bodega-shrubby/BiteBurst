import { Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export type NodeState = 'complete' | 'unlocked' | 'locked';

export interface LessonNodeData {
  id: string;
  title: string;
  icon: string;
  xp: number;
  state: NodeState;
  order: number;
}

interface PathNodeProps {
  x: number;
  y: number;
  icon: string;
  title: string;
  state: NodeState;
  order: number;
  onClick?: () => void;
  isNewlyUnlocked?: boolean;
}

export default function PathNode({ 
  x, 
  y, 
  icon, 
  title, 
  state, 
  order,
  onClick,
  isNewlyUnlocked = false 
}: PathNodeProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  // Trigger pop + glow animation for newly unlocked nodes
  useEffect(() => {
    if (isNewlyUnlocked) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 2400); // 500ms popIn + 2x 1200ms glowPulse
      return () => clearTimeout(timer);
    }
  }, [isNewlyUnlocked]);

  const isInteractive = state !== 'locked';
  const isComplete = state === 'complete';
  const isUnlocked = state === 'unlocked';

  // Calculate position offset for left/right alternating pattern
  const offsetX = order % 2 === 0 ? -90 : 90;
  const finalX = x + offsetX;

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: finalX - 36, // Center the 72px circle
        top: y - 36,
        transform: showAnimation ? 'scale(1)' : 'scale(1)',
      }}
    >
      <button
        onClick={isInteractive ? onClick : undefined}
        disabled={!isInteractive}
        role="button"
        aria-disabled={!isInteractive}
        aria-label={`${title.replace('\n', ' ')}, ${state}, ${state === 'unlocked' ? '25 XP' : ''}`}
        className={`
          relative group transition-all duration-300 transform
          lesson-node ${state}
          ${isInteractive ? 'hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2' : 'cursor-not-allowed'}
          ${showAnimation ? 'newly-unlocked' : ''}
        `}
        style={{ 
          width: '72px', 
          height: '72px',
          borderRadius: '50%',
          boxShadow: 'var(--bb-shadow)',
        }}
      >
        {/* Main node circle with gradient background */}
        <div className={`
          w-full h-full rounded-full border-4 border-white flex items-center justify-center
          relative overflow-hidden
          ${isComplete 
            ? 'bg-gradient-to-br from-green-400 to-green-500 text-white' 
            : isUnlocked
            ? 'bg-gradient-to-br from-purple-400 to-purple-500 text-white'
            : 'bg-gray-300 text-gray-500'
          }
        `}>
          {/* Icon or lock */}
          {state === 'locked' ? (
            <Lock className="w-6 h-6" aria-hidden="true" />
          ) : (
            <span className="text-2xl" role="img" aria-label={title}>
              {icon}
            </span>
          )}
          
          {/* Gold star badge for completed lessons */}
          {isComplete && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-yellow-800 text-xs font-bold">★</span>
            </div>
          )}
        </div>

        {/* START ribbon for unlocked lessons */}
        {isUnlocked && (
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-purple-400 uppercase tracking-wide">
              START
            </div>
          </div>
        )}
      </button>
      
      {/* Lesson title - only show for interactive lessons */}
      {isInteractive && (
        <div className="mt-6 text-center max-w-20">
          <h3 className="text-xs font-semibold text-gray-700 leading-tight whitespace-pre-line">
            {title}
          </h3>
        </div>
      )}

      {/* Locked lesson tooltip - shows on hover */}
      {!isInteractive && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            Finish earlier lessons to unlock
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}