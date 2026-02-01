import { useState, useEffect } from 'react';

const ACTIVITY_FACTS = [
  "Running for just 10 minutes can boost your mood for hours! 🏃",
  "Dancing is one of the best exercises because it works your whole body! 💃",
  "Swimming uses almost every muscle in your body! 🏊",
  "Kids who play sports tend to do better in school! ⚽",
  "Just 30 minutes of activity a day keeps you healthy and strong! 💪",
  "Walking 10,000 steps is about 5 miles - that's far! 🚶",
  "Jumping rope for 10 minutes burns as many calories as 30 minutes of jogging! 🪢",
  "Playing outside in nature reduces stress and makes you happier! 🌳"
];

export default function ActivityFactCard() {
  const [fact, setFact] = useState('');

  useEffect(() => {
    const randomFact = ACTIVITY_FACTS[Math.floor(Math.random() * ACTIVITY_FACTS.length)];
    setFact(randomFact);
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full font-medium">
          💡 FUN ACTIVITY FACT
        </span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {fact}
      </p>
    </div>
  );
}
