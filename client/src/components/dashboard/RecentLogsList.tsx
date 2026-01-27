import { formatDistanceToNow, parseISO } from 'date-fns';

interface RecentLog {
  id: string;
  type: 'food' | 'activity';
  summary: string;
  ts: string;
  xpAwarded?: number;
  feedback?: string | null;
}

interface RecentLogsListProps {
  logs: RecentLog[];
  className?: string;
}

export default function RecentLogsList({ logs, className = '' }: RecentLogsListProps) {
  const getTimeAgo = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Just now';
    }
  };
  
  const getTypeIcon = (type: string) => {
    return type === 'food' ? '🍽️' : '🏃';
  };

  const getTypeLabel = (type: string) => {
    return type === 'food' ? 'Food log' : 'Activity';
  };
  
  if (!logs || logs.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6 ${className}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Activity</h2>
        <div className="text-center py-6 space-y-3">
          <div className="text-5xl mb-2">📝</div>
          <h3 className="text-lg font-bold text-gray-900">
            No activity yet today
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Tap the buttons below to log your first meal or activity!
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <button 
              onClick={() => window.location.href = '/food-log'}
              className="px-4 py-3 bg-[#FF6A00] text-white rounded-xl font-bold hover:bg-[#E55A00] transition-colors"
            >
              🍎 Log Your First Meal
            </button>
            <button 
              onClick={() => window.location.href = '/activity-log'}
              className="px-4 py-3 border-2 border-[#FF6A00] text-[#FF6A00] rounded-xl font-bold hover:bg-orange-50 transition-colors"
            >
              ⚽ Log Your First Activity
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-2xl border-2 border-gray-200 p-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
      
      <div className="space-y-3">
        {logs.slice(0, 5).map((log, index) => (
          <div 
            key={log.id}
            className={`
              p-4 rounded-xl border-2 transition-all duration-200
              ${index === 0 
                ? 'bg-orange-50 border-orange-200' 
                : 'bg-gray-50 border-gray-100 hover:border-gray-200'
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
                  {getTypeIcon(log.type)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">
                    {log.summary}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {getTypeLabel(log.type)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {getTimeAgo(log.ts)}
                    </span>
                  </div>
                  {/* AI Feedback Preview */}
                  {log.feedback && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2 italic">
                      "{log.feedback.slice(0, 80)}{log.feedback.length > 80 ? '...' : ''}"
                    </p>
                  )}
                </div>
              </div>
              {/* XP Badge */}
              {log.xpAwarded && log.xpAwarded > 0 && (
                <span className="text-sm font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                  +{log.xpAwarded} XP
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {logs.length >= 3 && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => window.location.href = '/logs'}
            className="text-sm text-[#FF6A00] font-bold hover:text-[#E55A00] transition-colors"
          >
            View all activity →
          </button>
        </div>
      )}
    </div>
  );
}
