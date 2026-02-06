import { useLocation } from 'wouter';
import coachFlex from '@assets/Mascots/CoachFlex.png';

interface ActivityLog {
  id: string;
  type: 'food' | 'activity';
  summary: string;
  xpAwarded?: number;
  timestamp?: Date;
}

interface TodaysActivityProps {
  recentLogs?: ActivityLog[];
}

export default function TodaysActivity({ recentLogs = [] }: TodaysActivityProps) {
  const [, setLocation] = useLocation();

  const hasActivity = recentLogs.length > 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      <h3 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
        📋 Today's Activity
      </h3>

      {hasActivity ? (
        <div className="space-y-2">
          {recentLogs.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-xl">
                {log.type === 'food' ? '🍽️' : '🏃'}
              </span>
              <span className="text-sm flex-1 text-gray-700 truncate">{log.summary}</span>
              {log.xpAwarded && (
                <span className="text-xs text-orange-500 font-bold">
                  +{log.xpAwarded} XP
                </span>
              )}
            </div>
          ))}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setLocation('/food-log')}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition flex items-center justify-center gap-1"
            >
              🍽️ Log More
            </button>
            <button
              onClick={() => setLocation('/activity-log')}
              className="flex-1 border-2 border-[#7AB8F5] text-[#2E6BB5] py-3 rounded-xl font-bold text-sm hover:bg-[#E8F4FD] transition flex items-center justify-center gap-1"
            >
              🏃 Log Activity
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <img src={coachFlex} alt="Coach Flex" className="w-[90px] h-[90px] object-contain mx-auto mb-3" />
          <p className="font-bold text-gray-800 text-base">No activity yet today</p>
          <p className="text-sm text-gray-500 mt-1">Time to fuel up! 🍎</p>

          <div className="flex flex-col gap-2 mt-5">
            <button
              onClick={() => setLocation('/food-log')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3 rounded-xl font-bold text-sm hover:from-orange-600 hover:to-orange-500 transition shadow-sm flex items-center justify-center gap-2"
            >
              🍽️ Log a Meal
            </button>
            <button
              onClick={() => setLocation('/activity-log')}
              className="w-full border-2 border-[#7AB8F5] text-[#2E6BB5] py-3 rounded-xl font-bold text-sm hover:bg-[#E8F4FD] transition flex items-center justify-center gap-2"
            >
              🏃 Log Activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
