import { Lock } from 'lucide-react';

export interface LessonNode {
  id: string;
  title: string;
  icon: string;
  xp: number;
  state: 'locked' | 'unlocked' | 'complete';
  pathIndex: number;
}

interface TrackNodeProps {
  node: LessonNode;
  onClick?: () => void;
  isGlowing?: boolean;
  position: 'left' | 'right' | 'center';
}

export default function TrackNode({ node, onClick, isGlowing = false, position }: TrackNodeProps) {
  const isInteractive = node.state !== 'locked';
  const isComplete = node.state === 'complete';
  
  return (
    <div className={`
      relative flex flex-col items-center w-24
      ${position === 'left' ? 'self-start ml-8' : 
        position === 'right' ? 'self-end mr-8' : 
        'self-center'}
    `}>
      <button
        onClick={isInteractive ? onClick : undefined}
        disabled={!isInteractive}
        className={`
          relative group transition-all duration-300 transform
          ${isInteractive ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer' : 'cursor-not-allowed'}
          ${isGlowing ? 'animate-pulse shadow-xl shadow-purple-300' : ''}
        `}
        style={{ minWidth: '44px', minHeight: '44px' }}
        aria-label={`${node.title} lesson - ${node.state}`}
      >
        {/* Main node circle */}
        <div className={`
          relative w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg
          ${isComplete 
            ? 'bg-gradient-to-br from-green-400 to-green-500 border-green-300 text-white shadow-green-200' 
            : node.state === 'unlocked'
            ? 'bg-gradient-to-br from-purple-400 to-purple-500 border-purple-300 text-white shadow-purple-200'
            : 'bg-gradient-to-br from-gray-300 to-gray-400 border-gray-200 text-gray-500 shadow-gray-200'
          }
          ${isInteractive ? 'group-hover:scale-105' : ''}
        `}>
          {/* Icon or lock */}
          {node.state === 'locked' ? (
            <Lock className="w-5 h-5" aria-hidden="true" />
          ) : (
            <span className="text-xl" role="img" aria-label={node.title}>
              {node.icon}
            </span>
          )}
          
          {/* Completion star */}
          {isComplete && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-yellow-800 text-xs">★</span>
            </div>
          )}
        </div>
        
        {/* Start button for unlocked lessons */}
        {node.state === 'unlocked' && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-purple-400">
              START
            </div>
          </div>
        )}
      </button>
      
      {/* Label - only show for unlocked/complete lessons */}
      {node.state !== 'locked' && (
        <div className="mt-3 text-center space-y-1 max-w-20">
          <h3 className="text-xs font-semibold text-gray-700 leading-tight">
            {node.title}
          </h3>
        </div>
      )}
    </div>
  );
}