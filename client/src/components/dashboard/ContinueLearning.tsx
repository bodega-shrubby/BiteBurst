import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useActiveChild } from '@/hooks/useActiveChild';
import { apiRequest } from '@/lib/queryClient';
import brainyBolt from '@/assets/Mascots/BrainyBolt.png';

interface ApiLesson {
  id: string;
  title: string;
  icon: string;
  topicId: string;
  topicTitle: string;
  sortOrder: number;
  state: string;
  difficultyLevel: number;
}

export default function ContinueLearning() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const activeChild = useActiveChild(user);
  const childAge = activeChild?.age || 7;

  const { data: apiLessons, isLoading } = useQuery<ApiLesson[]>({
    queryKey: [`/api/age/${childAge}/lessons`, user?.id, activeChild?.childId],
    queryFn: () => {
      const params = new URLSearchParams({ userId: user?.id || '' });
      if (activeChild?.childId) {
        params.append('childId', activeChild.childId);
      }
      return apiRequest(`/api/age/${childAge}/lessons?${params.toString()}`);
    },
    enabled: !!user && !!childAge,
  });

  const currentLesson = useMemo(() => {
    if (!apiLessons || apiLessons.length === 0) return null;
    return apiLessons.find(l => l.state === 'current')
      || apiLessons.find(l => l.state === 'unlocked')
      || apiLessons[0];
  }, [apiLessons]);

  const progress = useMemo(() => {
    if (!apiLessons || apiLessons.length === 0) return { completed: 0, total: 0, percent: 0 };
    const completed = apiLessons.filter(l => l.state === 'completed').length;
    const total = apiLessons.length;
    return { completed, total, percent: Math.round((completed / total) * 100) };
  }, [apiLessons]);

  const handleStartLesson = () => {
    if (currentLesson) {
      setLocation(`/lesson/${currentLesson.id}`);
    } else {
      setLocation('/lessons');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-3xl p-6">
        <div className="flex items-center gap-5">
          <div className="w-[90px] h-[90px] bg-gray-100 rounded-full animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-100 rounded-full w-32 animate-pulse" />
            <div className="h-6 bg-gray-100 rounded-full w-48 animate-pulse" />
            <div className="h-2 bg-gray-100 rounded-full w-full animate-pulse" />
            <div className="h-12 bg-gray-100 rounded-xl w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-3xl p-6">
        <div className="flex items-center gap-5">
          <img src={brainyBolt} alt="Brainy Bolt" className="w-[90px] h-[90px] flex-shrink-0 object-contain" />
          <div className="flex-1 min-w-0">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
              🎉 ALL DONE
            </span>
            <h3 className="font-extrabold text-lg text-green-600 mb-2">
              All lessons completed!
            </h3>
            <p className="text-sm text-gray-500">Great job! Check back for new lessons.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-3xl p-6">
      <div className="flex items-center gap-5">
        <img src={brainyBolt} alt="Brainy Bolt" className="w-[90px] h-[90px] flex-shrink-0 object-contain" />

        <div className="flex-1 min-w-0">
          <span className="inline-block bg-[#E8F4FD] text-[#2E6BB5] text-xs font-bold px-3 py-1 rounded-full mb-2">
            📚 CONTINUE LEARNING
          </span>

          <h3 className="font-extrabold text-lg text-orange-500 mb-1">
            {currentLesson.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{currentLesson.topicTitle}</p>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-500">
              {progress.completed} of {progress.total}
            </span>
          </div>

          <button
            onClick={handleStartLesson}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-4 rounded-xl font-bold text-base hover:from-orange-600 hover:to-orange-500 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            📖 START LESSON
          </button>
        </div>
      </div>
    </div>
  );
}
