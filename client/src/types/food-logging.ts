export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  categoryId: string;
  xpValue: number;
}

export interface FoodCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  borderColor: string;
  accentColor?: string;
  description?: string;
}

export interface MealType {
  id: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  emoji: string;
  timeRange: string;
  color: string;
  borderColor: string;
  accentColor?: string;
  typical: string[];
}

export interface MealLog {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  categories: {
    [categoryId: string]: string[];
  };
  timestamp: string;
  totalXP: number;
}

export interface FoodLoggingState {
  currentMeal: MealLog | null;
  step: 'meal-type' | 'categories' | 'items';
  currentCategory: string | null;
  allItems: FoodItem[];
}
