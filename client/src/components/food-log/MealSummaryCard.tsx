import { FoodItem } from '@/types/food-logging';
import { Sparkles } from 'lucide-react';

interface MealSummaryCardProps {
  items: FoodItem[];
  totalXP: number;
  mealName: string;
}

export default function MealSummaryCard({ items, totalXP, mealName }: MealSummaryCardProps) {
  if (items.length === 0) return null;

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

      <div className="flex flex-wrap gap-2">
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

      <p className="text-xs text-gray-600 mt-3 text-center">
        {items.length} {items.length === 1 ? 'item' : 'items'} logged so far
      </p>
    </div>
  );
}
