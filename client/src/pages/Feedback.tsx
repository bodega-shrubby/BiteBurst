import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';
import mascotImage from '@assets/9ef8e8fe-158e-4518-bd1c-1325863aebca_1756365757940.png';
import { animateXP, levelFromTotal, percentInLevel, formatLevel } from '@/utils/xpAnimation';
import { apiRequest } from '@/lib/queryClient';
import '../styles/tokens.css';

interface LogData {
  id: string;
  xpAwarded: number;
  feedback?: string;
  content: any;
  entryMethod: string;
}

export default function Feedback() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [logData, setLogData] = useState<LogData | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpAnimationComplete, setXpAnimationComplete] = useState(false);
  const [levelUpOccurred, setLevelUpOccurred] = useState(false);
  
  // StrictMode safe guard
  const hasAnimatedRef = useRef(false);
  
  // Refs for XP animation elements
  const xpValueRef = useRef<HTMLDivElement>(null);
  const xpBarRef = useRef<HTMLDivElement>(null);
  const levelFromRef = useRef<HTMLSpanElement>(null);
  const levelToRef = useRef<HTMLSpanElement>(null);
  
  const queryClient = useQueryClient();

  // Type coercion - prevent string vs number pitfalls
  const rawAwardXP = (logData as any)?.xpAwarded ?? 0;
  const awardXP = Number(rawAwardXP);
  const currentTotalXP = Number((user as any)?.totalXp ?? 0);

  console.table({
    rawAwardXP,
    awardXP,
    currentTotalXP,
    hasUser: !!user,
    hasLogData: !!logData,
  });

  // XP update mutation
  const xpUpdateMutation = useMutation({
    mutationFn: async ({ userId, deltaXp, reason }: { userId: string; deltaXp: number; reason: string }) => {
      return apiRequest(`/api/user/${userId}/xp`, {
        method: 'POST',
        body: { delta_xp: deltaXp, reason }
      });
    },
    onSuccess: (data) => {
      console.log('XP updated successfully:', data);
      // Invalidate user data to refresh with new XP/level
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (error) => {
      console.error('XP update failed:', error);
      // Could show a toast here about fallback mode
    }
  });

  // Start XP animation with fallback handling
  const startXPAnimation = async (fromTotalXP: number, awardXP: number) => {
    try {
      // Diagnostics for debugging
      console.table({ 
        start: fromTotalXP, 
        gain: awardXP, 
        end: fromTotalXP + awardXP, 
        ...levelFromTotal(fromTotalXP + awardXP) 
      });
      
      await animateXP({
        fromTotalXP,
        awardXP,
        xpValueRef,
        xpBarRef,
        levelFromRef,
        levelToRef,
        onLevelUp: (newLevel) => {
          console.log('Level up to:', newLevel);
          setLevelUpOccurred(true);
          // Trigger confetti for level up
          setShowCelebration(true);
        },
        onDone: ({ newTotalXP, newLevel }) => {
          console.log('XP animation complete:', { newTotalXP, newLevel });
          setXpAnimationComplete(true);
        }
      });
    } catch (error) {
      console.error('XP animation failed:', error);
      // Fallback: show static final state
      if (xpValueRef.current) {
        xpValueRef.current.textContent = `+${awardXP} XP`;
      }
      if (xpBarRef.current) {
        const { pct } = percentInLevel(fromTotalXP + awardXP);
        xpBarRef.current.style.width = `${pct * 100}%`;
      }
      setXpAnimationComplete(true);
    }
  };

  // Get log data from URL params or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const logId = params.get('logId');
    const xp = parseInt(params.get('xp') || '0');
    
    // Try localStorage first
    const storedData = localStorage.getItem('lastLogData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setLogData(data);
        localStorage.removeItem('lastLogData');
        return;
      } catch (error) {
        console.error('Error parsing stored log data:', error);
      }
    }
    
    // Fallback to URL params if available
    if (logId && logId !== 'temp') {
      setLogData({
        id: logId,
        xpAwarded: xp,
        content: { emojis: ['🍎'] }, // placeholder
        entryMethod: 'emoji'
      });
    } else {
      // Default fallback
      setLogData({
        id: 'temp',
        xpAwarded: xp || 10,
        content: { emojis: ['🍎'] },
        entryMethod: 'emoji'
      });
    }
    
    console.log('Feedback page mounted with logData:', logData);
    
    // Development test harness for XP animation
    if (process.env.NODE_ENV === 'development' && !storedData && !logId) {
      const demo = {
        id: 'demo',
        xpAwarded: 120, // Should level up once with curve 100 + L * 25
        content: { emojis: ['🍎', '🥬'] },
        entryMethod: 'emoji'
      };
      console.log('Using demo XP data for testing:', demo);
      setLogData(demo);
    }
  }, []);

  // Start animations when user and logData are ready
  useEffect(() => {
    if (!user || !logData || hasAnimatedRef.current) return;

    const t = setTimeout(async () => {
      try {
        // Initial celebration animation
        setShowCelebration(true);
        
        // Start XP animation if we have award points
        if (awardXP > 0) {
          await startXPAnimation(currentTotalXP, awardXP);
        }
        
        // Update XP on server after animation completes
        if ((user as any)?.id && awardXP > 0) {
          await xpUpdateMutation.mutateAsync({
            userId: String((user as any).id),
            deltaXp: awardXP,
            reason: 'food_log',
          });
          // invalidate AFTER the animation to avoid remount flicker
          queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        }
        
        // mark complete after everything
        hasAnimatedRef.current = true;
        setXpAnimationComplete(true);
      } catch (e) {
        console.error('XP flow error', e);
      }
    }, 1500);

    return () => clearTimeout(t);
    // awardXP/currentTotalXP derive from user/logData
  }, [user, logData]);

  // Fetch AI feedback if not already present
  const { data: feedbackData, isLoading: feedbackLoading } = useQuery({
    queryKey: ['/api/ai/feedback', logData?.id],
    enabled: !!logData && !logData.feedback,
    queryFn: async () => {
      if (!logData || !user) return null;
      
      const response = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': localStorage.getItem('sessionId') || '',
        },
        body: JSON.stringify({
          age: user.ageBracket,
          goal: user.goal,
          mealLog: logData.content,
          logId: logData.id,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get feedback');
      }
      
      return response.json();
    },
  });

  const handleLogAnother = () => {
    setLocation('/food-log');
  };

  const handleBackToDashboard = () => {
    setLocation('/dashboard');
  };

  if (!logData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <img 
            src={mascotImage} 
            alt="BiteBurst Mascot" 
            className="w-20 h-20 mx-auto rounded-full"
          />
          <p className="text-gray-600">Loading your feedback...</p>
          <Button onClick={handleBackToDashboard} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const feedback = logData.feedback || feedbackData?.feedback;
  const isLoading = feedbackLoading && !logData.feedback;

  const renderContent = () => {
    if (logData.entryMethod === 'emoji' && logData.content?.emojis) {
      return (
        <div className="flex flex-wrap gap-2 justify-center">
          {logData.content.emojis.map((emoji: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-lg px-3 py-1">
              {emoji}
            </Badge>
          ))}
        </div>
      );
    }
    
    if (logData.entryMethod === 'text' && logData.content?.description) {
      return (
        <p className="text-base text-center text-gray-700">
          "{logData.content.description}"
        </p>
      );
    }
    
    if (logData.entryMethod === 'photo') {
      return (
        <div className="text-center">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-gray-600">Photo logged successfully!</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-[#FF6A00] text-white p-4 flex items-center justify-between z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToDashboard}
          className="text-white hover:bg-white/20 p-2"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">GREAT JOB!</h1>
          <img 
            src={mascotImage} 
            alt="BiteBurst mascot" 
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
        
        <div className="w-8" /> {/* Spacer for centering */}
      </header>

      <div className="p-4 space-y-6 max-w-[420px] mx-auto">
        {/* Hero Celebration Section */}
        <section className="bb-hero text-center space-y-6">
          <div className="bb-mascot-wrap relative inline-block">
            <img 
              src={mascotImage} 
              alt="BiteBurst mascot celebrating" 
              className={`bb-mascot w-32 h-32 mx-auto ${
                showCelebration ? 'bb-mascot-bounce' : ''
              }`}
            />
            {/* Star Confetti Particles */}
            <div 
              className={`bb-confetti absolute inset-0 pointer-events-none ${
                showCelebration ? 'bb-confetti-active' : ''
              }`} 
              aria-hidden="true"
            >
              <div className="bb-confetti-particle bb-confetti-1">✨</div>
              <div className="bb-confetti-particle bb-confetti-2">✨</div>
              <div className="bb-confetti-particle bb-confetti-3">✨</div>
              <div className="bb-confetti-particle bb-confetti-4">✨</div>
              <div className="bb-confetti-particle bb-confetti-5">✨</div>
              <div className="bb-confetti-particle bb-confetti-6">✨</div>
            </div>
          </div>
          
          <h2 className={`bb-h1 text-3xl font-bold text-gray-800 ${
            showCelebration ? 'bb-slide-in' : 'opacity-0'
          }`}>
            Awesome meal choice!
          </h2>
        </section>

        {/* What You Logged */}
        <Card className="border-2 border-[#FF6A00]">
          <CardContent className="p-6">
            <h3 className="text-center font-medium text-gray-600 mb-4">
              What you logged:
            </h3>
            {renderContent()}
          </CardContent>
        </Card>

        {/* Animated XP System */}
        <Card className="bb-xp-card bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-[#FF6A00]" aria-live="polite">
          <CardContent className="p-6 text-center">
            {/* XP Count Display */}
            <div ref={xpValueRef} className="text-3xl font-bold text-[#FF6A00] mb-2">
              +{awardXP} XP
            </div>
            <p className="text-gray-600 mb-4">Experience points earned!</p>
            
            {/* Progress Bar */}
            <div className="bb-progress">
              <div ref={xpBarRef} className="bb-progress-bar" style={{ width: '0%' }}></div>
            </div>
            
            {/* Level Pills */}
            <div className="bb-level-pills">
              <span ref={levelFromRef} className="bb-level-pill">
                {formatLevel(levelFromTotal(currentTotalXP).level + 1)}
              </span>
              <span ref={levelToRef} className="bb-level-pill">
                {formatLevel(levelFromTotal(currentTotalXP).level + 2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* AI Feedback */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium text-gray-800 mb-3 text-center">
              Your nutrition coach says:
            </h3>
            
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">
                <div className="animate-spin w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full mx-auto mb-2"></div>
                Getting your personalized feedback...
              </div>
            ) : feedback ? (
              <p className="text-base text-gray-700 text-center leading-relaxed">
                {feedback}
              </p>
            ) : (
              <p className="text-base text-gray-700 text-center leading-relaxed">
                Keep up the great work! Every healthy choice helps you grow stronger and smarter.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleLogAnother}
            className="w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white py-4 text-lg font-bold rounded-xl"
          >
            <RotateCcw size={20} className="mr-2" />
            LOG ANOTHER MEAL
          </Button>
          
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            className="w-full border-2 border-[#FF6A00] text-[#FF6A00] hover:bg-orange-50 py-4 text-lg font-medium rounded-xl"
          >
            <Home size={20} className="mr-2" />
            BACK TO DASHBOARD
          </Button>
        </div>
      </div>
    </div>
  );
}