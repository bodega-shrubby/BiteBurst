import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';
import PathCanvas from '@/components/PathCanvas';
import LessonNode, { type Lesson } from '@/components/LessonNode';
import StarMilestone from '@/components/StarMilestone';
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

  // Centered straight-line layout calculations
  const containerWidth = 384; // Standard mobile width
  const centerX = containerWidth / 2; // All nodes centered
  const startY = 120; // Below progress card
  const nodeGap = 120; // Vertical spacing between nodes
  const starGap = 60; // Gap before/after star milestones
  const topPadding = 80;
  const bottomPadding = 160;

  // Calculate all positions (lessons + star milestones)
  const allPositions = useMemo(() => {
    const positions: Array<{ x: number; y: number; type: 'lesson' | 'star'; index: number }> = [];
    let currentY = startY;
    
    lessons.forEach((_, i) => {
      positions.push({ x: centerX, y: currentY, type: 'lesson', index: i });
      currentY += nodeGap;
      
      // Add star milestone after lessons 3, 6, and 8
      if (i === 2 || i === 5 || i === 7) {
        currentY += starGap;
        positions.push({ x: centerX, y: currentY, type: 'star', index: positions.length });
        currentY += starGap;
      }
    });
    
    return positions;
  }, [lessons.length, centerX]);

  // Extract just lesson and star positions for path
  const pathPositions = allPositions.map(pos => ({ x: pos.x, y: pos.y, side: 'center' as const }));

  // Calculate total height including star milestones
  const lastPosition = allPositions[allPositions.length - 1];
  const totalHeight = topPadding + lastPosition.y + bottomPadding;

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
      <main className="relative">
        <div className="max-w-sm mx-auto px-4 relative" style={{ width: '100%', maxWidth: '384px' }}>
          
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
            className="relative"
            style={{ 
              height: totalHeight,
              paddingTop: topPadding,
              paddingBottom: bottomPadding 
            }}
          >
            {/* Path Canvas */}
            <PathCanvas 
              nodePositions={pathPositions}
              containerWidth={containerWidth}
              height={totalHeight}
            />

            {/* All Nodes (Lessons + Stars) */}
            {allPositions.map((position) => {
              if (position.type === 'lesson') {
                const lesson = lessons[position.index];
                return (
                  <LessonNode
                    key={lesson.id}
                    lesson={lesson}
                    side='center'
                    y={position.y}
                    index={position.index}
                    onClick={() => handleLessonClick(lesson)}
                  />
                );
              } else {
                // Star milestone
                const completedLessons = position.index <= 3 ? 3 : position.index <= 6 ? 6 : 8;
                const isUnlocked = completed >= completedLessons;
                return (
                  <StarMilestone
                    key={`star-${position.index}`}
                    y={position.y}
                    index={position.index}
                    isUnlocked={isUnlocked}
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