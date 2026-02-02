import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import * as confettiModule from 'canvas-confetti';
import oniCelebrateImage from '@assets/Mascots/Oni_celebrate.png';
import oniProudImage from '@assets/Mascots/Oni_proud.png';
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
        accentBorder: 'border-blue-300',
        accentBg: 'bg-blue-50',
        accentText: 'text-blue-500',
        glow: 'rgba(59, 130, 246, 0.3)',
        title: "You're on fire!",
        emoji: '🔥',
        headerText: 'YOU CRUSHED IT!',
        headerEmoji: '💪'
      }
    : {
        primary: 'from-orange-500 to-orange-600',
        accent: 'orange-500',
        accentBorder: 'border-orange-300',
        accentBg: 'bg-orange-50',
        accentText: 'text-orange-500',
        glow: 'rgba(255, 106, 0, 0.3)',
        title: 'Super healthy!',
        emoji: '🥕',
        headerText: 'AMAZING!',
        headerEmoji: '🎉'
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

  return (
    <div className={`min-h-screen bg-white transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <header className={`bg-gradient-to-r ${theme.primary} text-white px-4 py-4`}>
        <div className="flex items-center justify-between max-w-md mx-auto">
          <span className="text-xl font-black">
            {theme.headerText} {theme.headerEmoji}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
              <span>🔥</span>
              <span className="font-bold">5</span>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
              <span>⭐</span>
              <span className="font-bold">{xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-8 text-2xl bb-star-float" style={{ animationDelay: '0s' }}>⭐</div>
            <div className="absolute -top-2 -right-6 text-xl bb-star-float" style={{ animationDelay: '0.3s' }}>✨</div>
            <div className="absolute top-8 -left-10 text-xl bb-star-float" style={{ animationDelay: '0.6s' }}>🌟</div>
            <div className="absolute top-6 -right-8 text-xl bb-star-float" style={{ animationDelay: '0.9s' }}>
              {isActivity ? '⚡' : '⭐'}
            </div>

            <img
              src={isActivity ? oniProudImage : oniCelebrateImage}
              alt="Oni the Orange celebrating"
              className={`w-36 h-36 mx-auto object-contain transition-all duration-500 ${showContent ? 'bb-mascot-bounce-success' : 'opacity-0 scale-75'}`}
            />
          </div>

          <h1 className={`text-3xl font-black text-gray-800 mt-4 transition-all duration-500 ${showContent ? 'bb-slide-in' : 'opacity-0 translate-y-4'}`}>
            {theme.title} {theme.emoji}
          </h1>
        </div>

        <div
          className={`bg-white rounded-3xl border-2 ${theme.accentBorder} shadow-xl p-5 mb-4 transition-all duration-500 ${showContent ? 'bb-slide-up' : 'opacity-0 translate-y-8'}`}
          style={{ animationDelay: '0.3s' }}
        >
          <h3 className="text-center font-bold text-gray-700 mb-4">What you logged:</h3>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className={`w-16 h-16 ${theme.accentBg} ${theme.accentBorder} rounded-xl flex items-center justify-center border-2`}>
                <span className="text-3xl">{isActivity ? '⚽' : '🍎'}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`bg-gradient-to-br ${isActivity ? 'from-blue-50 to-indigo-50 border-blue-300' : 'from-orange-50 to-amber-50 border-orange-300'} rounded-3xl border-2 shadow-xl p-5 mb-4 transition-all duration-500 ${showContent ? 'bb-slide-up' : 'opacity-0 translate-y-8'}`}
          style={{ animationDelay: '0.5s' }}
        >
          <div className="text-center">
            <div className={`text-4xl font-black ${theme.accentText} mb-2 bb-xp-glow`}>
              +{xp} XP
            </div>
            <p className="text-gray-600 text-sm mb-3">Experience points earned!</p>

            <div className="bb-progress mb-2">
              <div className={`bb-progress-bar ${isActivity ? 'bg-blue-500' : ''}`} style={{ width: '60%' }}></div>
            </div>

            <div className="bb-level-pills">
              <span className={`bb-level-pill ${isActivity ? 'border-blue-500 text-blue-500' : ''}`}>Lv 3</span>
              <span className={`bb-level-pill ${isActivity ? 'border-blue-500 text-blue-500' : ''}`}>Lv 4</span>
            </div>
          </div>
        </div>

        <div className={`flex justify-center transition-all duration-500 ${showContent ? 'bb-slide-up' : 'opacity-0 translate-y-8'}`} style={{ animationDelay: '0.7s' }}>
          <div className={`bg-gradient-to-r ${isActivity ? 'from-blue-500 to-indigo-600' : 'from-orange-500 to-red-500'} text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2`}>
            <span className="text-lg bb-flame-pulse">🔥</span>
            <span className="font-bold">5-day streak!</span>
            <span className="text-lg bb-flame-pulse">🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
}
