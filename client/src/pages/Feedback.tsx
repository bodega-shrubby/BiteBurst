import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';
import * as confettiModule from 'canvas-confetti';
import oniCelebrateImage from '@assets/Mascots/Oni_celebrate.png';
import oniProudImage from '@assets/Mascots/Oni_proud.png';
import captainCarrot from '@assets/Mascots/CaptainCarrot.png';
import coachFlex from '@assets/Mascots/CoachFlex.png';
import SuccessSidebar from '@/components/success/SuccessSidebar';
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

  const theme = isActivity ? {
    headerBg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    cardBorder: 'border-blue-200',
    accentBg: 'from-blue-50 to-indigo-50',
    accentColor: 'text-blue-500',
    streakBg: 'from-blue-500 to-indigo-600',
    buttonBg: 'bg-blue-500 hover:bg-blue-600',
    buttonOutline: 'border-blue-500 text-blue-500 hover:bg-blue-50',
    title: "Fantastic way to keep active!",
    headerText: 'YOU CRUSHED IT!',
    headerEmoji: '💪'
  } : {
    headerBg: 'bg-gradient-to-r from-orange-500 to-orange-600',
    cardBorder: 'border-orange-200',
    accentBg: 'from-orange-50 to-amber-50',
    accentColor: 'text-orange-500',
    streakBg: 'from-orange-500 to-red-500',
    buttonBg: 'bg-orange-500 hover:bg-orange-600',
    buttonOutline: 'border-orange-500 text-orange-500 hover:bg-orange-50',
    title: "Awesome meal choice!",
    headerText: 'AMAZING!',
    headerEmoji: '🎉'
  };

  const tipMascot = isActivity ? coachFlex : captainCarrot;
  const tipName = isActivity ? 'Coach Flex' : 'Captain Carrot';
  const oniImage = isActivity ? oniProudImage : oniCelebrateImage;
  const bounceClass = isActivity ? 'oni-celebrate-energetic' : 'oni-celebrate';

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
      ? ['#3B82F6', '#10B981', '#8B5CF6', '#06B6D4']
      : ['#FF6A00', '#FFB800', '#FF4444', '#22C55E'];

    confetti({
      particleCount: 100,
      spread: 80,
      colors,
      origin: { y: 0.3 }
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
  const isLoadingFeedback = feedbackLoading && !logData.feedback;

  const renderContent = () => {
    const emojiLabels: Record<string, string> = {
      '🍎': 'Apple', '🥕': 'Carrots', '🥛': 'Milk', '🥪': 'Sandwich',
      '🍌': 'Banana', '🥦': 'Broccoli', '🍊': 'Orange', '🥗': 'Salad',
      '🥚': 'Eggs', '🍞': 'Bread', '🧀': 'Cheese', '🍗': 'Chicken',
      '🥑': 'Avocado', '🍇': 'Grapes', '🍓': 'Strawberry', '🥜': 'Nuts',
      '⚽': 'Soccer', '🏃': 'Running', '🚴': 'Cycling', '🏊': 'Swimming',
      '🏀': 'Basketball', '🎾': 'Tennis', '💃': 'Dancing', '🧘': 'Yoga',
      '🤸': 'Gymnastics', '⛹️': 'Sports', '🚶': 'Walking', '🧗': 'Climbing'
    };

    if (logData.entryMethod === 'emoji' && logData.content?.emojis) {
      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {logData.content.emojis.map((emoji: string, index: number) => {
              const label = emojiLabels[emoji] || (isActivity ? 'Activity' : 'Food');
              return (
                <div
                  key={index}
                  className="text-center bb-emoji-bounce"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${isActivity ? 'from-blue-50 to-blue-100 border-blue-300' : 'from-orange-50 to-orange-100 border-orange-300'} rounded-2xl flex items-center justify-center border-2 shadow-md`}>
                    <span className="text-4xl">{emoji}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 font-medium">{label}</p>
                </div>
              );
            })}
          </div>

          {isActivity && (
            <div className="flex justify-center gap-3 pt-2">
              {logData.durationMin && (
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm">
                  ⏱️ {logData.durationMin} min
                </span>
              )}
              {logData.mood && (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm">
                  😃 {logData.mood === 'happy' ? 'Felt great!' : logData.mood === 'ok' ? 'Okay' : 'Tired'}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }
    
    if (logData.entryMethod === 'text' && logData.content?.description) {
      return (
        <div className={`${isActivity ? 'bg-blue-50 border-blue-300' : 'bg-orange-50 border-orange-300'} rounded-xl px-6 py-4 border-2 text-center`}>
          <p className="text-lg font-medium text-gray-800">"{logData.content.description}"</p>
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
              className={`w-32 h-32 object-cover rounded-xl shadow-lg border-2 ${isActivity ? 'border-blue-300' : 'border-orange-300'} mx-auto`}
            />
          ) : (
            <div className={`w-32 h-32 ${isActivity ? 'bg-blue-50 border-blue-300' : 'bg-orange-50 border-orange-300'} rounded-xl mx-auto flex items-center justify-center border-2 shadow-lg`}>
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
      <div className="h-screen flex">
        <div className="hidden lg:block">
          <SuccessSidebar isActivity={isActivity} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className={`sticky top-0 z-40 ${theme.headerBg} text-white px-4 py-4 lg:px-8 lg:py-6`}>
            <div className="flex items-center justify-between max-w-2xl mx-auto lg:max-w-none">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="text-white hover:bg-white/20 p-2 lg:flex lg:items-center lg:gap-2"
              >
                <ArrowLeft size={20} />
                <span className="hidden lg:inline font-medium">Back</span>
              </Button>
              
              <div className="flex items-center gap-2 lg:gap-3">
                <span className="text-xl lg:text-2xl font-black tracking-wide">{theme.headerText}</span>
                <span className="text-2xl lg:text-3xl">{theme.headerEmoji}</span>
              </div>

              <div className="flex items-center gap-1 lg:gap-2 bg-white/20 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full">
                <span className="flame-pulse text-lg lg:text-xl">🔥</span>
                <span className="font-bold text-sm">{(user as any)?.streak || 5}</span>
              </div>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto bg-gray-50 lg:bg-white">
              <div className="p-5 lg:p-8 space-y-5 lg:space-y-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="absolute -top-6 -left-12 text-3xl star-float" style={{ animationDelay: '0s' }}>⭐</div>
                    <div className="absolute -top-4 -right-10 text-2xl star-float" style={{ animationDelay: '0.3s' }}>{isActivity ? '💪' : '✨'}</div>
                    <div className="absolute top-10 -left-14 text-2xl star-float" style={{ animationDelay: '0.6s' }}>🌟</div>
                    <div className="absolute top-8 -right-12 text-2xl star-float" style={{ animationDelay: '0.9s' }}>{isActivity ? '⚡' : '⭐'}</div>

                    <img
                      src={oniImage}
                      alt="Oni the Orange celebrating"
                      className={`w-36 h-36 lg:w-44 lg:h-44 mx-auto object-contain ${showCelebration ? bounceClass : 'opacity-0'}`}
                    />
                  </div>

                  <h1 className={`text-3xl lg:text-4xl font-black text-gray-800 mt-6 ${showCelebration ? 'text-pop' : 'opacity-0'}`}>
                    {theme.title}
                  </h1>
                </div>

                <div className={`bg-white rounded-3xl border-2 ${theme.cardBorder} shadow-xl p-5 lg:p-6 card-hover transition-all duration-300 slide-up`} style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-center font-bold text-gray-700 text-lg mb-4">What you logged:</h3>
                  {renderContent()}
                </div>

                <div className={`bg-gradient-to-br ${theme.accentBg} rounded-3xl border-2 ${theme.cardBorder} shadow-xl p-5 lg:p-6 slide-up`} style={{ animationDelay: '0.5s' }}>
                  <div className="text-center">
                    <div ref={xpValueRef} className={`text-4xl font-black ${theme.accentColor} xp-glow mb-2`}>
                      +{awardXP} XP
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Experience points earned!</p>

                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div 
                        ref={xpBarRef}
                        className={`absolute inset-0 rounded-full progress-fill ${isActivity ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`} 
                        style={{ width: '0%' }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span ref={levelFromRef} className={`px-3 py-1 rounded-full font-bold border ${isActivity ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-orange-100 text-orange-600 border-orange-200'}`}>
                        {formatLevel(levelFromTotal(currentTotalXP).level + 1)}
                      </span>
                      <span ref={levelToRef} className={`px-3 py-1 rounded-full font-bold border ${isActivity ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-orange-100 text-orange-600 border-orange-200'}`}>
                        {formatLevel(levelFromTotal(currentTotalXP).level + 2)}
                      </span>
                    </div>
                  </div>
                </div>

                {showStreakPill && (
                  <div className="flex justify-center slide-up" style={{ animationDelay: '0.7s' }}>
                    <div className={`bg-gradient-to-r ${theme.streakBg} text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2`}>
                      <span className="flame-pulse text-2xl">🔥</span>
                      <span className="font-black text-lg">{(user as any)?.streak || 5}-DAY STREAK!</span>
                      <span className="flame-pulse text-2xl">🔥</span>
                    </div>
                  </div>
                )}

                {showBadgePill && newBadges.length > 0 && (
                  <div className="flex justify-center slide-up" style={{ animationDelay: '0.8s' }}>
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                      <span className="text-2xl">🏅</span>
                      <span className="font-black text-lg">{newBadges[0]} unlocked!</span>
                    </div>
                  </div>
                )}

                <div className="lg:hidden slide-up" style={{ animationDelay: '0.9s' }}>
                  <div className="flex justify-center mb-3">
                    <img 
                      src={tipMascot} 
                      alt={tipName}
                      className="w-16 h-16 object-contain drop-shadow-lg"
                    />
                  </div>
                  
                  <div className={`relative bg-white rounded-3xl border-2 ${isActivity ? 'border-blue-100' : 'border-orange-100'} shadow-lg p-5 bubble-appear`}>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white"></div>
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] ${isActivity ? 'border-b-blue-100' : 'border-b-orange-100'}`}></div>
                    
                    <h3 className="font-bold text-gray-800 mb-3 text-center text-lg">
                      {tipName} says:
                    </h3>
                    
                    {isLoadingFeedback ? (
                      <div className="text-center text-gray-500 py-4">
                        <div className={`animate-spin w-6 h-6 border-3 ${isActivity ? 'border-blue-500' : 'border-orange-500'} border-t-transparent rounded-full mx-auto mb-2`}></div>
                        <p className="text-sm">Getting your personalized feedback...</p>
                      </div>
                    ) : feedback ? (
                      <div>
                        <p className="text-gray-700 text-center leading-relaxed">
                          {typewriterText || feedback}
                          {isTyping && <span className="inline-block w-0.5 h-5 bg-gray-700 ml-0.5 animate-pulse"></span>}
                        </p>
                        <p className="text-center mt-3">
                          <span className={`font-bold ${isActivity ? 'text-blue-500' : 'text-orange-500'}`}>
                            {isActivity ? 'Keep it up, champion!' : 'SUPER COMBO!'}
                          </span> {isActivity ? '🏆' : '⭐'}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 text-center leading-relaxed">
                          {isActivity 
                            ? "Great job staying active! Keep moving and having fun!" 
                            : "Great food choices! You're fueling your body with awesome stuff!"}
                        </p>
                        <p className="text-center mt-3">
                          <span className={`font-bold ${isActivity ? 'text-blue-500' : 'text-orange-500'}`}>
                            {isActivity ? 'Keep it up, champion!' : 'SUPER COMBO!'}
                          </span> {isActivity ? '🏆' : '⭐'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button
                    onClick={handleLogAnother}
                    className={`w-full ${theme.buttonBg} text-white h-14 text-base font-bold uppercase tracking-wider shadow-lg rounded-2xl btn-press`}
                  >
                    <RotateCcw size={20} className="mr-2" />
                    {isActivity ? 'LOG ANOTHER ACTIVITY' : 'LOG ANOTHER MEAL'}
                  </Button>
                  
                  <Button
                    onClick={handleBackToDashboard}
                    variant="outline"
                    className={`w-full border-2 ${theme.buttonOutline} h-14 text-base font-bold uppercase tracking-wider rounded-2xl btn-press`}
                  >
                    <Home size={20} className="mr-2" />
                    BACK TO DASHBOARD
                  </Button>
                </div>
              </div>
            </main>

            <div className="hidden lg:block w-[280px] bg-gray-50 border-l border-gray-200 p-4 space-y-4 overflow-y-auto">
              <div className="flex justify-center">
                <img 
                  src={tipMascot} 
                  alt={tipName}
                  className="w-20 h-20 object-contain drop-shadow-lg"
                />
              </div>
              
              <div className={`relative bg-white rounded-2xl border-2 ${isActivity ? 'border-blue-100' : 'border-orange-100'} shadow-lg p-4 bubble-appear`}>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] ${isActivity ? 'border-b-blue-100' : 'border-b-orange-100'}`}></div>
                
                <h3 className="font-bold text-gray-800 mb-2 text-center text-sm">
                  {tipName} says:
                </h3>
                
                {isLoadingFeedback ? (
                  <div className="text-center text-gray-500 py-2">
                    <div className={`animate-spin w-5 h-5 border-2 ${isActivity ? 'border-blue-500' : 'border-orange-500'} border-t-transparent rounded-full mx-auto mb-2`}></div>
                    <p className="text-xs">Getting feedback...</p>
                  </div>
                ) : feedback ? (
                  <div>
                    <p className="text-gray-700 text-center leading-relaxed text-sm">
                      {typewriterText || feedback}
                      {isTyping && <span className="inline-block w-0.5 h-4 bg-gray-700 ml-0.5 animate-pulse"></span>}
                    </p>
                    <p className="text-center mt-2 text-sm">
                      <span className={`font-bold ${isActivity ? 'text-blue-500' : 'text-orange-500'}`}>
                        {isActivity ? 'Keep it up, champion!' : 'SUPER COMBO!'}
                      </span> {isActivity ? '🏆' : '⭐'}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 text-center leading-relaxed text-sm">
                      {isActivity 
                        ? "Great job staying active! Keep moving and having fun!" 
                        : "Great food choices! You're fueling your body with awesome stuff!"}
                    </p>
                    <p className="text-center mt-2 text-sm">
                      <span className={`font-bold ${isActivity ? 'text-blue-500' : 'text-orange-500'}`}>
                        {isActivity ? 'Keep it up, champion!' : 'SUPER COMBO!'}
                      </span> {isActivity ? '🏆' : '⭐'}
                    </p>
                  </div>
                )}
              </div>

              <div className={`bg-gradient-to-br ${theme.accentBg} rounded-2xl border ${isActivity ? 'border-blue-200' : 'border-orange-200'} p-4`}>
                <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                  <span>💡</span> Fun Fact
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {isActivity 
                    ? "Did you know? Just 30 minutes of exercise can boost your mood for up to 12 hours!" 
                    : "Did you know? Eating colorful fruits and veggies gives your body superpowers!"}
                </p>
              </div>

              {isActivity && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                  <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
                    <span>📊</span> This Week
                  </h3>
                  <div className="flex justify-between gap-1">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <div key={i} className="flex-1 text-center">
                        <div
                          className={`rounded-lg mb-1 ${i < ((user as any)?.streak || 5) ? 'bg-blue-500' : 'bg-gray-200'}`}
                          style={{ height: `${20 + (i < ((user as any)?.streak || 5) ? Math.random() * 30 : 0)}px` }}
                        />
                        <span className="text-xs text-gray-500">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-200 p-4">
                <h3 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2">
                  <span>🔥</span> Streak Power
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">{(user as any)?.streak || 5} days</span>
                  <div className="flex gap-0.5">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full ${i < ((user as any)?.streak || 5) ? (isActivity ? 'bg-blue-500' : 'bg-orange-500') : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
