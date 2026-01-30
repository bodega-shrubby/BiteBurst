import { useEffect, useState } from 'react';

interface XPProgressBarProps {
  xpToday: number;
  xpGoal: number;
  className?: string;
}

export default function XPProgressBar({ xpToday, xpGoal, className = '' }: XPProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progress = Math.min((xpToday / xpGoal) * 100, 100);
  const isComplete = xpToday >= xpGoal;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`bg-white rounded-2xl border-2 border-orange-200 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">⚡</span>
          <span className="font-bold text-gray-900 text-lg">Daily XP Goal</span>
        </div>
        <div className="text-right">
          <span className={`text-xl font-bold ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
            {xpToday}
          </span>
          <span className="text-gray-500 text-lg"> / {xpGoal}</span>
        </div>
      </div>
      
      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
            isComplete 
              ? 'bg-gradient-to-r from-green-400 to-green-500' 
              : 'bg-gradient-to-r from-orange-400 to-orange-500'
          }`}
          style={{ width: `${animatedProgress}%` }}
        >
          <div className="absolute inset-0 shimmer-effect" />
        </div>
        
        {isComplete && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm drop-shadow-md">
              🎉 Goal Complete!
            </span>
          </div>
        )}
      </div>
      
      {!isComplete && (
        <div className="mt-2 text-center text-sm text-gray-600">
          <span className="font-medium text-orange-600">{xpGoal - xpToday} XP</span> to go!
        </div>
      )}
    </div>
  );
}
