import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, Plus, Search } from 'lucide-react';
import { FOOD_ITEMS, FOOD_CATEGORIES } from '@/constants/food-data';
import { FoodItem } from '@/types/food-logging';
import FoodLogBreadcrumb from './FoodLogBreadcrumb';
import AppleBuddyMascot from '@/components/AppleBuddyMascot';

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
  const selectedCount = allSelectedItems.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[#F5F5F7] pb-48"
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
              <h1 className="text-2xl font-extrabold mb-1">{category?.name}</h1>
              <p className="text-white/90 text-sm">Tap everything you ate!</p>
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

      <FoodLogBreadcrumb mealType={mealType} currentCategory={categoryId} />

      <div className="p-6 max-w-3xl mx-auto">
        <div className="max-w-[480px] mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8E93]" />
            <input
              type="text"
              placeholder={`Search ${category?.name?.toLowerCase() || 'items'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-base placeholder:text-[#C7C7CC] focus:outline-none focus:ring-2 focus:ring-[#FF6B35] transition-all"
            />
          </div>
        </div>

        <p className="text-center text-[#8E8E93] text-sm mb-4">
          Tap to select <span className="mx-1">•</span> 
          <span className="font-bold text-[#34C759]">{selectedCount} items</span> selected
        </p>

        <div className="grid grid-cols-6 gap-4 max-w-[720px] mx-auto mb-6">
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
                    ? 'bg-[#E8FAE8] shadow-[0_0_0_3px_#34C759]'
                    : 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:scale-105'
                  }
                  active:scale-95
                `}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 z-10 bg-[#34C759] rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-[pop_0.2s_ease-out]">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}
                
                <div className="flex flex-col items-center justify-center h-full">
                  <span className={`text-4xl mb-1.5 transition-transform duration-200 ${isSelected ? 'scale-110' : 'scale-100'}`}>
                    {item.emoji}
                  </span>
                  <span className={`text-xs font-medium text-center line-clamp-1 ${isSelected ? 'text-[#1C7B3A] font-bold' : 'text-[#1C1C1E]'}`}>
                    {item.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#8E8E93] mb-4">No items found!</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#FF6B35] font-semibold underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {allSelectedItems.length > 0 && (
        <div 
          key={`floating-buttons-${allSelectedItems.length}`}
          className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-20"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1 bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-l-4 border-l-[#FF9500]">
              <div className="flex flex-wrap gap-2">
                {allSelectedItems.slice(0, 6).map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center gap-1 bg-[#F5F5F7] rounded-lg px-2 py-1.5"
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-xs text-[#1C1C1E] capitalize">{item.name}</span>
                  </div>
                ))}
                {allSelectedItems.length > 6 && (
                  <div className="flex items-center px-2 py-1.5 text-xs text-[#8E8E93] font-medium">
                    +{allSelectedItems.length - 6} more
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onAddMore}
                className="py-3 px-6 bg-white border-2 border-[#FF6B35] text-[#FF6B35] font-bold rounded-xl hover:bg-[#FFF5F2] active:scale-95 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add More</span>
              </button>
              
              <button
                onClick={onFinish}
                className="py-3 px-6 bg-[#34C759] hover:bg-[#2FB350] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
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
  );
}
