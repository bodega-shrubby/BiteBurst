import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import mascotImage from '@assets/9ef8e8fe-158e-4518-bd1c-1325863aebca_1756365757940.png';
import '../styles/tokens.css';

export default function Success() {
  const [, setLocation] = useLocation();
  const [isExiting, setIsExiting] = useState(false);
  
  // Get type from URL params
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type') || 'food';

  useEffect(() => {
    // Get log data from URL params
    const params = new URLSearchParams(window.location.search);
    const logId = params.get('logId');
    const xp = params.get('xp');
    const type = params.get('type'); // 'activity' or defaults to 'food'
    
    // Start fade out transition before redirect
    const fadeTimer = setTimeout(() => {
      setIsExiting(true);
    }, 4500); // Start fade at 4.5s
    
    // Redirect to feedback page after fade completes
    const redirectTimer = setTimeout(() => {
      const feedbackUrl = `/feedback?logId=${logId || 'temp'}&xp=${xp || '0'}&type=${type || 'food'}`;
      setLocation(feedbackUrl);
    }, 5000); // Complete redirect at 5s

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [setLocation]);

  return (
    <div 
      className={`min-h-screen bg-white flex items-center justify-center p-8 transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <div className="relative inline-block mb-8">
          <img 
            src={mascotImage} 
            alt="BiteBurst Mascot" 
            className="bb-mascot bb-success-animation mx-auto"
            style={{ width: '200px', height: '200px' }}
          />
          {/* Star confetti particles */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 text-3xl animate-bounce">
            ✨
          </div>
          <div className="absolute top-4 left-0 transform -translate-x-4 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>
            ✨
          </div>
          <div className="absolute top-4 right-0 transform translate-x-4 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>
            ✨
          </div>
          <div className="absolute bottom-4 left-1/4 transform -translate-x-2 text-xl animate-bounce" style={{ animationDelay: '0.3s' }}>
            ✨
          </div>
          <div className="absolute bottom-4 right-1/4 transform translate-x-2 text-xl animate-bounce" style={{ animationDelay: '0.8s' }}>
            ✨
          </div>
          <div className="absolute top-1/2 left-0 transform -translate-x-6 -translate-y-1/2 text-lg animate-pulse" style={{ animationDelay: '1.2s' }}>
            ✨
          </div>
          <div className="absolute top-1/2 right-0 transform translate-x-6 -translate-y-1/2 text-lg animate-pulse" style={{ animationDelay: '0.7s' }}>
            ✨
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#FF7A00] mb-4">
          Great job!
        </h1>
        <p className="text-gray-600 text-lg">
          Your {type === 'activity' ? 'activity' : 'meal'} has been logged
        </p>
      </div>
    </div>
  );
}