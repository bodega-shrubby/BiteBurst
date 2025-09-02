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
    }, 1000); // 1 second to enjoy the animation

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <img 
          src={mascotImage} 
          alt="BiteBurst Mascot" 
          className="bb-mascot bb-success-animation mx-auto"
          style={{ width: '120px', height: '120px' }}
        />
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