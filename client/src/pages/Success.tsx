import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import * as confettiModule from 'canvas-confetti';
import oniCelebrateImage from '@assets/Mascots/Oni_celebrate.png';
import oniProudImage from '@assets/Mascots/Oni_proud.png';
import captainCarrotImage from '@assets/Mascots/CaptainCarrot.png';
import coachFlexImage from '@assets/Mascots/CoachFlex.png';
import SuccessSidebar from '@/components/success/SuccessSidebar';
import SuccessRightColumn from '@/components/success/SuccessRightColumn';
import '../styles/tokens.css';

const confetti = confettiModule.default || confettiModule;

export default function Success() {
  const [, setLocation] = useLocation();
  const [isExiting, setIsExiting] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'food';
  const xp = params.get('xp') || '25';
  const logId = params.get('logId');

  const isActivity = type === 'activity';

  const theme = isActivity
    ? {
        primary: 'from-blue-500 to-indigo-600',
        accent: 'blue-500',
        glow: 'rgba(59, 130, 246, 0.3)',
        title: "You're on fire! 🔥",
        headerText: 'YOU CRUSHED IT!',
        headerEmoji: '💪',
        cardBorder: 'border-blue-200',
        cardBg: 'from-blue-50 to-indigo-50',
        accentColor: 'text-blue-500',
        streakBg: 'from-blue-500 to-indigo-600'
      }
    : {
        primary: 'from-orange-500 to-orange-600',
        accent: 'orange-500',
        glow: 'rgba(255, 106, 0, 0.3)',
        title: 'Super healthy! 🥕',
        headerText: 'AMAZING!',
        headerEmoji: '🎉',
        cardBorder: 'border-orange-200',
        cardBg: 'from-orange-50 to-amber-50',
        accentColor: 'text-orange-500',
        streakBg: 'from-orange-500 to-red-500'
      };

  useEffect(() => {
    const colors = isActivity
      ? ['#3B82F6', '#10B981', '#8B5CF6', '#06B6D4', '#6366F1']
      : ['#FF6A00', '#FFB800', '#FF4444', '#FFDD00', '#22C55E'];

    confetti({
      particleCount: 150,
      spread: 100,
      colors,
      origin: { y: 0.4 }
    });

    setTimeout(() => {
      confetti({
        particleCount: 75,
        angle: 60,
        spread: 70,
        colors,
        origin: { x: 0, y: 0.5 }
      });
      confetti({
        particleCount: 75,
        angle: 120,
        spread: 70,
        colors,
        origin: { x: 1, y: 0.5 }
      });
    }, 200);

    setTimeout(() => setShowContent(true), 300);

    const fadeTimer = setTimeout(() => setIsExiting(true), 4500);

    const redirectTimer = setTimeout(() => {
      setLocation(`/feedback?logId=${logId || 'temp'}&xp=${xp}&type=${type}`);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [setLocation, logId, xp, type, isActivity]);

  const oniImage = isActivity ? oniProudImage : oniCelebrateImage;
  const bounceClass = isActivity ? 'oni-celebrate-energetic' : 'oni-celebrate';

  return (
    <div className={`min-h-screen bg-white transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="h-screen flex">
        <div className="hidden lg:block">
          <SuccessSidebar isActivity={isActivity} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className={`bg-gradient-to-r ${theme.primary} text-white px-4 py-4 lg:px-8 lg:py-6`}>
            <div className="flex items-center justify-between max-w-2xl mx-auto lg:max-w-none">
              <div className="flex items-center gap-2">
                <span className="text-xl lg:text-2xl font-black tracking-wide">{theme.headerText}</span>
                <span className="text-2xl lg:text-3xl">{theme.headerEmoji}</span>
              </div>
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="flex items-center gap-1 lg:gap-2 bg-white/20 px-3 lg:px-4 py-1 lg:py-2 rounded-full text-sm">
                  <span className="flame-pulse text-lg lg:text-xl">🔥</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex items-center gap-1 lg:gap-2 bg-white/20 px-3 lg:px-4 py-1 lg:py-2 rounded-full text-sm">
                  <span className="text-lg lg:text-xl">⭐</span>
                  <span className="font-bold">{xp} XP</span>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            <main className="flex-1 overflow-y-auto bg-gray-50 lg:bg-white">
              <div className="p-5 lg:p-8 max-w-2xl mx-auto space-y-5 lg:space-y-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="absolute -top-6 -left-12 text-3xl star-float" style={{ animationDelay: '0s' }}>⭐</div>
                    <div className="absolute -top-4 -right-10 text-2xl star-float" style={{ animationDelay: '0.3s' }}>{isActivity ? '💪' : '✨'}</div>
                    <div className="absolute top-10 -left-14 text-2xl star-float" style={{ animationDelay: '0.6s' }}>🌟</div>
                    <div className="absolute top-8 -right-12 text-2xl star-float" style={{ animationDelay: '0.9s' }}>{isActivity ? '⚡' : '⭐'}</div>

                    <img
                      src={oniImage}
                      alt="Oni the Orange celebrating"
                      className={`w-36 h-36 lg:w-44 lg:h-44 mx-auto object-contain ${showContent ? bounceClass : 'opacity-0'}`}
                    />
                  </div>

                  <h1 className={`text-3xl lg:text-4xl font-black text-gray-800 mt-6 ${showContent ? 'text-pop' : 'opacity-0'}`}>
                    {theme.title}
                  </h1>
                </div>

                <div
                  className={`bg-white rounded-3xl border-2 ${theme.cardBorder} shadow-xl p-5 lg:p-6 card-hover transition-all duration-300 ${showContent ? 'slide-up' : 'opacity-0 translate-y-8'}`}
                  style={{ animationDelay: '0.3s' }}
                >
                  <h3 className="text-center font-bold text-gray-700 text-lg mb-4">What you logged:</h3>
                  <div className="flex justify-center gap-4">
                    <div className="text-center emoji-bounce">
                      <div className={`w-20 h-20 bg-gradient-to-br ${isActivity ? 'from-blue-50 to-blue-100 border-blue-300' : 'from-orange-50 to-orange-100 border-orange-300'} rounded-2xl flex items-center justify-center border-2 shadow-md`}>
                        <span className="text-5xl">{isActivity ? '⚽' : '🍎'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 font-bold">{isActivity ? 'Soccer' : 'Apple'}</p>
                    </div>
                    {!isActivity && (
                      <>
                        <div className="text-center emoji-bounce" style={{ animationDelay: '0.1s' }}>
                          <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 rounded-2xl flex items-center justify-center border-2 shadow-md">
                            <span className="text-5xl">🥕</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 font-bold">Carrots</p>
                        </div>
                        <div className="text-center emoji-bounce" style={{ animationDelay: '0.2s' }}>
                          <div className="w-20 h-20 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 rounded-2xl flex items-center justify-center border-2 shadow-md">
                            <span className="text-5xl">🥛</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 font-bold">Milk</p>
                        </div>
                      </>
                    )}
                  </div>
                  {isActivity && (
                    <div className="flex justify-center gap-3 mt-4">
                      <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <span>⏱️</span> 30 min
                      </span>
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <span>😃</span> Felt great!
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className={`bg-gradient-to-br ${theme.cardBg} rounded-3xl border-2 ${theme.cardBorder} shadow-xl p-5 lg:p-6 ${showContent ? 'slide-up' : 'opacity-0'}`}
                  style={{ animationDelay: '0.5s' }}
                >
                  <div className="text-center">
                    <div className={`text-4xl font-black ${theme.accentColor} xp-glow mb-2`}>
                      +{xp} XP
                    </div>
                    <p className="text-gray-600 text-sm mb-4">Experience points earned!</p>

                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`absolute inset-0 rounded-full progress-fill ${isActivity ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-gradient-to-r from-orange-400 to-orange-500'}`} 
                        style={{ width: '30%' }}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className={`px-3 py-1 rounded-full font-bold border ${isActivity ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-orange-100 text-orange-600 border-orange-200'}`}>Lv 3</span>
                      <span className={`px-3 py-1 rounded-full font-bold border ${isActivity ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-orange-100 text-orange-600 border-orange-200'}`}>Lv 4</span>
                    </div>
                  </div>
                </div>

                <div className={`flex justify-center ${showContent ? 'slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
                  <div className={`bg-gradient-to-r ${theme.streakBg} text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2`}>
                    <span className="flame-pulse text-2xl">🔥</span>
                    <span className="font-black text-lg">5-DAY STREAK!</span>
                    <span className="flame-pulse text-2xl">🔥</span>
                  </div>
                </div>

                <div className="lg:hidden slide-up" style={{ animationDelay: '0.9s' }}>
                  <div className="flex justify-center mb-3">
                    <img 
                      src={isActivity ? coachFlexImage : captainCarrotImage} 
                      alt={isActivity ? 'Coach Flex' : 'Captain Carrot'}
                      className="w-16 h-16 object-contain drop-shadow-lg"
                    />
                  </div>
                  
                  <div className={`relative bg-white rounded-3xl border-2 ${isActivity ? 'border-blue-100' : 'border-orange-100'} shadow-lg p-5 bubble-appear`}>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[12px] border-b-white"></div>
                    <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[14px] ${isActivity ? 'border-b-blue-100' : 'border-b-orange-100'}`}></div>
                    
                    <h3 className="font-bold text-gray-800 mb-3 text-center text-lg">
                      {isActivity ? 'Coach Flex' : 'Captain Carrot'} says:
                    </h3>
                    
                    <p className="text-gray-700 text-center leading-relaxed">
                      {isActivity 
                        ? "Amazing workout! Keep moving and having fun! 💪" 
                        : "Great food choices! You're fueling your body with awesome stuff! 🥕"}
                    </p>
                  </div>
                </div>
              </div>
            </main>

            <div className="hidden lg:block">
              <SuccessRightColumn isActivity={isActivity} streak={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
