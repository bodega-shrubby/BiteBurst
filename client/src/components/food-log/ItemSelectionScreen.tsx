import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Search } from 'lucide-react';
import { FOOD_ITEMS, FOOD_CATEGORIES } from '@/constants/food-data';
import { FoodItem } from '@/types/food-logging';
import FoodLogBreadcrumb from './FoodLogBreadcrumb';
import AppleBuddyMascot from '@/components/AppleBuddyMascot';
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import FoodLogRightColumn from './FoodLogRightColumn';

interface ItemSelectionScreenProps {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  categoryId: string;
  initialSelectedIds: string[];
  allSelectedItems: FoodItem[];
  streak?: number;
  onUpdate: (itemIds: string[]) => void;
  onAddMore: () => void;
  onFinish: () => void;
  onBack: () => void;
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
  streak = 0,
  onUpdate,
  onAddMore,
  onFinish,
  onBack
}: ItemSelectionScreenProps) {
  const [, setLocation] = useLocation();
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [searchQuery, setSearchQuery] = useState('');
  const category = FOOD_CATEGORIES.find(c => c.id === categoryId);
  const allItems = FOOD_ITEMS.filter(item => item.categoryId === categoryId);
  const mealName = mealType.charAt(0).toUpperCase() + mealType.slice(1);

  const items = searchQuery
    ? allItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allItems;

  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    onUpdateRef.current(selectedIds);
  }, [selectedIds]);

  const toggleItem = (itemId: string) => {
    triggerHaptic();
    setSelectedIds(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const totalXP = allSelectedItems.reduce((sum, item) => sum + item.xpValue, 0);
  const selectedCount = allSelectedItems.length;

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
              className="flex-1 min-w-0 bg-white pb-48"
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
                  <h1 className="text-2xl font-bold text-white">{category?.name}</h1>
                  <p className="text-orange-100 text-sm mt-1">Tap everything you ate!</p>
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

              <FoodLogBreadcrumb mealType={mealType} currentCategory={categoryId} />

              <div className="px-6 py-6 bg-gray-50">
                <div className="max-w-[480px] mx-auto mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder={`Search ${category?.name?.toLowerCase() || 'items'}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white rounded-xl shadow-sm text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                    />
                  </div>
                </div>

                <p className="text-center text-gray-500 text-sm mb-4">
                  Tap to select <span className="mx-1">•</span> 
                  <span className="font-bold text-green-500">{selectedCount} items</span> selected
                </p>

                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 max-w-[720px] mx-auto mb-6">
                  {items.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        className={`
                          relative aspect-square rounded-2xl p-3
                          transition-all duration-200
                          ${isSelected
                            ? 'bg-green-50 shadow-[0_0_0_3px_#22c55e]'
                            : 'bg-white shadow-sm hover:shadow-lg hover:scale-105'
                          }
                          active:scale-95
                        `}
                      >
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 z-10 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-[pop_0.2s_ease-out]">
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          </div>
                        )}
                        
                        <div className="flex flex-col items-center justify-center h-full">
                          <span className={`text-4xl mb-1.5 transition-transform duration-200 ${isSelected ? 'scale-110' : 'scale-100'}`}>
                            {item.emoji}
                          </span>
                          <span className={`text-xs font-medium text-center line-clamp-1 ${isSelected ? 'text-green-700 font-bold' : 'text-gray-900'}`}>
                            {item.name}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {items.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No items found!</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-orange-500 font-semibold underline"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </div>

              {allSelectedItems.length > 0 && (
                <div 
                  key={`floating-buttons-${allSelectedItems.length}`}
                  className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-20 md:left-[200px] lg:pr-[360px]"
                >
                  <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex-1 bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-orange-400">
                      <div className="flex flex-wrap gap-2">
                        {allSelectedItems.slice(0, 6).map((item) => (
                          <div 
                            key={item.id}
                            className="flex items-center gap-1 bg-gray-100 rounded-lg px-2 py-1.5"
                          >
                            <span className="text-lg">{item.emoji}</span>
                            <span className="text-xs text-gray-900 capitalize">{item.name}</span>
                          </div>
                        ))}
                        {allSelectedItems.length > 6 && (
                          <div className="flex items-center px-2 py-1.5 text-xs text-gray-500 font-medium">
                            +{allSelectedItems.length - 6} more
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={onAddMore}
                        className="py-3 px-6 bg-white border-2 border-orange-500 text-orange-500 font-bold rounded-xl hover:bg-orange-50 active:scale-95 transition-all flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add More</span>
                      </button>
                      
                      <button
                        onClick={onFinish}
                        className="py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        <span>Done with {mealName}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <AppleBuddyMascot categoryId={categoryId} />
            </motion.div>

            <FoodLogRightColumn step="items" itemCount={allSelectedItems.length} />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}
