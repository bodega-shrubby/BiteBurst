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
  { bg: ['#F87171', '#EF4444'], edge: '#DC2626' },
  { bg: ['#FB923C', '#F97316'], edge: '#EA580C' },
  { bg: ['#FBBF24', '#F59E0B'], edge: '#D97706' },
  { bg: ['#4ADE80', '#22C55E'], edge: '#16A34A' },
  { bg: ['#60A5FA', '#3B82F6'], edge: '#2563EB' },
  { bg: ['#A78BFA', '#8B5CF6'], edge: '#7C3AED' },
  { bg: ['#F472B6', '#EC4899'], edge: '#DB2777' },
];

function getNodeColor(order: number) {
  return nodeColors[order % nodeColors.length];
}

function get3DStyles(state: NodeState, color: typeof nodeColors[0]) {
  if (state === 'locked') {
    return {
      background: 'linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)',
      boxShadow: `
        0 6px 0 0 #D1D5DB,
        0 8px 8px rgba(0, 0, 0, 0.1),
        inset 0 2px 4px rgba(255, 255, 255, 0.8),
        inset 0 -2px 4px rgba(0, 0, 0, 0.05)
      `,
    };
  }
  
  if (state === 'complete') {
    return {
      background: `linear-gradient(180deg, ${color.bg[0]} 0%, ${color.bg[1]} 100%)`,
      boxShadow: `
        0 6px 0 0 ${color.edge},
        0 8px 8px rgba(0, 0, 0, 0.15),
        inset 0 2px 4px rgba(255, 255, 255, 0.4),
        inset 0 -2px 4px rgba(0, 0, 0, 0.1)
      `,
    };
  }
  
  return {
    background: `linear-gradient(180deg, ${color.bg[0]} 0%, ${color.bg[1]} 100%)`,
    boxShadow: `
      0 6px 0 0 ${color.edge},
      0 8px 8px rgba(0, 0, 0, 0.2),
      inset 0 2px 4px rgba(255, 255, 255, 0.4),
      inset 0 -2px 4px rgba(0, 0, 0, 0.1)
    `,
  };
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
  const size = state === 'unlocked' ? 76 : 68;
  const halfSize = size / 2;
  const styles3D = get3DStyles(state, color);

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
          relative group rounded-full border-[3px] border-white
          flex items-center justify-center
          transition-all duration-200
          ${isInteractive ? 'hover:brightness-105 active:translate-y-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2' : 'cursor-not-allowed'}
          ${showAnimation ? 'animate-node-pop' : ''}
          ${isUnlocked && !showAnimation ? 'animate-glow-pulse' : ''}
        `}
        style={{ 
          width: size, 
          height: size,
          ...styles3D,
        }}
      >
        {state === 'locked' ? (
          <Lock className="w-6 h-6 text-gray-400" aria-hidden="true" />
        ) : (
          <span className="text-2xl drop-shadow-sm" role="img" aria-label={title}>
            {icon}
          </span>
        )}
        
        {isComplete && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-md z-10">
            <Check className="w-4 h-4 text-yellow-900" strokeWidth={3} />
          </div>
        )}

        {isUnlocked && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-30">
            <div 
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-md"
              style={{
                backgroundColor: color.edge,
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
