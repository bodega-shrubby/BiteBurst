import brainyBoltImage from '@assets/Mascots/BrainyBolt.png';

interface LessonSection {
  emoji: string;
  color: 'blue' | 'green' | 'yellow' | 'cyan' | 'orange';
  heading: string;
  subEmoji: string;
  text: string;
}

interface LessonContentProps {
  title: string;
  mascot: {
    name: string;
    emoji: string;
    imagePath?: string | null;
  };
  intro: {
    greeting: string;
    message: string;
  };
  sections: LessonSection[];
  keyPoints: string[];
  mascotMessage: string;
  currentStep: number;
  totalSteps: number;
  lives: number;
  onContinue: () => void;
  onClose: () => void;
}

const colorMap: Record<string, { bg: string; border: string }> = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-400 to-blue-500',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-400 to-green-500',
    border: 'border-green-200',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-400 to-orange-400',
    border: 'border-yellow-200',
  },
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-400 to-blue-400',
    border: 'border-cyan-200',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-400 to-orange-500',
    border: 'border-orange-200',
  },
};

export function LessonContent({
  title,
  mascot,
  intro,
  sections,
  keyPoints,
  mascotMessage,
  currentStep,
  totalSteps,
  lives,
  onContinue,
  onClose,
}: LessonContentProps) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 via-yellow-50 to-white">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b-2 border-orange-100 px-4 py-3 z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-3 md:gap-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-all group"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-500 group-hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Progress Bar */}
          <div className="flex-1 h-4 md:h-5 bg-gray-200 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] md:text-xs font-bold text-white drop-shadow-sm">
                {currentStep}/{totalSteps}
              </span>
            </div>
          </div>

          {/* Lives */}
          <div className="flex items-center gap-1 bg-yellow-50 px-2 md:px-4 py-1 md:py-2 rounded-full border-2 border-yellow-200">
            {[...Array(lives)].map((_, i) => (
              <span
                key={i}
                className="text-lg md:text-xl animate-bounce"
                style={{ animationDelay: `${i * 0.1}s`, animationDuration: '2s' }}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content - Responsive */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row min-h-full">

          {/* Left Side - Mascot */}
          <div className="w-full md:w-2/5 lg:w-1/3 p-4 md:p-6 lg:p-8 flex flex-col items-center md:justify-start md:pt-24 justify-center bg-gradient-to-br from-orange-50 to-yellow-50 md:border-r-2 md:border-orange-100">
            {/* Mascot Avatar */}
            <div className="relative mb-4 md:mb-6">
              {/* Glow */}
              <div className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto rounded-full bg-orange-300/30 blur-xl animate-pulse" />

              {/* Sparkles */}
              <span className="absolute -top-2 -right-4 text-xl md:text-2xl animate-pulse">✨</span>
              <span className="absolute -top-1 left-0 text-lg md:text-xl animate-pulse" style={{ animationDelay: '0.3s' }}>⭐</span>
              <span className="absolute bottom-0 -right-2 text-base md:text-lg animate-pulse" style={{ animationDelay: '0.6s' }}>💫</span>

              {/* Mascot Image */}
              <div
                className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex items-center justify-center animate-bounce"
                style={{ animationDuration: '3s' }}
              >
                <img 
                  src={mascot.imagePath || brainyBoltImage} 
                  alt={mascot.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Name Badge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full border-2 border-orange-300 shadow-md">
                <span className="text-xs md:text-sm font-bold text-orange-600">{mascot.name}</span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mt-4">
              <div className="inline-block bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-1 rounded-full text-xs md:text-sm font-bold mb-2 md:mb-3 animate-bounce">
                🌟 LESSON TIME! 🌟
              </div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-800 leading-tight">
                {title.includes('SUPERPOWER') ? (
                  <>
                    {title.split('SUPERPOWER')[0]}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500">
                      SUPERPOWER!
                    </span> 💪
                  </>
                ) : (
                  <>{title} 💪</>
                )}
              </h1>
            </div>

            {/* Speech Bubble */}
            <div className="mt-4 md:mt-6 bg-white rounded-2xl border-2 border-orange-200 p-3 md:p-4 shadow-lg max-w-xs relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[12px] border-l-transparent border-r-transparent border-b-orange-200" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px] border-l-transparent border-r-transparent border-b-white" />
              <p className="text-gray-700 text-sm md:text-base leading-relaxed text-center font-medium">
                {intro.greeting} ⚡<br />
                {intro.message}
              </p>
            </div>
          </div>

          {/* Right Side - Cards */}
          <div className="w-full md:w-3/5 lg:w-2/3 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {/* Cards - Stack on mobile, 2-col grid on desktop */}
            <div className="space-y-3 md:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 max-w-2xl mx-auto">
              {sections.map((section, i) => {
                const colors = colorMap[section.color] || colorMap.orange;
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl border-2 ${colors.border} p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer`}
                  >
                    {/* Desktop: Centered layout */}
                    <div className="hidden lg:block text-center mb-3">
                      <div className={`w-16 h-16 mx-auto rounded-2xl ${colors.bg} flex items-center justify-center text-4xl shadow-md`}>
                        {section.emoji}
                      </div>
                    </div>
                    <h3 className="hidden lg:block font-extrabold text-gray-800 text-lg mb-2 text-center">
                      {section.heading} {section.subEmoji}
                    </h3>
                    <p className="hidden lg:block text-gray-600 text-base leading-relaxed text-center">
                      {section.text}
                    </p>

                    {/* Mobile/Tablet: Horizontal layout */}
                    <div className="lg:hidden flex gap-3 items-start">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${colors.bg} flex items-center justify-center text-2xl md:text-3xl shadow-md flex-shrink-0`}>
                        {section.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-extrabold text-gray-800 text-sm md:text-base mb-1">
                          {section.heading} {section.subEmoji}
                        </h3>
                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                          {section.text}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Remember Box */}
            <div className="mt-4 md:mt-6 max-w-2xl mx-auto bg-gradient-to-br from-yellow-100 via-orange-50 to-pink-50 rounded-3xl border-2 border-yellow-300 p-4 md:p-6 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-2xl">💡</span>
                <h3 className="font-bold text-xl text-orange-600">REMEMBER!</h3>
                <span className="text-2xl">🧠</span>
              </div>

              {/* Responsive Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {keyPoints.map((point, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 shadow-md border border-green-100 flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 font-medium text-sm leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascot Message */}
            <p className="mt-4 text-center text-gray-500 text-sm italic">
              "{mascotMessage}"
            </p>
          </div>
        </div>
      </main>

      {/* Footer - Full width sticky at bottom, outside grid */}
      <footer className="sticky bottom-0 z-40 bg-gradient-to-t from-amber-50 via-amber-50/95 to-transparent pt-6 pb-6">
        <div className="max-w-md mx-auto px-4">
          <button
            onClick={onContinue}
            className="w-full py-4 px-8 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 hover:from-orange-600 hover:via-orange-500 hover:to-yellow-500 text-white font-black text-lg md:text-xl uppercase tracking-wide rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3 active:scale-95"
            style={{ boxShadow: '0 0 20px rgba(255, 106, 0, 0.3)' }}
          >
            <span>LET'S GO!</span>
            <span className="text-xl md:text-2xl animate-bounce">🚀</span>
          </button>
          <p className="text-center text-sm text-gray-500 mt-2 font-medium">
            Tap to start the quiz! ✨
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LessonContent;
