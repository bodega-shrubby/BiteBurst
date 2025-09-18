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
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  // Debug state changes
  useEffect(() => {
    console.log('🔄 STATE CHANGED:', { lessonState, currentAttempt, currentStepId: currentStep?.id });
  }, [lessonState, currentAttempt]);

  // Fetch lesson data
  const { data: lessonData, isLoading } = useQuery({
    queryKey: ['/api/lessons', lessonId],
    queryFn: () => apiRequest(`/api/lessons/${lessonId}`),
    enabled: !!lessonId,
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
        // Calculate XP based on current attempt
        const xpEarned = currentStep ? calculateXP(currentStep, currentAttempt) : response.xpAwarded || 0;
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
        setLives(prev => Math.max(0, prev - 1));
        
        if (!currentStep?.retryConfig) {
          // No retry config - use old behavior
          setTimeout(() => {
            setSelectedAnswer(null);
            setHasSelectionChanged(false);
          }, 1500);
          return;
        }
        
        const maxAttempts = currentStep.retryConfig.maxAttempts;
        
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
            heartsRemaining: Math.max(0, lives - 1), // After deduction, clamped
            xpEarned: 0,
            usedLearnCard: false
          });
        }
        
        // SPEC FIX: Handle attempt 2 routing correctly
        console.log('🔥 DEBUG - Before state change:', { currentAttempt, lessonState, lives });
        
        if (currentAttempt === 1) {
          // First incorrect - always show try-again banner
          console.log('📍 Setting state to incorrect, attempt 1->2');
          setLessonState('incorrect');
          setCurrentAttempt(2);
          setHasSelectionChanged(false);
        } else if (currentAttempt === 2) {
          // Second incorrect - check if tryAgain2 message exists
          if (currentStep.retryConfig.messages.tryAgain2) {
            // Show try-again banner with second message
            console.log('📍 Setting state to incorrect, attempt 2->3');
            setLessonState('incorrect');
            setCurrentAttempt(3);
            setHasSelectionChanged(false);
          } else {
            // No second message - go straight to learn card
            console.log('📍 Setting state to learn (no tryAgain2)');
            const learnXP = calculateXP(currentStep, 3); // Should be 0
            setTotalXpEarned(prev => prev + learnXP);
            setLessonState('learn');
            
            // Log learn card usage
            if (currentStep && selectedAnswer) {
              logAttemptMutation.mutate({
                lessonId,
                stepId: currentStep.id,
                stepNumber: currentStep.stepNumber,
                attemptNumber: 3, // Learn card is attempt 3
                isCorrect: false,
                selectedAnswer: 'learn-card-shown',
                timeOnStepMs,
                heartsRemaining: Math.max(0, lives - 1), // After deduction, clamped
                xpEarned: learnXP,
                usedLearnCard: true
              });
            }
          }
        } else {
          // Third attempt or max attempts reached - show learn card
          console.log('📍 Setting state to learn (attempt 3+)');
          const learnXP = calculateXP(currentStep, 3); // Should be 0
          setTotalXpEarned(prev => prev + learnXP);
          console.log('🚀 ABOUT TO SET STATE TO LEARN - current state:', lessonState);
          setLessonState('learn');
          console.log('✅ CALLED setLessonState(learn)');
          
          // Log learn card usage
          if (currentStep && selectedAnswer) {
            logAttemptMutation.mutate({
              lessonId,
              stepId: currentStep.id,
              stepNumber: currentStep.stepNumber,
              attemptNumber: 3, // Learn card is attempt 3
              isCorrect: false,
              selectedAnswer: 'learn-card-shown',
              timeOnStepMs,
              heartsRemaining: Math.max(0, lives - 1), // After deduction, clamped
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

  // Get retry message based on attempt number
  const getRetryMessage = (step: LessonStep, attempt: number): string => {
    if (!step.retryConfig) return "Try again!";
    
    if (attempt === 1) return step.retryConfig.messages.tryAgain1;
    if (attempt === 2 && step.retryConfig.messages.tryAgain2) {
      return step.retryConfig.messages.tryAgain2;
    }
    return step.retryConfig.messages.tryAgain1; // Fallback to first message
  };

  // Reset state for next step
  const resetForNextStep = () => {
    setCurrentStepIndex(prev => prev + 1);
    setLessonState('asking');
    setSelectedAnswer(null);
    setShowContinueButton(false);
    setCurrentAttempt(1);
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
        {/* DEBUG: Show current state */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-yellow-100 text-xs">
            State: {lessonState} | Attempt: {currentAttempt} | HasChanged: {hasSelectionChanged ? 'Y' : 'N'}
          </div>
        )}
        
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
            message={getRetryMessage(currentStep, currentAttempt - 1)} // -1 because we already incremented
            onTryAgain={handleTryAgain}
            canTryAgain={true} // CRITICAL FIX: Always enable Try Again button
          />
        )}
        
        {lessonState === 'learn' && currentStep && (
          <>
            {console.log('🎓 RENDERING LEARN CARD:', { 
              lessonState, 
              currentStep: currentStep?.id, 
              message: currentStep.retryConfig?.messages.learnCard 
            })}
            <LessonLearn
              message={currentStep.retryConfig?.messages.learnCard || "Let's learn more about this!"}
              onContinue={handleLearnContinue}
            />
          </>
        )}
        
        {lessonState === 'learn' && !currentStep && (
          <div className="text-red-500">❌ LEARN STATE BUT NO CURRENT STEP</div>
        )}
        
        {lessonState !== 'asking' && lessonState !== 'incorrect' && lessonState !== 'learn' && lessonState !== 'success' && (
          <div className="text-red-500">❌ UNKNOWN STATE: {lessonState}</div>
        )}
        
        {lessonState === 'success' && currentStep && (
          <LessonSuccess
            step={currentStep}
            selectedAnswer={selectedAnswer}
            xpEarned={calculateXP(currentStep, currentAttempt)}
            onContinue={handleContinue}
            showContinueButton={showContinueButton}
          />
        )}
      </div>
    </div>
  );
}