import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useActiveChild } from '@/hooks/useActiveChild';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { X } from 'lucide-react';
import captainCarrotImage from '@assets/Mascots/CaptainCarrot.png';

function OrangeBurst({ filled = true, size = 20 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#FF6A00" : "#E5E5E5"}
      className={`transition-all duration-200 ${filled ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}
    >
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}
import { Button } from '@/components/ui/button';
import { LessonAsking, LessonSuccess, LessonIncorrect, LessonLearn, LessonComplete, ProgressBar, LessonContent } from './components';

interface LessonPlayerProps {
  lessonId: string;
}

type LessonState = 'intro' | 'lesson-content' | 'asking' | 'incorrect' | 'learn' | 'success' | 'complete';

type FeedbackType = string | { success?: string; hint_after_2?: string; motivating_fail?: string };

interface RememberCard {
  id: number;
  emoji: string;
  text: string;
}

interface LessonContentData {
  title: string;
  intro?: {
    greeting: string;
    message: string;
  };
  sections: Array<{
    emoji: string;
    color: 'blue' | 'green' | 'yellow' | 'cyan' | 'orange';
    heading: string;
    subEmoji: string;
    text: string;
  }>;
  keyPoints: string[];
  rememberCards?: RememberCard[];
  mascotMessage: string;
}

interface LessonStep {
  id: string;
  stepNumber: number;
  questionType: 'multiple-choice' | 'true-false' | 'matching' | 'label-reading' | 'ordering' | 'tap-pair' | 'fill-blank' | 'lesson-content';
  question: string;
  content: {
    options?: Array<{ id: string; text: string; emoji?: string; correct?: boolean }> | string[];
    correctAnswer?: string | boolean;
    correctPair?: string[];
    feedback?: FeedbackType;
    matchingPairs?: Array<{ left: string; right: string }>;
    pairs?: Array<{ left: string; right: string }>;
    labelOptions?: Array<{ id: string; name: string; sugar: string; fiber: string; protein: string; correct?: boolean }>;
    orderingItems?: Array<{ id: string; text: string; correctOrder: number }>;
    items?: Array<{ id: string; text: string; category: string }>;
    blanks?: Array<{ id: string; correctAnswer: string; hint?: string; acceptableAnswers?: string[] }>;
    sentence?: string;
    title?: string;
    intro?: { greeting: string; message: string };
    sections?: LessonContentData['sections'];
    keyPoints?: string[];
    mascotMessage?: string;
  };
  xpReward: number;
  mascotAction?: string;
  retryConfig?: {
    maxAttempts: number;
    hintAfterAttempt?: number;
    showAnswerAfterAttempt?: number;
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
  learningTakeaway?: string;
  mascotIntro?: string;
  mascotId?: string;
  orderInUnit?: number;
  iconEmoji?: string;
}

export default function LessonPlayer({ lessonId }: LessonPlayerProps) {
  const { user } = useAuth();
  const activeChild = useActiveChild(user);
  const [, setLocation] = useLocation();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lessonState, setLessonState] = useState<LessonState>('intro');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [lives, setLives] = useState(5);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [showContinueButton, setShowContinueButton] = useState(false);
  
  // Enhanced retry flow state machine
  const [currentAttempt, setCurrentAttempt] = useState(1); // 1, 2, or 3 (learn card)
  const [tryAgainMessage, setTryAgainMessage] = useState<string>(''); // Message for TRY_AGAIN state
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);
  const [lastSelectedAnswer, setLastSelectedAnswer] = useState<string | null>(null); // Track previous selection for change detection
  const [showRetryBanner, setShowRetryBanner] = useState(false); // Show hint banner after retry
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0); // Track correct answers for stats

  const getStepFeedbackMessage = (step: LessonStep | undefined, type: 'hint_after_2' | 'motivating_fail'): string | undefined => {
    if (!step) return undefined;

    if (type === 'hint_after_2') {
      const hint = (step.content as any).hint;
      if (hint) return hint;
    }
    if (type === 'motivating_fail') {
      const incorrectFb = (step.content as any).incorrectFeedback;
      if (incorrectFb) return incorrectFb;
    }

    const feedback = step.content.feedback;
    if (!feedback) return undefined;
    if (typeof feedback === 'string') return undefined;
    return type === 'hint_after_2' ? feedback.hint_after_2 : feedback.motivating_fail;
  };

  // Helper to get selected answer text for display in LessonIncorrect
  const getSelectedAnswerText = (step: LessonStep, answerId: string | null): string | undefined => {
    if (!answerId || !step.content.options) return undefined;
    const option = step.content.options.find(opt =>
      typeof opt === 'string' ? opt === answerId : opt.id === answerId
    );
    if (!option) return answerId;
    return typeof option === 'string' ? option : option.text;
  };

  // Helper to get selected answer emoji for display in LessonIncorrect
  const getSelectedAnswerEmoji = (step: LessonStep, answerId: string | null): string | undefined => {
    if (!answerId || !step.content.options) return undefined;
    const option = step.content.options.find(opt =>
      typeof opt === 'object' && opt.id === answerId
    );
    return option && typeof option === 'object' ? option.emoji : undefined;
  };

  // Helper to get correct answer text for LessonLearn
  const getCorrectAnswerText = (step: LessonStep): string | undefined => {
    if (step.content.options) {
      const correctOpt = step.content.options.find(opt => typeof opt === 'object' && opt.correct);
      return correctOpt && typeof correctOpt === 'object' ? correctOpt.text : undefined;
    }
    if (step.content.correctAnswer !== undefined) {
      return String(step.content.correctAnswer);
    }
    return undefined;
  };

  // Helper to get correct answer emoji for LessonLearn
  const getCorrectAnswerEmoji = (step: LessonStep): string | undefined => {
    if (step.content.options) {
      const correctOpt = step.content.options.find(opt => typeof opt === 'object' && opt.correct);
      return correctOpt && typeof correctOpt === 'object' ? correctOpt.emoji : undefined;
    }
    return undefined;
  };

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
      
      console.log('📝 Logging attempt:', { userId: user.id, childId: activeChild?.childId, ...attemptData });
      return apiRequest('/api/lessons/log-attempt', {
        method: 'POST',
        body: {
          userId: user.id,
          childId: activeChild?.childId, // For additional children
          ...attemptData,
        }
      });
    },
    onSuccess: () => {
      console.log('📝 Attempt logged successfully');
    },
    onError: (error) => {
      console.error('📝 Failed to log attempt:', error);
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
          childId: activeChild?.childId, // For additional children
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
        // ONLY award XP on SUCCESS state, scaled by attempts
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
        
        // Track correct answer for stats
        setCorrectAnswerCount(prev => prev + 1);
        
        // Transition to SUCCESS state
        setLessonState('success');
        // Show continue button after a delay
        setTimeout(() => setShowContinueButton(true), 1500);
      } else {
        // Handle incorrect answer - deduct life and show retry flow
        const heartsRemaining = Math.max(0, lives - 1);
        setLives(heartsRemaining);
        
        // Log the incorrect attempt first
        const prevAnswer = selectedAnswer; // Capture for logging
        if (currentStep && prevAnswer) {
          logAttemptMutation.mutate({
            lessonId,
            stepId: currentStep.id,
            stepNumber: currentStep.stepNumber,
            attemptNumber: currentAttempt,
            isCorrect: false,
            selectedAnswer: prevAnswer,
            timeOnStepMs,
            heartsRemaining: heartsRemaining,
            xpEarned: 0, // No XP on incorrect attempts
            usedLearnCard: false
          });
        }
        
        // Helper to extract feedback messages from content.feedback
        const getFeedbackMessage = (type: 'hint_after_2' | 'motivating_fail'): string | undefined => {
          const feedback = currentStep?.content?.feedback;
          if (!feedback) return undefined;
          if (typeof feedback === 'object') {
            return type === 'hint_after_2' ? feedback.hint_after_2 : feedback.motivating_fail;
          }
          return undefined;
        };
        
        if (!hasFullRetryConfig(currentStep?.retryConfig)) {
          if (currentAttempt === 1) {
            setLessonState('incorrect');
            setTryAgainMessage('Try again!');
            setCurrentAttempt(2);
            setSelectedAnswer(null);
            setHasSelectionChanged(false);
            setLastSelectedAnswer(null);
          } else if (currentAttempt === 2) {
            // Second attempt - use hint_after_2 if available
            const hintAfter2 = getFeedbackMessage('hint_after_2');
            if (hintAfter2) {
              setLessonState('incorrect');
              setTryAgainMessage(hintAfter2);
              setCurrentAttempt(3);
              setSelectedAnswer(null);
              setHasSelectionChanged(false);
              setLastSelectedAnswer(null);
            } else {
              // No hint_after_2, go directly to learn card
              setLessonState('learn');
              setSelectedAnswer(null);
              
              // Log learn card usage
              if (currentStep) {
                logAttemptMutation.mutate({
                  lessonId,
                  stepId: currentStep.id,
                  stepNumber: currentStep.stepNumber,
                  attemptNumber: 3,
                  isCorrect: false,
                  selectedAnswer: 'learn-card-shown',
                  timeOnStepMs,
                  heartsRemaining: heartsRemaining,
                  xpEarned: 0,
                  usedLearnCard: true
                });
              }
            }
          } else {
            // Third attempt failed - go to learn card
            setLessonState('learn');
            setSelectedAnswer(null);
            
            // Log learn card usage
            if (currentStep) {
              logAttemptMutation.mutate({
                lessonId,
                stepId: currentStep.id,
                stepNumber: currentStep.stepNumber,
                attemptNumber: 3,
                isCorrect: false,
                selectedAnswer: 'learn-card-shown',
                timeOnStepMs,
                heartsRemaining: heartsRemaining,
                xpEarned: 0, // No XP for fallback learn card
                usedLearnCard: true
              });
            }
          }
          return;
        }
        
        // Proper state machine with retryConfig
        const maxAttempts = currentStep.retryConfig.maxAttempts ?? 3;
        
        // State transitions based on current attempt and config
        if (currentAttempt === 1) {
          // First incorrect: ASK → TRY_AGAIN
          setLessonState('incorrect');
          setTryAgainMessage(currentStep.retryConfig.messages.tryAgain1 || 'Try again!');
          setCurrentAttempt(2);
          setSelectedAnswer(null);
          setHasSelectionChanged(false);
          setLastSelectedAnswer(null);
        } else if (currentAttempt === 2 && maxAttempts >= 3) {
          // Second incorrect and max attempts allows third: TRY_AGAIN → TRY_AGAIN (with different message) or LEARN_CARD
          // Use tryAgain2 from retryConfig or hint_after_2 from feedback
          const hintAfter2 = getFeedbackMessage('hint_after_2');
          const secondMessage = currentStep.retryConfig.messages.tryAgain2 || hintAfter2;
          if (secondMessage) {
            setLessonState('incorrect');
            setTryAgainMessage(secondMessage);
            setCurrentAttempt(3);
            setSelectedAnswer(null);
            setHasSelectionChanged(false);
            setLastSelectedAnswer(null);
          } else {
            // No second message - go directly to learn card with XP (but only awarded on SUCCESS)
            setLessonState('learn');
            setSelectedAnswer(null);
            
            // Log learn card usage
            if (currentStep) {
              logAttemptMutation.mutate({
                lessonId,
                stepId: currentStep.id,
                stepNumber: currentStep.stepNumber,
                attemptNumber: 3,
                isCorrect: false,
                selectedAnswer: 'learn-card-shown',
                timeOnStepMs,
                heartsRemaining: heartsRemaining,
                xpEarned: 0, // XP is awarded only on SUCCESS, not here
                usedLearnCard: true
              });
            }
          }
        } else {
          // Final incorrect (maxAttempts reached): TRY_AGAIN → learn card  
          setLessonState('learn');
          setSelectedAnswer(null);
          
          // Log learn card usage
          if (currentStep) {
            logAttemptMutation.mutate({
              lessonId,
              stepId: currentStep.id,
              stepNumber: currentStep.stepNumber,
              attemptNumber: 3,
              isCorrect: false,
              selectedAnswer: 'learn-card-shown',
              timeOnStepMs,
              heartsRemaining: heartsRemaining,
              xpEarned: 0, // XP is awarded only on SUCCESS, not here
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
    // In incorrect state, any selection after entering the state should enable the button
    if (lessonState === 'incorrect') {
      setHasSelectionChanged(true);
    } else {
      // Track selection changes for other states
      setHasSelectionChanged(answer !== lastSelectedAnswer);
    }
    setLastSelectedAnswer(answer);
  };

  const hasFullRetryConfig = (config: LessonStep['retryConfig']): boolean => {
    return !!config && !!config.xp && !!config.messages;
  };

  const calculateXP = (step: LessonStep, attempt: number): number => {
    if (!hasFullRetryConfig(step.retryConfig)) {
      return attempt === 1 ? step.xpReward : 0;
    }
    
    if (attempt === 1) return step.retryConfig!.xp.firstTry;
    if (attempt === 2) return step.retryConfig!.xp.secondTry;
    return step.retryConfig!.xp.learnCard;
  };

  // Calculate CHECK button state based on current lesson state and selection
  const getCanCheck = (): boolean => {
    // In asking state: allow check if answer selected
    if (lessonState === 'asking') {
      return !!selectedAnswer;
    }
    
    // In incorrect state: need both answer selected AND selection changed
    if (lessonState === 'incorrect') {
      return !!selectedAnswer && hasSelectionChanged;
    }
    
    // Other states don't use the CHECK button
    return false;
  };

  // Reset state for next step
  const resetForNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    const nextStep = lessonData?.steps[nextIndex];
    const nextState = nextStep?.questionType === 'lesson-content' ? 'lesson-content' : 'asking';
    
    setCurrentStepIndex(nextIndex);
    setLessonState(nextState);
    setSelectedAnswer(null);
    setShowContinueButton(false);
    setCurrentAttempt(1);
    setTryAgainMessage('');
    setStepStartTime(Date.now());
    setHasSelectionChanged(false);
    setLastSelectedAnswer(null);
    setShowRetryBanner(false);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer || !currentStep) return;
    
    submitAnswerMutation.mutate({
      stepId: currentStep.id,
      answer: selectedAnswer
    });
  };

  // Mutation to mark lesson as complete
  const markCompleteMutation = useMutation({
    mutationFn: async ({ lessonId, xpEarned }: { lessonId: string; xpEarned: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return apiRequest(`/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        body: { xpEarned, userId: user.id, childId: activeChild?.childId }
      });
    },
    onSuccess: () => {
      console.log('✅ Lesson marked as complete');
      // Invalidate all lesson and age-based queries so the next lessons show as unlocked
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          const key = query.queryKey[0];
          return typeof key === 'string' && (
            key.startsWith('/api/lessons') || 
            key.startsWith('/api/age')
          );
        }
      });
    },
    onError: (error) => {
      console.error('Failed to mark lesson complete:', error);
    }
  });

  const handleContinue = () => {
    if (currentStepIndex < (lessonData?.totalSteps || 0) - 1) {
      // Add a brief delay for smooth transition to next step
      setTimeout(() => {
        resetForNextStep();
      }, 400);
    } else {
      // Lesson complete - mark it in the database
      markCompleteMutation.mutate({ lessonId, xpEarned: totalXpEarned });
      setLessonState('complete');
    }
  };

  // Handle "Try Again" from incorrect state
  const handleTryAgain = () => {
    setLessonState('asking');
    setSelectedAnswer(null);
    setHasSelectionChanged(false);
    setLastSelectedAnswer(null);
    setStepStartTime(Date.now()); // Reset timing for retry attempt analytics
    setShowRetryBanner(true); // Show hint banner when returning to asking state
  };

  // Handle "Continue" from LEARN_CARD state (skip to next step, award XP)
  const handleLearnContinue = () => {
    // Award XP for completing via learn card (only here, not when showing the card)
    let finalXp = totalXpEarned;
    if (currentStep) {
      const learnXP = calculateXP(currentStep, 3) ?? 0;
      finalXp = totalXpEarned + learnXP;
      setTotalXpEarned(finalXp);
    }
    
    if (currentStepIndex < (lessonData?.totalSteps || 0) - 1) {
      resetForNextStep();
    } else {
      // Mark lesson as complete in database
      markCompleteMutation.mutate({ lessonId, xpEarned: finalXp });
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

  // Auto-transition from intro to lesson-content if first step is lesson-content type
  useEffect(() => {
    if (lessonData && lessonState === 'intro') {
      const firstStep = lessonData.steps[0];
      if (firstStep?.questionType === 'lesson-content') {
        setStepStartTime(Date.now());
        setLessonState('lesson-content');
      }
    }
  }, [lessonData, lessonState]);

  // Guard: if current step is lesson-content but we're in asking state, redirect
  useEffect(() => {
    if (lessonData && lessonState === 'asking') {
      const step = lessonData.steps[currentStepIndex];
      if (step?.questionType === 'lesson-content') {
        setLessonState('lesson-content');
      }
    }
  }, [lessonData, lessonState, currentStepIndex]);

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex items-center justify-center">
        <div className="text-lg font-semibold text-red-600">Lesson not found</div>
      </div>
    );
  }

  if (lessonState === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div>
            <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full font-medium">
              Lesson {lessonData.orderInUnit || 1}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-3">
              {lessonData.iconEmoji || '📚'} {lessonData.title}
            </h2>
            {lessonData.description && (
              <p className="text-gray-600 text-sm mt-1">
                {lessonData.description}
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-sm">
            <div className="w-32 h-32 mx-auto animate-bounce">
              <img
                src={captainCarrotImage}
                alt="Captain Carrot"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200 mt-4">
              <p className="text-gray-800 text-sm leading-relaxed">
                {lessonData.mascotIntro || "Hey Superhero! 🦸‍♀️ Let's learn something new today! Tap the healthy choices to power up!"}
              </p>
            </div>
          </div>

          {lessonData.learningTakeaway && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium mb-1">🎯 LEARNING GOAL</p>
              <p className="text-sm text-blue-800">"{lessonData.learningTakeaway}"</p>
            </div>
          )}

          <button
            onClick={() => setLessonState('asking')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-lg transition shadow-lg"
          >
            Let's Go! 🚀
          </button>
        </div>
      </div>
    );
  }

  if (lessonState === 'lesson-content') {
    const contentStep = lessonData.steps[currentStepIndex];
    if (!contentStep || contentStep.questionType !== 'lesson-content') {
      return null;
    }
    
    const getMascotInfo = () => {
      const defaultMascots: Record<string, { name: string; emoji: string }> = {
        'captain-carrot': { name: 'Captain Carrot', emoji: '🥕' },
        'brainy-bolt': { name: 'Brainy Bolt', emoji: '⚡' },
      };
      const mascotId = lessonData.mascotId || 'brainy-bolt';
      return defaultMascots[mascotId] || { name: 'Brainy Bolt', emoji: '⚡' };
    };
    
    return (
      <LessonContent
        title={contentStep.content.title || lessonData.title}
        mascot={getMascotInfo()}
        intro={contentStep.content.intro || {
          greeting: 'Hey there, superstar!',
          message: lessonData.mascotIntro || "Let's learn something new!"
        }}
        sections={contentStep.content.sections || []}
        keyPoints={contentStep.content.keyPoints || []}
        rememberCards={(contentStep.content as any).rememberCards || undefined}
        mascotMessage={contentStep.content.mascotMessage || "Let's see what you learned! 🎉"}
        currentStep={currentStepIndex + 1}
        totalSteps={lessonData.totalSteps}
        lives={lives}
        onContinue={() => {
          const nextIndex = currentStepIndex + 1;
          if (nextIndex < lessonData.totalSteps) {
            setCurrentStepIndex(nextIndex);
            setStepStartTime(Date.now());
            const nextStep = lessonData.steps[nextIndex];
            if (nextStep?.questionType === 'lesson-content') {
              setLessonState('lesson-content');
            } else {
              setLessonState('asking');
            }
          } else {
            markCompleteMutation.mutate({ lessonId, xpEarned: totalXpEarned });
            setLessonState('complete');
          }
        }}
        onClose={handleClose}
      />
    );
  }

  if (lessonState === 'complete') {
    return (
      <LessonComplete
        lessonTitle={lessonData.title}
        totalXp={totalXpEarned}
        correctAnswers={correctAnswerCount}
        totalQuestions={lessonData.totalSteps}
        streakDays={7}
        onContinue={handleClose}
        onBackToDashboard={handleClose}
      />
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
        
        <div className="flex items-center gap-0.5" title="Bursts remaining">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrangeBurst key={i} filled={i < lives} size={20} />
          ))}
        </div>
      </div>

      {/* Lesson Content */}
      <div className="flex-1 px-4 py-6">
        {lessonState === 'asking' && currentStep && currentStep.questionType !== 'lesson-content' && (
          <LessonAsking
            step={currentStep}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onCheck={handleCheckAnswer}
            isSubmitting={submitAnswerMutation.isPending}
            canCheck={getCanCheck()}
            lessonId={lessonId}
            banner={showRetryBanner && tryAgainMessage ? {
              variant: 'tryAgain',
              text: tryAgainMessage
            } : undefined}
          />
        )}
        
        {lessonState === 'incorrect' && currentStep && (
          <LessonIncorrect
            message={tryAgainMessage || "Not quite right. Try again!"}
            hint={getStepFeedbackMessage(currentStep, 'hint_after_2')}
            attemptNumber={currentAttempt - 1}
            onTryAgain={handleTryAgain}
            canTryAgain={true}
            selectedAnswer={selectedAnswer || lastSelectedAnswer || undefined}
            selectedAnswerText={getSelectedAnswerText(currentStep, selectedAnswer || lastSelectedAnswer)}
            selectedAnswerEmoji={getSelectedAnswerEmoji(currentStep, selectedAnswer || lastSelectedAnswer)}
          />
        )}
        
        {lessonState === 'learn' && currentStep && (
          <LessonLearn
            title={currentStep.question || "Learning Time"}
            body={(hasFullRetryConfig(currentStep.retryConfig) ? currentStep.retryConfig?.messages.learnCard : undefined) || getStepFeedbackMessage(currentStep, 'motivating_fail') || "Let's learn more about this!"}
            onContinue={handleLearnContinue}
            xpEarned={calculateXP(currentStep, 3)}
            correctAnswer={getCorrectAnswerText(currentStep)}
            correctAnswerEmoji={getCorrectAnswerEmoji(currentStep)}
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