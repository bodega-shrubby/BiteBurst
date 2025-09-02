import { useEffect } from 'react';
import { useLocation } from 'wouter';
import mascotImage from '@assets/9ef8e8fe-158e-4518-bd1c-1325863aebca_1756365757940.png';
import '../styles/tokens.css';

export default function Success() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Get log data from URL params
    const params = new URLSearchParams(window.location.search);
    const logId = params.get('logId');
    const xp = params.get('xp');
    
    // Redirect to feedback page after animation completes
    const timer = setTimeout(() => {
      const feedbackUrl = `/feedback?logId=${logId || 'temp'}&xp=${xp || '0'}`;
      setLocation(feedbackUrl);
    }, 5000); // 5 seconds to enjoy the animation

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-block">
          <img 
            src={mascotImage} 
            alt="BiteBurst Mascot" 
            className="bb-mascot bb-success-animation mx-auto"
            style={{ width: '120px', height: '120px' }}
          />
          {/* Additional confetti particles */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 text-2xl animate-bounce">
            🎉
          </div>
          <div className="absolute top-0 left-0 transform -translate-x-2 -translate-y-2 text-xl animate-pulse" style={{ animationDelay: '0.5s' }}>
            ✨
          </div>
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 text-xl animate-pulse" style={{ animationDelay: '1s' }}>
            🎊
          </div>
          <div className="absolute bottom-0 left-1/4 transform -translate-y-2 text-lg animate-bounce" style={{ animationDelay: '0.3s' }}>
            🌟
          </div>
          <div className="absolute bottom-0 right-1/4 transform -translate-y-2 text-lg animate-bounce" style={{ animationDelay: '0.8s' }}>
            💫
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#FF7A00] mt-6">
          Great job!
        </h1>
        <p className="text-gray-600 mt-2">
          Your meal has been logged
        </p>
      </div>
    </div>
  );
}