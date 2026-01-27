import { ChevronRight } from 'lucide-react';
import { TIME_PERIODS, ACTIVITY_TYPES } from '@/constants/activity-data';

interface ActivityLogBreadcrumbProps {
  timePeriod: string;
  currentActivityType?: string;
}

export default function ActivityLogBreadcrumb({ timePeriod, currentActivityType }: ActivityLogBreadcrumbProps) {
  const period = TIME_PERIODS.find(p => p.id === timePeriod);
  const activityType = currentActivityType 
    ? ACTIVITY_TYPES.find(t => t.id === currentActivityType)
    : null;

  return (
    <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
      <div className="max-w-md mx-auto flex items-center text-sm">
        <span className="text-blue-600 font-medium flex items-center">
          <span className="mr-1">{period?.emoji}</span>
          {period?.name}
        </span>
        
        {activityType && (
          <>
            <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            <span className="text-blue-800 font-semibold flex items-center">
              <span className="mr-1">{activityType.emoji}</span>
              {activityType.name}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
