import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft, MessageSquare, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import foodEmojis from '@/config/food-emojis.json';
import mascotImage from '@assets/9ef8e8fe-158e-4518-bd1c-1325863aebca_1756365757940.png';

type Step = 'category' | 'items' | 'text';

interface FoodItem {
  emoji: string;
  name: string;
  healthy: boolean;
}

const triggerHaptic = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(10);
  }
};

const CATEGORY_ORDER = [
  { id: 'Fruits', name: 'Fruits', emoji: '🍎', color: 'from-red-100 to-red-200', border: 'border-red-300' },
  { id: 'Snacks', name: 'Snacks', emoji: '🍪', color: 'from-yellow-100 to-yellow-200', border: 'border-yellow-300' },
  { id: 'Vegetables', name: 'Veggies', emoji: '🥦', color: 'from-green-100 to-green-200', border: 'border-green-300' },
  { id: 'Drinks', name: 'Drinks', emoji: '💧', color: 'from-blue-100 to-blue-200', border: 'border-blue-300' },
  { id: 'Bread', name: 'Bread & Grains', emoji: '🍞', color: 'from-amber-100 to-amber-200', border: 'border-amber-300' },
  { id: 'Dairy', name: 'Dairy', emoji: '🥛', color: 'from-purple-100 to-purple-200', border: 'border-purple-300' },
  { id: 'Protein', name: 'Protein', emoji: '🍗', color: 'from-orange-100 to-orange-200', border: 'border-orange-300' },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0
  })
};

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-100 h-32">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-3" />
          <div className="w-20 h-4 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

function ItemSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3 p-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="aspect-square rounded-2xl bg-gray-100 p-3">
          <div className="w-full aspect-square bg-gray-200 rounded-xl mb-2" />
          <div className="w-12 h-3 bg-gray-200 rounded mx-auto" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ categoryName, onBack }: { categoryName: string; onBack: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <img 
        src={mascotImage}
        alt="Sunny Slice"
        className="w-32 h-32 mb-6 animate-bounce-slow"
      />
      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
        Hmm, this category is empty!
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-xs">
        Try another category or use text input to log what you ate! 🍎
      </p>
      <button
        onClick={onBack}
        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all min-h-[48px]"
      >
        ← Try Another Category
      </button>
    </div>
  );
}

interface FoodItemButtonProps {
  item: FoodItem;
  isSelected: boolean;
  onToggle: () => void;
}

