import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, Plus } from 'lucide-react';
import { FOOD_ITEMS, FOOD_CATEGORIES } from '@/constants/food-data';
import { FoodItem } from '@/types/food-logging';
import FoodLogBreadcrumb from './FoodLogBreadcrumb';

interface ItemSelectionScreenProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  categoryId: string;
  initialSelectedIds: string[];
  allSelectedItems: FoodItem[];
  onUpdate: (itemIds: string[]) => void;
  onAddMore: () => void;
  onFinish: () => void;
  onBack: () => void;
}

const MEAL_TIPS = {
  breakfast: [
    "Mix colorful foods for maximum nutrition!",
    "Protein + carbs = lasting energy all morning!",
    "Don't forget dairy for strong bones!",
    "Fruit is nature's candy - sweet and healthy!"
  ],
  lunch: [
    "Try to include a veggie in every lunch!",
    "Water is the best drink for growing kids!",
    "Eat a rainbow - different colors = different vitamins!",
    "Balance is key - a bit of everything!"
  ],
  dinner: [
    "Protein helps your muscles grow strong!",
    "Veggies are superfoods - they make you super!",
    "Grains give you energy for tomorrow!",
    "Eating together makes food taste better!"
  ],
  snack: [
    "Fresh fruit is the perfect snack!",
    "Nuts give you brain power!",
    "Yogurt is a great between-meal choice!",
    "Thirsty? Water is always the best!"
  ]
};

const CATEGORY_TIPS: Record<string, string> = {
  fruits: "Fruits are packed with vitamins to keep you healthy!",
  vegetables: "Veggies make you grow strong and fast!",
  dairy: "Dairy builds super strong bones!",
  bread: "Grains give you energy to play and learn!",
  protein: "Protein builds muscles - you'll be so strong!",
  drinks: "Water is the best drink for your body!",
  snacks: "Healthy snacks give you power between meals!"
};

function MotivationalTip({ mealType, categoryId }: { mealType: string; categoryId: string }) {
  const categoryTip = CATEGORY_TIPS[categoryId];
  const mealTips = MEAL_TIPS[mealType as keyof typeof MEAL_TIPS] || MEAL_TIPS.snack;
  const randomMealTip = useMemo(() => mealTips[Math.floor(Math.random() * mealTips.length)], [mealTips]);
  
  const tip = categoryTip || randomMealTip;

  return (
    <div className="mt-6 mb-4 text-center">
      <div className="inline-block bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl px-5 py-3 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-lg">💡</span>
            </div>
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-bold text-blue-900 mb-0.5">Quick Tip!</p>
            <p className="text-sm text-gray-700 leading-snug">
              {tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
};

export default function ItemSelectionScreen({
  mealType,
  categoryId,
  initialSelectedIds,
  allSelectedItems,
  onUpdate,
  onAddMore,
  onFinish,
  onBack
}: ItemSelectionScreenProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const category = FOOD_CATEGORIES.find(c => c.id === categoryId);
  const items = FOOD_ITEMS.filter(item => item.categoryId === categoryId);
  const mealName = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  const handleUpdate = useCallback((ids: string[]) => {
    onUpdate(ids);
  }, [onUpdate]);

  useEffect(() => {
    handleUpdate(selectedIds);
  }, [selectedIds, handleUpdate]);

  const toggleItem = (itemId: string) => {
    triggerHaptic();
    setSelectedIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const totalXP = allSelectedItems.reduce((sum, item) => sum + item.xpValue, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-white pb-48"
    >
      <header className="bg-gradient-to-b from-orange-500 to-orange-600 px-4 py-4 text-white sticky top-0 z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">{category?.name}</h2>
          <div className="w-10" />
        </div>
      </header>

      <FoodLogBreadcrumb mealType={mealType} currentCategory={categoryId} />

      <div className="p-4 max-w-md mx-auto">
        <p className="text-center text-gray-700 mb-4">
          Tap everything you ate!
        </p>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`
                  relative min-w-[72px] min-h-[72px] aspect-square rounded-2xl p-2
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-500 scale-105 shadow-lg'
                    : 'bg-white border-2 border-gray-200 hover:border-orange-300 hover:scale-105'
                  }
                  active:scale-95
                `}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 z-10 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-scale-bounce">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}
                
                <div className="flex flex-col items-center justify-center h-full">
                  <span className={`text-3xl mb-1 transition-transform duration-200 ${isSelected ? 'scale-110' : 'scale-100'}`}>
                    {item.emoji}
                  </span>
                  <span className={`text-[10px] font-medium text-center line-clamp-1 ${isSelected ? 'text-green-800 font-bold' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <MotivationalTip mealType={mealType} categoryId={categoryId} />

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No items in this category yet!</p>
            <button
              onClick={onBack}
              className="text-orange-600 font-semibold underline"
            >
              Try another category
            </button>
          </div>
        )}
      </div>

      {allSelectedItems.length > 0 && (
        <div 
          key={`floating-buttons-${allSelectedItems.length}`}
          className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-20 animate-slide-up-fade"
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-orange-800">
                  Your {mealName}
                </span>
                <span className="text-sm font-bold text-orange-600">
                  +{totalXP} XP
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {allSelectedItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center space-x-1 bg-white rounded-lg px-2 py-1.5 border border-orange-200"
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-xs text-gray-700 capitalize">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={onAddMore}
                className="w-full py-3 px-4 bg-white border-2 border-orange-500 text-orange-600 font-bold rounded-xl hover:bg-orange-50 active:scale-95 transition-all flex items-center justify-center space-x-2 min-h-[48px]"
              >
                <Plus className="w-5 h-5" />
                <span>Add from Another Category</span>
              </button>
              
              <button
                onClick={onFinish}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-2xl hover:from-green-600 hover:to-green-700 active:scale-95 transition-all flex items-center justify-center space-x-3 text-lg min-h-[56px]"
              >
                <Check className="w-6 h-6" />
                <span>Done with {mealName}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
