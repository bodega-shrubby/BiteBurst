import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { MEAL_TYPES } from '@/constants/food-data';
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import FoodLogHeader from './FoodLogHeader';
import FoodLogRightColumn from './FoodLogRightColumn';

interface MealTypeScreenProps {
  onSelect: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
  streak?: number;
  totalXP?: number;
}

export default function MealTypeScreen({ onSelect, streak = 0, totalXP = 0 }: MealTypeScreenProps) {
  const [, setLocation] = useLocation();

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
              className="flex-1 min-w-0 bg-white"
            >
              <FoodLogHeader 
                streak={streak} 
                totalXp={totalXP}
                subtitle="What meal is this?"
              />

              <div className="px-6 py-6 bg-gray-50">
                <p className="text-center text-gray-500 text-lg mb-7">What meal are you logging?</p>
                
                <div className="grid grid-cols-2 gap-6 max-w-[560px] mx-auto">
                  {MEAL_TYPES.map((meal) => (
                    <button
                      key={meal.id}
                      onClick={() => onSelect(meal.id)}
                      className="relative bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-200 aspect-square flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg active:scale-[0.98]"
                    >
                      <span className="text-7xl mb-4">{meal.emoji}</span>
                      <h3 className="text-2xl font-bold text-gray-900">{meal.name}</h3>
                    </button>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <p className="text-sm text-gray-500 mb-2">Not sure which meal?</p>
                  <button
                    onClick={() => onSelect('snack')}
                    className="text-orange-500 font-semibold text-base hover:underline"
                  >
                    Just log food without meal type
                  </button>
                </div>
              </div>
            </motion.div>

            <FoodLogRightColumn step="meal-type" />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}
