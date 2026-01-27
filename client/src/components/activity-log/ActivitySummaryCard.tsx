import { Zap, CheckCircle } from 'lucide-react';
import { ACTIVITY_TYPES, ACTIVITIES } from '@/constants/activity-data';
import { SelectedActivity } from '@/types/activity-logging';

interface ActivitySummaryCardProps {
  activities: SelectedActivity[];
  totalXP: number;
  totalMinutes: number;
  periodName: string;
}

export default function ActivitySummaryCard({ 
  activities, 
  totalXP, 
  totalMinutes,
  periodName 
}: ActivitySummaryCardProps) {
  if (activities.length === 0) return null;

  const activityTypes = new Set(
    activities.map(a => {
      const fullActivity = ACTIVITIES.find(act => act.id === a.activityId);
      return fullActivity?.typeId;
    }).filter(Boolean)
  );

  const typeInfo = Array.from(activityTypes).map(typeId => {
    const type = ACTIVITY_TYPES.find(t => t.id === typeId);
    return type;
  }).filter(Boolean);

  const isDiverse = activityTypes.size >= 2;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">Your {periodName} Activity</h3>
        </div>
        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          +{totalXP} XP
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {activities.map((activity, idx) => (
          <div 
            key={`${activity.activityId}-${idx}`}
            className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-blue-200 shadow-sm"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{activity.activityEmoji}</span>
              <span className="text-sm font-medium text-gray-700 capitalize">
                {activity.activityName}
              </span>
            </div>
            <span className="text-xs font-bold text-blue-600">
              {activity.durationMinutes} min
            </span>
          </div>
        ))}
      </div>

      {typeInfo.length > 0 && (
        <div className="pt-3 border-t border-blue-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-xs font-semibold text-gray-700">Types:</span>
              <div className="flex items-center flex-wrap gap-1">
                {typeInfo.map((type, idx) => (
                  <div key={type!.id} className="flex items-center">
                    <span className="text-sm">{type!.emoji}</span>
                    <span className="text-xs text-gray-600 ml-0.5">{type!.name}</span>
                    {idx < typeInfo.length - 1 && (
                      <span className="text-gray-400 mx-1">•</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {isDiverse && (
              <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-bold text-green-700">Diverse!</span>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-600 mt-3 text-center">
        {totalMinutes} total minutes • {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
      </p>
    </div>
  );
}
