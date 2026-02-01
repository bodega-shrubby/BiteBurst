import { motion } from 'framer-motion';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import { FOOD_CATEGORIES } from '@/constants/food-data';
import FoodLogBreadcrumb from './FoodLogBreadcrumb';
import MealSummaryCard from './MealSummaryCard';
import { FoodItem, MealLog } from '@/types/food-logging';

interface CategoryScreenProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  selectedItems: FoodItem[];
  totalXP: number;
  currentMealState: MealLog;
  streak?: number;
  onSelectCategory: (categoryId: string) => void;
  onBack: () => void;
  onFinish: () => void;
  onTextInput: () => void;
}

export default function CategoryScreen({ 
  mealType, 
  selectedItems, 
  totalXP,
  currentMealState,
  streak = 0,
  onSelectCategory, 
  onBack,
  onFinish,
  onTextInput
}: CategoryScreenProps) {
  const mealName = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  const getCategoryItemCount = (categoryId: string): number => {
    return currentMealState.categories[categoryId]?.length || 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[#F5F5F7] pb-32"
    >
      <header className="bg-gradient-to-r from-[#FF6B35] to-[#FF8F5C] px-6 py-6 text-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              onClick={onBack}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold mb-1">{mealName}</h1>
              <p className="text-white/90 text-sm">What did you have?</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#FF9500] to-[#FF6B00] px-4 py-2 rounded-full font-bold">
              <span>🔥</span>
              <span>{streak}</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-4 py-2 rounded-full font-bold">
              <span>⭐</span>
              <span>{totalXP}</span>
            </div>
          </div>
        </div>
      </header>

      <FoodLogBreadcrumb mealType={mealType} />

      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-center text-[#8E8E93] text-lg mb-7">Pick a category to get started</p>

        {selectedItems.length > 0 && (
          <MealSummaryCard 
            items={selectedItems}
            totalXP={totalXP}
            mealName={mealName}
          />
        )}

        <div className="grid grid-cols-3 gap-5 max-w-[640px] mx-auto">
          {FOOD_CATEGORIES.map((category) => {
            const itemCount = getCategoryItemCount(category.id);
            const hasItems = itemCount > 0;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="relative bg-white rounded-2xl p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-l-[5px] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] active:scale-[0.98]"
                style={{ borderLeftColor: category.accentColor }}
              >
                {hasItems && (
                  <div className="absolute -top-2 -right-2 z-10 bg-[#34C759] text-white rounded-full min-w-[28px] h-7 flex items-center justify-center text-sm font-extrabold border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                    {itemCount}
                  </div>
                )}

                <span className="text-5xl mb-2.5 block">{category.emoji}</span>
                <span className="text-base font-bold text-[#1C1C1E]">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 pt-7 border-t border-[#E5E5EA] max-w-[640px] mx-auto">
          <p className="text-sm text-[#8E8E93] text-center mb-3">
            Can't find what you're looking for?
          </p>
          <button
            onClick={onTextInput}
            className="w-full py-4 px-6 bg-white border-2 border-dashed border-[#C7C7CC] rounded-xl text-base font-semibold text-[#8E8E93] flex items-center justify-center gap-2.5 hover:bg-[#F5F5F7] transition-all"
          >
            <span className="text-xl">💬</span>
            <span>Type what you ate</span>
          </button>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-20">
          <div className="max-w-2xl mx-auto flex justify-end">
            <button
              onClick={onFinish}
              className="py-4 px-8 bg-[#34C759] hover:bg-[#2FB350] text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] text-lg"
            >
              Done with {mealName}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
