import { useState, useCallback } from 'react';
import { ActivityLoggingState, SelectedActivity } from '@/types/activity-logging';
import { ACTIVITIES } from '@/constants/activity-data';

export const useActivityLogging = () => {
  const [state, setState] = useState<ActivityLoggingState>({
    currentLog: null,
    step: 'time-period',
    currentActivityType: null,
    selectedActivities: []
  });

  const startLog = useCallback((timePeriod: 'morning' | 'afternoon' | 'evening' | 'anytime') => {
    setState(prev => ({
      ...prev,
      currentLog: {
        timePeriod,
        activities: [],
        timestamp: new Date().toISOString(),
        totalXP: 0,
        totalMinutes: 0
      },
      step: 'activity-types',
      selectedActivities: []
    }));
  }, []);

  const selectActivityType = useCallback((typeId: string) => {
    setState(prev => ({
      ...prev,
      currentActivityType: typeId,
      step: 'duration'
    }));
  }, []);

  const addActivity = useCallback((activityId: string, durationMinutes: number) => {
    setState(prev => {
      if (!prev.currentLog) return prev;

      const activity = ACTIVITIES.find(a => a.id === activityId);
      if (!activity) return prev;

      const xpEarned = activity.xpPerMinute * durationMinutes;
      const newActivity: SelectedActivity = {
        activityId,
        activityName: activity.name,
        activityEmoji: activity.emoji,
        durationMinutes,
        xpEarned
      };

      const updatedActivities = [...prev.selectedActivities, newActivity];
      const totalMinutes = updatedActivities.reduce((sum, a) => sum + a.durationMinutes, 0);
      const totalXP = updatedActivities.reduce((sum, a) => {
        const act = ACTIVITIES.find(ac => ac.id === a.activityId);
        return sum + (act ? act.xpPerMinute * a.durationMinutes : 0);
      }, 0);

      return {
        ...prev,
        currentLog: {
          ...prev.currentLog,
          activities: updatedActivities.map(a => ({
            activityId: a.activityId,
            durationMinutes: a.durationMinutes
          })),
          totalXP,
          totalMinutes
        },
        selectedActivities: updatedActivities,
        step: 'activity-types',
        currentActivityType: null
      };
    });
  }, []);

  const backToActivityTypes = useCallback(() => {
    setState(prev => ({
      ...prev,
      step: 'activity-types',
      currentActivityType: null
    }));
  }, []);

  const getAllActivities = useCallback(() => {
    return state.selectedActivities;
  }, [state.selectedActivities]);

  const getTotalXP = useCallback((): number => {
    return state.currentLog?.totalXP || 0;
  }, [state.currentLog]);

  const getTotalMinutes = useCallback((): number => {
    return state.currentLog?.totalMinutes || 0;
  }, [state.currentLog]);

  const reset = useCallback(() => {
    setState({
      currentLog: null,
      step: 'time-period',
      currentActivityType: null,
      selectedActivities: []
    });
  }, []);

  return {
    state,
    startLog,
    selectActivityType,
    addActivity,
    backToActivityTypes,
    getAllActivities,
    getTotalXP,
    getTotalMinutes,
    reset
  };
};
