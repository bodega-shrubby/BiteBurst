import { useDashboard, useAddLog, type DashboardData, type KVLog } from "@/hooks/useKeyValueAPI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  Brain, 
  Dumbbell, 
  Trophy, 
  Flame, 
  Star,
  Plus,
  Apple,
  Activity
} from "lucide-react";
import { useState } from "react";

const goalIcons = {
  energy: Zap,
  focus: Brain,
  strength: Dumbbell
} as const;

const goalColors = {
  energy: "text-yellow-500",
  focus: "text-blue-500", 
  strength: "text-red-500"
} as const;

interface DashboardProps {
  uid: string;
}

export default function Dashboard({ uid }: DashboardProps) {
  const { data: dashboardData, isLoading, error } = useDashboard(uid);
  const addLog = useAddLog();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-orange-200 rounded mb-6 w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-white rounded-lg shadow"></div>
              ))}
            </div>
            <div className="h-64 bg-white rounded-lg shadow"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200">
            <CardContent className="p-6 text-center">
              <div className="text-red-500 mb-2">
                <Trophy className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Dashboard Not Available</h2>
              <p className="text-gray-600">
                Unable to load your dashboard data. Please try again later.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { user, stats, streak, badges, todayLogs, summary } = dashboardData as DashboardData;
  const GoalIcon = goalIcons[user.goal as keyof typeof goalIcons];

  const handleQuickLog = async (type: 'food' | 'activity', content: string) => {
    try {
      await addLog.mutateAsync({
        uid,
        logData: {
          type,
          entryMethod: 'text',
          content: { text: content },
          goalContext: user.goal,
          aiFeedback: `Great ${type} choice for your ${user.goal} goal!`,
          xpAwarded: 5
        }
      });
      setShowQuickAdd(false);
    } catch (error) {
      console.error('Failed to add log:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center">
              <span className="text-2xl">{user.avatar === 'mascot-01' ? '🍊' : '👤'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome back, {user.displayName}!
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <GoalIcon className={`w-4 h-4 ${goalColors[user.goal as keyof typeof goalColors]}`} />
                <span className="capitalize">{user.goal} Goal</span>
                <span>•</span>
                <span>{user.ageBracket} years old</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowQuickAdd(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Total XP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{summary.totalXP}</div>
              <p className="text-xs text-gray-500 mt-1">
                +{summary.todayXP} today
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{summary.currentStreak}</div>
              <p className="text-xs text-gray-500 mt-1">
                Best: {summary.longestStreak} days
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-500" />
                Badges Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{summary.totalBadges}</div>
              <p className="text-xs text-gray-500 mt-1">
                {summary.todayEntries} entries today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Activity */}
        <Card className="border-orange-200 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayLogs.length > 0 ? (
              <div className="space-y-3">
                {todayLogs.map((log: KVLog, index: number) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      {log.type === 'food' ? 
                        <Apple className="w-4 h-4 text-orange-600" /> :
                        <Activity className="w-4 h-4 text-blue-600" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{log.type}</span>
                        <Badge variant="secondary" className="text-xs">
                          +{log.xpAwarded} XP
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {log.content?.text || log.content?.emoji?.join(' ') || 'Photo entry'}
                      </p>
                      {log.aiFeedback && (
                        <p className="text-xs text-orange-600 mt-1 italic">
                          {log.aiFeedback}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(log.ts).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No activity logged today yet</p>
                <p className="text-sm">Start tracking your food and activities!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Badges */}
        {badges.earned.length > 0 && (
          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-orange-500" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {badges.earned.map((badge: { id: string; name: string; ts: number }) => (
                  <div key={badge.id} className="flex items-center gap-2 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Add Modal */}
        {showQuickAdd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Quick Add Entry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleQuickLog('food', 'Quick snack')}
                  className="w-full justify-start"
                  variant="outline"
                  disabled={addLog.isPending}
                >
                  <Apple className="w-4 h-4 mr-2" />
                  Log Food/Snack
                </Button>
                <Button 
                  onClick={() => handleQuickLog('activity', 'Physical activity')}
                  className="w-full justify-start"
                  variant="outline"
                  disabled={addLog.isPending}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Log Activity
                </Button>
                <Button 
                  onClick={() => setShowQuickAdd(false)}
                  variant="ghost"
                  className="w-full"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}