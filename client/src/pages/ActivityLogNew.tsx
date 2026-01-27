import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import TimePeriodScreen from '@/components/activity-log/TimePeriodScreen';
import ActivityTypeScreen from '@/components/activity-log/ActivityTypeScreen';
import DurationSelectionScreen from '@/components/activity-log/DurationSelectionScreen';
import { apiRequest } from '@/lib/queryClient';

export default function ActivityLogNew() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    state,
    startLog,
    selectActivityType,
    addActivity,
    backToActivityTypes,
    getAllActivities,
    getTotalXP,
    getTotalMinutes,
    reset
  } = useActivityLogging();

  const handleFinishLogging = async () => {
    if (!state.currentLog || !user) return;

    try {
      const activities = getAllActivities();
      const activitySummary = activities.map(a => `${a.activityEmoji} ${a.activityName} (${a.durationMinutes}min)`).join(', ');
      const totalMinutes = getTotalMinutes();
      
      await apiRequest('/api/logs', {
        method: 'POST',
        body: {
          userId: user.id,
          type: 'activity',
          entryMethod: 'emoji',
          durationMin: totalMinutes,
          content: {
            timePeriod: state.currentLog.timePeriod,
            activities: state.currentLog.activities,
            totalMinutes: totalMinutes,
            summary: activitySummary
          }
        }
      });

      const xpToAdd = getTotalXP();
      if (xpToAdd > 0) {
        await apiRequest(`/api/user/${user.id}/xp`, {
          method: 'POST',
          body: {
            amount: xpToAdd,
            source: 'activity_log'
          }
        });
      }

      toast({
        title: "Activity logged!",
        description: `You earned +${xpToAdd} XP for ${totalMinutes} minutes of activity!`,
      });

      reset();
      setLocation('/dashboard');
    } catch (error) {
      console.error('Failed to submit activity log:', error);
      toast({
        title: "Oops!",
        description: "Couldn't save your activity. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {state.step === 'time-period' && (
          <TimePeriodScreen
            key="time-period"
            onSelect={startLog}
          />
        )}

        {state.step === 'activity-types' && state.currentLog && (
          <ActivityTypeScreen
            key="activity-types"
            timePeriod={state.currentLog.timePeriod}
            selectedActivities={getAllActivities()}
            totalXP={getTotalXP()}
            totalMinutes={getTotalMinutes()}
            onSelectType={selectActivityType}
            onBack={() => reset()}
            onFinish={handleFinishLogging}
          />
        )}

        {state.step === 'duration' && state.currentLog && state.currentActivityType && (
          <DurationSelectionScreen
            key={`duration-${state.currentActivityType}`}
            timePeriod={state.currentLog.timePeriod}
            activityTypeId={state.currentActivityType}
            selectedActivities={getAllActivities()}
            totalXP={getTotalXP()}
            totalMinutes={getTotalMinutes()}
            onAddActivity={addActivity}
            onAddMore={backToActivityTypes}
            onFinish={handleFinishLogging}
            onBack={backToActivityTypes}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
