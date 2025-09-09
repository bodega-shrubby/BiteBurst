import { Star } from 'lucide-react';

interface StarBadgeProps {
  y: number;
  isUnlocked?: boolean;
}

export default function StarBadge({ y, isUnlocked = false }: StarBadgeProps) {
  const bgColor = isUnlocked ? 'bg-amber-100' : 'bg-gray-100';
  const starColor = isUnlocked ? 'text-amber-500' : 'text-gray-400';
  const ringColor = isUnlocked ? 'border-amber-300' : 'border-gray-300';

  return (
    <div
      className="absolute left-1/2 transform -translate-x-1/2"
      style={{ top: y }}
    >
      <div className={`
        w-12 h-12 rounded-full ${bgColor} border-2 ${ringColor}
        flex items-center justify-center shadow-sm
      `}>
        <Star className={`w-6 h-6 ${starColor} ${isUnlocked ? 'fill-current' : ''}`} />
      </div>
    </div>
  );
}