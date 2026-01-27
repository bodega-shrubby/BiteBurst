import { useState, useCallback } from 'react';
import { FoodLoggingState, FoodItem } from '@/types/food-logging';
import { FOOD_ITEMS } from '@/constants/food-data';

export const useFoodLogging = () => {
  const [state, setState] = useState<FoodLoggingState>({
    currentMeal: null,
    step: 'meal-type',
    currentCategory: null,
    allItems: []
  });

  const startMeal = useCallback((mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setState(prev => ({
      ...prev,
      currentMeal: {
        mealType,
        categories: {},
        timestamp: new Date().toISOString(),
        totalXP: 0
      },
      step: 'categories',
      allItems: []
    }));
  }, []);

  const selectCategory = useCallback((categoryId: string) => {
    setState(prev => ({
      ...prev,
      currentCategory: categoryId,
      step: 'items'
    }));
  }, []);

  const addItems = useCallback((categoryId: string, itemIds: string[]) => {
    setState(prev => {
      if (!prev.currentMeal) return prev;

      const newCategories = {
        ...prev.currentMeal.categories,
        [categoryId]: itemIds
      };

      const allSelectedItemIds = Object.values(newCategories).flat();
      const allSelectedItems = FOOD_ITEMS.filter(item => 
        allSelectedItemIds.includes(item.id)
      );

      const totalXP = allSelectedItems.reduce((sum, item) => sum + item.xpValue, 0);

      return {
        ...prev,
        currentMeal: {
          ...prev.currentMeal,
          categories: newCategories,
          totalXP
        },
        allItems: allSelectedItems
      };
    });
  }, []);

  const backToCategories = useCallback(() => {
    setState(prev => ({
      ...prev,
      step: 'categories',
      currentCategory: null
    }));
  }, []);

  const getAllSelectedItems = useCallback((): FoodItem[] => {
    return state.allItems;
  }, [state.allItems]);

  const getTotalXP = useCallback((): number => {
    return state.currentMeal?.totalXP || 0;
  }, [state.currentMeal]);

  const reset = useCallback(() => {
    setState({
      currentMeal: null,
      step: 'meal-type',
      currentCategory: null,
      allItems: []
    });
  }, []);

  return {
    state,
    startMeal,
    selectCategory,
    addItems,
    backToCategories,
    getAllSelectedItems,
    getTotalXP,
    reset
  };
};
