import { Lock, Check } from 'lucide-react';
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

const nodeColors = [
  { bg: '#EF4444', shadow: '#DC2626', glow: 'rgba(239, 68, 68, 0.3)' },
  { bg: '#F97316', shadow: '#EA580C', glow: 'rgba(249, 115, 22, 0.3)' },
  { bg: '#EAB308', shadow: '#CA8A04', glow: 'rgba(234, 179, 8, 0.3)' },
  { bg: '#22C55E', shadow: '#16A34A', glow: 'rgba(34, 197, 94, 0.3)' },
  { bg: '#3B82F6', shadow: '#2563EB', glow: 'rgba(59, 130, 246, 0.3)' },
  { bg: '#A855F7', shadow: '#9333EA', glow: 'rgba(168, 85, 247, 0.3)' },
  { bg: '#EC4899', shadow: '#DB2777', glow: 'rgba(236, 72, 153, 0.3)' },
];

function getNodeColor(order: number) {
  return nodeColors[order % nodeColors.length];
}

function getNodeSize(state: NodeState): number {
  switch (state) {
    case 'locked': return 64;
    case 'complete': return 68;
    case 'unlocked': return 76;
  }
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

  useEffect(() => {
    if (isNewlyUnlocked) {
      setShowAnimation(true);
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNewlyUnlocked]);

  const isInteractive = state !== 'locked';
  const isComplete = state === 'complete';
  const isUnlocked = state === 'unlocked';
  
  const color = getNodeColor(order);
  const size = getNodeSize(state);
  const halfSize = size / 2;

  const getBoxShadow = () => {
    if (state === 'locked') {
      return '0 6px 0 0 #D1D5DB, 0 8px 15px rgba(0,0,0,0.1)';
    }
    if (state === 'complete') {
      return `0 6px 0 0 ${color.shadow}, 0 8px 15px rgba(0,0,0,0.12)`;
    }
    return `0 6px 0 0 ${color.shadow}, 0 8px 20px ${color.glow}`;
  };

  const getBackground = () => {
    if (state === 'locked') return '#E5E7EB';
    return color.bg;
  };

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: x - halfSize,
        top: y - halfSize,
        zIndex: isUnlocked ? 20 : 10,
      }}
    >
      <button
        onClick={isInteractive ? onClick : undefined}
        disabled={!isInteractive}
        role="button"
        aria-disabled={!isInteractive}
        aria-label={`${title.replace('\n', ' ')}, ${state}${isUnlocked ? ', 25 XP' : ''}`}
        className={`
          relative group rounded-full border-4 border-white
          flex items-center justify-center
          transition-all duration-200
          ${isInteractive ? 'hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2' : 'cursor-not-allowed'}
          ${showAnimation ? 'animate-node-pop' : ''}
          ${isUnlocked && !showAnimation ? 'animate-glow-pulse' : ''}
        `}
        style={{ 
          width: size, 
          height: size,
          backgroundColor: getBackground(),
          boxShadow: getBoxShadow(),
        }}
      >
        {state === 'locked' ? (
          <Lock className="w-6 h-6 text-gray-400" aria-hidden="true" />
        ) : (
          <span className={`drop-shadow-sm ${isUnlocked ? 'text-2xl' : 'text-xl'}`} role="img" aria-label={title}>
            {icon}
          </span>
        )}
        
        {isComplete && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md z-10">
            <Check className="w-4 h-4 text-green-500" strokeWidth={3} />
          </div>
        )}

        {isUnlocked && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
            <div 
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
              style={{
                backgroundColor: color.shadow,
              }}
            >
              START
            </div>
          </div>
        )}
      </button>
      
      {isInteractive && (
        <div className={`text-center max-w-20 ${isUnlocked ? 'mt-8' : 'mt-4'}`}>
          <h3 className="text-[11px] font-medium text-gray-600 leading-tight whitespace-pre-line">
            {title}
          </h3>
        </div>
      )}

      {!isInteractive && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-gray-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-lg text-center max-w-28">
            <div className="font-medium whitespace-pre-line">{title}</div>
            <div className="text-gray-400 text-[9px] mt-0.5">Complete earlier lessons</div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800" />
          </div>
        </div>
      )}
    </div>
  );
}
