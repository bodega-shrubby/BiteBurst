import { useMemo } from 'react';

interface Lesson {
  id: string;
  title: string;
  icon: string;
  state: 'completed' | 'current' | 'unlocked' | 'locked';
  xp: number;
  topicId?: string;
  topicTitle?: string;
  difficultyLevel: number;
}

interface LessonGroup {
  baseId: string;
  baseName: string;
  icon: string;
  levels: Lesson[];
}

interface LessonJourneyProps {
  lessons: Lesson[];
  onLessonClick: (lessonId: string) => void;
}

function groupLessonsByBaseId(lessons: Lesson[]): LessonGroup[] {
  const groups = new Map<string, LessonGroup>();

  lessons.forEach(lesson => {
    const baseId = lesson.id
      .replace(/-medium$/, '')
      .replace(/-hard$/, '');

    const baseName = lesson.title
      .replace(/ - Level \d$/, '')
      .replace(/ - Level 1$/, '')
      .replace(/ - Level 2$/, '')
      .replace(/ - Level 3$/, '');

    if (!groups.has(baseId)) {
      groups.set(baseId, {
        baseId,
        baseName,
        icon: lesson.icon,
        levels: []
      });
    }

    groups.get(baseId)!.levels.push(lesson);
  });

  groups.forEach(group => {
    group.levels.sort((a, b) => a.difficultyLevel - b.difficultyLevel);
  });

  return Array.from(groups.values());
}

export default function LessonJourney({ lessons, onLessonClick }: LessonJourneyProps) {
  const lessonGroups = useMemo(() => groupLessonsByBaseId(lessons), [lessons]);

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

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1: return 'Level 1';
      case 2: return 'Level 2';
      case 3: return 'Level 3';
      default: return `Level ${level}`;
    }
  };

  const allLevelsComplete = (group: LessonGroup) => {
    return group.levels.every(level => level.state === 'completed');
  };

  const totalNodes = lessonGroups.reduce((acc, group) => acc + group.levels.length + 1, 0);
  const pathHeight = totalNodes * 100 + 60;

  let nodeIndex = 0;
  const nodePositions: { x: number; y: number }[] = [];
  
  lessonGroups.forEach(group => {
    group.levels.forEach(() => {
      const y = 60 + nodeIndex * 100;
      const x = nodeIndex % 2 === 0 ? 80 : 220;
      nodePositions.push({ x, y });
      nodeIndex++;
    });
    const y = 60 + nodeIndex * 100;
    const x = nodeIndex % 2 === 0 ? 80 : 220;
    nodePositions.push({ x, y });
    nodeIndex++;
  });

  const generatePath = () => {
    const points: string[] = [];
    nodePositions.forEach((pos, index) => {
      if (index === 0) {
        points.push(`M ${pos.x} ${pos.y}`);
      } else {
        const prevPos = nodePositions[index - 1];
        const midY = (prevPos.y + pos.y) / 2;
        points.push(`Q ${prevPos.x} ${midY} ${pos.x} ${pos.y}`);
      }
    });
    return points.join(' ');
  };

  let renderIndex = 0;

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
          {lessonGroups.map((group) => {
            const treasureUnlocked = allLevelsComplete(group);
            
            return (
              <div key={group.baseId}>
                {group.levels.map((lesson) => {
                  const isEven = renderIndex % 2 === 0;
                  const isClickable = lesson.state === 'current' || lesson.state === 'unlocked' || lesson.state === 'completed';
                  renderIndex++;

                  return (
                    <div key={lesson.id}>
                      <div
                        className={`flex items-center mb-12 ${isEven ? 'justify-start pl-4' : 'justify-end pr-4'}`}
                      >
                        <div 
                          className={`flex items-center gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse'} ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                          onClick={() => isClickable && onLessonClick(lesson.id)}
                        >
                          <div
                            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl transition-transform ${isClickable ? 'hover:scale-110' : ''} ${getNodeStyle(lesson.state)}`}
                          >
                            {getNodeContent(lesson)}
                          </div>

                          <div className={`bg-white rounded-xl px-4 py-2 shadow-lg max-w-[180px] border transition-shadow ${isClickable ? 'hover:shadow-xl' : ''} ${getBorderStyle(lesson.state)}`}>
                            <p className="font-bold text-sm text-gray-800">{group.baseName}</p>
                            <p className="text-xs text-gray-500">{getLevelLabel(lesson.difficultyLevel)}</p>
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
                    </div>
                  );
                })}

                {(() => {
                  const isEven = renderIndex % 2 === 0;
                  renderIndex++;
                  
                  return (
                    <div className={`flex items-center mb-12 ${isEven ? 'justify-start pl-4' : 'justify-end pr-4'}`}>
                      <div className={`flex items-center gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div
                          className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl transition-all ${
                            treasureUnlocked
                              ? 'bg-amber-400 border-amber-500 animate-bounce shadow-lg shadow-amber-300 cursor-pointer hover:scale-110'
                              : 'bg-amber-100 border-amber-200 opacity-50'
                          }`}
                        >
                          {treasureUnlocked ? '🎁' : '🎁'}
                        </div>
                        <div className={`bg-white rounded-xl px-4 py-2 shadow-lg max-w-[160px] border ${treasureUnlocked ? 'border-amber-300' : 'border-gray-200 opacity-50'}`}>
                          <p className="font-bold text-sm text-amber-800">Checkpoint Reward</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-amber-600 font-medium">+50 XP</span>
                            {!treasureUnlocked && (
                              <span className="text-xs text-gray-400">Complete all levels</span>
                            )}
                            {treasureUnlocked && (
                              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">CLAIM</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
