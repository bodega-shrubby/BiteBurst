import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';
import mascotImage from '@assets/9ef8e8fe-158e-4518-bd1c-1325863aebca_1756365757940.png';
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
  const [animatedXP, setAnimatedXP] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // Simple leveling system: 100 XP per level
  const calculateLevel = (totalXP: number) => {
    const level = Math.floor(totalXP / 100) + 1;
    const currentLevelXP = totalXP % 100;
    const nextLevelXP = 100;
    const progressPercent = (currentLevelXP / nextLevelXP) * 100;
    
    return {
      level,
      currentLevelXP,
      nextLevelXP,
      progressPercent,
      levelFrom: level,
      levelTo: level + 1
    };
  };

  const startXPAnimation = (targetXP: number) => {
    console.log('startXPAnimation called with targetXP:', targetXP, 'user:', user);
    
    // Reset animated XP to 0 first
    setAnimatedXP(0);
    
    if (!user) {
      console.log('No user found, using fallback animation');
      // Simple fallback - just set the target XP directly after a delay
      setTimeout(() => {
        setAnimatedXP(targetXP);
        setProgressPercent(50);
      }, 300);
      return;
    }
    
    const currentUserXP = user.xp || 0;
    const newTotalXP = currentUserXP + targetXP;
    const levelInfo = calculateLevel(newTotalXP);
    
    console.log('Level info:', levelInfo);
    
    // Use a simpler animation approach with useState and setTimeout
    let currentValue = 0;
    const increment = Math.ceil(targetXP / 20); // 20 steps
    const stepDuration = 800 / 20; // Total 800ms divided by steps
    
    const animateStep = () => {
      currentValue = Math.min(currentValue + increment, targetXP);
      console.log('Step animation - currentValue:', currentValue);
      setAnimatedXP(currentValue);
      
      if (currentValue < targetXP) {
        setTimeout(animateStep, stepDuration);
      } else {
        // Start progress bar animation after XP finishes
        setTimeout(() => {
          setProgressPercent(levelInfo.progressPercent);
        }, 100);
      }
    };
    
    // Start the step animation after a small delay
    setTimeout(animateStep, 100);
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
    
    // Trigger celebration animation after component mounts
    const celebrationTimer = setTimeout(() => {
      setShowCelebration(true);
    }, 200);
    
    // Start XP animation separately after a longer delay to ensure component is fully rendered
    const xpTimer = setTimeout(() => {
      if (logData) {
        console.log('Starting XP animation with:', logData.xpAwarded);
        startXPAnimation(logData.xpAwarded);
      } else {
        console.log('No logData available for XP animation');
      }
    }, 1000);
    
    return () => {
      clearTimeout(celebrationTimer);
      clearTimeout(xpTimer);
    };
  }, []);

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

        {/* XP Award Section */}
        <section className="bb-card bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-[#FF6A00] rounded-3xl p-6" aria-live="polite">
          <div className="text-center mb-4">
            <div className={`bb-xp-value text-5xl font-bold text-[#FF6A00] mb-2 ${
              showCelebration ? 'bb-xp-animate' : ''
            }`}>
              +{animatedXP} XP
            </div>
            <div className="text-gray-600 text-sm">Experience points earned</div>
          </div>
          
          {user && (
            <>
              <div className="bb-progress bg-gray-200 h-3 rounded-full mb-3 overflow-hidden">
                <div 
                  className="bb-progress-bar h-full bg-gradient-to-r from-[#FF6A00] to-[#FF8A20] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              
              <div className="bb-level-meta flex justify-between text-sm text-gray-600">
                <span>Lv {calculateLevel(user.xp || 0).level}</span>
                <span>Lv {calculateLevel((user.xp || 0) + (logData?.xpAwarded || 0)).level}</span>
              </div>
            </>
          )}
        </section>

        {/* What You Logged */}
        <Card className="border-2 border-[#FF6A00] rounded-3xl">
          <CardContent className="p-6">
            <h3 className="text-center font-medium text-gray-600 mb-4">
              What you logged:
            </h3>
            {renderContent()}
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