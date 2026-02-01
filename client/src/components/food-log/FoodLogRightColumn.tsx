import AppleBuddyCard from './AppleBuddyCard';
import FoodFactCard from './FoodFactCard';
import FoodLogBadges from './FoodLogBadges';
import AdPlaceholder from './AdPlaceholder';

interface FoodLogRightColumnProps {
  step?: 'meal-type' | 'categories' | 'items';
  itemCount?: number;
  newFood?: { name: string; date: string } | null;
}

export default function FoodLogRightColumn({ 
  step = 'meal-type', 
  itemCount = 0,
  newFood 
}: FoodLogRightColumnProps) {
  return (
    <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">
      <AppleBuddyCard step={step} itemCount={itemCount} />
      <FoodFactCard newFood={newFood} />
      <FoodLogBadges />
      <AdPlaceholder />
    </div>
  );
}
