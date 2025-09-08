import { useEffect, useState } from 'react';

interface XPDayRingProps {
  xpToday: number;
  xpGoal: number;
  lifetimeXP: number;
  level: number;
  onGoalReached?: () => void;
}

export default function XPDayRing({ 
  xpToday, 
  xpGoal, 
  lifetimeXP, 
  level, 
  onGoalReached 
}: XPDayRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [previousGoalMet, setPreviousGoalMet] = useState(false);
  
  const progress = Math.min(xpToday / xpGoal, 1);
  const goalMet = xpToday >= xpGoal;
  const circumference = 2 * Math.PI * 36; // radius = 36
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - animatedProgress);
  
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setAnimatedProgress(progress);
      return;
    }
    
    // Animate the ring
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  useEffect(() => {
    // Trigger celebration when goal is reached for the first time
    if (goalMet && !previousGoalMet && onGoalReached) {
      onGoalReached();
    }
    setPreviousGoalMet(goalMet);
  }, [goalMet, previousGoalMet, onGoalReached]);
  
  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-3">
        {/* Background circle */}
        <svg className="w-24 h-24 transform -rotate-90" aria-hidden="true">
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="#EAEAEA"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="#FF6A00"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        
        {/* XP Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-900" aria-live="polite">
            {xpToday}
          </span>
          <span className="text-xs text-gray-500">XP</span>
        </div>
        
        {/* Goal celebration overlay */}
        {goalMet && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-2xl animate-bounce">🎉</div>
          </div>
        )}
      </div>
      
      {/* Progress text */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700" aria-live="polite">
          {goalMet ? (
            <span className="text-green-600 font-bold">Goal reached! 🎉</span>
          ) : (
            <span>{xpToday}/{xpGoal} XP today</span>
          )}
        </p>
        <p className="text-xs text-gray-500">
          Level {level} • {lifetimeXP.toLocaleString()} total XP
        </p>
      </div>
    </div>
  );
}