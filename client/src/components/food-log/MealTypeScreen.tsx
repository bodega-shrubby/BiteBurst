import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { MEAL_TYPES } from '@/constants/food-data';

interface MealTypeScreenProps {
  onSelect: (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
  streak?: number;
  totalXP?: number;
}

export default function MealTypeScreen({ onSelect, streak = 0, totalXP = 0 }: MealTypeScreenProps) {
  const [, setLocation] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[#F5F5F7]"
    >
      <header className="bg-gradient-to-r from-[#FF6B35] to-[#FF8F5C] px-6 py-6 text-white">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setLocation('/dashboard')}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold mb-1">Log Your Meal</h1>
              <p className="text-white/90 text-sm">What meal is this?</p>
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

      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-center text-[#8E8E93] text-lg mb-7">What meal are you logging?</p>
        
        <div className="grid grid-cols-2 gap-6 max-w-[560px] mx-auto">
          {MEAL_TYPES.map((meal) => (
              <button
                key={meal.id}
                onClick={() => onSelect(meal.id)}
                className="relative bg-white rounded-3xl p-8 text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)] border-l-[6px] aspect-square flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] active:scale-[0.98]"
                style={{ borderLeftColor: meal.accentColor }}
              >
                <span className="text-7xl mb-4">{meal.emoji}</span>
                
                <h3 className="text-2xl font-bold text-[#1C1C1E]">
                  {meal.name}
                </h3>
              </button>
            ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-[15px] text-[#8E8E93] mb-2">Not sure which meal?</p>
          <button
            onClick={() => onSelect('snack')}
            className="text-[#FF6B35] font-semibold text-base hover:underline"
          >
            Just log food without meal type
          </button>
        </div>
      </div>
    </motion.div>
  );
}
