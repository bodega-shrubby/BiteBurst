import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';
import PathCanvas from '@/components/PathCanvas';
import LessonNode, { type Lesson } from '@/components/LessonNode';
import { week1Lessons } from '@/data/week1-lessons';

export default function Lessons() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [lessons, setLessons] = useState<Lesson[]>(week1Lessons);

  // Handle lesson completion from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const justCompleted = urlParams.get('completed');
    
    if (justCompleted) {
      // Find and mark lesson as completed, unlock next
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

  // Layout calculations
  const containerWidth = 420; // max-width of container
  const centerX = containerWidth / 2;
  const startY = 120; // Below progress card
  const nodeGap = 120; // Vertical spacing between nodes
  const topPadding = 80;
  const bottomPadding = 160;

  // Calculate anchor points for path (centered between left/right positions)
  const pathPoints = useMemo(() => {
    return lessons.map((_, i) => {
      const y = startY + i * nodeGap;
      // Path x with gentle sway - centered between left/right nodes
      const x = centerX + Math.sin(i * 0.9) * 14;
      return { x, y };
    });
  }, [lessons.length]);

  // Calculate total height
  const totalHeight = topPadding + startY + (lessons.length - 1) * nodeGap + bottomPadding;

  // Handle node click
  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.state === 'current' || lesson.state === 'unlocked') {
      // Route to lesson (using demo for MVP)
      setLocation(`/lesson/demo?id=${lesson.id}`);
    }
  };

  // Progress hint text
  const getProgressHint = () => {
    if (completed === 0) {
      return 'Tap "Healthy Snacks" to start your journey!';
    }
    return 'Great! Keep going to unlock new lessons!';
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 border-b border-orange-300 z-30 px-4 py-4 shadow-sm">
        <div className="max-w-md mx-auto">
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
      <main className="relative overflow-hidden">
        <div className="max-w-md mx-auto px-4 relative overflow-hidden" style={{ maxWidth: '420px' }}>
          
          {/* Progress Card */}
          <div className="mt-4 mb-8">
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
            className="relative overflow-hidden"
            style={{ 
              height: totalHeight,
              paddingTop: topPadding,
              paddingBottom: bottomPadding 
            }}
          >
            {/* Path Canvas */}
            <PathCanvas 
              points={pathPoints}
              width={containerWidth}
              height={totalHeight}
            />

            {/* Lesson Nodes */}
            {lessons.map((lesson, index) => {
              const side = index % 2 === 0 ? 'left' : 'right';
              const y = startY + index * nodeGap;
              // Add extra gap after every 3rd node for polish
              const extraGap = index > 0 && index % 3 === 0 ? 10 : 0;
              const adjustedY = y + Math.floor(index / 3) * extraGap;

              return (
                <LessonNode
                  key={lesson.id}
                  lesson={lesson}
                  side={side}
                  y={adjustedY}
                  index={index}
                  onClick={() => handleLessonClick(lesson)}
                />
              );
            })}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}