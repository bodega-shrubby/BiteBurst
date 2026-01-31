import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import { cleanLessons, type CleanLesson, type LessonState } from '@/data/clean-lessons';

interface ApiLesson {
  id: string;
  title: string;
  icon: string;
  topicId: string;
  topicTitle: string;
  sortOrder: number;
  description: string | null;
  state: LessonState;
}

interface LessonDisplayData {
  id: string;
  title: string;
  description: string;
  emoji: string;
  duration: number;
  xp: number;
  type: 'lesson' | 'quiz' | 'practice';
  status: 'completed' | 'current' | 'locked';
}

const LESSON_DESCRIPTIONS: Record<string, string> = {
  'fuel-for-football': 'Learn which foods give you energy to run faster',
  'brainfuel-for-school': 'Discover the building blocks for strong muscles',
  'hydration': 'Why water is your best friend during sports',
  'move': 'The best movement for active kids',
  'focus': 'Boost your concentration power',
  'veggies': 'Why vegetables are superpowers',
  'carbs': 'The best fuel sources for energy',
  'protein': 'Building blocks for growth',
  'colors': 'Eat the rainbow for health',
};

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Sarah K.', initial: 'S', xp: 450, color: 'bg-purple-400' },
  { rank: 2, name: 'Mike T.', initial: 'M', xp: 380, color: 'bg-blue-400' },
  { rank: 3, name: 'Alex R.', initial: 'A', xp: 290, color: 'bg-green-400' },
];

function mapApiToDisplayData(lessons: CleanLesson[]): LessonDisplayData[] {
  return lessons.map((lesson, index) => ({
    id: lesson.id,
    title: lesson.title.replace('\n', ' '),
    description: LESSON_DESCRIPTIONS[lesson.id] || 'Complete this lesson to earn XP!',
    emoji: lesson.icon,
    duration: 5,
    xp: index === lessons.length - 1 ? 25 : 15,
    type: index === 0 || index === lessons.length - 1 ? 'quiz' as const : 'lesson' as const,
    status: lesson.state === 'completed' ? 'completed' as const : 
            lesson.state === 'current' || lesson.state === 'unlocked' ? 'current' as const : 
            'locked' as const,
  }));
}

