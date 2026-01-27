import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { ACTIVITY_TYPES, ACTIVITIES } from '@/constants/activity-data';
import ActivityLogBreadcrumb from './ActivityLogBreadcrumb';
import ActivitySummaryCard from './ActivitySummaryCard';
import { SelectedActivity } from '@/types/activity-logging';

interface ActivityTypeScreenProps {
  timePeriod: 'morning' | 'afternoon' | 'evening' | 'anytime';
  selectedActivities: SelectedActivity[];
  totalXP: number;
  totalMinutes: number;
  onSelectType: (typeId: string) => void;
  onBack: () => void;
  onFinish: () => void;
}

export default function ActivityTypeScreen({ 
  timePeriod, 
  selectedActivities, 
  totalXP,
  totalMinutes,
  onSelectType, 
  onBack,
  onFinish 
}: ActivityTypeScreenProps) {
  const periodName = timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1);

  const getTypeActivityCount = (typeId: string): number => {
    return selectedActivities.filter(a => {
      const activity = ACTIVITIES.find(act => act.id === a.activityId);
      return activity?.typeId === typeId;
    }).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-white pb-32"
    >
      <header className="bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-4 text-white sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">{periodName}</h2>
          <div className="w-10" />
        </div>
      </header>

      <ActivityLogBreadcrumb timePeriod={timePeriod} />

      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-1">
            What did you do?
          </p>
          <p className="text-sm text-gray-500">
            Pick an activity type
          </p>
        </div>

        {selectedActivities.length > 0 && (
          <ActivitySummaryCard 
            activities={selectedActivities}
            totalXP={totalXP}
            totalMinutes={totalMinutes}
            periodName={periodName}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          {ACTIVITY_TYPES.map((type) => {
            const activityCount = getTypeActivityCount(type.id);
            const hasActivities = activityCount > 0;

            return (
              <button
                key={type.id}
                onClick={() => onSelectType(type.id)}
                className={`
                  relative
                  flex flex-col items-center justify-center
                  p-6 rounded-2xl
                  bg-gradient-to-br ${type.color}
                  border-2 ${type.borderColor}
                  hover:scale-105 hover:shadow-xl hover:-translate-y-1
                  active:scale-95
                  transition-all duration-200
                  min-h-[140px]
                  overflow-hidden
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                
                {hasActivities && (
                  <div className="absolute -top-2 -right-2 z-10 bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-xs font-bold">{activityCount}</span>
                  </div>
                )}

                <span className="text-5xl mb-3">{type.emoji}</span>
                <span className="text-base font-bold text-gray-900 text-center">
                  {type.name}
                </span>
                
                {hasActivities ? (
                  <span className="text-xs text-green-700 font-semibold mt-1">
                    {activityCount} logged
                  </span>
                ) : (
                  <span className="text-xs text-gray-600 mt-1">
                    {type.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedActivities.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-20 animate-slide-up-fade">
          <div className="max-w-md mx-auto">
            <button
              onClick={onFinish}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-2xl hover:from-green-600 hover:to-green-700 active:scale-95 transition-all text-lg min-h-[56px]"
            >
              Done with {periodName}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
