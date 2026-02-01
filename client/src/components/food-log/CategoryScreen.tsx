import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { FOOD_CATEGORIES } from '@/constants/food-data';
import FoodLogBreadcrumb from './FoodLogBreadcrumb';
import MealSummaryCard from './MealSummaryCard';
import { FoodItem, MealLog } from '@/types/food-logging';
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import FoodLogHeader from './FoodLogHeader';
import FoodLogRightColumn from './FoodLogRightColumn';

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
  const [, setLocation] = useLocation();
  const mealName = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  const getCategoryItemCount = (categoryId: string): number => {
    return currentMealState.categories[categoryId]?.length || 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex min-h-screen md:ml-[200px]">
        <div className="flex-1 flex justify-center">
          <div className="flex max-w-[1100px] w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 min-w-0 bg-white pb-32"
            >
              <header className="sticky top-0 z-30">
                <div
                  className="px-6 py-6"
                  style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      onClick={onBack}
                      className="text-white/80 hover:text-white text-sm flex items-center space-x-1"
                    >
                      <span>←</span>
                      <span>Back</span>
                    </button>
                  </div>
                  <h1 className="text-2xl font-bold text-white">{mealName}</h1>
                  <p className="text-orange-100 text-sm mt-1">What did you have?</p>
                </div>

                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🔥</span>
                      <div>
                        <div className="text-base font-bold text-gray-900">{streak}</div>
                        <div className="text-xs text-gray-500">Streak</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">⭐</span>
                      <div>
                        <div className="text-base font-bold text-gray-700">{totalXP} XP</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <FoodLogBreadcrumb mealType={mealType} />

              <div className="px-6 py-6 bg-gray-50">
                <p className="text-center text-gray-500 text-lg mb-7">Pick a category to get started</p>

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
                        className="relative bg-white rounded-2xl p-6 text-center shadow-sm border-l-[5px] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
                        style={{ borderLeftColor: category.accentColor }}
                      >
                        {hasItems && (
                          <div className="absolute -top-2 -right-2 z-10 bg-green-500 text-white rounded-full min-w-[28px] h-7 flex items-center justify-center text-sm font-extrabold border-[3px] border-white shadow-md">
                            {itemCount}
                          </div>
                        )}

                        <span className="text-5xl mb-2.5 block">{category.emoji}</span>
                        <span className="text-base font-bold text-gray-900">
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 pt-7 border-t border-gray-200 max-w-[640px] mx-auto">
                  <p className="text-sm text-gray-500 text-center mb-3">
                    Can't find what you're looking for?
                  </p>
                  <button
                    onClick={onTextInput}
                    className="w-full py-4 px-6 bg-white border-2 border-dashed border-gray-300 rounded-xl text-base font-semibold text-gray-500 flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-all"
                  >
                    <span className="text-xl">💬</span>
                    <span>Type what you ate</span>
                  </button>
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-20 md:left-[200px] lg:pr-[360px]">
                  <div className="max-w-2xl mx-auto flex justify-end">
                    <button
                      onClick={onFinish}
                      className="py-4 px-8 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] text-lg"
                    >
                      Done with {mealName}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <FoodLogRightColumn step="categories" itemCount={selectedItems.length} />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}
