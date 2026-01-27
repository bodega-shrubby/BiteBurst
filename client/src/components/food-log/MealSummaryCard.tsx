import { FoodItem } from '@/types/food-logging';
import { Sparkles, CheckCircle } from 'lucide-react';
import { FOOD_CATEGORIES } from '@/constants/food-data';

interface MealSummaryCardProps {
  items: FoodItem[];
  totalXP: number;
  mealName: string;
}

export default function MealSummaryCard({ items, totalXP, mealName }: MealSummaryCardProps) {
  if (items.length === 0) return null;

  const representedCategories = new Set(items.map(item => item.categoryId));
  const categoryInfo = Array.from(representedCategories).map(catId => {
    const category = FOOD_CATEGORIES.find(c => c.id === catId);
    return category;
  }).filter(Boolean);

  const isBalanced = representedCategories.size >= 3;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-4 border-2 border-orange-200 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-orange-600" />
          <h3 className="font-bold text-gray-900">Your {mealName}</h3>
        </div>
        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          +{totalXP} XP
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {items.map((item) => (
          <div 
            key={item.id}
            className="flex items-center space-x-1.5 bg-white rounded-lg px-3 py-2 border border-orange-200 shadow-sm"
          >
            <span className="text-xl">{item.emoji}</span>
            <span className="text-sm font-medium text-gray-700 capitalize">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      {categoryInfo.length > 0 && (
        <div className="pt-3 border-t border-orange-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-xs font-semibold text-gray-700">Balance:</span>
              <div className="flex items-center flex-wrap gap-1">
                {categoryInfo.map((cat, idx) => (
                  <div key={cat!.id} className="flex items-center">
                    <span className="text-sm">{cat!.emoji}</span>
                    <span className="text-xs text-gray-600 ml-0.5">{cat!.name}</span>
                    {idx < categoryInfo.length - 1 && (
                      <span className="text-gray-400 mx-1">•</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {isBalanced && (
              <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-bold text-green-700">Balanced!</span>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-600 mt-3 text-center">
        {items.length} {items.length === 1 ? 'item' : 'items'} logged so far
      </p>
    </div>
  );
}
