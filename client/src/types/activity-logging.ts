export interface Activity {
  id: string;
  name: string;
  emoji: string;
  typeId: string;
  xpPerMinute: number;
  description?: string;
}

export interface ActivityType {
  id: string;
  name: string;
  emoji: string;
  color: string;
  borderColor: string;
  description: string;
  examples: string[];
}

export interface TimePeriod {
  id: 'morning' | 'afternoon' | 'evening' | 'anytime';
  name: string;
  emoji: string;
  timeRange: string;
  color: string;
  borderColor: string;
  motivation: string;
}

export interface SelectedActivity {
  activityId: string;
  activityName: string;
  activityEmoji: string;
  durationMinutes: number;
}

export interface ActivityLog {
  timePeriod: 'morning' | 'afternoon' | 'evening' | 'anytime';
  activities: {
    activityId: string;
    durationMinutes: number;
  }[];
  timestamp: string;
  totalXP: number;
  totalMinutes: number;
}

export interface ActivityLoggingState {
  currentLog: ActivityLog | null;
  step: 'time-period' | 'activity-types' | 'duration';
  currentActivityType: string | null;
  selectedActivities: SelectedActivity[];
}
