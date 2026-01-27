import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, Plus, Clock } from 'lucide-react';
import { ACTIVITIES, DURATION_PRESETS, ACTIVITY_TYPES, ACTIVITY_TIPS } from '@/constants/activity-data';
import ActivityLogBreadcrumb from './ActivityLogBreadcrumb';
import ActivitySummaryCard from './ActivitySummaryCard';
import { SelectedActivity } from '@/types/activity-logging';

interface DurationSelectionScreenProps {
  timePeriod: 'morning' | 'afternoon' | 'evening' | 'anytime';
  activityTypeId: string;
  selectedActivities: SelectedActivity[];
  totalXP: number;
  totalMinutes: number;
  onAddActivity: (activityId: string, duration: number) => void;
  onAddMore: () => void;
  onFinish: () => void;
  onBack: () => void;
}

export default function DurationSelectionScreen({
  timePeriod,
  activityTypeId,
  selectedActivities,
  totalXP,
  totalMinutes,
  onAddActivity,
  onAddMore,
  onFinish,
  onBack
}: DurationSelectionScreenProps) {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const activities = ACTIVITIES.filter(a => a.typeId === activityTypeId);
  const periodName = timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1);
  const activityType = ACTIVITY_TYPES.find(t => t.id === activityTypeId);

  const handleSelectActivity = (activityId: string) => {
    setSelectedActivity(activityId);
    setSelectedDuration(null);
    setShowCustomInput(false);
  };

  const handleSelectDuration = (minutes: number) => {
    setSelectedDuration(minutes);
    setShowCustomInput(false);
  };

  const handleAddActivity = () => {
    if (!selectedActivity || !selectedDuration) return;
    
    onAddActivity(selectedActivity, selectedDuration);
    
    setSelectedActivity(null);
    setSelectedDuration(null);
    setCustomDuration('');
    setShowCustomInput(false);
  };

  const handleCustomDurationSubmit = () => {
    const minutes = parseInt(customDuration);
    if (minutes > 0 && minutes <= 240) {
      setSelectedDuration(minutes);
      setShowCustomInput(false);
    }
  };

  const canAddActivity = selectedActivity && selectedDuration;
  const tip = ACTIVITY_TIPS[activityTypeId] || ACTIVITY_TIPS[timePeriod];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-white pb-64"
    >
      <header className="bg-gradient-to-b from-blue-500 to-blue-600 px-4 py-4 text-white sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">{activityType?.name}</h2>
          <div className="w-10" />
        </div>
      </header>

      <ActivityLogBreadcrumb 
        timePeriod={timePeriod} 
        currentActivityType={activityTypeId}
      />

      <div className="p-4 max-w-md mx-auto space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            1️⃣ What activity?
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {activities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => handleSelectActivity(activity.id)}
                className={`
                  min-w-[72px] min-h-[72px] aspect-square rounded-2xl p-3
                  transition-all duration-200
                  ${selectedActivity === activity.id
                    ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-500 scale-105 shadow-lg'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:scale-105'
                  }
                  active:scale-95
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-3xl mb-1">{activity.emoji}</span>
                  <span className={`text-xs font-medium text-center line-clamp-2 ${
                    selectedActivity === activity.id ? 'text-blue-800 font-bold' : 'text-gray-700'
                  }`}>
                    {activity.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              2️⃣ How long?
            </h3>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset.minutes}
                  onClick={() => handleSelectDuration(preset.minutes)}
                  className={`
                    py-3 px-2 rounded-xl min-h-[72px]
                    transition-all duration-200
                    ${selectedDuration === preset.minutes
                      ? 'bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-500 scale-105 shadow-lg'
                      : 'bg-white border-2 border-gray-200 hover:border-green-300'
                    }
                    active:scale-95
                  `}
                >
                  <div className="text-xl mb-1">{preset.emoji}</div>
                  <div className={`text-xs font-bold ${
                    selectedDuration === preset.minutes ? 'text-green-800' : 'text-gray-700'
                  }`}>
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>

            {!showCustomInput ? (
              <button
                onClick={() => setShowCustomInput(true)}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <Clock className="w-5 h-5" />
                <span>Custom time</span>
              </button>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter minutes (1-240)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="240"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="30"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-center text-lg font-bold"
                  />
                  <button
                    onClick={handleCustomDurationSubmit}
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 active:scale-95 transition-all min-h-[48px]"
                  >
                    ✓
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {selectedActivity && tip && (
          <div className="mt-6 text-center">
            <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl px-5 py-3 max-w-sm">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-lg">💡</span>
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold text-blue-900 mb-0.5">Did you know?</p>
                  <p className="text-sm text-gray-700 leading-snug">
                    {tip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {(selectedActivities.length > 0 || canAddActivity) && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-20 animate-slide-up-fade">
          <div className="max-w-md mx-auto space-y-3">
            {selectedActivities.length > 0 && (
              <ActivitySummaryCard 
                activities={selectedActivities}
                totalXP={totalXP}
                totalMinutes={totalMinutes}
                periodName={periodName}
              />
            )}

            <div className="space-y-2">
              {canAddActivity && (
                <button
                  onClick={handleAddActivity}
                  className="w-full py-3 px-4 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-xl hover:bg-blue-50 active:scale-95 transition-all flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add This Activity</span>
                </button>
              )}

              {selectedActivities.length > 0 && (
                <button
                  onClick={onAddMore}
                  className="w-full py-3 px-4 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-xl hover:bg-orange-50 active:scale-95 transition-all flex items-center justify-center space-x-2 min-h-[48px]"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Different Activity</span>
                </button>
              )}
              
              {selectedActivities.length > 0 && (
                <button
                  onClick={onFinish}
                  className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-2xl hover:from-green-600 hover:to-green-700 active:scale-95 transition-all flex items-center justify-center space-x-3 text-lg min-h-[56px]"
                >
                  <Check className="w-6 h-6" />
                  <span>Done with {periodName}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
