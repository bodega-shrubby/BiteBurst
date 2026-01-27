import { TimePeriod, ActivityType, Activity } from '@/types/activity-logging';

export const TIME_PERIODS: TimePeriod[] = [
  {
    id: 'morning',
    name: 'Morning',
    emoji: '🌅',
    timeRange: '6am-12pm',
    color: 'from-yellow-100 to-orange-100',
    borderColor: 'border-yellow-400',
    motivation: 'Start your day with energy!'
  },
  {
    id: 'afternoon',
    name: 'Afternoon',
    emoji: '☀️',
    timeRange: '12pm-6pm',
    color: 'from-orange-100 to-red-100',
    borderColor: 'border-orange-400',
    motivation: 'Perfect time to move and play!'
  },
  {
    id: 'evening',
    name: 'Evening',
    emoji: '🌙',
    timeRange: '6pm-10pm',
    color: 'from-purple-100 to-indigo-100',
    borderColor: 'border-purple-400',
    motivation: 'Wind down with gentle movement!'
  },
  {
    id: 'anytime',
    name: 'Anytime',
    emoji: '⚡',
    timeRange: 'Any time',
    color: 'from-blue-100 to-cyan-100',
    borderColor: 'border-blue-400',
    motivation: 'Every moment counts!'
  }
];

export const ACTIVITY_TYPES: ActivityType[] = [
  {
    id: 'sports',
    name: 'Sports',
    emoji: '⚽',
    color: 'from-green-100 to-green-200',
    borderColor: 'border-green-300',
    description: 'Team & ball games',
    examples: ['Soccer', 'Basketball', 'Tennis']
  },
  {
    id: 'exercise',
    name: 'Exercise',
    emoji: '🏃',
    color: 'from-blue-100 to-blue-200',
    borderColor: 'border-blue-300',
    description: 'Cardio & fitness',
    examples: ['Running', 'Jumping', 'Dancing']
  },
  {
    id: 'play',
    name: 'Active Play',
    emoji: '🎮',
    color: 'from-purple-100 to-purple-200',
    borderColor: 'border-purple-300',
    description: 'Fun & games',
    examples: ['Tag', 'Hide & Seek', 'Playground']
  },
  {
    id: 'strength',
    name: 'Strength',
    emoji: '💪',
    color: 'from-red-100 to-red-200',
    borderColor: 'border-red-300',
    description: 'Build muscles',
    examples: ['Climbing', 'Push-ups', 'Pull-ups']
  },
  {
    id: 'flexibility',
    name: 'Flexibility',
    emoji: '🧘',
    color: 'from-pink-100 to-pink-200',
    borderColor: 'border-pink-300',
    description: 'Stretch & balance',
    examples: ['Yoga', 'Stretching', 'Dance']
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    emoji: '🌳',
    color: 'from-teal-100 to-teal-200',
    borderColor: 'border-teal-300',
    description: 'Nature activities',
    examples: ['Hiking', 'Biking', 'Swimming']
  }
];

export const ACTIVITIES: Activity[] = [
  { id: 'soccer', name: 'Soccer', emoji: '⚽', typeId: 'sports', xpPerMinute: 2 },
  { id: 'basketball', name: 'Basketball', emoji: '🏀', typeId: 'sports', xpPerMinute: 2 },
  { id: 'tennis', name: 'Tennis', emoji: '🎾', typeId: 'sports', xpPerMinute: 2 },
  { id: 'volleyball', name: 'Volleyball', emoji: '🏐', typeId: 'sports', xpPerMinute: 2 },
  { id: 'baseball', name: 'Baseball', emoji: '⚾', typeId: 'sports', xpPerMinute: 2 },
  { id: 'running', name: 'Running', emoji: '🏃', typeId: 'exercise', xpPerMinute: 3 },
  { id: 'jumping', name: 'Jumping Jacks', emoji: '🤸', typeId: 'exercise', xpPerMinute: 2 },
  { id: 'dancing', name: 'Dancing', emoji: '💃', typeId: 'exercise', xpPerMinute: 2 },
  { id: 'skipping', name: 'Jump Rope', emoji: '🪢', typeId: 'exercise', xpPerMinute: 3 },
  { id: 'tag', name: 'Tag', emoji: '🏃‍♂️', typeId: 'play', xpPerMinute: 2 },
  { id: 'playground', name: 'Playground', emoji: '🛝', typeId: 'play', xpPerMinute: 2 },
  { id: 'hide-seek', name: 'Hide & Seek', emoji: '🙈', typeId: 'play', xpPerMinute: 2 },
  { id: 'trampoline', name: 'Trampoline', emoji: '🤾', typeId: 'play', xpPerMinute: 2 },
  { id: 'climbing', name: 'Climbing', emoji: '🧗', typeId: 'strength', xpPerMinute: 3 },
  { id: 'pushups', name: 'Push-ups', emoji: '💪', typeId: 'strength', xpPerMinute: 3 },
  { id: 'pullups', name: 'Pull-ups', emoji: '🏋️', typeId: 'strength', xpPerMinute: 3 },
  { id: 'yoga', name: 'Yoga', emoji: '🧘', typeId: 'flexibility', xpPerMinute: 2 },
  { id: 'stretching', name: 'Stretching', emoji: '🤸‍♀️', typeId: 'flexibility', xpPerMinute: 2 },
  { id: 'hiking', name: 'Hiking', emoji: '🥾', typeId: 'outdoor', xpPerMinute: 3 },
  { id: 'biking', name: 'Biking', emoji: '🚴', typeId: 'outdoor', xpPerMinute: 3 },
  { id: 'swimming', name: 'Swimming', emoji: '🏊', typeId: 'outdoor', xpPerMinute: 3 },
  { id: 'walking', name: 'Walking', emoji: '🚶', typeId: 'outdoor', xpPerMinute: 1 },
];

export const DURATION_PRESETS = [
  { minutes: 5, label: '5 min', emoji: '⚡' },
  { minutes: 10, label: '10 min', emoji: '💪' },
  { minutes: 15, label: '15 min', emoji: '🔥' },
  { minutes: 20, label: '20 min', emoji: '⭐' },
  { minutes: 30, label: '30 min', emoji: '🏆' },
  { minutes: 45, label: '45 min', emoji: '💎' },
  { minutes: 60, label: '1 hour', emoji: '👑' },
];

export const getRecommendedTimePeriod = (): 'morning' | 'afternoon' | 'evening' | 'anytime' => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'anytime';
};

export const ACTIVITY_TIPS: Record<string, string> = {
  morning: "Morning movement wakes up your brain!",
  afternoon: "Perfect time for high-energy activities!",
  evening: "Gentle movement helps you sleep better!",
  sports: "Team sports teach cooperation and build friendships!",
  exercise: "Cardio makes your heart super strong!",
  play: "Active play is the best kind of fun!",
  strength: "Strong muscles help you in everything you do!",
  flexibility: "Stretching prevents injuries and feels great!",
  outdoor: "Nature activities are good for body AND mind!"
};
