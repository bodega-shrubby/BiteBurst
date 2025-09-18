import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LessonAsking, LessonSuccess, LessonIncorrect, LessonLearn, ProgressBar } from './components';

interface LessonPlayerProps {
  lessonId: string;
}

type LessonState = 'asking' | 'incorrect' | 'learn' | 'success' | 'complete';

interface LessonStep {
  id: string;
  stepNumber: number;
  questionType: 'multiple-choice' | 'true-false' | 'matching' | 'label-reading' | 'ordering';
  question: string;
  content: {
    options?: Array<{ id: string; text: string; emoji?: string; correct?: boolean }>;
    correctAnswer?: string | boolean;
    feedback?: string;
    matchingPairs?: Array<{ left: string; right: string }>;
    labelOptions?: Array<{ id: string; name: string; sugar: string; fiber: string; protein: string; correct?: boolean }>;
    orderingItems?: Array<{ id: string; text: string; correctOrder: number }>;
  };
  xpReward: number;
  mascotAction?: string;
  retryConfig?: {
    maxAttempts: number;
    xp: { firstTry: number; secondTry: number; learnCard: number };
    messages: {
      tryAgain1: string;
      tryAgain2?: string;
      learnCard: string;
    };
  };
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  totalSteps: number;
  steps: LessonStep[];
}

