import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import { useFoodLogging } from '@/hooks/useFoodLogging';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import MealTypeScreen from '@/components/food-log/MealTypeScreen';
import CategoryScreen from '@/components/food-log/CategoryScreen';
import ItemSelectionScreen from '@/components/food-log/ItemSelectionScreen';

const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
};

export default function FoodLogNew() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  
  const {
    state,
    startMeal,
    selectCategory,
    addItems,
    backToCategories,
    getAllSelectedItems,
    getTotalXP,
    reset
  } = useFoodLogging();

  useEffect(() => {
    if (showTextInput && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showTextInput]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const allItems = getAllSelectedItems();
      let content: any = {};
      let entryMethod = 'emoji';
      
      if (showTextInput && textInput.trim().length >= 2) {
        content = { text: textInput.trim() };
        entryMethod = 'text';
      } else if (allItems.length > 0) {
        content = { 
          emojis: allItems.map(item => item.emoji),
          mealType: state.currentMeal?.mealType,
          items: allItems.map(item => ({ id: item.id, name: item.name, emoji: item.emoji }))
        };
        entryMethod = 'emoji';
      } else {
        throw new Error('No items selected');
      }

      return await apiRequest('/api/logs', {
        method: 'POST',
        body: {
          userId: user.id,
          type: 'food',
          entryMethod,
          content,
          timestamp: new Date().toISOString()
        }
      });
    },
    onSuccess: (data) => {
      triggerHaptic();
      if (data && typeof data === 'object' && 'id' in data) {
        localStorage.setItem('lastLogData', JSON.stringify(data));
      }
      reset();
      const successUrl = `/success?logId=${data?.id || 'temp'}&xp=${(data as any)?.xpAwarded || getTotalXP()}`;
      setLocation(successUrl);
    },
    onError: (error: any) => {
      toast({
        title: "Oops!",
        description: error.message || "Something went wrong. Try again!",
        variant: "destructive",
      });
    },
  });

  const handleFinishLogging = () => {
    triggerHaptic();
    submitMutation.mutate();
  };

  const handleTextSubmit = () => {
    if (textInput.trim().length >= 2) {
      triggerHaptic();
      submitMutation.mutate();
    }
  };

  const handleBackFromText = () => {
    setShowTextInput(false);
    setTextInput('');
  };

  if (showTextInput) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="min-h-screen bg-white flex flex-col"
      >
        <header className="bg-gradient-to-b from-orange-500 to-orange-600 px-4 py-4 text-white sticky top-0 z-20">
          <div className="max-w-md mx-auto flex items-center">
            <button 
              onClick={handleBackFromText}
              className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold">Type What You Ate</h1>
            </div>
            <div className="w-10" />
          </div>
        </header>

        <div className="p-4 max-w-md mx-auto flex-1 pb-32">
          <p className="text-sm text-gray-600 mb-4 text-center font-medium">
            Tell me what you had!
          </p>
          
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value.slice(0, 160))}
              maxLength={160}
              placeholder="e.g., apple, yogurt, sandwich with cheese..."
              className="w-full p-4 border-2 border-gray-200 rounded-2xl text-base min-h-[120px] focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {textInput.length}/160
            </div>
          </div>

          {textInput.length > 0 && textInput.length < 2 && (
            <p className="text-red-500 text-sm mt-2 text-center">
              Please add at least 2 characters
            </p>
          )}

          <p className="text-xs text-gray-500 text-center mt-4">
            Tip: Keep it simple - just list what you ate!
          </p>
        </div>

        {textInput.trim().length >= 2 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-30 pb-6"
          >
            <div className="max-w-md mx-auto">
              <button
                onClick={handleTextSubmit}
                disabled={submitMutation.isPending}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-xl hover:from-green-600 hover:to-green-700 active:scale-95 transition-all flex items-center justify-center space-x-3 min-h-[56px] disabled:opacity-50"
              >
                <MessageSquare className="w-6 h-6" />
                <span>{submitMutation.isPending ? 'Logging...' : 'Log Meal'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {state.step === 'meal-type' && (
          <MealTypeScreen
            key="meal-type"
            onSelect={startMeal}
          />
        )}

        {state.step === 'categories' && state.currentMeal && (
          <CategoryScreen
            key="categories"
            mealType={state.currentMeal.mealType}
            selectedItems={getAllSelectedItems()}
            totalXP={getTotalXP()}
            onSelectCategory={selectCategory}
            onBack={() => {
              reset();
              setLocation('/dashboard');
            }}
            onFinish={handleFinishLogging}
            onTextInput={() => setShowTextInput(true)}
          />
        )}

        {state.step === 'items' && state.currentMeal && state.currentCategory && (
          <ItemSelectionScreen
            key={`items-${state.currentCategory}`}
            mealType={state.currentMeal.mealType}
            categoryId={state.currentCategory}
            initialSelectedIds={state.currentMeal.categories[state.currentCategory] || []}
            allSelectedItems={getAllSelectedItems()}
            onUpdate={(itemIds) => addItems(state.currentCategory!, itemIds)}
            onAddMore={backToCategories}
            onFinish={handleFinishLogging}
            onBack={backToCategories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
