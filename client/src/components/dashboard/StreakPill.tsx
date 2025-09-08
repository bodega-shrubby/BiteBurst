import { Flame } from 'lucide-react';

interface StreakPillProps {
  streakDays: number;
  onClick?: () => void;
  className?: string;
}

export default function StreakPill({ streakDays, onClick, className = '' }: StreakPillProps) {
  if (streakDays === 0) {
    return null;
  }
  
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`
        flex items-center gap-1 px-3 py-1.5 rounded-full 
        bg-gradient-to-r from-orange-500 to-orange-600 
        text-white text-sm font-bold
        shadow-lg transition-all duration-200
        ${onClick ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}
        ${onClick ? 'hover:shadow-xl' : ''}
        min-h-[44px] min-w-[44px]
        ${className}
      `}
      aria-label={`Current streak: ${streakDays} days`}
      role={onClick ? 'button' : 'status'}
    >
      <Flame 
        size={16} 
        className={`text-yellow-200 ${streakDays > 0 ? 'animate-pulse' : ''}`} 
      />
      <span className="whitespace-nowrap">
        {streakDays}-day streak
      </span>
    </button>
  );
}