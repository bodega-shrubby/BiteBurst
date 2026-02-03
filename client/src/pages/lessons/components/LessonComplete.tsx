import { Button } from '@/components/ui/button';
import oniProudImage from '@assets/Mascots/Oni_proud.png';

interface LessonCompleteProps {
  lessonTitle: string;
  totalXp: number;
  correctAnswers: number;
  totalQuestions: number;
  streakDays?: number;
  achievement?: {
    title: string;
    description: string;
  };
  onContinue: () => void;
  onBackToDashboard: () => void;
}

export default function LessonComplete({
  lessonTitle,
  totalXp,
  correctAnswers,
  totalQuestions,
  streakDays,
  achievement,
  onContinue,
  onBackToDashboard
}: LessonCompleteProps) {
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 via-yellow-50 to-white relative overflow-hidden">
      {/* Confetti Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-4 left-8 text-2xl animate-bounce" style={{ animationDelay: '0s' }}>🎊</span>
        <span className="absolute top-4 right-8 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎉</span>
        <span className="absolute top-12 left-1/4 text-xl animate-bounce" style={{ animationDelay: '0.4s' }}>⭐</span>
        <span className="absolute top-12 right-1/4 text-xl animate-bounce" style={{ animationDelay: '0.6s' }}>✨</span>
        <span className="absolute top-20 left-12 text-lg animate-bounce" style={{ animationDelay: '0.3s' }}>🌟</span>
        <span className="absolute top-20 right-12 text-lg animate-bounce" style={{ animationDelay: '0.5s' }}>🎊</span>
      </div>

      {/* Header (Progress Complete) */}
      <div className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur border-b border-gray-100">
        <button 
          onClick={onBackToDashboard}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <span className="text-gray-500 text-xl">✕</span>
        </button>
        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 rounded-full w-full"></div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#FF6A00">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 relative z-10">
        {/* Celebrating Mascot */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-orange-300 mascot-celebrate">
              <img
                src={oniProudImage}
                alt="Oni Celebrating"
                className="w-24 h-24 object-contain"
              />
            </div>
            <span className="absolute -top-2 -right-2 text-3xl">🎉</span>
            <span className="absolute -bottom-1 -left-2 text-2xl">⭐</span>
          </div>
        </div>

        {/* Completion Message */}
        <div className="text-center mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Lesson Complete!</h1>
          <p className="text-orange-600 font-medium">Amazing work, you're a star! ⭐</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-orange-100 mb-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-500">{totalXp}</div>
              <div className="text-xs text-gray-500">Total XP</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500">{correctAnswers}/{totalQuestions}</div>
              <div className="text-xs text-gray-500">Correct</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-500">{accuracy}%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
          </div>
        </div>

        {/* Achievement Unlocked (Optional) */}
        {achievement && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white mb-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <p className="text-xs opacity-80">Achievement Unlocked!</p>
                <p className="font-bold">{achievement.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Streak Bonus */}
        {streakDays && streakDays > 1 && (
          <div className="flex items-center justify-center gap-3 bg-orange-50 rounded-xl p-3 mb-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-bold text-orange-600">{streakDays} Day Streak!</p>
              <p className="text-xs text-orange-500">+5 bonus XP</p>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '1s' }}>
          <Button
            onClick={onContinue}
            className="w-full py-4 h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg uppercase tracking-wide shadow-lg hover:from-orange-600 hover:to-orange-700"
          >
            Continue Learning
          </Button>
          <Button
            onClick={onBackToDashboard}
            variant="ghost"
            className="w-full py-3 h-12 rounded-2xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
