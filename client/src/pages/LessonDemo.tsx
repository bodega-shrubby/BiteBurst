import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { X } from 'lucide-react';
import QuizPills, { type QuizOption } from '@/components/lessons/QuizPills';
import SuccessStrip from '@/components/lessons/SuccessStrip';
import Confetti from '@/components/lessons/Confetti';
import BrainyBoltImage from '@assets/Mascots/BrainyBolt.png';
import SunnyProudImage from '@assets/Mascots/sunny_proud.png';

type LessonStep = 'intro' | 'quiz' | 'success' | 'complete';

interface LessonRun {
  startedAt: number;
  finishedAt?: number;
  correct: boolean;
}

const quizOptions: QuizOption[] = [
  { id: 'apple', emoji: '🍎', text: 'Apple', isCorrect: true },
  { id: 'chocolate', emoji: '🍫', text: 'Chocolate bar', isCorrect: false },
  { id: 'pretzel', emoji: '🥨', text: 'Pretzel', isCorrect: false },
];

export default function LessonDemo() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<LessonStep>('intro');
  const [lessonRun, setLessonRun] = useState<LessonRun | null>(null);
  const [showSuccessStrip, setShowSuccessStrip] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // XP award mutation
  const awardXpMutation = useMutation({
    mutationFn: async ({ amount, reason }: { amount: number; reason: string }) => {
      if (!user?.id) throw new Error('User not logged in');
      
      return apiRequest(`/api/user/${user.id}/xp`, {
        method: 'POST',
        body: { delta_xp: amount, reason }
      });
    }
  });

  // Handle back navigation
  const handleBack = () => {
    setLocation('/lessons');
  };

  // Start lesson
  const handleStart = () => {
    const now = Date.now();
    setLessonRun({
      startedAt: now,
      correct: false
    });
    setCurrentStep('quiz');
  };

  // Handle quiz answer
  const handleQuizAnswer = (optionId: string, isCorrect: boolean) => {
    if (!lessonRun) return;

    const updatedRun = {
      ...lessonRun,
      correct: isCorrect
    };
    setLessonRun(updatedRun);

    if (isCorrect) {
      // Show success strip
      setTimeout(() => {
        setShowSuccessStrip(true);
      }, 800); // Wait for bounce animation
    } else {
      // Allow retry after a moment
      setTimeout(() => {
        // Reset for retry (in a real app, you might limit retries)
        setCurrentStep('quiz');
      }, 1500);
    }
  };

  // Continue from success
  const handleContinueFromSuccess = () => {
    setShowSuccessStrip(false);
    setCurrentStep('complete');
  };

  // Claim XP and complete lesson
  const handleClaimXp = async () => {
    if (!lessonRun || !user?.id) return;

    try {
      // Award XP via API
      await awardXpMutation.mutateAsync({
        amount: 25,
        reason: 'lesson_demo'
      });

      // Show confetti
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        setShowConfetti(true);
      }

      // Wait for celebration, then navigate back
      setTimeout(() => {
        setLocation('/lessons?justCompleted=demo');
      }, prefersReducedMotion ? 1000 : 2000);

    } catch (error) {
      console.error('Failed to award XP:', error);
      // Still allow completion - show non-blocking toast in real app
      setLocation('/lessons?justCompleted=demo');
    }
  };

  // Calculate elapsed time
  const getElapsedTime = () => {
    if (!lessonRun?.startedAt) return '0:00';
    const elapsed = Math.floor((Date.now() - lessonRun.startedAt) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Show loading spinner while auth is checking
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-spin">🔄</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">📚</div>
          <h2 className="text-xl font-bold text-gray-900">Please log in</h2>
          <p className="text-gray-600">Sign in to take lessons</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Confetti */}
      <Confetti 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-20 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back to lessons"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Progress bar */}
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-orange-500 h-1 rounded-full transition-all duration-300"
                style={{
                  width: currentStep === 'intro' ? '25%' :
                         currentStep === 'quiz' ? '50%' :
                         currentStep === 'success' ? '75%' : '100%'
                }}
              />
            </div>
          </div>
          
          {/* Hearts/Lives (decorative) */}
          <div className="flex space-x-1">
            <span className="text-red-500">❤️</span>
            <span className="text-xs text-gray-500">5</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 pb-32">
        <div className="max-w-md mx-auto">
          
          {/* Intro Step */}
          {currentStep === 'intro' && (
            <div className="space-y-8 text-center animate-in fade-in duration-500">
              {/* Lesson info card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                <div className="space-y-4">
                  <div className="text-4xl">🍎</div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Healthy Snacks</h1>
                    <p className="text-gray-600 mt-1">Lesson 1 of 4</p>
                  </div>
                </div>
              </div>

              {/* Mascot + subtitle */}
              <div className="space-y-4">
                <div className="text-6xl">🍊</div>
                <p className="text-lg text-gray-700">
                  Pick the snack that powers you up!
                </p>
              </div>

              {/* Start button */}
              <button
                onClick={handleStart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg"
              >
                Start (+25 XP)
              </button>
            </div>
          )}

          {/* Quiz Step */}
          {currentStep === 'quiz' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <QuizPills
                prompt="Which of these is a healthy snack?"
                options={quizOptions}
                onAnswer={handleQuizAnswer}
              />
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="space-y-8 text-center animate-in fade-in duration-500">
              {/* Celebration illustration */}
              <div className="space-y-6">
                <div className="animate-bounce">
                  <img 
                    src={SunnyProudImage} 
                    alt="Sunny proud celebration" 
                    className="w-24 h-24 mx-auto object-contain"
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <div className="text-4xl">🍊</div>
                  <div className="text-4xl">🧒</div>
                </div>
                <h1 className="text-3xl font-bold text-orange-600">
                  Lesson complete!
                </h1>
              </div>

              {/* Stats tiles */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-orange-100 border-2 border-orange-300 rounded-2xl p-4">
                  <div className="text-orange-600 text-2xl font-bold">⚡ 25</div>
                  <div className="text-orange-800 text-xs font-medium mt-1">Total XP</div>
                </div>
                <div className="bg-green-100 border-2 border-green-300 rounded-2xl p-4">
                  <div className="text-green-600 text-2xl font-bold">✓ 100%</div>
                  <div className="text-green-800 text-xs font-medium mt-1">Good</div>
                </div>
                <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl p-4">
                  <div className="text-blue-600 text-2xl font-bold">⏱ {getElapsedTime()}</div>
                  <div className="text-blue-800 text-xs font-medium mt-1">Speedy</div>
                </div>
              </div>

              {/* Claim XP button */}
              <button
                onClick={handleClaimXp}
                disabled={awardXpMutation.isPending}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-4 px-6 rounded-2xl transition-colors shadow-lg"
              >
                {awardXpMutation.isPending ? 'Claiming XP...' : 'Claim XP'}
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mascot at bottom */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <img 
          src={BrainyBoltImage} 
          alt="BrainyBolt mascot" 
          className="w-32 h-32 sm:w-36 sm:h-36 object-contain drop-shadow-lg"
        />
      </div>

      {/* Success Strip */}
      <SuccessStrip
        show={showSuccessStrip}
        message="🍎 Apples give long-lasting energy."
        onContinue={handleContinueFromSuccess}
      />
    </div>
  );
}