interface Lesson {
  id: string;
  title: string;
  icon: string;
  state: 'completed' | 'current' | 'unlocked' | 'locked';
  xp: number;
  topicId?: string;
  topicTitle?: string;
}

interface LessonJourneyProps {
  lessons: Lesson[];
  onLessonClick: (lessonId: string) => void;
}

export default function LessonJourney({ lessons, onLessonClick }: LessonJourneyProps) {

  const getNodeStyle = (state: string) => {
    switch (state) {
      case 'completed':
        return 'bg-green-500 border-green-600 text-white shadow-lg';
      case 'current':
        return 'bg-orange-500 border-orange-600 text-white shadow-lg animate-pulse ring-4 ring-orange-200';
      case 'unlocked':
        return 'bg-blue-100 border-blue-300 text-blue-700';
      default:
        return 'bg-gray-200 border-gray-300 text-gray-400';
    }
  };

  const getBorderStyle = (state: string) => {
    if (state === 'locked') return 'opacity-50 border-gray-200';
    if (state === 'current') return 'border-orange-300';
    return 'border-gray-100';
  };

  const getNodeContent = (lesson: Lesson) => {
    if (lesson.state === 'completed') return '✓';
    if (lesson.state === 'locked') return '🔒';
    return lesson.icon;
  };

  const pathHeight = lessons.length * 100 + 60;

  const generatePath = () => {
    const points: string[] = [];
    lessons.forEach((_, index) => {
      const y = 60 + index * 100;
      const x = index % 2 === 0 ? 80 : 220;
      const prevX = index % 2 === 0 ? 220 : 80;

      if (index === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        const prevY = 60 + (index - 1) * 100;
        const midY = (prevY + y) / 2;
        points.push(`Q ${prevX} ${midY} ${x} ${y}`);
      }
    });
    return points.join(' ');
  };

  return (
    <div className="p-6 bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
      <div className="max-w-md mx-auto relative">
        <svg
          className="absolute inset-0 w-full pointer-events-none"
          style={{ zIndex: 0, height: pathHeight }}
          viewBox={`0 0 300 ${pathHeight}`}
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#d1d5db" />
            </linearGradient>
          </defs>
          <path
            d={generatePath()}
            stroke="url(#pathGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="12 8"
          />
        </svg>

        <div className="relative" style={{ zIndex: 1 }}>
          {lessons.map((lesson, index) => {
            const isEven = index % 2 === 0;
            const isClickable = lesson.state === 'current' || lesson.state === 'unlocked' || lesson.state === 'completed';

            return (
              <div key={lesson.id}>
                <div
                  className={`flex items-center mb-12 ${isEven ? 'justify-start pl-4' : 'justify-end pr-4'}`}
                >
                  <div className={`flex items-center gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div
                      className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl transition-transform ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${getNodeStyle(lesson.state)}`}
                      onClick={() => isClickable && onLessonClick(lesson.id)}
                    >
                      {getNodeContent(lesson)}
                    </div>

                    <div className={`bg-white rounded-xl px-4 py-2 shadow-lg max-w-[160px] border ${getBorderStyle(lesson.state)}`}>
                      <p className="font-bold text-sm text-gray-800">{lesson.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-600 font-medium">+{lesson.xp} XP</span>
                        {lesson.state === 'current' && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">START</span>
                        )}
                        {lesson.state === 'completed' && (
                          <span className="text-green-500 text-xs">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {(index + 1) % 3 === 0 && index < lessons.length - 1 && (
                  <div className="flex justify-center mb-12">
                    <div className="bg-yellow-100 border-2 border-yellow-300 rounded-2xl px-5 py-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-200 rounded-xl flex items-center justify-center text-xl">
                        🎁
                      </div>
                      <div>
                        <p className="font-bold text-yellow-800 text-sm">Checkpoint!</p>
                        <p className="text-xs text-yellow-600">+50 XP</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-4 mb-8">
          <div className="text-center">
            <span className="text-4xl">🏆</span>
            <p className="text-sm font-bold text-gray-600 mt-1">Complete All!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
