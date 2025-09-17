import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface QuickLogGridProps {
  className?: string;
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

export default function QuickLogGrid({ className = '' }: QuickLogGridProps) {
  const [, setLocation] = useLocation();
  const [pressedTile, setPressedTile] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation for logging food automatically
  const foodLogMutation = useMutation({
    mutationFn: async (foodData: { emoji: string; label: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      return apiRequest('/api/logs', {
        method: 'POST',
        body: {
          userId: user.id,
          type: 'food',
          entryMethod: 'emoji',
          content: {
            emojis: [foodData.emoji]
          }
        }
      });
    },
    onSuccess: (response) => {
      // Invalidate relevant caches
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['/api/user', user.id, 'daily-summary'] });
        queryClient.invalidateQueries({ queryKey: ['/api/logs'] });
      }
      
      // Navigate to success page with log details
      const logId = response.id || 'temp';
      const xp = response.xpAwarded || 15;
      setLocation(`/success?logId=${logId}&xp=${xp}&type=food`);
    },
    onError: (error) => {
      console.error('Quick food log error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log food item. Please try again.',
        variant: 'destructive',
      });
      setPressedTile(null);
    }
  });
  
  // Simplified test function to bypass complex logic
  const handleSimpleTest = () => {
    console.log('🎯 SIMPLE TEST BUTTON CLICKED!');
    alert('Button clicked! If you see this, clicks are working.');
  };
  
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
    const isPressed = pressedTile === `${type}-${query}`;
    const isDisabled = type === 'food' && foodLogMutation.isPending;
    
    return (
      <button
        onMouseDown={() => !isDisabled && setPressedTile(`${type}-${query}`)}
        onMouseUp={() => setPressedTile(null)}
        onMouseLeave={() => setPressedTile(null)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🔥 SIMPLE CLICK TEST:', type, query);
          if (type === 'food') {
            console.log('🍎 Food clicked - navigating to success');
            setLocation('/success?type=food&xp=15');
          } else {
            console.log('⚽ Activity clicked - navigating to activity log');
            setLocation(`/activity-log?activity=${query}`);
          }
        }}
        disabled={isDisabled}
        data-testid={`quick-log-${type}-${query}`}
        className={`
          relative z-10 pointer-events-auto
          flex flex-col items-center justify-center
          w-16 h-16 rounded-2xl border-2 border-gray-200
          bg-gray-50 hover:bg-orange-50 hover:border-orange-200
          transition-all duration-150
          ${isPressed ? 'scale-95 bg-orange-100' : 'hover:scale-105'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          min-h-[44px] min-w-[44px]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500
        `}
        style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
        aria-label={`Quick log ${label.toLowerCase()}`}
        aria-busy={isDisabled}
      >
        <span className="text-2xl mb-1" role="img" aria-hidden="true">
          {emoji}
        </span>
        <span className="text-xs font-medium text-gray-700 leading-tight">
          {label}
        </span>
        {isDisabled && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </button>
    );
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-xl font-bold text-black mb-3">Quick Log</h3>
        <p className="text-sm text-gray-600 mb-4">Tap, snap, go!</p>
        <button 
          onClick={handleSimpleTest}
          className="bg-red-500 text-white px-4 py-2 rounded mb-4"
        >
          TEST CLICK - If this works, clicks are functional
        </button>
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
          className="w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white h-12 text-base font-bold uppercase tracking-wider"
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