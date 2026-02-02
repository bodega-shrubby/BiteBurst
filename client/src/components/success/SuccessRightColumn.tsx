import captainCarrotImage from '@assets/Mascots/CaptainCarrot.png';
import coachFlexImage from '@assets/Mascots/CoachFlex.png';

interface SuccessRightColumnProps {
  isActivity?: boolean;
  feedback?: string;
  isLoading?: boolean;
  streak?: number;
  badges?: string[];
}

export default function SuccessRightColumn({ 
  isActivity = false, 
  feedback,
  isLoading = false,
  streak = 5,
  badges = []
}: SuccessRightColumnProps) {
  const tipMascot = isActivity ? coachFlexImage : captainCarrotImage;
  const tipName = isActivity ? 'Coach Flex' : 'Captain Carrot';
  
  const theme = isActivity 
    ? {
        borderColor: 'border-blue-100',
        accentBg: 'from-blue-50 to-indigo-50',
        spinnerColor: 'border-blue-500'
      }
    : {
        borderColor: 'border-orange-100',
        accentBg: 'from-orange-50 to-amber-50',
        spinnerColor: 'border-orange-500'
      };

  return (
    <div className="w-[280px] bg-gray-50 border-l border-gray-200 p-4 space-y-4 overflow-y-auto">
      <div className="flex justify-center">
        <img 
          src={tipMascot} 
          alt={tipName}
          className="w-20 h-20 object-contain drop-shadow-lg"
        />
      </div>
      
      <div className={`relative bg-white rounded-2xl border-2 ${theme.borderColor} shadow-lg p-4 bubble-appear`}>
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
        <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] ${isActivity ? 'border-b-blue-100' : 'border-b-orange-100'}`}></div>
        
        <h3 className="font-bold text-gray-800 mb-2 text-center text-sm">
          {tipName} says:
        </h3>
        
        {isLoading ? (
          <div className="text-center text-gray-500 py-2">
            <div className={`animate-spin w-5 h-5 border-2 ${theme.spinnerColor} border-t-transparent rounded-full mx-auto mb-2`}></div>
            <p className="text-xs">Getting feedback...</p>
          </div>
        ) : feedback ? (
          <p className="text-gray-700 text-center leading-relaxed text-sm">
            {feedback}
          </p>
        ) : (
          <p className="text-gray-700 text-center leading-relaxed text-sm">
            {isActivity 
              ? "Great job staying active! Keep moving and having fun!" 
              : "Great food choices! You're fueling your body with awesome stuff!"}
          </p>
        )}
      </div>

      <div className={`bg-gradient-to-br ${theme.accentBg} rounded-2xl border ${isActivity ? 'border-blue-200' : 'border-orange-200'} p-4`}>
        <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
          <span>💡</span> Fun Fact
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {isActivity 
            ? "Did you know? Just 30 minutes of exercise can boost your mood for up to 12 hours!" 
            : "Did you know? Eating colorful fruits and veggies gives your body superpowers!"}
        </p>
      </div>

      {isActivity && (
        <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200`}>
          <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
            <span>📊</span> This Week
          </h3>
          <div className="flex justify-between gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="flex-1 text-center">
                <div
                  className={`rounded-lg mb-1 ${i < streak ? 'bg-blue-500' : 'bg-gray-200'}`}
                  style={{ height: `${20 + (i < streak ? Math.random() * 30 : 0)}px` }}
                />
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {badges.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
            <span>🏅</span> Recent Badges
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {badges.slice(0, 6).map((badge, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center mx-auto border border-yellow-200">
                  <span className="text-2xl">{badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2">
          <span>🔥</span> Streak Power
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">{streak} days</span>
          <div className="flex gap-0.5">
            {[...Array(7)].map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full ${i < streak ? 'bg-orange-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
