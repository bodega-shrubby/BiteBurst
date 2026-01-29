import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';
import ConnectingPath from '@/components/lessons/ConnectingPath';
import PathNode, { type NodeState } from '@/components/lessons/PathNode';
import PathDecorations from '@/components/lessons/PathDecorations';
import StarBadge from '@/components/StarBadge';
import { cleanLessons, type CleanLesson } from '@/data/clean-lessons';
import mascotImage from '@/assets/mascot-teacher.png';

type LessonState = 'current' | 'unlocked' | 'locked' | 'completed';

interface ApiLesson {
  id: string;
  title: string;
  icon: string;
  unitId: string;
  unitTitle: string;
  sortOrder: number;
  description: string | null;
  state: LessonState;
}

interface Point {
  x: number;
  y: number;
}

function mapToNodeState(state: LessonState): NodeState {
  if (state === 'completed') return 'complete';
  if (state === 'current' || state === 'unlocked') return 'unlocked';
  return 'locked';
}

function calculateNodePositions(nodeCount: number, containerWidth: number): Point[] {
  const paddingX = 70;
  const startY = 80;
  const spacingY = 110;
  
  const positions: Point[] = [];
  const centerX = containerWidth / 2;
  const amplitude = Math.min(80, (containerWidth - paddingX * 2) / 2 - 40);
  
  for (let i = 0; i < nodeCount; i++) {
    const pattern = i % 4;
    let x: number;
    
    switch (pattern) {
      case 0: x = centerX; break;
      case 1: x = centerX + amplitude; break;
      case 2: x = centerX; break;
      case 3: x = centerX - amplitude; break;
      default: x = centerX;
    }
    
    positions.push({
      x: Math.max(paddingX, Math.min(containerWidth - paddingX, x)),
      y: startY + (i * spacingY)
    });
  }
  
  return positions;
}

export default function Lessons() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(360);
  const [newlyUnlockedId, setNewlyUnlockedId] = useState<string | null>(null);
  
  const curriculumId = user?.curriculum || 'uk-ks2';
  
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  const { data: apiLessons, isLoading: lessonsLoading } = useQuery<ApiLesson[]>({
    queryKey: [`/api/curriculum/${curriculumId}/lessons`],
    enabled: !!user && !!curriculumId,
  });
  
  const lessons: CleanLesson[] = apiLessons && apiLessons.length > 0 
    ? apiLessons.map(l => ({
        id: l.id,
        title: l.title.replace(' ', '\n'),
        icon: l.icon,
        state: l.state
      }))
    : cleanLessons;

  const [localLessons, setLocalLessons] = useState<CleanLesson[]>(lessons);
  
  useEffect(() => {
    setLocalLessons(lessons);
  }, [apiLessons]);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const justCompleted = urlParams.get('completed');
    
    if (justCompleted) {
      setLocalLessons(prev => {
        const currentIndex = prev.findIndex(l => l.id === justCompleted);
        return prev.map((lesson, index) => {
          if (lesson.id === justCompleted) {
            return { ...lesson, state: 'completed' as const };
          }
          if (index === currentIndex + 1 && lesson.state === 'locked') {
            setNewlyUnlockedId(lesson.id);
            return { ...lesson, state: 'unlocked' as const };
          }
          return lesson;
        });
      });
      
      window.history.replaceState({}, '', '/lessons');
    }
  }, []);

  useEffect(() => {
    if (newlyUnlockedId && scrollRef.current) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`lesson-${newlyUnlockedId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlockedId]);

  const displayLessons = localLessons.length > 0 ? localLessons : lessons;
  const completed = displayLessons.filter(l => l.state === 'completed').length;
  const progressPercent = displayLessons.length > 0 ? (completed / displayLessons.length) * 100 : 0;

  const nodePositions = useMemo(() => 
    calculateNodePositions(displayLessons.length, containerWidth),
    [displayLessons.length, containerWidth]
  );

  const totalHeight = nodePositions.length > 0 
    ? nodePositions[nodePositions.length - 1].y + 200 
    : 600;

  const handleLessonClick = (lesson: CleanLesson) => {
    if (lesson.state === 'current' || lesson.state === 'unlocked') {
      setLocation(`/lesson/${lesson.id}`);
    }
  };

  const getProgressHint = () => {
    if (completed === 0 && displayLessons.length > 0) {
      const firstLesson = displayLessons[0];
      return `Tap "${firstLesson.title.replace('\n', ' ')}" to start your journey!`;
    }
    if (completed === displayLessons.length) {
      return "Amazing! You've completed all lessons! 🎉";
    }
    return 'Great progress! Keep going to unlock more lessons!';
  };

  if (loading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-bounce">🍊</div>
          <p className="text-gray-600 font-medium">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">📚</div>
          <h2 className="text-xl font-bold text-gray-900">Please log in</h2>
          <p className="text-gray-600">Sign in to access your lessons</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-20" 
      style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)' }}
      ref={scrollRef}
    >
      <header className="sticky top-0 z-30 shadow-md">
        <div 
          className="px-4 py-4"
          style={{ 
            background: 'linear-gradient(135deg, #FF8E3C 0%, #FF6A00 50%, #E55A00 100%)',
          }}
        >
          <div className="max-w-sm mx-auto">
            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold text-white drop-shadow-sm">
                Sports Nutrition: Week 1
              </h1>
              <p className="text-sm text-orange-100">
                Learn what foods fuel your body for football and sports
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="absolute left-4 top-72 z-10 hidden sm:block">
          <img 
            src={mascotImage} 
            alt="BiteBurst Teacher Mascot" 
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-lg"
          />
        </div>

        <div ref={containerRef} className="max-w-md mx-auto px-4 relative">
          <div className="mt-6 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg font-bold text-gray-900">
                  {completed} of {displayLessons.length} lessons
                </div>
                <div className="text-2xl">
                  {completed === displayLessons.length ? '🏆' : '📚'}
                </div>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ 
                    width: `${progressPercent}%`,
                    background: 'linear-gradient(90deg, #FF8E3C 0%, #FF6A00 100%)',
                    boxShadow: progressPercent > 0 ? '0 0 10px rgba(255, 142, 60, 0.5)' : 'none',
                  }}
                />
              </div>
              
              <p className="text-sm text-gray-600">
                {getProgressHint()}
              </p>
            </div>
          </div>

          <div 
            className="relative"
            style={{ height: totalHeight }}
          >
            <ConnectingPath 
              nodePositions={nodePositions} 
              completedCount={completed} 
            />
            
            <PathDecorations nodePositions={nodePositions} />

            {displayLessons.map((lesson, index) => (
              <div key={lesson.id} id={`lesson-${lesson.id}`}>
                <PathNode
                  x={nodePositions[index]?.x || 0}
                  y={nodePositions[index]?.y || 0}
                  icon={lesson.icon}
                  title={lesson.title}
                  state={mapToNodeState(lesson.state)}
                  order={index}
                  onClick={() => handleLessonClick(lesson)}
                  isNewlyUnlocked={lesson.id === newlyUnlockedId}
                />
              </div>
            ))}

            {[2, 5, 7].map((afterIndex) => {
              if (afterIndex >= displayLessons.length || !nodePositions[afterIndex]) return null;
              const y = (nodePositions[afterIndex].y + (nodePositions[afterIndex + 1]?.y || nodePositions[afterIndex].y + 100)) / 2;
              
              return (
                <StarBadge
                  key={`star-${afterIndex}`}
                  y={y}
                  isUnlocked={completed > afterIndex}
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
