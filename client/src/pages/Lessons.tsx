import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';
import LessonCircle from '@/components/LessonCircle';
import StraightPath from '@/components/StraightPath';
import StarBadge from '@/components/StarBadge';
import { cleanLessons, type CleanLesson } from '@/data/clean-lessons';

export default function Lessons() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [lessons, setLessons] = useState<CleanLesson[]>(cleanLessons);

  // Handle lesson completion from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const justCompleted = urlParams.get('completed');
    
    if (justCompleted) {
      // Mark lesson as completed, unlock next
      setLessons(prev => prev.map((lesson, index) => {
        if (lesson.id === justCompleted) {
          return { ...lesson, state: 'completed' as const };
        }
        // Unlock next lesson
        const currentIndex = prev.findIndex(l => l.id === justCompleted);
        if (index === currentIndex + 1 && lesson.state === 'locked') {
          return { ...lesson, state: 'unlocked' as const };
        }
        return lesson;
      }));
      
      // Clear URL params
      window.history.replaceState({}, '', '/lessons');
    }
  }, []);

  // Calculate progress
  const completed = lessons.filter(l => l.state === 'completed').length;
  const progressPercent = (completed / lessons.length) * 100;

  // Mobile-centered layout
  const containerWidth = 360; // Mobile-friendly width
  const startY = 50; // Start position - reduced gap
  const lessonGap = 140; // Space between lessons
  const starGap = 70; // Space for star badges

  // Calculate all positions
  const allElements: Array<
    | { type: 'lesson'; lesson: CleanLesson; y: number }
    | { type: 'star'; y: number; isUnlocked: boolean }
  > = [];
  let currentY = startY;

  lessons.forEach((lesson, index) => {
    allElements.push({
      type: 'lesson',
      lesson,
      y: currentY
    });
    currentY += lessonGap;

    // Add star after lessons 3, 6, and 8
    if (index === 2 || index === 5 || index === 7) {
      allElements.push({
        type: 'star',
        y: currentY,
        isUnlocked: completed >= (index + 1)
      });
      currentY += starGap;
    }
  });

  // Handle lesson click
  const handleLessonClick = (lesson: CleanLesson) => {
    if (lesson.state === 'current' || lesson.state === 'unlocked') {
      setLocation(`/lesson/demo?id=${lesson.id}`);
    }
  };

  // Progress hint text
  const getProgressHint = () => {
    if (completed === 0) {
      return 'Tap "Healthy Snacks" to start your journey!';
    }
    return 'Great progress! Keep going to unlock more lessons!';
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
          <p className="text-gray-600">Sign in to access your lessons</p>
        </div>
      </div>
    );
  }

  const totalHeight = currentY + 100; // Add bottom padding

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 border-b border-orange-300 z-30 px-4 py-4 shadow-sm">
        <div className="max-w-sm mx-auto">
          <div className="text-center space-y-1">
            <h1 className="text-xl font-bold text-white">
              Healthy Habits: Week 1
            </h1>
            <p className="text-sm text-orange-100">
              Learn the basics of healthy eating and movement
            </p>
          </div>
        </div>
      </header>

      {/* Track Container */}
      <main className="relative">
        <div className="max-w-sm mx-auto px-4 relative" style={{ width: '100%', maxWidth: `${containerWidth}px` }}>
          
          {/* Progress Card */}
          <div className="mt-6 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {completed} of {lessons.length} lessons complete
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                <div 
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              
              <p className="text-sm text-gray-600">
                {getProgressHint()}
              </p>
            </div>
          </div>

          {/* Track Area */}
          <div 
            className="relative"
            style={{ height: totalHeight }}
          >
            {/* Straight Path */}
            <StraightPath 
              startY={startY}
              endY={currentY - starGap}
              containerWidth={containerWidth}
            />

            {/* All Elements (Lessons + Stars) */}
            {allElements.map((element, index) => {
              if (element.type === 'lesson') {
                return (
                  <LessonCircle
                    key={element.lesson.id}
                    lesson={element.lesson}
                    y={element.y}
                    onClick={() => handleLessonClick(element.lesson)}
                  />
                );
              } else {
                return (
                  <StarBadge
                    key={`star-${index}`}
                    y={element.y}
                    isUnlocked={element.isUnlocked}
                  />
                );
              }
            })}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}