import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';
import mascotImage from '@assets/9ef8e8fe-158e-4518-bd1c-1325863aebca_1756365757940.png';
import nutritionCoachMascot from '@assets/generated_images/Sporty_nutrition_coach_mascot_f383d6cf.png';
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
  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showStreakPill, setShowStreakPill] = useState(false);
  const [showBadgePill, setShowBadgePill] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  
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

  // Fetch AI feedback if not already present - MOVED BEFORE EARLY RETURN
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
        
        // Show gamification features after XP animation
        setTimeout(() => {
          // Show streak pill if streak >= 2
          if ((user as any)?.streak >= 2) {
            setShowStreakPill(true);
          }
          
          // TODO: Check for new badges and show badge pill
          // This would require checking if badges were awarded during this session
        }, 800);
        
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

  // Typewriter effect for feedback - MOVED BEFORE EARLY RETURN
  useEffect(() => {
    const feedback = logData?.feedback || feedbackData?.feedback;
    const isLoading = feedbackLoading && !logData?.feedback;
    
    if (feedback && feedback !== typewriterText && !isLoading) {
      setIsTyping(true);
      setTypewriterText('');
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        // No animation for users who prefer reduced motion
        setTypewriterText(feedback);
        setIsTyping(false);
        return;
      }
      
      let index = 0;
      const timer = setInterval(() => {
        if (index < feedback.length) {
          setTypewriterText(feedback.slice(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 30); // Adjust speed as needed
      
      return () => clearInterval(timer);
    }
  }, [feedbackData?.feedback, logData?.feedback, feedbackLoading, typewriterText]);

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

  // Goal icon helper function
  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'energy':
        return { icon: '⚡', class: 'bb-goal-energy' };
      case 'focus':
        return { icon: '🧠', class: 'bb-goal-focus' };
      case 'strength':
        return { icon: '💪', class: 'bb-goal-strength' };
      default:
        return { icon: '⚡', class: 'bb-goal-energy' };
    }
  };


  const renderContent = () => {
    if (logData.entryMethod === 'emoji' && logData.content?.emojis) {
      return (
        <div className="flex flex-wrap gap-3 justify-center">
          {logData.content.emojis.map((emoji: string, index: number) => (
            <div 
              key={index} 
              className="bb-emoji-chip bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-[#FF6A00] rounded-2xl px-6 py-4 shadow-lg transform hover:scale-105 transition-transform duration-200"
            >
              <span className="text-4xl block mb-2">{emoji}</span>
            </div>
          ))}
        </div>
      );
    }
    
    if (logData.entryMethod === 'text' && logData.content?.description) {
      return (
        <div className="bb-text-pill bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl px-8 py-6 shadow-md mx-auto max-w-sm">
          <div className="text-2xl mb-2 text-center">📝</div>
          <p className="text-lg font-medium text-slate-800 text-center leading-relaxed">
            "{logData.content.description}"
          </p>
        </div>
      );
    }
    
    if (logData.entryMethod === 'photo') {
      return (
        <div className="bb-photo-preview text-center">
          {logData.content?.photoUrl ? (
            <div className="inline-block">
              <img 
                src={logData.content.photoUrl} 
                alt="Logged meal photo" 
                className="w-32 h-32 object-cover rounded-2xl shadow-lg border-2 border-[#FF6A00] mx-auto mb-3"
              />
            </div>
          ) : (
            <div className="bb-photo-placeholder bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-2xl w-32 h-32 mx-auto mb-3 flex items-center justify-center shadow-lg">
              <span className="text-4xl">📷</span>
            </div>
          )}
          <p className="text-base font-medium text-gray-700">Photo logged successfully!</p>
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
        <div className="bb-content-card bg-white border-2 border-[#FF6A00] rounded-3xl shadow-2xl p-8" style={{ borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
          <h3 className="text-center text-xl font-bold text-gray-800 mb-6 tracking-wide">
            What you logged:
          </h3>
          {renderContent()}
        </div>

        {/* Animated XP System */}
        <div
          className="bb-xp-card bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-[#FF6A00]"
          style={{
            display: 'block',
            visibility: 'visible',
            opacity: 1,
            position: 'relative',
            zIndex: 10,
            maxHeight: 'none',
            height: 'auto',
            borderRadius: '24px',
            boxShadow: '0 20px 40px -12px rgba(255, 106, 0, 0.25)'
          }}
          aria-live="polite"
        >
          <div className="p-6 text-center">
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
          </div>
        </div>

        {/* Gamification Pills */}
        {showStreakPill && (user as any)?.streak >= 2 && (
          <div className="flex justify-center" role="status" aria-live="polite">
            <div className="bb-streak-pill">
              <span className="text-xl">🔥</span>
              <span>{(user as any)?.streak}-day streak!</span>
            </div>
          </div>
        )}

        {showBadgePill && newBadges.length > 0 && (
          <div className="flex justify-center" role="status" aria-live="assertive">
            <div className="bb-badge-pill">
              <span className="text-xl">🏅</span>
              <span>{newBadges[0]} unlocked!</span>
            </div>
          </div>
        )}

        {/* AI Feedback with Speech Bubble */}
        <div className="bb-coach-section">
          {/* Goal Icon */}
          <div className="flex justify-center mb-4">
            <div className={`bb-goal-icon ${getGoalIcon((user as any)?.goal).class}`}>
              {getGoalIcon((user as any)?.goal).icon}
            </div>
          </div>
          
          {/* Coach Mascot and Speech Bubble */}
          <div className="flex items-start gap-4 justify-center">
            {/* Nutrition Coach Mascot */}
            <div className="flex-shrink-0">
              <img 
                src={nutritionCoachMascot} 
                alt="Nutrition coach mascot"
                className="w-20 h-24 object-contain"
              />
            </div>
            
            {/* Speech Bubble */}
            <div className="bb-speech-bubble flex-1 max-w-sm">
            <h3 className="font-bold text-gray-800 mb-4 text-center text-lg">
              Your nutrition coach says:
            </h3>
            
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">
                <div className="animate-spin w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Getting your personalized feedback...</p>
              </div>
            ) : feedback ? (
              <div className="relative">
                <p className={`text-base text-gray-700 leading-relaxed ${isTyping ? 'bb-typewriter' : ''}`}>
                  {typewriterText || feedback}
                </p>
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 bg-gray-700 ml-0.5 animate-pulse"></span>
                )}
              </div>
            ) : (
              <p className="text-base text-gray-700 leading-relaxed">
                Keep up the great work! Every healthy choice helps you grow stronger and smarter.
              </p>
            )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 flex flex-col items-center">
          <Button
            onClick={handleLogAnother}
            className="bb-enhanced-button max-w-[366px] w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white h-12 text-base font-bold uppercase tracking-wider"
            style={{ borderRadius: '13px' }}
          >
            <RotateCcw size={20} className="mr-2" />
            LOG ANOTHER MEAL
          </Button>
          
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            className="bb-enhanced-button max-w-[366px] w-full border-2 border-[#FF6A00] text-[#FF6A00] hover:bg-orange-50 h-12 text-base font-bold uppercase tracking-wider"
            style={{ borderRadius: '13px' }}
          >
            <Home size={20} className="mr-2" />
            BACK TO DASHBOARD
          </Button>
        </div>
      </div>
    </div>
  );
}