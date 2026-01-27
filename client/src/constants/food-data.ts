import { MealType, FoodCategory, FoodItem } from '@/types/food-logging';

export const MEAL_TYPES: MealType[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    emoji: '☀️',
    timeRange: '7-11am',
    color: 'from-yellow-100 to-orange-100',
    borderColor: 'border-yellow-400',
    typical: ['Cereal', 'Fruit', 'Milk', 'Toast']
  },
  {
    id: 'lunch',
    name: 'Lunch',
    emoji: '🌤️',
    timeRange: '12-3pm',
    color: 'from-green-100 to-blue-100',
    borderColor: 'border-green-400',
    typical: ['Sandwich', 'Veggies', 'Juice']
  },
  {
    id: 'dinner',
    name: 'Dinner',
    emoji: '🌙',
    timeRange: '5-9pm',
    color: 'from-purple-100 to-indigo-100',
    borderColor: 'border-purple-400',
    typical: ['Protein', 'Rice', 'Veggies']
  },
  {
    id: 'snack',
    name: 'Snack',
    emoji: '🍪',
    timeRange: 'Anytime',
    color: 'from-pink-100 to-red-100',
    borderColor: 'border-pink-400',
    typical: ['Fruit', 'Nuts', 'Yogurt']
  }
];

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'fruits',
    name: 'Fruits',
    emoji: '🍎',
    color: 'from-red-100 to-red-200',
    borderColor: 'border-red-300',
    description: 'Sweet and healthy!'
  },
  {
    id: 'snacks',
    name: 'Snacks',
    emoji: '🍪',
    color: 'from-yellow-100 to-yellow-200',
    borderColor: 'border-yellow-300',
    description: 'Tasty treats'
  },
  {
    id: 'vegetables',
    name: 'Veggies',
    emoji: '🥦',
    color: 'from-green-100 to-green-200',
    borderColor: 'border-green-300',
    description: 'Super healthy!'
  },
  {
    id: 'drinks',
    name: 'Drinks',
    emoji: '💧',
    color: 'from-blue-100 to-blue-200',
    borderColor: 'border-blue-300',
    description: 'Stay hydrated!'
  },
  {
    id: 'bread',
    name: 'Bread & Grains',
    emoji: '🍞',
    color: 'from-amber-100 to-amber-200',
    borderColor: 'border-amber-300',
    description: 'Energy foods'
  },
  {
    id: 'dairy',
    name: 'Dairy',
    emoji: '🥛',
    color: 'from-purple-100 to-purple-200',
    borderColor: 'border-purple-300',
    description: 'Strong bones!'
  },
  {
    id: 'protein',
    name: 'Protein',
    emoji: '🍗',
    color: 'from-orange-100 to-orange-200',
    borderColor: 'border-orange-300',
    description: 'Build muscles!'
  }
];

export const FOOD_ITEMS: FoodItem[] = [
  { id: 'apple', name: 'apple', emoji: '🍎', categoryId: 'fruits', xpValue: 20 },
  { id: 'banana', name: 'banana', emoji: '🍌', categoryId: 'fruits', xpValue: 20 },
  { id: 'orange', name: 'orange', emoji: '🍊', categoryId: 'fruits', xpValue: 20 },
  { id: 'strawberry', name: 'strawberry', emoji: '🍓', categoryId: 'fruits', xpValue: 20 },
  { id: 'blueberries', name: 'blueberries', emoji: '🫐', categoryId: 'fruits', xpValue: 20 },
  { id: 'grapes', name: 'grapes', emoji: '🍇', categoryId: 'fruits', xpValue: 20 },
  { id: 'cherries', name: 'cherries', emoji: '🍒', categoryId: 'fruits', xpValue: 20 },
  { id: 'kiwi', name: 'kiwi', emoji: '🥝', categoryId: 'fruits', xpValue: 20 },

  { id: 'broccoli', name: 'broccoli', emoji: '🥦', categoryId: 'vegetables', xpValue: 25 },
  { id: 'carrot', name: 'carrot', emoji: '🥕', categoryId: 'vegetables', xpValue: 25 },
  { id: 'tomato', name: 'tomato', emoji: '🍅', categoryId: 'vegetables', xpValue: 25 },
  { id: 'lettuce', name: 'lettuce', emoji: '🥬', categoryId: 'vegetables', xpValue: 25 },
  { id: 'cucumber', name: 'cucumber', emoji: '🥒', categoryId: 'vegetables', xpValue: 25 },
  { id: 'corn', name: 'corn', emoji: '🌽', categoryId: 'vegetables', xpValue: 25 },

  { id: 'milk', name: 'milk', emoji: '🥛', categoryId: 'dairy', xpValue: 20 },
  { id: 'cheese', name: 'cheese', emoji: '🧀', categoryId: 'dairy', xpValue: 20 },
  { id: 'yogurt', name: 'yogurt', emoji: '🍦', categoryId: 'dairy', xpValue: 20 },

  { id: 'bread', name: 'bread', emoji: '🍞', categoryId: 'bread', xpValue: 15 },
  { id: 'rice', name: 'rice', emoji: '🍚', categoryId: 'bread', xpValue: 15 },
  { id: 'pasta', name: 'pasta', emoji: '🍝', categoryId: 'bread', xpValue: 15 },
  { id: 'cereal', name: 'cereal', emoji: '🥣', categoryId: 'bread', xpValue: 15 },

  { id: 'chicken', name: 'chicken', emoji: '🍗', categoryId: 'protein', xpValue: 20 },
  { id: 'egg', name: 'egg', emoji: '🥚', categoryId: 'protein', xpValue: 20 },
  { id: 'fish', name: 'fish', emoji: '🐟', categoryId: 'protein', xpValue: 20 },

  { id: 'water', name: 'water', emoji: '💧', categoryId: 'drinks', xpValue: 15 },
  { id: 'juice', name: 'juice', emoji: '🧃', categoryId: 'drinks', xpValue: 15 },

  { id: 'cookie', name: 'cookie', emoji: '🍪', categoryId: 'snacks', xpValue: 10 },
  { id: 'chips', name: 'chips', emoji: '🥔', categoryId: 'snacks', xpValue: 10 },
  { id: 'popcorn', name: 'popcorn', emoji: '🍿', categoryId: 'snacks', xpValue: 10 },
];

export const getRecommendedMealType = (): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 14) return 'lunch';
  if (hour >= 14 && hour < 17) return 'snack';
  if (hour >= 17 && hour < 21) return 'dinner';
  return 'snack';
};
