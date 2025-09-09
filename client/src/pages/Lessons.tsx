import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import BottomNavigation from '@/components/BottomNavigation';
import TrackNode, { type LessonNode } from '@/components/lessons/TrackNode';
import lessonTrackData from '@/data/lessonTrack.json';

export default function Lessons() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [nodes, setNodes] = useState<LessonNode[]>(lessonTrackData as LessonNode[]);
  const [showMascotBubble, setShowMascotBubble] = useState(false);
  const [glowingNode, setGlowingNode] = useState<string | null>(null);

  // Check for completion celebration
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const justCompleted = urlParams.get('justCompleted');
    
    if (justCompleted === 'demo') {
      // Get current progress from localStorage
      const savedProgress = localStorage.getItem('bb-lesson-track');
      let currentProgress: Record<string, string> = {};
      
      if (savedProgress) {
        try {
          currentProgress = JSON.parse(savedProgress);
        } catch (e) {
          console.warn('Failed to parse lesson progress:', e);
        }
      }

      // Mark first lesson as complete and unlock second
      currentProgress['healthy-snacks'] = 'complete';
      currentProgress['hydration-heroes'] = 'unlocked';
      
      localStorage.setItem('bb-lesson-track', JSON.stringify(currentProgress));
      
      // Update nodes state
      const updatedNodes = lessonTrackData.map((node: any) => ({
        ...node,
        state: currentProgress[node.id] || node.state
      })) as LessonNode[];
      
      setNodes(updatedNodes);
      
      // Show celebration effects
      setGlowingNode('hydration-heroes');
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (!prefersReducedMotion) {
        // Scroll to newly unlocked node
        setTimeout(() => {
          const nodeElement = document.querySelector('[data-node-id="hydration-heroes"]');
          if (nodeElement) {
            nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
      
      // Clear celebration effects and URL params
      setTimeout(() => {
        setGlowingNode(null);
        window.history.replaceState({}, '', '/lessons');
      }, prefersReducedMotion ? 1000 : 2000);
    }
  }, []);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('bb-lesson-track');
    if (savedProgress) {
      try {
        const currentProgress = JSON.parse(savedProgress);
        const updatedNodes = lessonTrackData.map((node: any) => ({
          ...node,
          state: currentProgress[node.id] || node.state
        })) as LessonNode[];
        setNodes(updatedNodes);
      } catch (e) {
        console.warn('Failed to parse lesson progress:', e);
      }
    }
  }, []);

  // Show mascot bubble on first visit
  useEffect(() => {
    const hasSeenLessons = localStorage.getItem('bb-lessons-visited');
    if (!hasSeenLessons) {
      setShowMascotBubble(true);
      localStorage.setItem('bb-lessons-visited', 'true');
      
      // Hide bubble after 3 seconds
      setTimeout(() => {
        setShowMascotBubble(false);
      }, 3000);
    }
  }, []);

  const handleNodeClick = (node: LessonNode) => {
    if (node.state === 'unlocked' && node.id === 'healthy-snacks') {
      setLocation('/lesson/demo');
    } else if (node.state === 'unlocked') {
      // TODO: Navigate to other lessons when implemented
      console.log(`Lesson ${node.id} clicked - not yet implemented`);
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-20 p-4">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <h1 className="text-2xl font-bold text-orange-600 text-center">
              Healthy Habits: Week 1
            </h1>
            <p className="text-gray-600 text-sm text-center mt-1">
              Learn the basics of healthy eating and movement
            </p>
            
            {/* Floating mascot with bubble */}
            {showMascotBubble && (
              <div className="absolute top-0 right-0 flex items-start space-x-2 animate-in slide-in-from-right duration-500">
                <div className="bg-orange-100 border border-orange-300 rounded-2xl px-3 py-2 shadow-lg max-w-32">
                  <div className="text-xs text-orange-800 font-medium">
                    Welcome! Start your first lesson! 👋
                  </div>
                  {/* Speech bubble tail */}
                  <div className="absolute top-3 -right-1 w-2 h-2 bg-orange-100 border-r border-b border-orange-300 transform rotate-45" />
                </div>
                <div className="text-2xl animate-bounce">🍊</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Lesson Path */}
      <main className="p-6 pb-24">
        <div className="max-w-md mx-auto relative">
          {/* Lesson nodes with star milestones */}
          <div className="relative flex flex-col space-y-12 pt-4">
            {nodes.map((node, index) => {
              // Determine position for zigzag pattern
              const position = index === 0 ? 'center' : 
                              index % 2 === 1 ? 'right' : 'left';
              
              const showStar = (index + 1) % 3 === 0 && index < nodes.length - 1;
              
              return (
                <div key={`${node.id}-group`} className="flex flex-col items-center space-y-8">
                  <div 
                    data-node-id={node.id}
                    className="relative w-full"
                  >
                    <TrackNode
                      node={node}
                      onClick={() => handleNodeClick(node)}
                      isGlowing={glowingNode === node.id}
                      position={position}
                    />
                  </div>
                  
                  {/* Star milestone after every 3 lessons */}
                  {showStar && (
                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center shadow-lg">
                        <span className="text-gray-400 text-lg">★</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Progress summary */}
          <div className="mt-16 text-center space-y-2">
            <div className="text-sm text-gray-600">
              {nodes.filter(n => n.state === 'complete').length} of {nodes.length} lessons complete
            </div>
            <div className="text-xs text-gray-500">
              Keep going to unlock new lessons!
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}