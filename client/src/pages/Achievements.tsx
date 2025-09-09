import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Trophy } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import Confetti from '@/components/Confetti';
import TabNavigation, { type TabId } from '../components/achievements/TabNavigation';
import StickersTab from '../components/achievements/StickersTab';
import PersonalRecordsTab from '../components/achievements/PersonalRecordsTab';

export default function Achievements() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('stickers'); // Default to Stickers tab
  const [showCelebration, setShowCelebration] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle celebration for new unlocks
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const justUnlocked = urlParams.get('justUnlocked');
    
    if (justUnlocked) {
      setShowCelebration(true);
      setShowConfetti(true);
      
      // Ensure we're on the Stickers tab to see the celebration
      setActiveTab('stickers');
      
      // Remove query param
      window.history.replaceState({}, '', '/achievements');
      
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Please log in</h2>
          <p className="text-gray-600">Sign in to view your achievements</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Confetti Animation */}
      <Confetti 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center space-y-4 animate-bounce">
            <div className="text-6xl">🎉</div>
            <div className="text-2xl font-bold text-white">Badge Unlocked!</div>
            <div className="text-sm text-gray-300">Check your achievements page!</div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-20 p-4">
        <div className="max-w-md mx-auto space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Achievements
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Collect stickers by eating smart and moving daily
            </p>
          </div>
          
          {/* Tab Navigation */}
          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </header>

      {/* Tab Content */}
      <main className="p-4 pb-24">
        <div className="max-w-md mx-auto">
          <StickersTab isActive={activeTab === 'stickers'} />
          <PersonalRecordsTab isActive={activeTab === 'records'} />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}