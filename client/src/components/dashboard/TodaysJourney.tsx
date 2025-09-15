import { CheckCircle, Circle } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
}

interface TodaysJourneyProps {
  milestones: Milestone[];
  className?: string;
}

export default function TodaysJourney({ milestones, className = '' }: TodaysJourneyProps) {
  const completedCount = milestones.filter(m => m.completed).length;
  const totalCount = milestones.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <h2 className="text-xl font-bold text-black mb-4">Today's Journey</h2>
      
      <div className="space-y-3 mb-4">
        {milestones.map((milestone) => (
          <div 
            key={milestone.id}
            className={`
              flex items-center justify-between p-3 rounded-xl transition-all duration-300
              ${milestone.completed 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-gray-50 border border-gray-200'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              {milestone.completed ? (
                <CheckCircle 
                  className="w-5 h-5 text-green-600 animate-in zoom-in duration-300" 
                  aria-label="Completed"
                />
              ) : (
                <Circle 
                  className="w-5 h-5 text-gray-400" 
                  aria-label="Not completed"
                />
              )}
              <span 
                className={`font-medium transition-all duration-300 ${
                  milestone.completed 
                    ? 'line-through text-green-700' 
                    : 'text-gray-900'
                }`}
              >
                {milestone.title}
              </span>
            </div>
            <span 
              className={`text-sm font-semibold ${
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
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {completedCount}/{totalCount} tasks completed
          </span>
          <span className="font-semibold text-gray-800">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
            aria-label={`${completedCount} of ${totalCount} tasks completed`}
          />
        </div>
      </div>
      
      {/* Completion message */}
      {completedCount === totalCount && totalCount > 0 && (
        <div 
          className="mt-4 p-3 bg-green-100 border border-green-200 rounded-xl text-center"
          role="status"
          aria-live="polite"
        >
          <span className="text-green-800 font-semibold">
            🎉 Amazing! You completed all your daily goals!
          </span>
        </div>
      )}
    </div>
  );
}