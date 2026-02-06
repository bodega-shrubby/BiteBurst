import { useMemo } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useActiveChild } from '@/hooks/useActiveChild';
import { apiRequest } from '@/lib/queryClient';
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import LessonMascot from '@/components/LessonMascot';
import LessonJourney from '@/components/LessonJourney';
import { cleanLessons, type CleanLesson, type LessonState } from '@/data/clean-lessons';
import treasureChestImg from '@assets/treasure_chest_1769687520313.jpg';

interface ApiLesson {
  id: string;
  title: string;
  icon: string;
  topicId: string;
  topicTitle: string;
  sortOrder: number;
  topicOrder?: number;
  description: string | null;
  state: LessonState;
  difficultyLevel: number;
  mascotId?: string;
  mascot?: {
    id: string;
    name: string;
    emoji: string;
    imagePath: string | null;
  } | null;
}

interface TopicData {
  id: string;
  title: string;
  description: string | null;
  iconEmoji: string | null;
  defaultMascotId: string | null;
  age: number | null;
  mascot: {
    id: string;
    name: string;
    emoji: string;
    imagePath: string | null;
  } | null;
  lessonCount: number;
}

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Sarah K.', initial: 'S', xp: 450, color: 'bg-purple-400' },
  { rank: 2, name: 'Mike T.', initial: 'M', xp: 380, color: 'bg-blue-400' },
  { rank: 3, name: 'Alex R.', initial: 'A', xp: 290, color: 'bg-green-400' },
];

function WeeklyChallenge() {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">🎯 WEEKLY CHALLENGE</span>
        <span className="text-xs opacity-80">3 days left</span>
      </div>
      <h3 className="font-bold text-lg">Complete 5 Lessons</h3>
      <p className="text-sm text-indigo-100 mt-1">Earn a special badge!</p>
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1 opacity-80">
          <span>Progress</span>
          <span>0/5</span>
        </div>
        <div className="bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full" style={{ width: '0%' }} />
        </div>
      </div>
    </div>
  );
}

function AdPlaceholder() {
  return (
    <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
      <div className="text-center py-8">
        <div className="text-3xl mb-2 opacity-50">📣</div>
        <p className="text-sm text-gray-400">Ad Placeholder</p>
        <p className="text-xs text-gray-300 mt-1">340 x 180</p>
      </div>
    </div>
  );
}

interface LessonListItem {
  id: string;
  title: string;
  state: 'completed' | 'current' | 'unlocked' | 'locked';
  difficultyLevel: number;
}

interface LessonGroup {
  baseId: string;
  baseName: string;
  levels: LessonListItem[];
}

function groupLessonsForSidebar(lessons: LessonListItem[]): LessonGroup[] {
  const groups = new Map<string, LessonGroup>();

  lessons.forEach(lesson => {
    const baseId = lesson.id.replace(/-medium$/, '').replace(/-hard$/, '');
    const baseName = lesson.title
      .replace(/ - Level \d$/, '')
      .replace(/ - Level 1$/, '')
      .replace(/ - Level 2$/, '')
      .replace(/ - Level 3$/, '');

    if (!groups.has(baseId)) {
      groups.set(baseId, { baseId, baseName, levels: [] });
    }
    groups.get(baseId)!.levels.push(lesson);
  });

  groups.forEach(group => {
    group.levels.sort((a, b) => a.difficultyLevel - b.difficultyLevel);
  });

  return Array.from(groups.values());
}

