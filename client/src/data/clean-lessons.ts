export type LessonState = 'current' | 'unlocked' | 'locked' | 'completed';

export interface CleanLesson {
  id: string;
  title: string;
  icon: string;
  state: LessonState;
}

export const cleanLessons: CleanLesson[] = [
  { id: 'snacks', title: 'Healthy\nSnacks', icon: '🍎', state: 'current' },
  { id: 'hydration', title: 'Hydration\nHeroes', icon: '💧', state: 'unlocked' },
  { id: 'move', title: 'Move &\nGroove', icon: '⚽', state: 'locked' },
  { id: 'focus', title: 'Focus\nBoosters', icon: '🧠', state: 'locked' },
  { id: 'veggies', title: 'Veggie\nVictory', icon: '🥦', state: 'locked' },
  { id: 'carbs', title: 'Smart\nCarbs', icon: '🍞', state: 'locked' },
  { id: 'protein', title: 'Protein\nPower', icon: '🍗', state: 'locked' },
  { id: 'colors', title: 'Colorful\nPlate', icon: '🌈', state: 'locked' }
];