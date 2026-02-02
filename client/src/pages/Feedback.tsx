import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';
import * as confettiModule from 'canvas-confetti';
import oniCelebrateImage from '@assets/Mascots/Oni_celebrate.png';
import oniProudImage from '@assets/Mascots/Oni_proud.png';
import captainCarrotImage from '@assets/Mascots/CaptainCarrot.png';
import coachFlexImage from '@assets/Mascots/CoachFlex.png';
import { animateXP, levelFromTotal, percentInLevel, formatLevel } from '@/utils/xpAnimation';
import { apiRequest } from '@/lib/queryClient';
import '../styles/tokens.css';

const confetti = confettiModule.default || confettiModule;

interface LogData {
  id: string;
  xpAwarded: number;
  feedback?: string;
  content: any;
  entryMethod: string;
  type?: string;
  durationMin?: number;
  mood?: string;
  badge_awarded?: {
    code: string;
    name: string;
    description: string;
    category: string;
    rarity: string;
  };
}

export default function Feedback() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [logData, setLogData] = useState<LogData | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpAnimationComplete, setXpAnimationComplete] = useState(false);
  const [levelUpOccurred, setLevelUpOccurred] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showStreakPill, setShowStreakPill] = useState(false);
  const [showBadgePill, setShowBadgePill] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  
  const hasAnimatedRef = useRef(false);
  
  const xpValueRef = useRef<HTMLDivElement>(null);
  const xpBarRef = useRef<HTMLDivElement>(null);
  const levelFromRef = useRef<HTMLSpanElement>(null);
  const levelToRef = useRef<HTMLSpanElement>(null);
  
  const queryClient = useQueryClient();

  const rawAwardXP = (logData as any)?.xpAwarded ?? 0;
  const awardXP = Number(rawAwardXP);
  const currentTotalXP = Number((user as any)?.totalXp ?? 0);
  const isActivity = (logData as any)?.type === 'activity';

  const theme = isActivity
    ? {
        primary: 'from-blue-500 to-indigo-600',
        primarySolid: 'bg-blue-500',
        accent: 'blue-500',
        accentBorder: 'border-blue-300',
        accentBg: 'bg-blue-50',
        accentText: 'text-blue-500',
        accentGradient: 'from-blue-50 to-indigo-50',
        streakGradient: 'from-blue-500 to-indigo-600',
        headerText: 'YOU CRUSHED IT!',
        headerEmoji: '💪',
        title: 'Awesome workout!',
        titleEmoji: '💪',
        mascotLabel: 'Coach Flex says:',
        mascotImage: coachFlexImage
      }
    : {
        primary: 'from-orange-500 to-orange-600',
        primarySolid: 'bg-orange-500',
        accent: 'orange-500',
        accentBorder: 'border-orange-300',
        accentBg: 'bg-orange-50',
        accentText: 'text-orange-500',
        accentGradient: 'from-orange-50 to-amber-50',
        streakGradient: 'from-orange-500 to-red-500',
        headerText: 'AMAZING!',
        headerEmoji: '🎉',
        title: 'Awesome meal choice!',
        titleEmoji: '🍊',
        mascotLabel: 'Captain Carrot says:',
        mascotImage: captainCarrotImage
      };

  const xpUpdateMutation = useMutation({
    mutationFn: async ({ userId, deltaXp, reason }: { userId: string; deltaXp: number; reason: string }) => {
      return apiRequest(`/api/user/${userId}/xp`, {
        method: 'POST',
        body: { delta_xp: deltaXp, reason }
      });
    },
    onSuccess: (data) => {
      if (data.streak_changed) {
        const today = new Date().toISOString().split('T')[0];
        const lastStreakShown = localStorage.getItem('streakShownOn');
        
        if (lastStreakShown !== today) {
          setShowStreakPill(true);
          localStorage.setItem('streakShownOn', today);
        }
      }
      
      if (data.badge_awarded) {
        setNewBadges([data.badge_awarded.name]);
        setShowBadgePill(true);
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (error) => {
      console.error('XP update failed:', error);
    }
  });

  const startXPAnimation = async (fromTotalXP: number, awardXP: number) => {
    try {
      await animateXP({
        fromTotalXP,
        awardXP,
        xpValueRef,
        xpBarRef,
        levelFromRef,
        levelToRef,
        onLevelUp: (newLevel) => {
          setLevelUpOccurred(true);
          setShowCelebration(true);
        },
        onDone: ({ newTotalXP, newLevel }) => {
          setXpAnimationComplete(true);
        }
      });
    } catch (error) {
      console.error('XP animation failed:', error);
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const logId = params.get('logId');
    const xp = parseInt(params.get('xp') || '0');
    const type = params.get('type') || 'food';
    
    const storedData = localStorage.getItem('lastLogData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        if (!data.type) {
          data.type = type;
        }
        setLogData(data);
        localStorage.removeItem('lastLogData');
        return;
      } catch (error) {
        console.error('Error parsing stored log data:', error);
      }
    }
    
    if (logId && logId !== 'temp') {
      setLogData({
        id: logId,
        xpAwarded: xp,
        content: type === 'activity' ? { emojis: ['⚽'] } : { emojis: ['🍎'] },
        entryMethod: 'emoji',
        type: type
      });
    } else {
      setLogData({
        id: 'temp',
        xpAwarded: xp || 10,
        content: type === 'activity' ? { emojis: ['⚽'] } : { emojis: ['🍎'] },
        entryMethod: 'emoji',
        type: type
      });
    }
  }, []);

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
          yearGroup: user.yearGroup,
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

  useEffect(() => {
    if (!user || !logData || hasAnimatedRef.current) return;

    const colors = isActivity
      ? ['#3B82F6', '#10B981', '#8B5CF6', '#06B6D4', '#6366F1']
      : ['#FF6A00', '#FFB800', '#FF4444', '#FFDD00', '#22C55E'];

    confetti({
      particleCount: 100,
      spread: 80,
      colors,
      origin: { y: 0.5 }
    });

    const t = setTimeout(async () => {
      try {
        setShowCelebration(true);
        
        if (logData.badge_awarded) {
          setNewBadges([logData.badge_awarded.name]);
          setShowBadgePill(true);
        }
        
        if (awardXP > 0) {
          await startXPAnimation(currentTotalXP, awardXP);
        } else {
          setXpAnimationComplete(true);
        }
        
        if ((user as any)?.id && awardXP > 0) {
          await xpUpdateMutation.mutateAsync({
            userId: String((user as any).id),
            deltaXp: awardXP,
            reason: isActivity ? 'activity_log' : 'food_log',
          });
        }
        
        hasAnimatedRef.current = true;
      } catch (e) {
        console.error('XP flow error', e);
        setXpAnimationComplete(true);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [user, logData]);

  useEffect(() => {
    const feedback = logData?.feedback || feedbackData?.feedback;
    const isLoading = feedbackLoading && !logData?.feedback;
    
    if (feedback && feedback !== typewriterText && !isLoading) {
      setIsTyping(true);
      setTypewriterText('');
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
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
      }, 30);
      
      return () => clearInterval(timer);
    }
  }, [feedbackData?.feedback, logData?.feedback, feedbackLoading, typewriterText]);

  const handleLogAnother = () => {
    setLocation(isActivity ? '/activity-log' : '/food-log');
  };

  const handleBackToDashboard = () => {
    setLocation('/dashboard');
  };

  if (!logData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <img 
            src={oniCelebrateImage} 
            alt="BiteBurst Mascot" 
            className="w-20 h-20 mx-auto"
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
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {logData.content.emojis.map((emoji: string, index: number) => (
              <div 
                key={index} 
                className={`text-center bb-emoji-bounce`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 ${theme.accentBg} ${theme.accentBorder} rounded-2xl flex items-center justify-center border-2 shadow-md`}>
                  <span className="text-4xl">{emoji}</span>
                </div>
              </div>
            ))}
          </div>
          {isActivity && (
            <div className="flex justify-center gap-3">
              {logData.durationMin && (
                <span className={`${theme.accentBg} ${theme.accentText} px-4 py-2 rounded-full font-bold flex items-center gap-2`}>
                  <span>⏱️</span> {logData.durationMin} min
                </span>
              )}
              {logData.mood && (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                  <span>😃</span> {logData.mood === 'happy' ? 'Felt great!' : logData.mood === 'ok' ? 'Okay' : 'Tired'}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }
    
    if (logData.entryMethod === 'text' && logData.content?.description) {
      return (
        <div className="space-y-4">
          <div className={`${theme.accentBg} ${theme.accentBorder} rounded-2xl px-6 py-4 border-2 text-center`}>
            <div className="text-2xl mb-2">{isActivity ? '🏃' : '📝'}</div>
            <p className="text-lg font-medium text-gray-800">"{logData.content.description}"</p>
          </div>
          {isActivity && logData.durationMin && (
            <div className="flex justify-center">
              <span className={`${theme.accentBg} ${theme.accentText} px-4 py-2 rounded-full font-bold`}>
                ⏱️ {logData.durationMin} min
              </span>
            </div>
          )}
        </div>
      );
    }
    
    if (logData.entryMethod === 'photo') {
      return (
        <div className="text-center">
          {logData.content?.photoUrl ? (
            <img 
              src={logData.content.photoUrl} 
              alt="Logged meal photo" 
              className={`w-32 h-32 object-cover rounded-2xl shadow-lg border-2 ${theme.accentBorder} mx-auto`}
            />
          ) : (
            <div className={`w-32 h-32 ${theme.accentBg} ${theme.accentBorder} rounded-2xl mx-auto flex items-center justify-center border-2 shadow-lg`}>
              <span className="text-4xl">📷</span>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className={`sticky top-0 z-40 bg-gradient-to-r ${theme.primary} text-white px-4 py-4`}>
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToDashboard}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft size={20} />
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-xl font-black">{theme.headerText}</span>
            <span className="text-2xl">{theme.headerEmoji}</span>
          </div>

          <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full">
            <span className="bb-flame-pulse text-lg">🔥</span>
            <span className="font-bold text-sm">{(user as any)?.streak || 5}</span>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-5 max-w-md mx-auto">
        <div className="text-center pt-4">
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-8 text-2xl bb-star-float" style={{ animationDelay: '0s' }}>⭐</div>
            <div className="absolute -top-2 -right-6 text-xl bb-star-float" style={{ animationDelay: '0.3s' }}>{isActivity ? '💪' : '✨'}</div>
            <div className="absolute top-8 -left-10 text-lg bb-star-float" style={{ animationDelay: '0.6s' }}>✨</div>
            <div className="absolute top-6 -right-8 text-xl bb-star-float" style={{ animationDelay: '0.9s' }}>{isActivity ? '⚡' : '⭐'}</div>

            <img
              src={isActivity ? oniProudImage : oniCelebrateImage}
              alt="Oni the Orange celebrating"
              className={`w-36 h-36 mx-auto object-contain ${showCelebration ? 'bb-mascot-bounce-success' : ''}`}
            />
          </div>

          <h1 className={`text-3xl font-black text-gray-800 mt-4 ${showCelebration ? 'bb-slide-in' : ''}`}>
            {theme.title} {theme.titleEmoji}
          </h1>
        </div>

        <div className={`bg-white rounded-3xl border-2 ${theme.accentBorder} shadow-xl p-5 bb-card-hover bb-slide-up`}>
          <h3 className="text-center font-bold text-gray-700 mb-4">What you logged:</h3>
          {renderContent()}
        </div>

        <div className={`bg-gradient-to-br ${theme.accentGradient} rounded-3xl border-2 ${theme.accentBorder} shadow-xl p-5 bb-slide-up`} style={{ animationDelay: '0.2s' }}>
          <div className="text-center">
            <div ref={xpValueRef} className={`text-4xl font-black ${theme.accentText} bb-xp-glow mb-1`}>
              +{awardXP} XP
            </div>
            <p className="text-gray-600 text-sm mb-4">Experience points earned!</p>

            <div className="bb-progress mb-2">
              <div ref={xpBarRef} className={`bb-progress-bar ${isActivity ? 'bg-blue-500' : ''}`} style={{ width: '0%' }}></div>
            </div>

            <div className="bb-level-pills">
              <span ref={levelFromRef} className={`bb-level-pill ${isActivity ? 'border-blue-500 text-blue-500' : ''}`}>
                {formatLevel(levelFromTotal(currentTotalXP).level + 1)}
              </span>
              <span ref={levelToRef} className={`bb-level-pill ${isActivity ? 'border-blue-500 text-blue-500' : ''}`}>
                {formatLevel(levelFromTotal(currentTotalXP).level + 2)}
              </span>
            </div>
          </div>
        </div>

        {showStreakPill && (
          <div className="flex justify-center bb-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className={`bg-gradient-to-r ${theme.streakGradient} text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2`}>
              <span className="text-lg bb-flame-pulse">🔥</span>
              <span className="font-bold">{(user as any)?.streak || 5}-day streak!</span>
              <span className="text-lg bb-flame-pulse">🔥</span>
            </div>
          </div>
        )}

        {showBadgePill && newBadges.length > 0 && (
          <div className="flex justify-center bb-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="text-lg">🏅</span>
              <span className="font-bold">{newBadges[0]} unlocked!</span>
            </div>
          </div>
        )}

        <div className="bb-slide-up bb-bubble-appear" style={{ animationDelay: '0.6s' }}>
          <div className="flex justify-center mb-3">
            <img 
              src={theme.mascotImage} 
              alt={isActivity ? 'Coach Flex' : 'Captain Carrot'}
              className="w-16 h-16 object-contain drop-shadow-lg"
            />
          </div>
          
          <div className={`relative bg-white rounded-3xl border-2 ${isActivity ? 'border-blue-100' : 'border-orange-100'} shadow-lg p-5`}>
            <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white`}></div>
            <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] ${isActivity ? 'border-b-blue-100' : 'border-b-orange-100'}`}></div>
            
            <h3 className="font-bold text-gray-800 mb-3 text-lg text-center">
              {theme.mascotLabel}
            </h3>
            
            {isLoading ? (
              <div className="text-center text-gray-500 py-4">
                <div className={`animate-spin w-6 h-6 border-3 ${isActivity ? 'border-blue-500' : 'border-orange-500'} border-t-transparent rounded-full mx-auto mb-2`}></div>
                <p className="text-sm">Getting your personalized feedback...</p>
              </div>
            ) : feedback ? (
              <div className="relative">
                <p className={`text-base text-gray-700 leading-relaxed text-center ${isTyping ? 'bb-typewriter' : ''}`}>
                  {typewriterText || feedback}
                </p>
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 bg-gray-700 ml-0.5 animate-pulse"></span>
                )}
              </div>
            ) : (
              <p className="text-base text-gray-700 leading-relaxed text-center">
                {isActivity 
                  ? "Great job staying active! Keep moving and having fun!" 
                  : "Great food choices! You're fueling your body with awesome stuff!"}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Button
            onClick={handleLogAnother}
            className={`w-full ${isActivity ? 'bg-blue-500 hover:bg-blue-600' : 'bg-orange-500 hover:bg-orange-600'} text-white h-14 text-base font-bold uppercase tracking-wider shadow-lg`}
            style={{ borderRadius: '16px' }}
          >
            <RotateCcw size={20} className="mr-2" />
            {isActivity ? 'LOG ANOTHER ACTIVITY' : 'LOG ANOTHER MEAL'}
          </Button>
          
          <Button
            onClick={handleBackToDashboard}
            variant="outline"
            className={`w-full border-2 ${isActivity ? 'border-blue-500 text-blue-500 hover:bg-blue-50' : 'border-orange-500 text-orange-500 hover:bg-orange-50'} h-14 text-base font-bold uppercase tracking-wider`}
            style={{ borderRadius: '16px' }}
          >
            <Home size={20} className="mr-2" />
            BACK TO DASHBOARD
          </Button>
        </div>
      </div>
    </div>
  );
}
