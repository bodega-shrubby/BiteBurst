import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { BookOpen } from 'lucide-react';

interface LessonProgress {
  id: string;
  title: string;
  emoji: string;
  current_slide: number;
  total_slides: number;
  progress_percent: number;
}

export default function LessonHero() {
  const { user, session } = useAuth();
  const [, setLocation] = useLocation();

  const { data: lessonProgress, isLoading } = useQuery<LessonProgress | null>({
    queryKey: ['/api/user', user?.id, 'current-lesson'],
    queryFn: async () => {
      if (!user?.id || !session?.access_token) return null;
      try {
        const response = await fetch(`/api/user/${user.id}/current-lesson`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          }
        });
        if (!response.ok) return null;
        return response.json();
      } catch {
        return null;
      }
    },
    enabled: !!user?.id && !!session?.access_token,
  });

  const handleStartLesson = () => {
    if (lessonProgress?.id) {
      setLocation(`/lessons/${lessonProgress.id}`);
    } else {
      setLocation('/lessons');
    }
  };

  const currentLesson = lessonProgress || {
    title: 'Fuel for Football',
    emoji: '⚽',
    current_slide: 3,
    total_slides: 5,
    progress_percent: 60,
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl border-2 border-orange-200 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-gray-800 text-lg">Continue Learning</span>
        <span className="text-2xl">📚</span>
      </div>
      
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
          {currentLesson.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 truncate">{currentLesson.title}</div>
          <div className="text-sm text-gray-500">
            {currentLesson.current_slide} of {currentLesson.total_slides} slides
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-[#FF6A00] h-2 rounded-full transition-all duration-500"
              style={{ width: `${currentLesson.progress_percent}%` }}
            />
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleStartLesson}
        className="w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-md active:scale-[0.98]"
      >
        <BookOpen className="w-5 h-5" />
        START LESSON
      </button>
    </div>
  );
}
