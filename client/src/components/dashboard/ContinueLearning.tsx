import { useLocation } from 'wouter';

interface ContinueLearningProps {
  lesson?: {
    id: string;
    title: string;
    topicName: string;
    progress: number;
    currentSlide: number;
    totalSlides: number;
    emoji?: string;
  };
  onStartLesson?: () => void;
}

export default function ContinueLearning({ lesson, onStartLesson }: ContinueLearningProps) {
  const [, setLocation] = useLocation();

  const defaultLesson = {
    id: 'default',
    title: 'The Boss Battle',
    topicName: 'Sports Nutrition',
    progress: 60,
    currentSlide: 3,
    totalSlides: 5,
    emoji: '⚽',
  };

  const currentLesson = lesson || defaultLesson;

  const handleStartLesson = () => {
    if (onStartLesson) {
      onStartLesson();
    } else {
      setLocation(`/lessons/${currentLesson.id}`);
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-3xl p-6">
      <div className="flex items-center gap-5">
        <div className="w-[90px] h-[90px] bg-gradient-to-br from-[#4A90D9] to-[#7AB8F5] rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 shadow-md">
          {currentLesson.emoji || '📚'}
        </div>

        <div className="flex-1 min-w-0">
          <span className="inline-block bg-[#E8F4FD] text-[#2E6BB5] text-xs font-bold px-3 py-1 rounded-full mb-2">
            📚 CONTINUE LEARNING
          </span>

          <h3 className="font-extrabold text-lg text-orange-500 mb-2">
            {currentLesson.title}
          </h3>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
                style={{ width: `${currentLesson.progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-gray-500">
              {currentLesson.currentSlide} of {currentLesson.totalSlides}
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
