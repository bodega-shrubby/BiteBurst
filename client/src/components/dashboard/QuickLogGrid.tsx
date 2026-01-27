import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

interface QuickLogGridProps {
  className?: string;
  isFirstTimeUser?: boolean;
}

const FOOD_OPTIONS = [
  { emoji: '🍎', label: 'Apple', query: 'apple' },
  { emoji: '🥦', label: 'Broccoli', query: 'broccoli' },
  { emoji: '🍞', label: 'Bread', query: 'bread' },
  { emoji: '🧃', label: 'Juice', query: 'juice' }
];

const ACTIVITY_OPTIONS = [
  { emoji: '⚽', label: 'Soccer', query: 'soccer' },
  { emoji: '🧘', label: 'Yoga', query: 'yoga' },
  { emoji: '🏃', label: 'Running', query: 'run' },
  { emoji: '🎯', label: 'Practice', query: 'drills' }
];

export default function QuickLogGrid({ className = '', isFirstTimeUser = false }: QuickLogGridProps) {
  const [, setLocation] = useLocation();
  
  const TileButton = ({ 
    emoji, 
    label, 
    query, 
    type 
  }: { 
    emoji: string; 
    label: string; 
    query: string; 
    type: 'food' | 'activity';
  }) => {
    return (
      <button
        onClick={() => {
          if (type === 'food') {
            setLocation('/food-log');
          } else {
            setLocation('/activity-log');
          }
        }}
        data-testid={`quick-log-${type}-${query}`}
        className="
          flex flex-col items-center justify-center
          w-16 h-16 rounded-2xl border-2 border-gray-200
          bg-gray-50 hover:bg-orange-50 hover:border-orange-200
          transition-all duration-150 hover:scale-105
          min-h-[44px] min-w-[44px]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
        "
        aria-label={`Quick log ${label.toLowerCase()}`}
      >
        <span className="text-2xl mb-1" role="img" aria-hidden="true">
          {emoji}
        </span>
        <span className="text-xs font-medium text-gray-700 leading-tight">
          {label}
        </span>
      </button>
    );
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-xl font-bold text-black mb-3">Quick Log</h3>
        <p className="text-sm text-gray-600 mb-4">Tap, snap, go!</p>
      </div>
      
      {/* Food Row */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Food</h4>
        <div className="relative flex gap-3 overflow-x-auto pb-2">
          {FOOD_OPTIONS.map((option) => (
            <TileButton
              key={option.query}
              emoji={option.emoji}
              label={option.label}
              query={option.query}
              type="food"
            />
          ))}
        </div>
      </div>
      
      {/* Activity Row */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Activity</h4>
        <div className="relative flex gap-3 overflow-x-auto pb-2">
          {ACTIVITY_OPTIONS.map((option) => (
            <TileButton
              key={option.query}
              emoji={option.emoji}
              label={option.label}
              query={option.query}
              type="activity"
            />
          ))}
        </div>
      </div>
      
      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          onClick={() => setLocation('/food-log')}
          data-testid="button-log-meal"
          className={`w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white h-12 text-base font-bold uppercase tracking-wider ${isFirstTimeUser ? 'pulse-cta' : ''}`}
          style={{ borderRadius: '13px' }}
        >
          <span className="mr-2">🍎</span>
          Log Your Meal
        </Button>
        
        <Button
          onClick={() => setLocation('/activity-log')}
          data-testid="button-log-activity"
          variant="outline"
          className="w-full border-2 border-[#FF6A00] text-[#FF6A00] hover:bg-orange-50 h-12 text-base font-bold uppercase tracking-wider"
          style={{ borderRadius: '13px' }}
        >
          <span className="mr-2">⚽</span>
          Log Activity
        </Button>
      </div>
    </div>
  );
}