function LessonCard({ 
  lesson, 
  index, 
  onStart 
}: { 
  lesson: LessonDisplayData; 
  index: number; 
  onStart: () => void;
}) {
  const isCurrent = lesson.status === 'current';
  const isCompleted = lesson.status === 'completed';
  const isLocked = lesson.status === 'locked';

  return (
    <div 
      className={`lesson-card ${isCurrent ? 'current-glow' : ''} ${isLocked ? 'opacity-60' : ''}`}
      style={{
        transition: 'all 0.3s ease',
      }}
    >
      <div className={`bg-white rounded-2xl ${isCurrent ? 'border-2 border-orange-200' : 'border border-gray-200'} shadow-sm overflow-hidden`}>
        <div className="flex">
          <div className={`w-16 ${isCurrent ? 'bg-orange-500' : isCompleted ? 'bg-green-500' : 'bg-gray-200'} flex flex-col items-center justify-center py-4`}>
            <span className={`${isCurrent || isCompleted ? 'text-white' : 'text-gray-400'} text-2xl font-bold`}>
              {isCompleted ? '✓' : index + 1}
            </span>
          </div>

          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-bold text-base ${isCurrent || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {lesson.emoji} {lesson.title}
                </h3>
                <p className={`text-sm ${isCurrent || isCompleted ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                  {lesson.description}
                </p>
                <div className="flex items-center space-x-2 mt-3">
                  <span className={`${isCurrent || isCompleted ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-400'} text-xs px-2 py-1 rounded-full`}>
                    {lesson.duration} min
                  </span>
                  <span className={`${isCurrent || isCompleted ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'} text-xs px-2 py-1 rounded-full`}>
                    +{lesson.xp} XP
                  </span>
                  {lesson.type === 'quiz' && (isCurrent || isCompleted) && (
                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">Quiz</span>
                  )}
                </div>
              </div>
              {isCurrent && <div className="text-4xl">🥗</div>}
              {isCompleted && <div className="text-4xl">✅</div>}
              {isLocked && <div className="text-3xl opacity-30">{lesson.emoji}</div>}
            </div>
          </div>

          {isCurrent ? (
            <div 
              onClick={onStart}
              className="w-28 bg-green-500 flex items-center justify-center cursor-pointer hover:bg-green-600 transition"
            >
              <div className="text-center text-white">
                <span className="text-xl">▶️</span>
                <p className="text-sm font-bold mt-1">START</p>
              </div>
            </div>
          ) : isCompleted ? (
            <div className="w-28 bg-green-100 flex items-center justify-center">
              <div className="text-center text-green-600">
                <span className="text-xl">✅</span>
                <p className="text-xs mt-1">Done</p>
              </div>
            </div>
          ) : (
            <div className="w-28 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <span className="text-xl">🔒</span>
                <p className="text-xs mt-1">Locked</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PathConnector({ active = false }: { active?: boolean }) {
  return (
    <div className="flex justify-center">
      <div 
        className="w-0.5 h-6 rounded-full"
        style={{
          background: active
            ? 'repeating-linear-gradient(to bottom, #86efac 0px, #86efac 8px, transparent 8px, transparent 16px)'
            : 'repeating-linear-gradient(to bottom, #e5e7eb 0px, #e5e7eb 8px, transparent 8px, transparent 16px)'
        }}
      />
    </div>
  );
}

function CheckpointReward({ completed, required }: { completed: number; required: number }) {
  const isLocked = completed < required;
  const progressPercent = Math.min((completed / required) * 100, 100);

  return (
    <div className="flex justify-center py-4">
      <div 
        className="bg-white rounded-2xl px-6 py-5 border border-gray-200 shadow-sm max-w-lg w-full"
        style={{
          animation: 'subtle-glow 3s ease-in-out infinite',
        }}
      >
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center border border-amber-300">
              <span className="text-3xl">📦</span>
            </div>
            {isLocked && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-xs">🔒</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h4 className="font-bold text-gray-800">Checkpoint Reward</h4>
            <p className="text-sm text-gray-500 mt-0.5">Complete {required} lessons to unlock</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{completed} / {required}</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all" 
                  style={{ width: `${progressPercent}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="text-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-lg">🎁</div>
            <div className="text-xs text-gray-600 font-medium">+50 XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopicLessonsList({ lessons, completed }: { lessons: LessonDisplayData[]; completed: number }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base text-gray-800">Topic Lessons</h3>
        <span className="text-sm text-gray-400">{completed}/{lessons.length}</span>
      </div>

      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.status === 'current';
          const isLocked = lesson.status === 'locked';
          const isCompleted = lesson.status === 'completed';

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
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span className={`text-sm flex-1 ${isCurrent || isCompleted ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                  {lesson.title}
                </span>
                {isCurrent && <span className="text-green-500 text-xs">▶</span>}
                {isCompleted && <span className="text-green-500 text-xs">✓</span>}
                {isLocked && <span className="text-gray-400 text-xs">🔒</span>}
              </div>
              
              {(index === 2 || index === 5) && (
                <div className="flex items-center space-x-3 py-2 px-2 rounded-lg opacity-50">
                  <span className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 text-xs">📦</span>
                  <span className="text-sm text-amber-700 flex-1">Checkpoint Reward</span>
                  <span className="text-amber-600 text-xs">{Math.min(completed, index + 1)}/{index + 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

export default function Lessons() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  
  const curriculumId = user?.curriculum || 'uk-ks2';
  
  const { data: apiLessons, isLoading: lessonsLoading } = useQuery<ApiLesson[]>({
    queryKey: [`/api/curriculum/${curriculumId}/lessons`, user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/curriculum/${curriculumId}/lessons?userId=${user?.id}`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch lessons');
      return res.json();
    },
    enabled: !!user && !!curriculumId,
  });

  const displayLessons: LessonDisplayData[] = useMemo(() => {
    if (apiLessons && apiLessons.length > 0) {
      const mappedLessons: CleanLesson[] = apiLessons.map(l => ({
        id: l.id,
        title: l.title,
        icon: l.icon,
        state: l.state
      }));
      return mapApiToDisplayData(mappedLessons);
    }
    return mapApiToDisplayData(cleanLessons);
  }, [apiLessons]);

  const completed = displayLessons.filter(l => l.status === 'completed').length;
  const progressPercent = displayLessons.length > 0 ? (completed / displayLessons.length) * 100 : 0;
  const userXp = user?.totalXp || 85;
  const userName = user?.displayName || 'You';

  const handleLessonStart = (lessonId: string) => {
    setLocation(`/lesson/${lessonId}`);
  };

  const getFirstAvailableLesson = () => {
    const current = displayLessons.find(l => l.status === 'current');
    return current?.id || displayLessons[0]?.id || 'fuel-for-football';
  };

  if (loading || lessonsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-bounce">🍊</div>
          <p className="text-gray-600 font-medium">Loading lessons...</p>
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
      <style>{`
        .lesson-card {
          transition: all 0.3s ease;
        }
        .lesson-card:hover {
          transform: translateY(-3px);
        }
        .current-glow {
          box-shadow: 0 0 20px rgba(255, 106, 0, 0.15);
        }
        .current-glow:hover {
          box-shadow: 0 0 30px rgba(255, 106, 0, 0.25);
        }
        @keyframes subtle-glow {
          0%, 100% { box-shadow: 0 4px 15px rgba(180, 140, 80, 0.15); }
          50% { box-shadow: 0 4px 20px rgba(180, 140, 80, 0.25); }
        }
        .mascot-peek {
          animation: peek 4s ease-in-out infinite;
        }
        @keyframes peek {
          0%, 80%, 100% { transform: translateX(0); }
          10%, 70% { transform: translateX(10px); }
        }
      `}</style>

      <Sidebar />

      <div className="flex min-h-screen md:ml-[200px]">
        <div className="flex-1 flex justify-center">
          <div className="flex max-w-[1100px] w-full">
            
            <div className="flex-1 min-w-0 bg-white">
              <header className="sticky top-0 z-30">
                <div 
                  className="px-6 py-6"
                  style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <button 
                      onClick={() => setLocation('/dashboard')}
                      className="text-white/80 hover:text-white text-sm flex items-center space-x-1"
                    >
                      <span>←</span>
                      <span>Back</span>
                    </button>
                    <span className="text-white/40">|</span>
                    <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Week 1 of 8
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-white">Sports Nutrition: Week 1</h1>
                  <p className="text-orange-100 text-sm mt-1 flex items-center space-x-2">
                    <span>⚽ Football Edition</span>
                    <span>•</span>
                    <span>{displayLessons.length} Lessons</span>
                    <span>•</span>
                    <span>~{displayLessons.length * 5} min</span>
                  </p>
                </div>

                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🏅</span>
                      <div>
                        <div className="text-base font-bold text-gray-900">{completed}/{displayLessons.length}</div>
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

              <div className="px-6 py-6 bg-gray-50">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-xl">📚</span>
                      </div>
                      <div>
                        <div className="text-base font-bold text-gray-900">{completed} of {displayLessons.length} lessons</div>
                        <div className="text-sm text-gray-500">Complete lessons to earn XP!</div>
                      </div>
                    </div>
                    <div className="text-2xl">🎯</div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 bg-green-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    💡 {completed === 0 
                      ? `Tap "${displayLessons[0]?.title}" to start your journey!`
                      : completed === displayLessons.length 
                        ? "Amazing! You've completed all lessons!"
                        : "Great progress! Keep going to unlock more lessons!"
                    }
                  </p>
                </div>

                <div className="space-y-4">
                  {displayLessons.slice(0, 3).map((lesson, index) => (
                    <div key={lesson.id}>
                      <LessonCard 
                        lesson={lesson} 
                        index={index} 
                        onStart={() => handleLessonStart(lesson.id)} 
                      />
                      {index < 2 && <PathConnector active={lesson.status === 'completed'} />}
                    </div>
                  ))}

                  <CheckpointReward completed={completed} required={3} />

                  <PathConnector active={completed >= 3} />

                  {displayLessons.slice(3, 6).map((lesson, index) => (
                    <div key={lesson.id}>
                      <LessonCard 
                        lesson={lesson} 
                        index={index + 3} 
                        onStart={() => handleLessonStart(lesson.id)} 
                      />
                      {index < 2 && <PathConnector active={lesson.status === 'completed'} />}
                    </div>
                  ))}

                  {displayLessons.length > 6 && (
                    <div className="text-center py-4">
                      <p className="text-gray-400 text-sm">+ {displayLessons.length - 6} more lessons below</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Next Topic</span>
                      <h3 className="text-lg font-bold text-gray-800 mt-1">🌊 Hydration Heroes</h3>
                      <p className="text-sm text-gray-500 mt-1">Learn why water is your superpower!</p>
                    </div>
                    <div className="text-4xl opacity-40">🔒</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">
              <WeeklyChallenge />
              <TopicLessonsList lessons={displayLessons} completed={completed} />
              <LeaderboardCard userXp={userXp} userName={userName} />
              <AdPlaceholder />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <BottomNavigation />
      </div>

      <div className="hidden md:block fixed bottom-20 left-4 w-[180px]">
        <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center mascot-peek">
              <span className="text-2xl">🍊</span>
            </div>
            <div className="text-xs text-gray-600">
              <p className="font-semibold">Need help?</p>
              <p className="text-gray-400">Tap me!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
