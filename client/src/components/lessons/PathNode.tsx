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
  { bg: 'from-red-400 to-red-500', edge: '#DC2626', glow: 'rgba(239, 68, 68, 0.4)', light: '#FEE2E2' },
  { bg: 'from-orange-400 to-orange-500', edge: '#EA580C', glow: 'rgba(249, 115, 22, 0.4)', light: '#FFEDD5' },
  { bg: 'from-yellow-400 to-yellow-500', edge: '#CA8A04', glow: 'rgba(234, 179, 8, 0.4)', light: '#FEF3C7' },
  { bg: 'from-green-400 to-green-500', edge: '#16A34A', glow: 'rgba(34, 197, 94, 0.4)', light: '#DCFCE7' },
  { bg: 'from-blue-400 to-blue-500', edge: '#2563EB', glow: 'rgba(59, 130, 246, 0.4)', light: '#DBEAFE' },
  { bg: 'from-purple-400 to-purple-500', edge: '#9333EA', glow: 'rgba(168, 85, 247, 0.4)', light: '#F3E8FF' },
  { bg: 'from-pink-400 to-pink-500', edge: '#DB2777', glow: 'rgba(236, 72, 153, 0.4)', light: '#FCE7F3' },
];

function getNodeColor(order: number) {
  return nodeColors[order % nodeColors.length];
}

function getNodeSize(state: NodeState): number {
  switch (state) {
    case 'locked': return 64;
    case 'complete': return 72;
    case 'unlocked': return 84;
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

  const boxShadowStyle = isUnlocked
    ? `0 4px 20px -3px ${color.glow}, 0 8px 0 -2px ${color.edge}, inset 0 -4px 8px rgba(0,0,0,0.15), inset 0 4px 8px rgba(255,255,255,0.3)`
    : isComplete
    ? `0 4px 15px -3px ${color.glow}, 0 6px 0 -2px ${color.edge}, inset 0 -3px 6px rgba(0,0,0,0.1), inset 0 3px 6px rgba(255,255,255,0.2)`
    : '0 4px 8px rgba(0,0,0,0.15), 0 4px 0 -2px #9CA3AF';

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
          relative group transition-all duration-200 transform
          lesson-node ${state} lesson-node-3d
          ${isInteractive ? 'hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2' : 'cursor-not-allowed'}
          ${showAnimation ? 'animate-node-pop' : ''}
          ${isUnlocked && !showAnimation ? 'animate-glow-pulse' : ''}
        `}
        style={{ 
          width: size, 
          height: size,
          borderRadius: '50%',
          boxShadow: boxShadowStyle,
          '--edge-color': color.edge,
          '--glow-color': color.glow,
        } as React.CSSProperties}
      >
        <div className={`
          w-full h-full rounded-full border-4 border-white flex items-center justify-center
          relative overflow-hidden
          ${state === 'locked' 
            ? 'bg-gray-300' 
            : `bg-gradient-to-br ${color.bg}`
          }
        `}>
          {state === 'locked' && (
            <div className="absolute inset-0 bg-gray-600/30 rounded-full" />
          )}
          
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-60" 
               style={{ height: '50%' }} />
          
          {state === 'locked' ? (
            <Lock className="w-6 h-6 text-gray-500 relative z-10" aria-hidden="true" />
          ) : (
            <span className={`relative z-10 drop-shadow-sm ${isUnlocked ? 'text-3xl' : 'text-2xl'}`} role="img" aria-label={title}>
              {icon}
            </span>
          )}
          
          {isComplete && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/10 rounded-full" />
              <div className="relative z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
              </div>
            </div>
          )}
        </div>

        {isComplete && (
          <div className="absolute -top-1 -right-1 w-7 h-7 flex items-center justify-center z-20">
            <div 
              className="w-full h-full rounded-full flex items-center justify-center border-2 border-white"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                boxShadow: '0 2px 6px rgba(255, 165, 0, 0.4), 0 2px 0 -1px #B8860B',
              }}
            >
              <span className="text-white text-sm drop-shadow-sm">★</span>
            </div>
          </div>
        )}

        {isUnlocked && (
          <div className="absolute -bottom-5 left-1/2 z-30 animate-bounce-subtle">
            <div 
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg border-2"
              style={{
                background: `linear-gradient(135deg, ${color.edge} 0%, ${color.edge}dd 100%)`,
                borderColor: color.light,
                boxShadow: `0 4px 12px ${color.glow}`,
              }}
            >
              START
            </div>
          </div>
        )}
      </button>
      
      {isInteractive && (
        <div className={`text-center max-w-24 ${isUnlocked ? 'mt-10' : 'mt-6'}`}>
          <h3 className="text-xs font-semibold text-gray-700 leading-tight whitespace-pre-line">
            {title}
          </h3>
        </div>
      )}

      {!isInteractive && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
            Complete earlier lessons first
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900" />
          </div>
        </div>
      )}
    </div>
  );
}
