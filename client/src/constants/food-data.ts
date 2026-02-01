import { MealType, FoodCategory, FoodItem } from '@/types/food-logging';

export const MEAL_TYPES: MealType[] = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    emoji: '🥞',
    timeRange: '6am - 10am',
    color: 'bg-white',
    borderColor: 'border-l-[#FF9500]',
    accentColor: '#FF9500',
    typical: ['Cereal', 'Fruit', 'Milk', 'Toast']
  },
  {
    id: 'lunch',
    name: 'Lunch',
    emoji: '🥪',
    timeRange: '11am - 2pm',
    color: 'bg-white',
    borderColor: 'border-l-[#34C759]',
    accentColor: '#34C759',
    typical: ['Sandwich', 'Veggies', 'Juice']
  },
  {
    id: 'dinner',
    name: 'Dinner',
    emoji: '🍝',
    timeRange: '5pm - 9pm',
    color: 'bg-white',
    borderColor: 'border-l-[#AF52DE]',
    accentColor: '#AF52DE',
    typical: ['Protein', 'Rice', 'Veggies']
  },
  {
    id: 'snack',
    name: 'Snack',
    emoji: '🍎',
    timeRange: 'Anytime!',
    color: 'bg-white',
    borderColor: 'border-l-[#007AFF]',
    accentColor: '#007AFF',
    typical: ['Fruit', 'Nuts', 'Yogurt']
  }
];

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: 'fruits',
    name: 'Fruits',
    emoji: '🍎',
    color: 'bg-white',
    borderColor: 'border-l-[#FF3B30]',
    accentColor: '#FF3B30',
    description: 'Sweet and healthy!'
  },
  {
    id: 'snacks',
    name: 'Snacks',
    emoji: '🧀',
    color: 'bg-white',
    borderColor: 'border-l-[#FFCC00]',
    accentColor: '#FFCC00',
    description: 'Tasty treats'
  },
  {
    id: 'vegetables',
    name: 'Veggies',
    emoji: '🥦',
    color: 'bg-white',
    borderColor: 'border-l-[#34C759]',
    accentColor: '#34C759',
    description: 'Super healthy!'
  },
  {
    id: 'drinks',
    name: 'Drinks',
    emoji: '💧',
    color: 'bg-white',
    borderColor: 'border-l-[#007AFF]',
    accentColor: '#007AFF',
    description: 'Stay hydrated!'
  },
  {
    id: 'bread',
    name: 'Bread & Grains',
    emoji: '🍞',
    color: 'bg-white',
    borderColor: 'border-l-[#FF9500]',
    accentColor: '#FF9500',
    description: 'Energy foods'
  },
  {
    id: 'dairy',
    name: 'Dairy',
    emoji: '🥛',
    color: 'bg-white',
    borderColor: 'border-l-[#AF52DE]',
    accentColor: '#AF52DE',
    description: 'Strong bones!'
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
  { id: 'watermelon', name: 'watermelon', emoji: '🍉', categoryId: 'fruits', xpValue: 20 },
  { id: 'peach', name: 'peach', emoji: '🍑', categoryId: 'fruits', xpValue: 20 },
  { id: 'pear', name: 'pear', emoji: '🍐', categoryId: 'fruits', xpValue: 20 },
  { id: 'mango', name: 'mango', emoji: '🥭', categoryId: 'fruits', xpValue: 20 },

  { id: 'broccoli', name: 'broccoli', emoji: '🥦', categoryId: 'vegetables', xpValue: 25 },
  { id: 'carrot', name: 'carrot', emoji: '🥕', categoryId: 'vegetables', xpValue: 25 },
  { id: 'tomato', name: 'tomato', emoji: '🍅', categoryId: 'vegetables', xpValue: 25 },
  { id: 'lettuce', name: 'lettuce', emoji: '🥬', categoryId: 'vegetables', xpValue: 25 },
  { id: 'cucumber', name: 'cucumber', emoji: '🥒', categoryId: 'vegetables', xpValue: 25 },
  { id: 'corn', name: 'corn', emoji: '🌽', categoryId: 'vegetables', xpValue: 25 },
  { id: 'pepper', name: 'pepper', emoji: '🌶️', categoryId: 'vegetables', xpValue: 25 },
  { id: 'potato', name: 'potato', emoji: '🥔', categoryId: 'vegetables', xpValue: 25 },
  { id: 'onion', name: 'onion', emoji: '🧅', categoryId: 'vegetables', xpValue: 25 },
  { id: 'garlic', name: 'garlic', emoji: '🧄', categoryId: 'vegetables', xpValue: 25 },
  { id: 'mushroom', name: 'mushroom', emoji: '🍄', categoryId: 'vegetables', xpValue: 25 },
  { id: 'eggplant', name: 'eggplant', emoji: '🍆', categoryId: 'vegetables', xpValue: 25 },

  { id: 'milk', name: 'milk', emoji: '🥛', categoryId: 'dairy', xpValue: 20 },
  { id: 'cheese', name: 'cheese', emoji: '🧀', categoryId: 'dairy', xpValue: 20 },
  { id: 'yogurt', name: 'yogurt', emoji: '🍦', categoryId: 'dairy', xpValue: 20 },
  { id: 'butter', name: 'butter', emoji: '🧈', categoryId: 'dairy', xpValue: 20 },
  { id: 'ice-cream', name: 'ice cream', emoji: '🍨', categoryId: 'dairy', xpValue: 20 },
  { id: 'cream', name: 'cream', emoji: '🥛', categoryId: 'dairy', xpValue: 20 },

  { id: 'bread', name: 'bread', emoji: '🍞', categoryId: 'bread', xpValue: 15 },
  { id: 'rice', name: 'rice', emoji: '🍚', categoryId: 'bread', xpValue: 15 },
  { id: 'pasta', name: 'pasta', emoji: '🍝', categoryId: 'bread', xpValue: 15 },
  { id: 'cereal', name: 'cereal', emoji: '🥣', categoryId: 'bread', xpValue: 15 },
  { id: 'croissant', name: 'croissant', emoji: '🥐', categoryId: 'bread', xpValue: 15 },
  { id: 'bagel', name: 'bagel', emoji: '🥯', categoryId: 'bread', xpValue: 15 },
  { id: 'pretzel', name: 'pretzel', emoji: '🥨', categoryId: 'bread', xpValue: 15 },
  { id: 'pancakes', name: 'pancakes', emoji: '🥞', categoryId: 'bread', xpValue: 15 },
  { id: 'waffle', name: 'waffle', emoji: '🧇', categoryId: 'bread', xpValue: 15 },
  { id: 'tortilla', name: 'tortilla', emoji: '🫓', categoryId: 'bread', xpValue: 15 },
  { id: 'noodles', name: 'noodles', emoji: '🍜', categoryId: 'bread', xpValue: 15 },
  { id: 'pizza', name: 'pizza', emoji: '🍕', categoryId: 'bread', xpValue: 15 },

  { id: 'water', name: 'water', emoji: '💧', categoryId: 'drinks', xpValue: 15 },
  { id: 'juice', name: 'juice', emoji: '🧃', categoryId: 'drinks', xpValue: 15 },
  { id: 'smoothie', name: 'smoothie', emoji: '🥤', categoryId: 'drinks', xpValue: 15 },
  { id: 'tea', name: 'tea', emoji: '🍵', categoryId: 'drinks', xpValue: 15 },
  { id: 'cocoa', name: 'hot cocoa', emoji: '☕', categoryId: 'drinks', xpValue: 15 },
  { id: 'lemonade', name: 'lemonade', emoji: '🍋', categoryId: 'drinks', xpValue: 15 },

  { id: 'cookie', name: 'cookie', emoji: '🍪', categoryId: 'snacks', xpValue: 10 },
  { id: 'chips', name: 'chips', emoji: '🥔', categoryId: 'snacks', xpValue: 10 },
  { id: 'popcorn', name: 'popcorn', emoji: '🍿', categoryId: 'snacks', xpValue: 10 },
  { id: 'candy', name: 'candy', emoji: '🍬', categoryId: 'snacks', xpValue: 10 },
  { id: 'chocolate', name: 'chocolate', emoji: '🍫', categoryId: 'snacks', xpValue: 10 },
  { id: 'donut', name: 'donut', emoji: '🍩', categoryId: 'snacks', xpValue: 10 },
  { id: 'cupcake', name: 'cupcake', emoji: '🧁', categoryId: 'snacks', xpValue: 10 },
  { id: 'cake', name: 'cake', emoji: '🍰', categoryId: 'snacks', xpValue: 10 },
  { id: 'peanuts', name: 'peanuts', emoji: '🥜', categoryId: 'snacks', xpValue: 10 },
  { id: 'crackers', name: 'crackers', emoji: '🧂', categoryId: 'snacks', xpValue: 10 },
  { id: 'honey', name: 'honey', emoji: '🍯', categoryId: 'snacks', xpValue: 10 },
  { id: 'fries', name: 'fries', emoji: '🍟', categoryId: 'snacks', xpValue: 10 },
];

export const getRecommendedMealType = (): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 10) return 'breakfast';
  if (hour >= 11 && hour < 14) return 'lunch';
  if (hour >= 17 && hour < 21) return 'dinner';
  return 'snack';
};