export default function LessonPlayer({ lessonId }: LessonPlayerProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lessonState, setLessonState] = useState<LessonState>('asking');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [lives, setLives] = useState(5);
  // Removed redundant hearts state - using lives for consistency
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [showContinueButton, setShowContinueButton] = useState(false);
  
  // Retry flow state
  const [currentAttempt, setCurrentAttempt] = useState(1); // 1, 2, or 3 (learn card)
  const [bannerAttempt, setBannerAttempt] = useState<1 | 2>(1); // Track which banner to show
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);


  // Fetch lesson data with cache invalidation
  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['/api/lessons', lessonId],
    queryFn: () => apiRequest(`/api/lessons/${lessonId}?v=2`),
    enabled: !!lessonId,
    staleTime: 0,
  });

  // Analytics logging mutation
  const logAttemptMutation = useMutation({
    mutationFn: async (attemptData: {
      lessonId: string;
      stepId: string;
      stepNumber: number;
      attemptNumber: number;
      isCorrect: boolean;
      selectedAnswer: string;
      timeOnStepMs: number;
      heartsRemaining: number;
      xpEarned: number;
      usedLearnCard: boolean;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      return apiRequest('/api/lessons/log-attempt', {
        method: 'POST',
        body: {
          userId: user.id,
          ...attemptData,
        }
      });
    },
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: async ({ stepId, answer }: { stepId: string; answer: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      return apiRequest('/api/lessons/answer', {
        method: 'POST',
        body: {
          userId: user.id,
          lessonId,
          stepId,
          answer,
        }
      });
    },
    onSuccess: (response) => {
      const timeOnStepMs = Date.now() - stepStartTime;
      setIsAnswerCorrect(response.correct);
      
      if (response.correct) {
        // Calculate XP based on current attempt (guarded)
        const xpEarned = currentStep ? (calculateXP(currentStep, currentAttempt) ?? 0) : (response.xpAwarded || 0);
        setTotalXpEarned(prev => prev + xpEarned);
        
        // Log successful attempt
        if (currentStep && selectedAnswer) {
          logAttemptMutation.mutate({
            lessonId,
            stepId: currentStep.id,
            stepNumber: currentStep.stepNumber,
            attemptNumber: currentAttempt,
            isCorrect: true,
            selectedAnswer,
            timeOnStepMs,
            heartsRemaining: lives,
            xpEarned,
            usedLearnCard: false
          });
        }
        
        setLessonState('success');
        // Show continue button after a delay
        setTimeout(() => setShowContinueButton(true), 1500);
      } else {
        // Handle incorrect answer - deduct life and show retry flow
        const heartsRemaining = Math.max(0, lives - 1);
        setLives(heartsRemaining);
        
        if (!currentStep?.retryConfig) {
          // Fall back to a simple two-step retry: one incorrect banner, then learn on next miss
          const nextAttempt = Math.min(currentAttempt + 1, 3);
          if (currentAttempt >= 2) {
            // Second miss without retryConfig - go to learn card
            const learnXP = calculateXP(currentStep, 3) ?? 0;
            setTotalXpEarned(prev => prev + learnXP);
            setLessonState('learn');
            
            // Log the incorrect attempt that triggered the learn card
            if (currentStep && selectedAnswer) {
              logAttemptMutation.mutate({
                lessonId,
                stepId: currentStep.id,
                stepNumber: currentStep.stepNumber,
                attemptNumber: currentAttempt,
                isCorrect: false,
                selectedAnswer,
                timeOnStepMs,
                heartsRemaining: heartsRemaining,
                xpEarned: 0,
                usedLearnCard: false
              });
            }
            
            // Log learn card usage
            if (currentStep && selectedAnswer) {
              logAttemptMutation.mutate({
                lessonId,
                stepId: currentStep.id,
                stepNumber: currentStep.stepNumber,
                attemptNumber: 3, // Standardize learn-card logs
                isCorrect: false,
                selectedAnswer: 'learn-card-shown',
                timeOnStepMs,
                heartsRemaining: heartsRemaining,
                xpEarned: learnXP,
                usedLearnCard: true
              });
            }
          } else {
            // First miss without retryConfig - show incorrect banner  
            setLessonState('incorrect');
            setBannerAttempt(1);
            setCurrentAttempt(nextAttempt);
            setHasSelectionChanged(false);
            
            // Log the first incorrect attempt
            if (currentStep && selectedAnswer) {
              logAttemptMutation.mutate({
                lessonId,
                stepId: currentStep.id,
                stepNumber: currentStep.stepNumber,
                attemptNumber: currentAttempt,
                isCorrect: false,
                selectedAnswer,
                timeOnStepMs,
                heartsRemaining: heartsRemaining,
                xpEarned: 0,
                usedLearnCard: false
              });
            }
          }
          return;
        }
        
        const maxAttempts = currentStep.retryConfig.maxAttempts ?? 3;
        const nextAttempt = Math.min(currentAttempt + 1, 3);

        // Check if max attempts exceeded - route to learn card immediately
        if (currentAttempt >= maxAttempts) {
          const learnXP = calculateXP(currentStep, 3) ?? 0; // Guard against undefined
          setTotalXpEarned(prev => prev + learnXP);
          setLessonState('learn');
          
          // Log the incorrect attempt that triggered the learn card
          if (currentStep && selectedAnswer) {
            logAttemptMutation.mutate({
              lessonId,
              stepId: currentStep.id,
              stepNumber: currentStep.stepNumber,
              attemptNumber: currentAttempt,
              isCorrect: false,
              selectedAnswer,
              timeOnStepMs,
              heartsRemaining: heartsRemaining,
              xpEarned: 0,
              usedLearnCard: false
            });
          }
          
          // Log learn card usage
          if (currentStep && selectedAnswer) {
            logAttemptMutation.mutate({
              lessonId,
              stepId: currentStep.id,
              stepNumber: currentStep.stepNumber,
              attemptNumber: 3, // Standardize learn-card logs to attempt 3
              isCorrect: false,
              selectedAnswer: 'learn-card-shown',
              timeOnStepMs,
              heartsRemaining: heartsRemaining,
              xpEarned: learnXP,
              usedLearnCard: true
            });
          }
          return;
        }
        
        // Log incorrect attempt
        if (currentStep && selectedAnswer) {
          logAttemptMutation.mutate({
            lessonId,
            stepId: currentStep.id,
            stepNumber: currentStep.stepNumber,
            attemptNumber: currentAttempt,
            isCorrect: false,
            selectedAnswer,
            timeOnStepMs,
            heartsRemaining: heartsRemaining,
            xpEarned: 0,
            usedLearnCard: false
          });
        }
        
        // Show appropriate incorrect banner based on attempt
        if (currentAttempt === 1) {
          setLessonState('incorrect');
          setBannerAttempt(1);
          setCurrentAttempt(2);
          setHasSelectionChanged(false);
        } else if (currentAttempt === 2) {
          if (currentStep.retryConfig.messages.tryAgain2) {
            setLessonState('incorrect');
            setBannerAttempt(2);
            setCurrentAttempt(3);
            setHasSelectionChanged(false);
          } else {
            // No second message - go to learn card
            const learnXP = calculateXP(currentStep, 3) ?? 0;
            setTotalXpEarned(prev => prev + learnXP);
            setLessonState('learn');
            
            if (currentStep && selectedAnswer) {
              logAttemptMutation.mutate({
                lessonId,
                stepId: currentStep.id,
                stepNumber: currentStep.stepNumber,
                attemptNumber: 3,
                isCorrect: false,
                selectedAnswer: 'learn-card-shown',
                timeOnStepMs,
                heartsRemaining: heartsRemaining,
                xpEarned: learnXP,
                usedLearnCard: true
              });
            }
          }
        } else {
          // Final attempt - show learn card
          const learnXP = calculateXP(currentStep, 3) ?? 0;
          setTotalXpEarned(prev => prev + learnXP);
          setLessonState('learn');
          
          if (currentStep && selectedAnswer) {
            logAttemptMutation.mutate({
              lessonId,
              stepId: currentStep.id,
              stepNumber: currentStep.stepNumber,
              attemptNumber: 3, // Standardize learn-card logs
              isCorrect: false,
              selectedAnswer: 'learn-card-shown',
              timeOnStepMs,
              heartsRemaining: heartsRemaining,
              xpEarned: learnXP,
              usedLearnCard: true
            });
          }
        }
      }
    }
  });

  const currentStep = lessonData?.steps[currentStepIndex];
  const progress = lessonData ? ((currentStepIndex + 1) / lessonData.totalSteps) * 100 : 0;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setHasSelectionChanged(true);
  };

  // Calculate XP based on current attempt and retryConfig
  const calculateXP = (step: LessonStep, attempt: number): number => {
    if (!step.retryConfig) return step.xpReward; // Fallback to original XP
    
    if (attempt === 1) return step.retryConfig.xp.firstTry;
    if (attempt === 2) return step.retryConfig.xp.secondTry;
    return step.retryConfig.xp.learnCard; // Attempt 3 (learn card)
  };

  // Get retry message based on attempt number (resilient)
  const getRetryMessage = (step: LessonStep, attempt: 1 | 2): string => {
    const msgs = step.retryConfig?.messages;
    if (!msgs) return "Try again!";
    if (attempt === 1) return msgs.tryAgain1 || "Try again!";
    return msgs.tryAgain2 || msgs.tryAgain1 || "Try again!";
  };

  // Reset state for next step
  const resetForNextStep = () => {
    setCurrentStepIndex(prev => prev + 1);
    setLessonState('asking');
    setSelectedAnswer(null);
    setShowContinueButton(false);
    setCurrentAttempt(1);
    setBannerAttempt(1);
    setStepStartTime(Date.now());
    setHasSelectionChanged(false);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !currentStep) return;
    
    submitAnswerMutation.mutate({
      stepId: currentStep.id,
      answer: selectedAnswer
    });
  };

  const handleContinue = () => {
    if (currentStepIndex < (lessonData?.totalSteps || 0) - 1) {
      // Move to next step
      resetForNextStep();
    } else {
      // Lesson complete
      setLessonState('complete');
    }
  };

  // Handle "Try Again" from incorrect banner
  const handleTryAgain = () => {
    setLessonState('asking');
    setSelectedAnswer(null);
    setHasSelectionChanged(false);
    // bannerAttempt remains the same for proper messaging
  };

  // Handle "Continue" from learn card (skip to next step)
  const handleLearnContinue = () => {
    if (currentStepIndex < (lessonData?.totalSteps || 0) - 1) {
      resetForNextStep();
    } else {
      setLessonState('complete');
    }
  };

  const handleClose = () => {
    setLocation('/lessons');
  };

  // Reset step start time when step changes
  useEffect(() => {
    setStepStartTime(Date.now());
  }, [currentStepIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex items-center justify-center">
        <div className="text-lg font-semibold text-gray-600">Loading lesson...</div>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex items-center justify-center">
        <div className="text-lg font-semibold text-red-600">Lesson not found</div>
      </div>
    );
  }

  if (lessonState === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">🏆</div>
          <h1 className="text-2xl font-bold text-gray-900">Lesson Complete!</h1>
          <p className="text-gray-600">
            You earned {totalXpEarned} XP completing "{lessonData.title}"
          </p>
          <div className="space-y-3">
            <Button
              onClick={handleClose}
              className="w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white h-12 text-base font-bold"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          data-testid="close-lesson"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="flex-1 mx-4">
          <ProgressBar progress={progress} />
        </div>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-6 h-6 ${
                i < lives ? 'text-red-500 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="flex-1 px-4 py-6">
        {lessonState === 'asking' && currentStep && (
          <LessonAsking
            step={currentStep}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onCheck={handleCheckAnswer}
            isSubmitting={submitAnswerMutation.isPending}
            canCheck={!!selectedAnswer && hasSelectionChanged}
          />
        )}
        
        {lessonState === 'incorrect' && currentStep && (
          <LessonIncorrect
            message={getRetryMessage(currentStep, bannerAttempt)}
            onTryAgain={handleTryAgain}
            canTryAgain={true}
          />
        )}
        
        {lessonState === 'learn' && currentStep && (
          <LessonLearn
            message={currentStep.retryConfig?.messages.learnCard || "Let's learn more about this!"}
            onContinue={handleLearnContinue}
          />
        )}
        
        {lessonState === 'success' && currentStep && (
          <LessonSuccess
            step={currentStep}
            selectedAnswer={selectedAnswer}
            xpEarned={calculateXP(currentStep, currentAttempt) ?? 0}
            onContinue={handleContinue}
            showContinueButton={showContinueButton}
          />
        )}
      </div>
    </div>
  );
}