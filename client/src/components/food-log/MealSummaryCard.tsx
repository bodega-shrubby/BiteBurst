import { FoodItem } from '@/types/food-logging';
import { CheckCircle } from 'lucide-react';
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
    <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-l-[5px] border-l-[#FF9500] mb-7">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1C1C1E] text-lg flex items-center gap-2">
          <span>✨</span>
          <span>Your {mealName}</span>
        </h3>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="flex items-center gap-1.5 bg-[#F5F5F7] rounded-xl px-3.5 py-2.5 text-[15px] font-semibold text-[#1C1C1E]"
          >
            <span className="text-[22px]">{item.emoji}</span>
            <span className="capitalize">{item.name}</span>
          </div>
        ))}
      </div>

      {categoryInfo.length > 0 && (
        <div className="pt-4 border-t border-[#E5E5EA]">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5 text-sm text-[#8E8E93]">
              <span>Balance:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {categoryInfo.map((cat, idx) => (
                  <div key={cat!.id} className="flex items-center gap-0.5">
                    <span className="text-base">{cat!.emoji}</span>
                    {idx < categoryInfo.length - 1 && (
                      <span className="text-[#8E8E93] mx-1">+</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {isBalanced && (
              <div className="flex items-center gap-1.5 bg-[#34C759] text-white px-4 py-2 rounded-xl text-sm font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Balanced!</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