function FoodItemButton({ item, isSelected, onToggle }: FoodItemButtonProps) {
  const handleClick = () => {
    triggerHaptic();
    onToggle();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative flex flex-col items-center justify-center
        min-w-[72px] min-h-[72px] aspect-square rounded-2xl p-2
        transition-all duration-200
        ${isSelected
          ? 'bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-500 scale-105 shadow-lg'
          : 'bg-white border-2 border-gray-200 hover:border-orange-300 hover:scale-105'
        }
        active:scale-95
      `}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-scale-in">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}
      <span className={`text-3xl mb-1 transition-transform duration-200 ${isSelected ? 'scale-110' : 'scale-100'}`}>
        {item.emoji}
      </span>
      <span className={`text-[10px] font-medium text-center line-clamp-1 ${isSelected ? 'text-green-800 font-bold' : 'text-gray-600'}`}>
        {item.name}
      </span>
    </button>
  );
}

export default function FoodLogNew() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [step, setStep] = useState<Step>('category');
  const [direction, setDirection] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (step === 'text' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [step]);

  const currentItems = useMemo(() => {
    if (!selectedCategory) return [];
    const category = foodEmojis.categories.find(cat => cat.name === selectedCategory);
    return category?.emojis || [];
  }, [selectedCategory]);

  const hasValidContent = () => {
    if (step === 'items') return selectedEmojis.length > 0;
    if (step === 'text') return textInput.trim().length >= 2;
    return false;
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let content: any = {};
      let entryMethod = 'emoji';
      
      if (step === 'items') {
        content = { emojis: selectedEmojis };
        entryMethod = 'emoji';
      } else if (step === 'text') {
        content = { text: textInput.trim() };
        entryMethod = 'text';
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
      const successUrl = `/success?logId=${data?.id || 'temp'}&xp=${(data as any)?.xpAwarded || 0}`;
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

  const goToItems = (categoryId: string) => {
    triggerHaptic();
    setIsLoading(true);
    setDirection(1);
    setSelectedCategory(categoryId);
    setTimeout(() => {
      setStep('items');
      setIsLoading(false);
    }, 150);
  };

  const goToText = () => {
    triggerHaptic();
    setDirection(1);
    setStep('text');
  };

  const goBack = () => {
    triggerHaptic();
    setDirection(-1);
    if (step === 'items') {
      setStep('category');
      setSelectedEmojis([]);
    } else if (step === 'text') {
      setStep('category');
      setTextInput('');
    } else {
      setLocation('/dashboard');
    }
  };

  const toggleEmoji = (emoji: string) => {
    triggerHaptic();
    setSelectedEmojis(prev =>
      prev.includes(emoji)
        ? prev.filter(e => e !== emoji)
        : [...prev, emoji]
    );
  };

  const handleTextChange = (value: string) => {
    setTextInput(value.slice(0, 160));
  };

  const handleSubmit = () => {
    if (hasValidContent()) {
      triggerHaptic();
      submitMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-gradient-to-b from-orange-500 to-orange-600 px-4 py-4 text-white sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center">
          <button 
            onClick={goBack}
            className="p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold">
              {step === 'category' && 'Log Your Meal 🍽️'}
              {step === 'items' && selectedCategory}
              {step === 'text' && 'Type What You Ate'}
            </h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {step === 'category' && (
            <motion.div
              key="category"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <div className="p-4 max-w-md mx-auto pb-32">
                <p className="text-sm text-gray-600 mb-4 text-center font-medium">
                  🎯 Pick a category to get started!
                </p>
                
                {isLoading ? (
                  <CategorySkeleton />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {CATEGORY_ORDER.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => goToItems(category.id)}
                        className={`
                          flex flex-col items-center justify-center
                          p-5 rounded-2xl min-h-[120px]
                          bg-gradient-to-br ${category.color}
                          border-2 ${category.border}
                          hover:scale-105 hover:shadow-lg
                          active:scale-95
                          transition-all duration-200
                        `}
                      >
                        <span className="text-5xl mb-2">{category.emoji}</span>
                        <span className="text-sm font-bold text-gray-800 text-center">
                          {category.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center mb-3">
                    Can't find what you're looking for?
                  </p>
                  <button
                    onClick={goToText}
                    className="w-full py-4 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center space-x-2 min-h-[56px]"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Type what you ate</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'items' && (
            <motion.div
              key="items"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <div className="p-4 max-w-md mx-auto pb-48">
                {isLoading ? (
                  <ItemSkeleton />
                ) : currentItems.length === 0 ? (
                  <EmptyState categoryName={selectedCategory || ''} onBack={goBack} />
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4 text-center font-medium">
                      ✨ Tap everything you ate!
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {currentItems.map((item, index) => (
                        <FoodItemButton
                          key={index}
                          item={item}
                          isSelected={selectedEmojis.includes(item.emoji)}
                          onToggle={() => toggleEmoji(item.emoji)}
                        />
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button
                        onClick={goBack}
                        className="w-full py-3 px-4 text-orange-600 font-medium rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center space-x-2"
                      >
                        <span>← Pick different category</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {step === 'text' && (
            <motion.div
              key="text"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <div className="p-4 max-w-md mx-auto pb-48">
                <p className="text-sm text-gray-600 mb-4 text-center font-medium">
                  📝 Tell me what you had!
                </p>
                
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={textInput}
                    onChange={(e) => handleTextChange(e.target.value)}
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
                  💡 Tip: Keep it simple - just list what you ate!
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {hasValidContent() && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent z-30 pb-6"
          >
            <div className="max-w-md mx-auto space-y-3">
              {step === 'items' && selectedEmojis.length > 0 && (
                <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-orange-800">
                      {selectedEmojis.length} selected
                    </span>
                    <span className="text-xs text-orange-600 font-medium">
                      +{Math.min(selectedEmojis.length * 5, 25)} XP
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedEmojis.slice(0, 8).map((emoji, idx) => (
                      <span key={idx} className="text-2xl">{emoji}</span>
                    ))}
                    {selectedEmojis.length > 8 && (
                      <span className="text-sm text-orange-600 flex items-center ml-1">
                        +{selectedEmojis.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl shadow-xl hover:from-green-600 hover:to-green-700 active:scale-95 transition-all flex items-center justify-center space-x-3 min-h-[56px] disabled:opacity-50"
              >
                <Check className="w-6 h-6" />
                <span>
                  {submitMutation.isPending 
                    ? 'Logging...' 
                    : step === 'items' 
                      ? `Log ${selectedEmojis.length} Item${selectedEmojis.length > 1 ? 's' : ''}`
                      : 'Log Meal'
                  }
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {step === 'items' && selectedEmojis.length > 0 && 
          `Selected ${selectedEmojis.length} food${selectedEmojis.length > 1 ? 's' : ''}`
        }
        {step === 'text' && textInput.length >= 2 && 
          'Text input ready to submit'
        }
      </div>
    </div>
  );
}
