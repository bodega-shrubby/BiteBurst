import { Lock } from 'lucide-react';
import ProgressRing from './ProgressRing';

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
}

export default function TrackNode({ node, onClick, isGlowing = false }: TrackNodeProps) {
  const isInteractive = node.state !== 'locked';
  const isComplete = node.state === 'complete';
  const progress = isComplete ? 1 : 0;
  
  return (
    <div className="relative flex flex-col items-center">
      {/* Connection line to next node */}
      {node.pathIndex < 3 && (
        <div className="absolute top-20 w-0.5 h-16 bg-gray-300 -z-10" />
      )}
      
      <button
        onClick={isInteractive ? onClick : undefined}
        disabled={!isInteractive}
        className={`
          relative group transition-all duration-300 transform
          ${isInteractive ? 'hover:-translate-y-1 hover:shadow-lg cursor-pointer' : 'cursor-not-allowed'}
          ${isGlowing ? 'animate-pulse shadow-lg shadow-orange-200' : ''}
        `}
        style={{ minWidth: '44px', minHeight: '44px' }}
        aria-label={`${node.title} lesson - ${node.state}`}
      >
        {/* Main node card */}
        <div className={`
          relative w-20 h-20 rounded-full border-4 flex items-center justify-center
          ${isComplete 
            ? 'bg-green-100 border-green-400 text-green-600' 
            : node.state === 'unlocked'
            ? 'bg-orange-50 border-orange-400 text-orange-600'
            : 'bg-gray-100 border-gray-300 text-gray-400'
          }
          ${isInteractive ? 'group-hover:border-opacity-80' : ''}
        `}>
          {/* Icon or lock */}
          {node.state === 'locked' ? (
            <Lock className="w-6 h-6" aria-hidden="true" />
          ) : (
            <span className="text-2xl" role="img" aria-label={node.title}>
              {node.icon}
            </span>
          )}
          
          {/* Progress ring */}
          {node.state !== 'locked' && (
            <div className="absolute -top-1 -right-1">
              <ProgressRing 
                progress={progress} 
                size={24} 
                strokeWidth={3}
              />
            </div>
          )}
          
          {/* Completion checkmark */}
          {isComplete && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        {/* Start button for unlocked lessons */}
        {node.state === 'unlocked' && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Start
            </div>
          </div>
        )}
      </button>
      
      {/* Label */}
      <div className="mt-4 text-center space-y-1">
        <h3 className={`text-sm font-semibold ${
          node.state === 'locked' ? 'text-gray-400' : 'text-gray-900'
        }`}>
          {node.title}
        </h3>
        
        {/* XP chip */}
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          node.state === 'locked' 
            ? 'bg-gray-100 text-gray-400'
            : 'bg-orange-100 text-orange-600'
        }`}>
          +{node.xp} XP
        </div>
      </div>
    </div>
  );
}