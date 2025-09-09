import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';
import CurvySpine, { sampleSpinePoint } from '@/components/lessons/CurvySpine';
import PathNode, { type LessonNodeData, type NodeState } from '@/components/lessons/PathNode';
import lessonsWeek1Data from '@/data/lessons-week1.json';

export default function Lessons() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [lessons, setLessons] = useState<LessonNodeData[]>(lessonsWeek1Data as LessonNodeData[]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set(['snacks'])); // First lesson unlocked
  const [newlyUnlockedId, setNewlyUnlockedId] = useState<string | null>(null);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('bb_week1_progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCompletedIds(new Set(progress.completed || []));
        setUnlockedIds(new Set(progress.unlocked || ['snacks']));
      } catch (e) {
        console.warn('Failed to parse lesson progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    const progress = {
      completed: Array.from(completedIds),
      unlocked: Array.from(unlockedIds)
    };
    localStorage.setItem('bb_week1_progress', JSON.stringify(progress));
  }, [completedIds, unlockedIds]);

  // Handle lesson completion from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const justCompleted = urlParams.get('completed');
    
    if (justCompleted && lessons.find(l => l.id === justCompleted)) {
      // Mark lesson as complete
      setCompletedIds(prev => new Set([...Array.from(prev), justCompleted]));
      
      // Find and unlock next lesson
      const currentIndex = lessons.findIndex(l => l.id === justCompleted);
      if (currentIndex >= 0 && currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        setUnlockedIds(prev => new Set([...Array.from(prev), nextLesson.id]));
        setNewlyUnlockedId(nextLesson.id);
        
        // Clear newly unlocked state after animations complete
        setTimeout(() => setNewlyUnlockedId(null), 2500);
        
        // Scroll to newly unlocked lesson
        setTimeout(() => {
          const element = document.querySelector(`[data-lesson-id="${nextLesson.id}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
      
      // Clear URL params
      window.history.replaceState({}, '', '/lessons');
    }
  }, [lessons]);

  // Calculate current lesson states
  const lessonsWithState = lessons.map(lesson => ({
    ...lesson,
    state: completedIds.has(lesson.id) ? 'complete' as NodeState :
           unlockedIds.has(lesson.id) ? 'unlocked' as NodeState :
           'locked' as NodeState
  }));

  // Calculate progress for spine animation (0 to 1)
  const progress = completedIds.size / lessons.length;

  // Handle lesson node click
  const handleLessonClick = (lesson: LessonNodeData) => {
    if (lesson.state === 'unlocked') {
      // For MVP, all lessons route to the demo
      setLocation('/lesson/demo');
    } else if (lesson.state === 'locked') {
      // Show tooltip feedback (handled by PathNode component)
      console.log('Lesson locked - finish earlier lessons first');
    }
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

  const containerHeight = Math.max(1000, lessons.length * 120 + 300);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 border-b border-orange-300 z-30 px-6 py-4 shadow-sm">
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

      {/* Lesson Track */}
      <main 
        className="relative px-6"
        style={{ 
          minHeight: containerHeight,
          scrollSnapType: 'y proximity'
        }}
      >
        <div className="max-w-md mx-auto relative">
          {/* S-Curve Spine */}
          <CurvySpine 
            progress={progress} 
            nodeCount={lessons.length}
          />

          {/* Lesson Nodes */}
          {lessonsWithState.map((lesson, index) => {
            // Calculate position along S-curve
            const t = index / (lessons.length - 1);
            const spinePoint = sampleSpinePoint(t, lessons.length);
            
            // Convert SVG coordinates to container coordinates
            // SVG is positioned at 'calc(50% - 60px)' from left, so we need to offset accordingly
            const containerWidth = 384; // max-w-md = 24rem = 384px
            const svgOffsetX = (containerWidth / 2) - 60; // Match SVG positioning
            const finalX = svgOffsetX + spinePoint.x;
            
            return (
              <div
                key={lesson.id}
                data-lesson-id={lesson.id}
                style={{ scrollSnapAlign: 'center' }}
              >
                <PathNode
                  x={finalX}
                  y={spinePoint.y + 80} // Reduced offset for tighter spacing
                  icon={lesson.icon}
                  title={lesson.title}
                  state={lesson.state}
                  order={lesson.order}
                  onClick={() => handleLessonClick(lesson)}
                  isNewlyUnlocked={newlyUnlockedId === lesson.id}
                />
              </div>
            );
          })}
        </div>

        {/* Progress Footer */}
        <div 
          className="sticky bottom-24 left-0 right-0 pt-8 pb-4"
          style={{ top: 'auto' }}
        >
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-200">
              <div className="text-sm font-semibold text-gray-900">
                {completedIds.size} of {lessons.length} lessons complete
              </div>
              {completedIds.size === 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Tap "Healthy Snacks" to start your journey!
                </div>
              )}
              {completedIds.size > 0 && completedIds.size < lessons.length && (
                <div className="text-xs text-gray-500 mt-1">
                  Keep going to unlock new lessons!
                </div>
              )}
              {completedIds.size === lessons.length && (
                <div className="text-xs text-green-600 mt-1 font-medium">
                  Week 1 complete! Amazing progress! 🎉
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}