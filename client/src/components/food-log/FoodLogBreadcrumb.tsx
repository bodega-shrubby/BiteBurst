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
    <div className="bg-white px-6 py-4 border-b border-[#E5E5EA]">
      <div className="max-w-2xl mx-auto flex items-center gap-2.5 text-[15px]">
        <span className="text-[#FF6B35] font-semibold">Log Food</span>
        
        <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
        
        <span className="text-[#FF6B35] font-semibold flex items-center gap-1">
          <span>{meal?.emoji}</span>
          {meal?.name}
        </span>
        
        {category && (
          <>
            <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
            <span className="text-[#1C1C1E] font-bold flex items-center gap-1">
              <span>{category.emoji}</span>
              {category.name}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
