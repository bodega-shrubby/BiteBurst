import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useActiveChild } from "@/hooks/useActiveChild";
import Sidebar from "@/components/Sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import ActivityLogHeader from "@/components/activity-log/ActivityLogHeader";
import ActivityLogRightColumn from "@/components/activity-log/ActivityLogRightColumn";

interface ActivityOption {
  key: string;
  label: string;
  emoji: string;
  other?: boolean;
}

interface ActivityState {
  activity: string | null;
  activityLabel: string;
  duration: number | null;
  mood: string | null;
  method: 'emoji' | 'text';
  customText: string;
}

const ACTIVITY_OPTIONS: ActivityOption[] = [
  { key: 'soccer', label: 'Soccer', emoji: '⚽' },
  { key: 'run', label: 'Running', emoji: '🏃' },
  { key: 'yoga', label: 'Yoga', emoji: '🧘' },
  { key: 'drills', label: 'Practice', emoji: '🎯' },
  { key: 'bike', label: 'Biking', emoji: '🚴' },
  { key: 'dance', label: 'Dance', emoji: '🕺' },
  { key: 'swim', label: 'Swimming', emoji: '🏊' },
  { key: 'climb', label: 'Climb/Play', emoji: '🧗' },
  { key: 'basket', label: 'Basketball', emoji: '🏀' },
  { key: 'walk', label: 'Walk/Hike', emoji: '🥾' },
  { key: 'other', label: 'Other', emoji: '➕', other: true }
];

const DURATION_OPTIONS = [
  { key: '5', label: '5 min' },
  { key: '15', label: '15 min' },
  { key: '30', label: '30 min' },
  { key: '60', label: '60 min' }
];

const MOOD_OPTIONS = [
  { key: 'happy', label: 'Felt great', emoji: '😃' },
  { key: 'ok', label: 'Okay', emoji: '😐' },
  { key: 'tired', label: 'Tired', emoji: '😴' }
];

function computeActivityXP(min: number): number {
  if (min >= 60) return 30;
  if (min >= 30) return 20;
  if (min >= 15) return 15;
  return 10;
}

function getCurrentStep(state: ActivityState): 'activity' | 'duration' | 'mood' {
  if (!state.activity) return 'activity';
  if (!state.duration) return 'duration';
  return 'mood';
}

