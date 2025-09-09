import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Users, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';

interface WeekInfo {
  start: string;
  end: string;
  seconds_remaining: number;
}

interface LeagueInfo {
  tier: 'bronze' | 'silver' | 'gold';
  name: string;
  promote_count: number;
  demote_count: number;
}

interface LeaderboardMember {
  rank: number;
  user_id: string;
  name: string;
  avatar: string;
  xp_week: number;
  streak: number;
}

interface LeaderboardData {
  week: WeekInfo;
  league: LeagueInfo;
  promotion_zone_rank: number;
  demotion_zone_rank: number | null;
  members: LeaderboardMember[];
  me: LeaderboardMember | null;
  user_opted_out: boolean;
}

// League Badge Component
function LeagueBadge({ tier, active }: { tier: string; active: boolean }) {
  const badges = {
    bronze: { emoji: '🥉', color: 'bg-orange-100 border-orange-300' },
    silver: { emoji: '🥈', color: 'bg-gray-100 border-gray-300' },
    gold: { emoji: '🥇', color: 'bg-yellow-100 border-yellow-300' },
  };

  const badge = badges[tier as keyof typeof badges] || badges.bronze;
  
  return (
    <div className={`
      w-12 h-12 rounded-full border-2 flex items-center justify-center text-lg
      ${active ? badge.color : 'bg-gray-50 border-gray-200 grayscale opacity-50'}
    `}>
      {badge.emoji}
    </div>
  );
}

// Countdown Timer Component
function Countdown({ seconds }: { seconds: number }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);

  return (
    <div className="flex items-center space-x-1 text-orange-600 font-mono">
      <Clock size={16} />
      <span>{days}d {hours}h {minutes}m</span>
    </div>
  );
}

// League Header Component
function LeagueHeader({ data }: { data: LeaderboardData }) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-20 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* League Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LeagueBadge tier={data.league.tier} active={true} />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {data.league.name}
              </h1>
              <p className="text-sm text-gray-600">
                Top {data.league.promote_count} advance to the next league
              </p>
            </div>
          </div>
          <Countdown seconds={data.week.seconds_remaining} />
        </div>

        {/* Badge Progression */}
        <div className="flex items-center justify-center space-x-4">
          <LeagueBadge tier="bronze" active={data.league.tier === 'bronze'} />
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <LeagueBadge tier="silver" active={data.league.tier === 'silver'} />
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <LeagueBadge tier="gold" active={data.league.tier === 'gold'} />
        </div>
      </div>
    </div>
  );
}

// Promotion Zone Banner
function PromotionBanner() {
  return (
    <div className="flex items-center justify-center py-2 bg-green-50 border-y border-green-200">
      <div className="flex items-center space-x-2 text-green-700 font-semibold">
        <ChevronUp size={16} />
        <span>PROMOTION ZONE</span>
        <ChevronUp size={16} />
      </div>
    </div>
  );
}

// Demotion Warning Banner
function DemotionBanner() {
  return (
    <div className="flex items-center justify-center py-2 bg-orange-50 border-y border-orange-200">
      <div className="flex items-center space-x-2 text-orange-700 font-semibold">
        <ChevronDown size={16} />
        <span>DANGER ZONE</span>
        <ChevronDown size={16} />
      </div>
    </div>
  );
}

// Rank Row Component
function RankRow({ member, isMe, showPromotion, showDemotion }: { 
  member: LeaderboardMember; 
  isMe: boolean;
  showPromotion: boolean;
  showDemotion: boolean;
}) {
  return (
    <>
      {showPromotion && <PromotionBanner />}
      {showDemotion && <DemotionBanner />}
      
      <div className={`
        flex items-center justify-between p-4 border-b border-gray-100 min-h-[60px]
        ${isMe ? 'bg-orange-50 border-orange-200' : 'hover:bg-gray-50'}
        transition-colors duration-200
      `}>
        <div className="flex items-center space-x-3">
          {/* Rank */}
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${member.rank <= 3 
              ? 'bg-yellow-100 text-yellow-800' 
              : isMe 
                ? 'bg-orange-100 text-orange-800'
                : 'bg-gray-100 text-gray-600'
            }
          `}>
            {member.rank}
          </div>
          
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
            {member.avatar}
          </div>
          
          {/* Name & Streak */}
          <div>
            <div className={`font-semibold ${isMe ? 'text-orange-900' : 'text-gray-900'}`}>
              {member.name}
              {isMe && <span className="text-orange-600 ml-1">(You)</span>}
            </div>
            {member.streak > 0 && (
              <div className="text-xs text-gray-500">
                🔥 {member.streak} day streak
              </div>
            )}
          </div>
        </div>
        
        {/* XP */}
        <div className="text-right">
          <div className={`font-bold ${isMe ? 'text-orange-900' : 'text-gray-900'}`}>
            {member.xp_week} XP
          </div>
        </div>
      </div>
    </>
  );
}

// Opt-out Banner
function OptOutBanner() {
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">🕶️</div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          You're Hidden from Leaderboards
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Your progress is private. You can join the competition anytime in your settings.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Join Competition
        </button>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const { user } = useAuth();
  
  const { data: leaderboardData, isLoading, error } = useQuery<LeaderboardData>({
    queryKey: ['/api/leaderboard/league'],
    refetchInterval: 60000, // Refresh every minute for live updates
    enabled: !!user,
  });

  // Auto-scroll to user's position when data loads
  useEffect(() => {
    if (leaderboardData?.me) {
      // Delay to ensure DOM is rendered
      setTimeout(() => {
        const userRow = document.querySelector('[data-user-row="true"]');
        if (userRow) {
          userRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [leaderboardData?.me]);

  if (isLoading || !leaderboardData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-white border-b border-gray-200 z-20 p-4">
          <div className="max-w-md mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-48 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3 p-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-4xl">🏆</div>
          <h2 className="text-xl font-bold text-gray-900">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600">
            We couldn't load the leaderboard right now.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#FF6A00] text-white rounded-xl font-bold hover:bg-[#E55A00] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (leaderboardData.user_opted_out) {
    return (
      <div className="min-h-screen bg-white">
        <OptOutBanner />
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LeagueHeader data={leaderboardData} />
      
      <main className="pb-24">
        {leaderboardData.members.length === 0 ? (
          <div className="max-w-md mx-auto p-4">
            <div className="text-center py-16 space-y-4">
              <div className="text-4xl">🏆</div>
              <h2 className="text-xl font-bold text-gray-900">
                League Loading...
              </h2>
              <p className="text-gray-600">
                Your league is being prepared. Check back soon!
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {leaderboardData.members.map((member, index) => {
              const isMe = member.user_id === leaderboardData.me?.user_id;
              const showPromotion = member.rank === leaderboardData.promotion_zone_rank + 1;
              const showDemotion = leaderboardData.demotion_zone_rank && member.rank === leaderboardData.demotion_zone_rank;
              
              return (
                <div 
                  key={member.user_id}
                  data-user-row={isMe}
                >
                  <RankRow
                    member={member}
                    isMe={isMe}
                    showPromotion={showPromotion}
                    showDemotion={showDemotion}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
}