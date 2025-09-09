import { CleanLesson } from '@/data/clean-lessons';

interface LessonCircleProps {
  lesson: CleanLesson;
  y: number;
  onClick?: () => void;
}

export default function LessonCircle({ lesson, y, onClick }: LessonCircleProps) {
  const isCurrent = lesson.state === 'current';
  const isUnlocked = lesson.state === 'unlocked';
  const isLocked = lesson.state === 'locked';
  const isCompleted = lesson.state === 'completed';
  const isInteractive = isCurrent || isUnlocked;

  // Styling based on state
  const circleBackground = isCurrent ? 'bg-blue-400' : 'bg-white';
  const ringColor = isCompleted ? 'border-green-500' : isCurrent ? 'border-blue-400' : isUnlocked ? 'border-gray-300' : 'border-gray-300';
  const emojiOpacity = isLocked ? 'grayscale opacity-50' : '';
  const emojiColor = isCurrent ? 'text-white' : '';

  return (
    <div
      className="absolute left-1/2 transform -translate-x-1/2"
      style={{ top: y }}
    >
      {/* Main circle */}
      <button
        onClick={isInteractive ? onClick : undefined}
        disabled={!isInteractive}
        className={`
          w-[72px] h-[72px] rounded-full border-4 ${circleBackground} ${ringColor}
          flex items-center justify-center
          shadow-lg transition-all duration-200
          ${isInteractive ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
          ${isInteractive ? 'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2' : ''}
        `}
      >
        <span className={`text-2xl ${emojiColor} ${emojiOpacity}`}>
          {lesson.icon}
        </span>
      </button>

      {/* START pill for current lesson */}
      {isCurrent && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-white text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-400">
            START
          </div>
        </div>
      )}

      {/* Lesson title */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-xs font-medium text-gray-700 whitespace-pre leading-tight">
          {lesson.title}
        </div>
      </div>
    </div>
  );
}