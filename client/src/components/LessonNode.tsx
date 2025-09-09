import { Lock, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

type LessonState = 'locked' | 'current' | 'unlocked' | 'completed';

export type Lesson = {
  id: string;
  title: string;
  icon: '🍎' | '💧' | '🥦' | '🥪' | '⚽' | '🧠' | '😴' | '🏆';
  state: LessonState;
  progress?: number; // 0..1
};

interface LessonNodeProps {
  lesson: Lesson;
  side: 'left' | 'right';
  y: number;
  index: number;
  onClick?: () => void;
}

export default function LessonNode({ lesson, side, y, index, onClick }: LessonNodeProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [showEntrance, setShowEntrance] = useState(false);

  // Entrance animation with stagger
  useEffect(() => {
    const timer = setTimeout(() => setShowEntrance(true), index * 40);
    return () => clearTimeout(timer);
  }, [index]);

  const isInteractive = lesson.state === 'current' || lesson.state === 'unlocked';
  const isCurrent = lesson.state === 'current';
  const isCompleted = lesson.state === 'completed';
  const isLocked = lesson.state === 'locked';

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handlePointerDown = () => {
    if (isInteractive) setIsPressed(true);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
    if (isInteractive && onClick) {
      onClick();
    }
  };

  const handlePointerLeave = () => {
    setIsPressed(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      if (onClick) onClick();
    }
  };

  // Compute styles based on state
  const ringColor = isCompleted ? '#16A34A' : isCurrent ? '#8B5CF6' : '#FFFFFF';
  const ringBorder = isLocked ? '#CBD5E1' : isCompleted ? '#16A34A' : isCurrent ? '#8B5CF6' : '#E5E7EB';
  const bgColor = isLocked ? '#CBD5E1' : '#FFFFFF';

  const nodeClasses = `
    absolute w-[72px] h-[72px] rounded-full transition-all duration-300
    ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
    ${isPressed && !prefersReducedMotion ? 'scale-[0.98]' : 'scale-100'}
    ${showEntrance && !prefersReducedMotion ? 'opacity-100 translate-y-0' : !prefersReducedMotion ? 'opacity-0 translate-y-4' : 'opacity-100'}
    ${side === 'left' ? 'left-6' : 'right-6'}
    ${isInteractive ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2' : ''}
    ${isCurrent && !prefersReducedMotion ? 'animate-pulse' : ''}
  `;

  const ariaLabel = `${lesson.title}, ${lesson.state}${isCurrent ? ', start lesson' : isInteractive ? ', open lesson' : ''}`;

  return (
    <div
      className="absolute"
      style={{ 
        top: y,
        transform: 'translateY(-36px)' // Center the 72px node
      }}
    >
      <button
        className={nodeClasses}
        style={{ 
          top: 0,
          backgroundColor: bgColor,
          border: `3px solid ${ringBorder}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        disabled={!isInteractive}
        role="button"
        aria-label={ariaLabel}
        tabIndex={isInteractive ? 0 : -1}
      >
        {/* Inner circle with content */}
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center m-1 relative">
          {isLocked ? (
            <Lock className="w-6 h-6 text-gray-400" />
          ) : (
            <span className="text-2xl" role="img" aria-hidden="true">
              {lesson.icon}
            </span>
          )}
        </div>

        {/* Completed state star badge */}
        {isCompleted && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-white fill-current" />
          </div>
        )}
      </button>

      {/* START pill for current lesson */}
      {isCurrent && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            START
          </div>
        </div>
      )}

      {/* Lesson title */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs font-medium text-gray-900 max-w-[80px] leading-tight">
          {lesson.title}
        </div>
      </div>
    </div>
  );
}