import { format, isToday, parseISO } from 'date-fns';

interface RecentLog {
  id: string;
  type: 'food' | 'activity';
  summary: string;
  ts: string;
}

interface RecentLogsListProps {
  logs: RecentLog[];
  className?: string;
}

export default function RecentLogsList({ logs, className = '' }: RecentLogsListProps) {
  if (logs.length === 0) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
        <h2 className="text-xl font-bold text-[#FF6A00] mb-4">Today's Activity</h2>
        <div className="text-center py-8 space-y-3">
          <div className="text-4xl">📝</div>
          <p className="text-gray-600">
            Try one of these quick actions
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <button 
              onClick={() => window.location.href = '/food-log'}
              className="px-4 py-2 bg-[#FF6A00] text-white rounded-lg font-medium hover:bg-[#E55A00] transition-colors"
            >
              🍎 Log Your First Meal
            </button>
            <button 
              onClick={() => window.location.href = '/activity-log'}
              className="px-4 py-2 border-2 border-[#FF6A00] text-[#FF6A00] rounded-lg font-medium hover:bg-orange-50 transition-colors"
            >
              ⚽ Log Your First Activity
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const formatTime = (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      if (isToday(date)) {
        return format(date, 'h:mm a');
      }
      return format(date, 'MMM d, h:mm a');
    } catch (error) {
      return 'Just now';
    }
  };
  
  const getTypeIcon = (type: string) => {
    return type === 'food' ? '🍽️' : '🏃';
  };
  
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <h2 className="text-xl font-bold text-[#FF6A00] mb-4">Today's Activity</h2>
      
      <div className="space-y-3">
        {logs.map((log, index) => (
          <div 
            key={log.id}
            className={`
              flex items-center justify-between p-3 rounded-xl border border-gray-100
              ${index === 0 ? 'bg-orange-50 border-orange-200' : 'bg-gray-50'}
              transition-colors duration-200
            `}
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">
                {getTypeIcon(log.type)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">
                  {log.summary}
                </p>
                <p className="text-xs text-gray-500">
                  {log.type === 'food' ? 'Food log' : 'Activity log'}
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {formatTime(log.ts)}
            </span>
          </div>
        ))}
      </div>
      
      {logs.length >= 3 && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => window.location.href = '/logs'} // Future logs page
            className="text-sm text-[#FF6A00] font-medium hover:text-[#E55A00] transition-colors"
          >
            View all logs →
          </button>
        </div>
      )}
    </div>
  );
}