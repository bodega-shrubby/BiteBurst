import { useState, useEffect } from 'react';

const FOOD_FACTS = [
  "Carrots were originally purple before orange ones became popular! 🥕",
  "Strawberries have about 200 seeds on the outside! 🍓",
  "Honey never spoils - archaeologists found 3000-year-old honey that was still good! 🍯",
  "Bananas are technically berries, but strawberries aren't! 🍌",
  "Apples float because they're 25% air! 🍎",
  "Broccoli contains more protein than steak per calorie! 🥦",
  "Cucumbers are 96% water - super hydrating! 🥒",
  "Avocados are actually fruits, not vegetables! 🥑",
  "Pineapples take about 2 years to grow! 🍍",
  "A single spaghetti noodle is called a spaghetto! 🍝",
  "Lemons have more sugar than strawberries! 🍋",
  "Cranberries bounce when they're ripe! 🫐"
];

interface FoodFactCardProps {
  newFood?: { name: string; date: string } | null;
}

export default function FoodFactCard({ newFood }: FoodFactCardProps) {
  const [fact, setFact] = useState('');

  useEffect(() => {
    setFact(FOOD_FACTS[Math.floor(Math.random() * FOOD_FACTS.length)]);
  }, []);

  if (newFood) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-orange-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-medium">
            🌟 NEW FOOD EXPLORER
          </span>
        </div>
        <h3 className="font-bold text-base text-gray-800">
          Amazing! You tried {newFood.name}!
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Trying new foods makes you a food adventurer! Keep exploring new tastes!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">
          🧠 FUN FOOD FACT
        </span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {fact}
      </p>
    </div>
  );
}
