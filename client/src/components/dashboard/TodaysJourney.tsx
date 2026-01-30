import { useEffect, useRef, useState } from 'react';

interface Milestone {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
}

interface TodaysJourneyProps {
  milestones: Milestone[];
  className?: string;
  onTaskComplete?: (xpReward: number) => void;
}

export default function TodaysJourney({ milestones, className = '', onTaskComplete }: TodaysJourneyProps) {
  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const allComplete = completedCount === totalCount && totalCount > 0;
  
  // Track if we've initialized with the initial completed state
  const hasInitializedRef = useRef(false);
  const prevCompletedRef = useRef<Set<string>>(new Set());
  const [bonusAwarded, setBonusAwarded] = useState(false);
  
  // Initialize with current completed milestones on first render
  useEffect(() => {
    if (!hasInitializedRef.current) {
      // Initialize with currently completed milestones - don't trigger XP for these
      prevCompletedRef.current = new Set(milestones.filter(m => m.completed).map(m => m.id));
      hasInitializedRef.current = true;
      // Also check if bonus should be considered as already awarded
      if (allComplete) {
        setBonusAwarded(true);
      }
      return;
    }
    
    const currentCompleted = new Set(milestones.filter(m => m.completed).map(m => m.id));
    const prevCompleted = prevCompletedRef.current;
    
    // Find newly completed milestones (not in previous set)
    milestones.forEach(milestone => {
      if (milestone.completed && !prevCompleted.has(milestone.id)) {
        // This milestone was just completed!
        if (onTaskComplete) {
          onTaskComplete(milestone.reward);
        }
      }
    });
    
    // Update ref for next comparison
    prevCompletedRef.current = currentCompleted;
  }, [milestones, onTaskComplete, allComplete]);

  // Trigger bonus when ALL tasks complete (only once)
  useEffect(() => {
    if (allComplete && !bonusAwarded && hasInitializedRef.current) {
      setBonusAwarded(true);
      // Small delay for the bonus burst
      const timer = setTimeout(() => {
        if (onTaskComplete) {
          onTaskComplete(50); // Daily Journey bonus
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [allComplete, bonusAwarded, onTaskComplete]);
  
  return (
    <div className={`bg-white rounded-2xl border-2 border-gray-200 p-6 lg:p-8 ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Today's Journey</h2>
        <div className="text-base lg:text-lg font-semibold text-gray-600">
          {completedCount}/{totalCount} tasks
        </div>
      </div>
      
      <div className="space-y-4 mb-5">
        {milestones.map((milestone) => (
          <div 
            key={milestone.id}
            className={`
              flex items-center justify-between p-4 lg:p-5 rounded-xl transition-all duration-300
              ${milestone.completed 
                ? 'bg-green-50 border-2 border-green-200' 
                : 'bg-gray-50 border-2 border-gray-200'
              }
            `}
          >
            <div className="flex items-center space-x-4">
              {/* Animated Checkbox */}
              <div className={`
                w-7 h-7 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${milestone.completed 
                  ? 'bg-green-500 border-green-500 animate-check-pop' 
                  : 'border-gray-300'
                }
              `}>
                {milestone.completed && (
                  <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              <span 
                className={`font-medium text-base lg:text-lg transition-all duration-300 ${
                  milestone.completed 
                    ? 'line-through text-green-700' 
                    : 'text-gray-900'
                }`}
              >
                {milestone.title}
              </span>
            </div>
            <span 
              className={`text-base lg:text-lg font-bold ${
                milestone.completed 
                  ? 'text-green-600' 
                  : 'text-orange-500'
              }`}
            >
              +{milestone.reward} XP
            </span>
          </div>
        ))}
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-base lg:text-lg">
          <span className="text-gray-600">
            Progress
          </span>
          <span className="font-semibold text-gray-800">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-100 rounded-full h-4 lg:h-5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 lg:h-5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
            aria-label={`${completedCount} of ${totalCount} tasks completed`}
          />
        </div>
      </div>
      
      {/* Completion Bonus */}
      {allComplete && (
        <div 
          className="mt-5 p-5 lg:p-6 bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300 rounded-xl text-center"
          role="status"
          aria-live="polite"
        >
          <p className="text-xl lg:text-2xl font-bold text-orange-800">
            🎉 Daily Journey Complete! +50 XP Bonus!
          </p>
        </div>
      )}
    </div>
  );
}
