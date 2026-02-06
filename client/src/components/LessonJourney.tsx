import { useMemo } from 'react';
import { Check } from 'lucide-react';
import treasureChestImg from '@/assets/images/treasure-chest.png';
import appleBuddyImg from '@/assets/Mascots/AppleBuddy.png';
import snackTwinsImg from '@/assets/Mascots/SnackTwins.png';

const GROUP_MASCOTS: Record<string, { src: string; alt: string }> = {
  'morning-energy-boost': { src: appleBuddyImg, alt: 'Apple Buddy' },
  'power-up-snacks': { src: snackTwinsImg, alt: 'Snack Twins' },
};

const THEMED_ICONS = [
  '🍎', '🥦', '🏀', '🥕', '🍌', '🧘', '🥗', '⚽',
  '🍇', '🌽', '🏊', '🍊', '🥑', '🚴', '🫐', '🥒',
  '🏃', '🍓', '🧃', '🤸', '🥝', '🌶️', '🏋️', '🍉',
];

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
        return 'bg-white border-orange-500 shadow-lg ring-4 ring-orange-200';
      case 'unlocked':
        return 'bg-white border-blue-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getBorderStyle = (state: string) => {
    if (state === 'locked') return 'opacity-50 border-gray-200';
    if (state === 'current') return 'border-orange-300';
    return 'border-gray-100';
  };

  const getThemedIcon = (groupIndex: number, levelIndex: number) => {
    const idx = (groupIndex * 3 + levelIndex) % THEMED_ICONS.length;
    return THEMED_ICONS[idx];
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
          {lessonGroups.map((group, groupIndex) => {
            const treasureUnlocked = allLevelsComplete(group);
            
            const mascotKey = group.baseId.replace(/^age\d+-t\d+-L\d+-/, '');
            const mascot = GROUP_MASCOTS[mascotKey];

            return (
              <div key={group.baseId}>
                {group.levels.map((lesson, levelIndex) => {
                  const isEven = renderIndex % 2 === 0;
                  const isClickable = lesson.state === 'current' || lesson.state === 'unlocked' || lesson.state === 'completed';
                  renderIndex++;
                  const themedIcon = getThemedIcon(groupIndex, levelIndex);
                  const showMascot = mascot && levelIndex === 0;

                  return (
                    <div key={lesson.id}>
                      {showMascot && (
                        <div className={`flex mb-4 ${isEven ? 'justify-end pr-6' : 'justify-start pl-6'}`}>
                          <img
                            src={mascot.src}
                            alt={mascot.alt}
                            className="w-14 h-14 object-contain drop-shadow-md"
                          />
                        </div>
                      )}
                      <div
                        className={`flex items-center mb-12 ${isEven ? 'justify-start pl-4' : 'justify-end pr-4'}`}
                      >
                        <div 
                          className={`flex items-center gap-3 ${isEven ? 'flex-row' : 'flex-row-reverse'} ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                          onClick={() => isClickable && onLessonClick(lesson.id)}
                        >
                          <div
                            className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-transform ${isClickable ? 'hover:scale-110' : ''} ${getNodeStyle(lesson.state)}`}
                          >
                            {lesson.state === 'completed' ? (
                              <Check className="w-8 h-8 text-white" strokeWidth={3} />
                            ) : (
                              <span className={`text-2xl ${lesson.state === 'locked' ? 'grayscale opacity-40' : lesson.state === 'current' ? '' : 'grayscale opacity-60'}`} style={{ filter: lesson.state === 'locked' ? 'grayscale(100%)' : lesson.state === 'current' ? 'none' : 'grayscale(80%)' }}>
                                {themedIcon}
                              </span>
                            )}
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
                          className={`w-16 h-16 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all ${
                            treasureUnlocked
                              ? 'bg-amber-100 border-amber-400 animate-bounce cursor-pointer hover:scale-110 shadow-lg'
                              : 'bg-gray-100 border-gray-300'
                          }`}
                        >
                          <img
                            src={treasureChestImg}
                            alt="Treasure Chest"
                            className={`w-10 h-10 object-contain transition-all ${
                              treasureUnlocked ? '' : 'grayscale opacity-40'
                            }`}
                          />
                        </div>
                        <div className={`bg-white rounded-xl px-4 py-2 shadow-lg max-w-[160px] border transition-all ${
                          treasureUnlocked ? 'border-amber-300' : 'border-gray-200 opacity-50'
                        }`}>
                          <p className="font-bold text-sm text-gray-800">+50 XP</p>
                          <p className="text-xs text-gray-500">Complete all levels</p>
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
