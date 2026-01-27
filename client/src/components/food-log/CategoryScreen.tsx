import { motion } from 'framer-motion';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import { FOOD_CATEGORIES } from '@/constants/food-data';
import FoodLogBreadcrumb from './FoodLogBreadcrumb';
import MealSummaryCard from './MealSummaryCard';
import { FoodItem } from '@/types/food-logging';

interface CategoryScreenProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  selectedItems: FoodItem[];
  totalXP: number;
  onSelectCategory: (categoryId: string) => void;
  onBack: () => void;
  onFinish: () => void;
  onTextInput: () => void;
}

export default function CategoryScreen({ 
  mealType, 
  selectedItems, 
  totalXP,
  onSelectCategory, 
  onBack,
  onFinish,
  onTextInput
}: CategoryScreenProps) {
  const mealName = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-white pb-32"
    >
      <header className="bg-gradient-to-b from-orange-500 to-orange-600 px-4 py-4 text-white sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">{mealName}</h2>
          <div className="w-10" />
        </div>
      </header>

      <FoodLogBreadcrumb mealType={mealType} />

      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-1">
            What did you have?
          </p>
          <p className="text-sm text-gray-500">
            Pick a category to get started
          </p>
        </div>

        {selectedItems.length > 0 && (
          <MealSummaryCard 
            items={selectedItems}
            totalXP={totalXP}
            mealName={mealName}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          {FOOD_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`
                flex flex-col items-center justify-center
                p-6 rounded-2xl
                bg-gradient-to-br ${category.color}
                border-2 ${category.borderColor}
                hover:scale-105 hover:shadow-lg
                active:scale-95
                transition-all duration-200
                min-h-[140px]
              `}
            >
              <span className="text-5xl mb-3">{category.emoji}</span>
              <span className="text-base font-bold text-gray-900 text-center">
                {category.name}
              </span>
              {category.description && (
                <span className="text-xs text-gray-600 mt-1">
                  {category.description}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-3">
            Can't find what you're looking for?
          </p>
          <button
            onClick={onTextInput}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center space-x-2 min-h-[56px]"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Type what you ate</span>
          </button>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-20">
          <div className="max-w-md mx-auto">
            <button
              onClick={onFinish}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-2xl hover:from-green-600 hover:to-green-700 active:scale-95 transition-all text-lg min-h-[56px]"
            >
              Done with {mealName}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