function TopicLessonsList({ lessons, completed }: { lessons: LessonListItem[]; completed: number }) {
  const groups = groupLessonsForSidebar(lessons);
  
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base text-gray-800">Topic Lessons</h3>
        <span className="text-sm text-gray-400">{completed}/{lessons.length}</span>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {groups.map((group, groupIndex) => {
          const allComplete = group.levels.every(l => l.state === 'completed');
          
          return (
            <div key={group.baseId} className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 px-2">
                {group.baseName}
              </div>
              
              {group.levels.map((lesson) => {
                const isCurrent = lesson.state === 'current';
                const isLocked = lesson.state === 'locked';
                const isCompleted = lesson.state === 'completed';

                return (
                  <div key={lesson.id}>
                    <div 
                      className={`flex items-center space-x-3 py-2 px-2 rounded-lg ${
                        isCurrent ? 'bg-orange-50 cursor-pointer' : 
                        isCompleted ? 'bg-green-50' : 
                        isLocked ? 'opacity-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className={`w-6 h-6 ${
                        isCurrent ? 'bg-orange-500' : 
                        isCompleted ? 'bg-green-500' : 
                        'bg-gray-300'
                      } rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                        {isCompleted ? '✓' : lesson.difficultyLevel}
                      </span>
                      <span className={`text-sm flex-1 ${isCurrent || isCompleted ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                        Level {lesson.difficultyLevel}
                      </span>
                      {isCurrent && <span className="text-green-500 text-xs">▶</span>}
                      {isCompleted && <span className="text-green-500 text-xs">✓</span>}
                      {isLocked && <span className="text-gray-400 text-xs">🔒</span>}
                    </div>
                  </div>
                );
              })}
              
              <div className={`flex items-center space-x-3 py-2 px-2 rounded-lg ${allComplete ? 'bg-amber-50' : 'opacity-50'}`}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                  <img src={treasureChestImg} alt="Treasure Chest" className={`w-6 h-6 object-contain ${allComplete ? '' : 'grayscale opacity-50'}`} />
                </span>
                <span className="text-sm text-amber-700 flex-1">XP Reward</span>
                {allComplete ? (
                  <span className="text-amber-600 text-xs font-bold">CLAIM</span>
                ) : (
                  <span className="text-amber-600 text-xs">{group.levels.filter(l => l.state === 'completed').length}/{group.levels.length}</span>
                )}
              </div>

              {groupIndex < groups.length - 1 && (
                <div className="border-b border-gray-100 my-2" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LeaderboardCard({ userXp, userName }: { userXp: number; userName: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base text-gray-800">🏆 Leaderboard</h3>
        <Link href="/leaderboard" className="text-sm text-orange-500 font-medium hover:underline">
          View All →
        </Link>
      </div>

      <div className="space-y-2">
        {LEADERBOARD_DATA.map((player, index) => (
          <div key={player.rank} className={`flex items-center space-x-3 p-2 ${index === 0 ? 'bg-amber-50/50' : 'bg-gray-50'} rounded-xl`}>
            <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
            <div className={`w-7 h-7 ${player.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
              {player.initial}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-800">{player.name}</p>
            </div>
            <span className="font-bold text-sm text-gray-700">{player.xp} XP</span>
          </div>
        ))}

        <div className="border-t border-gray-100 pt-2 mt-2">
          <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded-xl border border-orange-200">
            <span className="text-xs font-bold text-gray-500 w-5 text-center">#8</span>
            <div className="w-7 h-7 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-gray-800">You ({userName})</p>
            </div>
            <span className="font-bold text-sm text-orange-600">{userXp} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Lessons() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const activeChild = useActiveChild(user);
  
  const childAge = activeChild?.age || 7; // Default to age 7 if not set
  
  const { data: apiLessons, isLoading: lessonsLoading } = useQuery<ApiLesson[]>({
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

  // Get the topic of the current/next lesson to work on (not just the first lesson)
  const currentTopicId = useMemo(() => {
    if (!apiLessons || apiLessons.length === 0) return undefined;
    // Find the current lesson or first unlocked lesson
    const currentLesson = apiLessons.find(l => l.state === 'current') 
      || apiLessons.find(l => l.state === 'unlocked')
      || apiLessons[0]; // Fallback to first lesson
    return currentLesson?.topicId;
  }, [apiLessons]);

  const { data: topicData } = useQuery<TopicData>({
    queryKey: ['/api/topics', currentTopicId],
    queryFn: () => apiRequest(`/api/topics/${currentTopicId}`),
    enabled: !!currentTopicId,
  });

  const journeyLessons = useMemo(() => {
    if (apiLessons && apiLessons.length > 0 && currentTopicId) {
      // Filter to show only lessons from the current topic
      return apiLessons
        .filter(lesson => lesson.topicId === currentTopicId)
        .map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          icon: lesson.icon || '📚',
          state: lesson.state as 'completed' | 'current' | 'unlocked' | 'locked',
          xp: 15,
          topicId: lesson.topicId,
          topicTitle: lesson.topicTitle,
          difficultyLevel: lesson.difficultyLevel || 1,
          mascotId: lesson.mascotId,
          mascot: lesson.mascot,
        }));
    }
    if (apiLessons && apiLessons.length > 0) {
      return apiLessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        icon: lesson.icon || '📚',
        state: lesson.state as 'completed' | 'current' | 'unlocked' | 'locked',
        xp: 15,
        topicId: lesson.topicId,
        topicTitle: lesson.topicTitle,
        difficultyLevel: lesson.difficultyLevel || 1,
        mascotId: lesson.mascotId,
        mascot: lesson.mascot,
      }));
    }
    return cleanLessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      icon: lesson.icon,
      state: lesson.state as 'completed' | 'current' | 'unlocked' | 'locked',
      xp: 15,
      difficultyLevel: 1
    }));
  }, [apiLessons, currentTopicId]);

  const completed = journeyLessons.filter(l => l.state === 'completed').length;
  const progressPercent = journeyLessons.length > 0 ? (completed / journeyLessons.length) * 100 : 0;
  const userXp = user?.totalXp || 85;
  const userName = user?.displayName || 'You';

  const handleLessonClick = (lessonId: string) => {
    setLocation(`/lesson/${lessonId}`);
  };

  if (loading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">📚</div>
          <h2 className="text-xl font-bold text-gray-900">Please log in</h2>
          <p className="text-gray-600">Sign in to access your lessons</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex min-h-screen md:ml-[200px]">
        <div className="flex-1 flex justify-center">
          <div className="flex max-w-[1100px] w-full">
            
            <div className="flex-1 min-w-0">
              <header className="sticky top-0 z-30">
                <div 
                  className="px-6 py-6"
                  style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <button 
                      onClick={() => setLocation('/dashboard')}
                      className="text-white/80 hover:text-white text-sm flex items-center space-x-1"
                    >
                      <span>←</span>
                      <span>Back to Topics</span>
                    </button>
                    <span className="text-white/40">|</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Unit 1
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <span>{topicData?.iconEmoji || '📚'}</span>
                    <span>{topicData?.title || 'Lessons'}</span>
                  </h1>
                  {topicData?.description && (
                    <p className="text-orange-100 text-sm mt-2 max-w-lg">
                      {topicData.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-3 mt-3">
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      {journeyLessons.length} Lessons
                    </span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      ~{journeyLessons.length * 5} min
                    </span>
                  </div>
                </div>

                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🏅</span>
                      <div>
                        <div className="text-base font-bold text-gray-900">{completed}/{journeyLessons.length}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">⚡</span>
                      <div>
                        <div className="text-base font-bold text-gray-700">{userXp} XP</div>
                        <div className="text-xs text-gray-500">Earned</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🔥</span>
                      <div>
                        <div className="text-base font-bold text-gray-700">{user?.streak || 0}</div>
                        <div className="text-xs text-gray-500">Streak</div>
                      </div>
                    </div>
                  </div>

                  <div className="w-40 hidden sm:block">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </header>

              <LessonJourney
                lessons={journeyLessons}
                onLessonClick={handleLessonClick}
              />
            </div>

            <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <LessonMascot
                  type="professor"
                  message={completed === 0 
                    ? "Welcome! Let's start your learning journey!" 
                    : completed === journeyLessons.length 
                      ? "Amazing work! You've mastered this topic! 🎉"
                      : "Great progress! Keep learning to unlock more!"}
                  size="md"
                />
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-medium">Professor's Tip</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {completed === 0 
                      ? "Take your time and have fun learning!"
                      : "Every lesson brings you closer to being a nutrition expert!"}
                  </p>
                </div>
              </div>

              <WeeklyChallenge />
              <TopicLessonsList lessons={journeyLessons} completed={completed} />
              <LeaderboardCard userXp={userXp} userName={userName} />
              <AdPlaceholder />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <BottomNavigation />
      </div>

      <div className="hidden md:block fixed bottom-20 left-4 w-[200px]">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-lg">
          <LessonMascot
            type="professor"
            message="Need help? Tap me!"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
