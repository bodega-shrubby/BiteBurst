import { formatDistanceToNow, parseISO } from 'date-fns';
import { useLocation } from 'wouter';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const [, setLocation] = useLocation();
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  
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
  
  const SUNNY_MESSAGES = [
    "I'm so excited to see what yummy things you'll try today!",
    "Ready to fuel up? Let's log something delicious!",
    "Every healthy choice makes me so happy! What's on the menu?",
    "Time to power up! What will you eat or do today?",
  ];
  
  const randomMessage = SUNNY_MESSAGES[Math.floor(Math.random() * SUNNY_MESSAGES.length)];
  
  if (!logs || logs.length === 0) {
    return (
      <div className={`bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6 ${className}`}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Activity</h2>
        <div className="text-center py-6 space-y-3">
          <div className="text-5xl mb-2 mascot-idle">🍊</div>
          <h3 className="text-lg font-bold text-gray-900">
            Hi there, friend!
          </h3>
          <p className="text-gray-600 text-sm mb-4 px-4">
            {randomMessage}
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <button 
              onClick={() => setLocation('/food-log')}
              className="px-4 py-3 bg-[#FF6A00] text-white rounded-xl font-bold hover:bg-[#E55A00] transition-colors min-h-[48px] pulse-cta"
            >
              🍎 Log Your First Meal
            </button>
            <button 
              onClick={() => setLocation('/activity-log')}
              className="px-4 py-3 border-2 border-[#FF6A00] text-[#FF6A00] rounded-xl font-bold hover:bg-orange-50 transition-colors min-h-[48px]"
            >
              ⚽ Log Your First Activity
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <span className="text-sm text-gray-500">{logs.length} logs today</span>
      </div>
      
      <div className="space-y-3">
        {logs.slice(0, 5).map((log) => {
          const isExpanded = expandedLogId === log.id;
          const hasFeedback = log.feedback && log.feedback.length > 0;
          
          return (
            <div 
              key={log.id}
              className="bg-white border-2 border-gray-200 rounded-xl hover:border-orange-200 hover:shadow-md transition-all duration-200"
            >
              {/* Main Log Card - Always Visible */}
              <button
                onClick={() => hasFeedback && setExpandedLogId(isExpanded ? null : log.id)}
                className="w-full p-4 text-left min-h-[44px]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-3xl flex-shrink-0">
                      {getTypeIcon(log.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-base">
                        {log.summary}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(log.ts)}
                        </p>
                        {hasFeedback && (
                          <>
                            <span className="text-gray-300">•</span>
                            <p className="text-xs text-blue-600 font-medium">
                              Coach's tip
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side: XP Badge + Expand Arrow */}
                  <div className="flex items-center space-x-2 ml-2">
                    {log.xpAwarded && log.xpAwarded > 0 && (
                      <div className="bg-orange-100 px-3 py-1.5 rounded-full flex-shrink-0">
                        <span className="text-orange-600 font-bold text-sm">
                          +{log.xpAwarded} XP
                        </span>
                      </div>
                    )}
                    
                    {hasFeedback && (
                      <div className="flex-shrink-0 min-w-[24px] min-h-[24px] flex items-center justify-center">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>

              {/* AI Feedback - Expandable */}
              {hasFeedback && isExpanded && (
                <div className="px-4 pb-4 animate-slide-down">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
                    {/* Coach Header */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">💪</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Coach Flex says:</p>
                      </div>
                    </div>
                    
                    {/* Feedback Text */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {log.feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show More Button */}
      {logs.length > 5 && (
        <button 
          onClick={() => setLocation('/logs')}
          className="w-full py-3 text-orange-600 font-semibold rounded-xl border-2 border-orange-200 hover:bg-orange-50 transition-colors min-h-[44px]"
        >
          View all {logs.length} logs →
        </button>
      )}
    </div>
  );
}
