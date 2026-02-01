import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import appleBuddyImage from '@assets/Mascots/AppleBuddy.png';

interface AppleBuddyMascotProps {
  categoryId?: string;
  screen?: 'mealType' | 'categorySelection';
}

const APPLE_BUDDY_TIPS: Record<string, string> = {
  mealType: "Logging meals helps you track your healthy eating journey! 🌟",
  categorySelection: "Try to eat from different food groups for a balanced meal! 🌈",
  fruits: "Fruits are packed with vitamins to keep you healthy and strong! 💪",
  vegetables: "Veggies make you grow strong and give you superpowers! 🦸",
  dairy: "Dairy builds super strong bones! 🦴",
  bread: "Grains give you energy to play and learn! ⚡",
  drinks: "Water is the best drink for your body! 💧",
  snacks: "Healthy snacks give you power between meals! 🔋"
};

export default function AppleBuddyMascot({ categoryId, screen }: AppleBuddyMascotProps) {
  const [showTip, setShowTip] = useState(false);
  const [hasShownTip, setHasShownTip] = useState(false);

  useEffect(() => {
    if (!hasShownTip) {
      const timer = setTimeout(() => {
        setShowTip(true);
        setHasShownTip(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [hasShownTip]);

  useEffect(() => {
    if (showTip) {
      const hideTimer = setTimeout(() => {
        setShowTip(false);
      }, 10000);
      return () => clearTimeout(hideTimer);
    }
  }, [showTip]);

  const getTip = () => {
    if (categoryId && APPLE_BUDDY_TIPS[categoryId]) {
      return APPLE_BUDDY_TIPS[categoryId];
    }
    if (screen && APPLE_BUDDY_TIPS[screen]) {
      return APPLE_BUDDY_TIPS[screen];
    }
    return "Eating healthy foods helps you grow big and strong! 🌟";
  };

  const handleMascotClick = () => {
    setShowTip(!showTip);
  };

  return (
    <div className="fixed bottom-28 right-6 z-30">
      {showTip && (
        <div className="absolute bottom-24 right-0 w-64 bg-white rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] animate-[slideUp_0.3s_ease-out]">
          <button
            onClick={() => setShowTip(false)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="text-sm font-bold text-[#1C1C1E]">Tip from Apple Buddy!</span>
          </div>
          
          <p className="text-sm text-[#1C1C1E] leading-relaxed pl-6">
            {getTip()}
          </p>
          
          <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </div>
      )}
      
      <button
        onClick={handleMascotClick}
        className="relative animate-[float_3s_ease-in-out_infinite] transition-transform hover:scale-110"
      >
        <img 
          src={appleBuddyImage} 
          alt="Apple Buddy" 
          className="w-24 h-24 object-contain drop-shadow-lg"
        />
      </button>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