export default function ActivityLog() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/activity-log");
  const { user } = useAuth();
  const activeChild = useActiveChild(user);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showMoreActivities, setShowMoreActivities] = useState(false);
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customDuration, setCustomDuration] = useState('');
  
  const [state, setState] = useState<ActivityState>({
    activity: null,
    activityLabel: '',
    duration: null,
    mood: null,
    method: 'emoji',
    customText: ''
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const activityParam = urlParams.get('activity');
    if (activityParam) {
      const option = ACTIVITY_OPTIONS.find(opt => opt.key === activityParam);
      if (option) {
        setState(prev => ({
          ...prev,
          activity: option.key,
          activityLabel: option.label,
          method: option.other ? 'text' : 'emoji'
        }));
      }
    }
  }, []);

  const logMutation = useMutation({
    mutationFn: async (logData: any) => {
      return apiRequest('/api/logs', {
        method: 'POST',
        body: logData
      });
    },
    onSuccess: async (response) => {
      const logData = {
        id: response.id,
        type: 'activity',
        content: state.method === 'emoji' 
          ? { emojis: [ACTIVITY_OPTIONS.find(opt => opt.key === state.activity)?.emoji || '🏃'] }
          : { description: state.activityLabel },
        entryMethod: state.method,
        xpAwarded: response.xpAwarded,
        durationMin: state.duration,
        mood: state.mood
      };
      
      localStorage.setItem('lastLogData', JSON.stringify(logData));
      setLocation(`/feedback?logId=${response.id}&xp=${response.xpAwarded}&type=activity`);
    },
    onError: (error) => {
      console.error('Activity log error:', error);
      toast({
        title: "Oops!",
        description: "Failed to log activity. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleActivitySelect = (option: ActivityOption) => {
    setState(prev => ({
      ...prev,
      activity: option.key,
      activityLabel: option.other ? '' : option.label,
      method: option.other ? 'text' : 'emoji'
    }));
  };

  const handleDurationSelect = (duration: string) => {
    setState(prev => ({
      ...prev,
      duration: Number(duration)
    }));
    setShowCustomDuration(false);
  };

  const handleCustomDurationSet = () => {
    const minutes = parseInt(customDuration);
    if (minutes >= 5 && minutes <= 120) {
      setState(prev => ({
        ...prev,
        duration: minutes
      }));
      setShowCustomDuration(false);
      setCustomDuration('');
    }
  };

  const handleMoodSelect = (mood: string) => {
    setState(prev => ({
      ...prev,
      mood: prev.mood === mood ? null : mood
    }));
  };

  const handleSubmit = async () => {
    if (!user || !state.activityLabel || !state.duration) return;

    const childUserId = activeChild?.childId || (user as any).id;

    const logData = {
      userId: childUserId,
      type: 'activity' as const,
      entryMethod: state.method,
      content: state.method === 'emoji' 
        ? { emojis: [ACTIVITY_OPTIONS.find(opt => opt.key === state.activity)?.emoji || '🏃'] }
        : { description: state.activityLabel },
      durationMin: state.duration,
      mood: state.mood
    };

    logMutation.mutate(logData);
  };

  const visibleActivities = showMoreActivities ? ACTIVITY_OPTIONS : ACTIVITY_OPTIONS.slice(0, 6);
  const canSubmit = state.activityLabel && state.duration && !logMutation.isPending;
  const currentStep = getCurrentStep(state);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex min-h-screen md:ml-[200px]">
        <div className="flex-1 flex justify-center">
          <div className="flex max-w-[1100px] w-full">
            
            <div className="flex-1 min-w-0 bg-white">
              <ActivityLogHeader 
                streak={user?.streak || 0}
                totalXp={user?.totalXp || 0}
                weeklyActivityMinutes={(user as any)?.weeklyActivityMinutes || 0}
              />

              <div className="px-6 py-6 bg-gray-50">
                <main className="space-y-8 pb-24">
                  <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Pick your activity</h2>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {visibleActivities.map((option) => (
                        <button
                          key={option.key}
                          onClick={() => handleActivitySelect(option)}
                          className={`
                            aspect-square flex flex-col items-center justify-center text-center p-3
                            rounded-2xl border-2 transition-all duration-200 min-h-[44px]
                            ${state.activity === option.key
                              ? 'border-[#FF6A00] bg-orange-50 scale-105 shadow-lg shadow-orange-200' 
                              : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                            }
                            active:scale-95
                          `}
                          style={{ minWidth: '64px', minHeight: '64px' }}
                        >
                          <span className="text-2xl mb-1">{option.emoji}</span>
                          <span className="text-xs font-medium text-gray-700">{option.label}</span>
                        </button>
                      ))}
                    </div>

                    {ACTIVITY_OPTIONS.length > 6 && (
                      <button
                        onClick={() => setShowMoreActivities(!showMoreActivities)}
                        className="w-full py-2 px-4 text-sm font-medium text-[#FF6A00] hover:bg-orange-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        {showMoreActivities ? (
                          <>Less <ChevronUp className="w-4 h-4" /></>
                        ) : (
                          <>More activities <ChevronDown className="w-4 h-4" /></>
                        )}
                      </button>
                    )}

                    {state.activity === 'other' && (
                      <div className="space-y-2">
                        <Textarea
                          value={state.customText}
                          onChange={(e) => {
                            const value = e.target.value;
                            setState(prev => ({
                              ...prev,
                              customText: value,
                              activityLabel: value
                            }));
                          }}
                          placeholder="Type your activity..."
                          className="min-h-[80px] text-base border-2 focus:border-[#FF6A00] rounded-xl"
                          maxLength={32}
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Be specific!</span>
                          <span>{state.customText.length}/32</span>
                        </div>
                      </div>
                    )}
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">How long?</h2>
                    
                    <div className="flex flex-wrap gap-2">
                      {DURATION_OPTIONS.map((option) => (
                        <button
                          key={option.key}
                          onClick={() => handleDurationSelect(option.key)}
                          className={`
                            px-4 py-2 rounded-xl font-medium transition-all min-h-[44px]
                            ${state.duration === Number(option.key)
                              ? 'bg-[#FF6A00] text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {option.label}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setShowCustomDuration(!showCustomDuration)}
                        className={`
                          px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-1 min-h-[44px]
                          ${showCustomDuration
                            ? 'bg-[#FF6A00] text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        <Plus className="w-4 h-4" />
                        Custom
                      </button>
                    </div>

                    {showCustomDuration && (
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <input
                            type="number"
                            value={customDuration}
                            onChange={(e) => setCustomDuration(e.target.value)}
                            placeholder="5-120"
                            min="5"
                            max="120"
                            className="w-full px-3 py-2 border-2 border-gray-200 focus:border-[#FF6A00] rounded-lg text-center"
                          />
                          <div className="text-xs text-gray-500 text-center mt-1">minutes (5-120)</div>
                        </div>
                        <Button
                          onClick={handleCustomDurationSet}
                          disabled={!customDuration || parseInt(customDuration) < 5 || parseInt(customDuration) > 120}
                          className="bg-[#FF6A00] hover:bg-[#E55A00] px-4 py-2"
                        >
                          Set
                        </Button>
                      </div>
                    )}
                  </section>

                  <section className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">How did it feel? <span className="text-sm text-gray-500">(optional)</span></h2>
                    
                    <div className="flex gap-3 justify-center">
                      {MOOD_OPTIONS.map((option) => (
                        <button
                          key={option.key}
                          onClick={() => handleMoodSelect(option.key)}
                          className={`
                            flex flex-col items-center p-3 rounded-xl transition-all min-h-[44px] min-w-[44px]
                            ${state.mood === option.key
                              ? 'bg-[#FF6A00] text-white scale-105' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                            active:scale-95
                          `}
                        >
                          <span className="text-2xl mb-1">{option.emoji}</span>
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <Card className="border-2 border-gray-200" role="region" aria-live="polite">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Preview</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Activity</span>
                          <span className="font-medium">{state.activityLabel || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-medium">{state.duration ? `${state.duration} min` : '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mood</span>
                          <span className="font-medium">
                            {state.mood ? MOOD_OPTIONS.find(m => m.key === state.mood)?.emoji : '—'}
                          </span>
                        </div>
                        {state.duration && (
                          <div className="flex justify-between pt-2 border-t border-gray-200">
                            <span className="text-gray-600">XP to earn</span>
                            <span className="font-bold text-[#FF6A00]">+{computeActivityXP(state.duration)} XP</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </main>
              </div>

              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:left-[200px] lg:right-[340px]">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full max-w-md mx-auto block bg-[#FF6A00] hover:bg-[#E55A00] text-white h-12 text-base font-bold uppercase tracking-wider disabled:opacity-50 shadow-lg"
                  style={{ borderRadius: '13px' }}
                >
                  {logMutation.isPending ? 'LOGGING...' : 'LOG ACTIVITY'}
                </Button>
              </div>
            </div>

            <ActivityLogRightColumn 
              step={currentStep}
              activitySelected={!!state.activity}
            />
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}
