import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { MEAL_TYPES, getRecommendedMealType } from '@/constants/food-data';

interface MealTypeScreenProps {
  onSelect: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
}

export default function MealTypeScreen({ onSelect }: MealTypeScreenProps) {
  const [, setLocation] = useLocation();
  const recommendedMeal = getRecommendedMealType();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-white"
    >
      <header className="bg-gradient-to-b from-orange-500 to-orange-600 px-4 py-6 text-white">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => setLocation('/dashboard')}
            className="mb-4 p-2 hover:bg-white/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <h1 className="text-3xl font-black mb-2">Log Your Meal</h1>
          <p className="text-orange-100 text-sm">What meal is this?</p>
        </div>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {MEAL_TYPES.map((meal) => {
            const isRecommended = meal.id === recommendedMeal;
            
            return (
              <button
                key={meal.id}
                onClick={() => onSelect(meal.id)}
                className={`
                  relative p-6 rounded-2xl border-2
                  bg-gradient-to-br ${meal.color}
                  ${meal.borderColor}
                  hover:scale-105 hover:shadow-xl
                  active:scale-95
                  transition-all duration-200
                  min-h-[180px]
                  flex flex-col items-center justify-center
                `}
              >
                {isRecommended && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    Right now!
                  </div>
                )}
                
                <span className="text-6xl mb-3">{meal.emoji}</span>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {meal.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3">
                  {meal.timeRange}
                </p>
                
                <p className="text-xs text-gray-500 text-center line-clamp-2">
                  e.g. {meal.typical.join(', ')}
                </p>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">Not sure which meal?</p>
          <button
            onClick={() => onSelect('snack')}
            className="text-orange-600 font-semibold text-sm hover:text-orange-700 underline"
          >
            Just log food without meal type
          </button>
        </div>
      </div>
    </motion.div>
  );
}
