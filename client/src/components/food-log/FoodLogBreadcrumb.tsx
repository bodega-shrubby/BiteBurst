import { ChevronRight } from 'lucide-react';
import { MEAL_TYPES, FOOD_CATEGORIES } from '@/constants/food-data';

interface FoodLogBreadcrumbProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  currentCategory?: string;
}

export default function FoodLogBreadcrumb({ mealType, currentCategory }: FoodLogBreadcrumbProps) {
  const meal = MEAL_TYPES.find(m => m.id === mealType);
  const category = currentCategory 
    ? FOOD_CATEGORIES.find(c => c.id === currentCategory) 
    : null;

  return (
    <div className="bg-orange-50 px-4 py-3 border-b border-orange-200">
      <div className="max-w-md mx-auto flex items-center space-x-2 text-sm">
        <span className="text-2xl">{meal?.emoji}</span>
        <span className="font-bold text-orange-900">
          {meal?.name}
        </span>
        
        {category && (
          <>
            <ChevronRight className="w-4 h-4 text-orange-400" />
            <span className="text-lg">{category.emoji}</span>
            <span className="text-orange-600 font-medium">
              {category.name}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
