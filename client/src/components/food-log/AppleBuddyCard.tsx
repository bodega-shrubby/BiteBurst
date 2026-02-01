import LessonMascot from '@/components/LessonMascot';

interface AppleBuddyCardProps {
  step?: 'meal-type' | 'categories' | 'items';
  itemCount?: number;
}

const MESSAGES: Record<string, string> = {
  'meal-type': "Welcome! Let's log what you ate today!",
  'categories': "Pick some yummy foods from each group!",
  'items': "Great choices! Add more foods or finish up!"
};

const TIPS: Record<string, string> = {
  'meal-type': "Logging your meals helps you eat healthy and earn rewards!",
  'categories': "Try to eat colorful foods from different groups!",
  'items': "The more variety, the more points you earn!"
};

export default function AppleBuddyCard({ step = 'meal-type', itemCount = 0 }: AppleBuddyCardProps) {
  const message = itemCount > 0 
    ? `Awesome! You picked ${itemCount} food${itemCount > 1 ? 's' : ''}! 🎉` 
    : MESSAGES[step];
  const tip = TIPS[step];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <LessonMascot
        type="topic"
        topicMascot="apple"
        message={message}
        size="md"
      />

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 font-medium">Apple Buddy's Tip</p>
        <p className="text-sm text-gray-700 mt-1">{tip}</p>
      </div>
    </div>
  );
}
