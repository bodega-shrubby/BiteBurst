# BiteBurst Activity Log - Complete UI Redesign to Match Lessons/Food Log Pages

## Overview

**Goal:** Completely redesign the Activity Log page (`ActivityLog.tsx`) to match the Lessons page layout exactly. This includes adding the Sidebar, right column, updated header, and all visual elements.

**Reference Files to Study:**
- `client/src/pages/Lessons.tsx` - **Master template** (copy layout structure exactly)
- `client/src/components/Sidebar.tsx` - Existing sidebar component
- `client/src/components/BottomNavigation.tsx` - Existing mobile navigation
- `client/src/components/LessonMascot.tsx` - Existing mascot component (has CoachFlex)

---

## CURRENT STATE vs TARGET STATE

### Current `ActivityLog.tsx` - PROBLEMS:

```tsx
// ❌ CURRENT - Missing everything
return (
  <div className="min-h-screen bg-white">
    {/* ❌ No Sidebar */}

    {/* ❌ Basic header - wrong style */}
    <header className="bb-appbar">
      <button className="bb-back">←</button>
      <h1>Log your activity</h1>
    </header>

    {/* ❌ Simple centered layout - no right column */}
    <main className="px-4 py-6 space-y-8 pb-24 max-w-md mx-auto">
      {/* content */}
    </main>

    {/* ❌ No BottomNavigation */}
  </div>
);
```

### Target Layout - FROM `Lessons.tsx`:

```tsx
// ✅ TARGET - Full layout structure
return (
  <div className="min-h-screen bg-gray-50">
    {/* ✅ CSS Styles */}
    <style>{`...animations...`}</style>

    {/* ✅ Sidebar - 200px fixed left */}
    <Sidebar />

    {/* ✅ Main layout container with sidebar offset */}
    <div className="flex min-h-screen md:ml-[200px]">
      <div className="flex-1 flex justify-center">
        <div className="flex max-w-[1100px] w-full">

          {/* ✅ Main Content Area */}
          <div className="flex-1 min-w-0 bg-white">
            {/* ✅ Header with orange gradient + stats bar */}
            <header className="sticky top-0 z-30">
              <div
                className="px-6 py-6"
                style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}
              >
                {/* Back button, title, subtitle */}
              </div>
              <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                {/* Stats: Streak, XP, etc */}
              </div>
            </header>

            {/* ✅ Content area */}
            <div className="px-6 py-6 bg-gray-50">
              {/* Activity selection content */}
            </div>
          </div>

          {/* ✅ Right Column - 340px, hidden on mobile */}
          <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">
            {/* Mascot Card */}
            {/* Fact Card */}
            {/* Badges Card */}
            {/* Ad Placeholder */}
          </div>
        </div>
      </div>
    </div>

    {/* ✅ Mobile bottom navigation */}
    <div className="md:hidden">
      <BottomNavigation />
    </div>
  </div>
);
```

---

## COMPLETE IMPLEMENTATION

### Step 1: Rewrite `ActivityLog.tsx` with Full Layout

Replace the entire `ActivityLog.tsx` file with this structure:

```tsx
// client/src/pages/ActivityLog.tsx

import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// ✅ ADD THESE IMPORTS
import Sidebar from '@/components/Sidebar';
import BottomNavigation from '@/components/BottomNavigation';
import LessonMascot from '@/components/LessonMascot';

// Keep existing interfaces and constants
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

const ACTIVITY_FACTS = [
  "Running for just 10 minutes can boost your mood for hours! 🏃",
  "Dancing is one of the best exercises because it works your whole body! 💃",
  "Swimming uses almost every muscle in your body! 🏊",
  "Kids who play sports tend to do better in school! ⚽",
  "Just 30 minutes of activity a day keeps you healthy and strong! 💪",
  "Walking 10,000 steps is about 5 miles - that's far! 🚶",
  "Jumping rope for 10 minutes burns as many calories as 30 minutes of jogging! 🪢",
  "Playing outside in nature reduces stress and makes you happier! 🌳"
];

const ACTIVITY_BADGES = [
  { id: 'first-move', emoji: '🏃', name: 'First Move', earned: true },
  { id: 'week-warrior', emoji: '🔥', name: 'Week Warrior', earned: false },
  { id: 'hour-hero', emoji: '⏱️', name: 'Hour Hero', earned: false },
  { id: 'diverse-mover', emoji: '🌟', name: 'Diverse Mover', earned: true },
];

function computeActivityXP(min: number): number {
  if (min >= 60) return 30;
  if (min >= 30) return 20;
  if (min >= 15) return 15;
  return 10;
}

// ========== RIGHT COLUMN COMPONENTS ==========

function CoachFlexCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <LessonMascot
        type="topic"
        topicMascot="fitness"
        message="Ready to move? Let's log your activity and earn XP!"
        size="md"
      />
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 font-medium">Coach Flex's Tip</p>
        <p className="text-sm text-gray-700 mt-1">
          Every minute of movement counts! Log your activities to track your progress.
        </p>
      </div>
    </div>
  );
}

function ActivityFactCard() {
  const randomFact = ACTIVITY_FACTS[Math.floor(Math.random() * ACTIVITY_FACTS.length)];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border border-purple-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-xs bg-purple-500 text-white px-3 py-1 rounded-full font-medium">
          💡 FUN ACTIVITY FACT
        </span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {randomFact}
      </p>
    </div>
  );
}

function ActivityBadgesCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-base text-gray-800">🏆 Activity Badges</h3>
        <Link href="/achievements" className="text-sm text-orange-500 font-medium hover:underline">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {ACTIVITY_BADGES.map((badge) => (
          <div key={badge.id} className="text-center">
            <div className={`
              w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl
              ${badge.earned
                ? 'bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300'
                : 'bg-gray-100 opacity-40 grayscale'}
            `}>
              {badge.emoji}
            </div>
            <p className={`text-xs mt-1 ${badge.earned ? 'text-gray-700' : 'text-gray-400'}`}>
              {badge.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyActivityChallenge() {
  return (
    <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-5 text-white shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">🎯 WEEKLY CHALLENGE</span>
        <span className="text-xs opacity-80">5 days left</span>
      </div>
      <h3 className="font-bold text-lg">Move 150 Minutes</h3>
      <p className="text-sm text-green-100 mt-1">Stay active all week!</p>
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1 opacity-80">
          <span>Progress</span>
          <span>0/150 min</span>
        </div>
        <div className="bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full" style={{ width: '0%' }} />
        </div>
      </div>
    </div>
  );
}

function AdPlaceholder() {
  return (
    <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
      <div className="text-center py-8">
        <div className="text-3xl mb-2 opacity-50">📣</div>
        <p className="text-sm text-gray-400">Ad Placeholder</p>
        <p className="text-xs text-gray-300 mt-1">340 x 180</p>
      </div>
    </div>
  );
}

// ========== MAIN COMPONENT ==========

export default function ActivityLog() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
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

  // Parse query params for pre-selected activity
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
      setLocation(`/success?logId=${response.id}&xp=${response.xpAwarded}&type=activity`);
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

    const logData = {
      userId: (user as any).id,
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
  const userXp = (user as any)?.totalXp || 0;

  // ========== RENDER WITH FULL LAYOUT ==========

  return (
    <div className="min-h-screen bg-gray-50">
      {/* CSS Animations - copied from Lessons.tsx */}
      <style>{`
        .activity-card {
          transition: all 0.3s ease;
        }
        .activity-card:hover {
          transform: translateY(-2px);
        }
        .selected-glow {
          box-shadow: 0 0 20px rgba(255, 106, 0, 0.15);
        }
      `}</style>

      {/* ✅ Sidebar - Fixed left 200px */}
      <Sidebar />

      {/* ✅ Main layout with sidebar offset */}
      <div className="flex min-h-screen md:ml-[200px]">
        <div className="flex-1 flex justify-center">
          <div className="flex max-w-[1100px] w-full">

            {/* ✅ Main Content Area */}
            <div className="flex-1 min-w-0 bg-white">

              {/* ✅ Header - Orange gradient + Stats bar */}
              <header className="sticky top-0 z-30">
                {/* Orange gradient section */}
                <div
                  className="px-6 py-6"
                  style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      onClick={() => setLocation('/dashboard')}
                      className="text-white/80 hover:text-white text-sm flex items-center space-x-1"
                    >
                      <span>←</span>
                      <span>Back</span>
                    </button>
                  </div>
                  <h1 className="text-2xl font-bold text-white">Log Your Activity</h1>
                  <p className="text-orange-100 text-sm mt-1">What did you do today?</p>
                </div>

                {/* Stats bar */}
                <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🔥</span>
                      <div>
                        <div className="text-base font-bold text-gray-900">{(user as any)?.streak || 0}</div>
                        <div className="text-xs text-gray-500">Streak</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">⭐</span>
                      <div>
                        <div className="text-base font-bold text-gray-700">{userXp} XP</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🏃</span>
                      <div>
                        <div className="text-base font-bold text-gray-700">0 min</div>
                        <div className="text-xs text-gray-500">This Week</div>
                      </div>
                    </div>
                  </div>

                  {/* XP to earn preview */}
                  {state.duration && (
                    <div className="hidden sm:block bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                      <span className="text-green-600 font-bold">+{computeActivityXP(state.duration)} XP</span>
                    </div>
                  )}
                </div>
              </header>

              {/* ✅ Main content area */}
              <div className="px-6 py-6 bg-gray-50 pb-32">

                {/* Activity Selection Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Pick your activity</h2>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {visibleActivities.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => handleActivitySelect(option)}
                        className={`
                          activity-card aspect-square flex flex-col items-center justify-center text-center p-3
                          rounded-2xl border-2 transition-all duration-200 min-h-[80px]
                          ${state.activity === option.key
                            ? 'border-[#FF6A00] bg-orange-50 scale-105 shadow-lg shadow-orange-200 selected-glow'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }
                          active:scale-95
                        `}
                      >
                        <span className="text-3xl mb-1">{option.emoji}</span>
                        <span className="text-xs font-medium text-gray-700">{option.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* More Activities Toggle */}
                  {ACTIVITY_OPTIONS.length > 6 && (
                    <button
                      onClick={() => setShowMoreActivities(!showMoreActivities)}
                      className="w-full mt-4 py-2 px-4 text-sm font-medium text-[#FF6A00] hover:bg-orange-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      {showMoreActivities ? (
                        <>Less <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>More activities <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  )}

                  {/* Custom Activity Input */}
                  {state.activity === 'other' && (
                    <div className="mt-4 space-y-2">
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
                </div>

                {/* Duration Selection Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">How long?</h2>

                  <div className="flex flex-wrap gap-3">
                    {DURATION_OPTIONS.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => handleDurationSelect(option.key)}
                        className={`
                          px-6 py-3 rounded-xl font-medium transition-all min-h-[48px]
                          ${state.duration === Number(option.key)
                            ? 'bg-[#FF6A00] text-white shadow-lg'
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
                        px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 min-h-[48px]
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

                  {/* Custom Duration Input */}
                  {showCustomDuration && (
                    <div className="mt-4 flex gap-3 items-end">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={customDuration}
                          onChange={(e) => setCustomDuration(e.target.value)}
                          placeholder="5-120"
                          min="5"
                          max="120"
                          className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#FF6A00] rounded-xl text-center text-lg"
                        />
                        <div className="text-xs text-gray-500 text-center mt-1">minutes (5-120)</div>
                      </div>
                      <Button
                        onClick={handleCustomDurationSet}
                        disabled={!customDuration || parseInt(customDuration) < 5 || parseInt(customDuration) > 120}
                        className="bg-[#FF6A00] hover:bg-[#E55A00] px-6 py-3 h-[52px]"
                      >
                        Set
                      </Button>
                    </div>
                  )}
                </div>

                {/* Mood Selection Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    How did it feel?
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">(optional)</p>

                  <div className="flex gap-4 justify-center">
                    {MOOD_OPTIONS.map((option) => (
                      <button
                        key={option.key}
                        onClick={() => handleMoodSelect(option.key)}
                        className={`
                          flex flex-col items-center p-4 rounded-xl transition-all min-w-[80px]
                          ${state.mood === option.key
                            ? 'bg-[#FF6A00] text-white scale-105 shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                          active:scale-95
                        `}
                      >
                        <span className="text-3xl mb-2">{option.emoji}</span>
                        <span className="text-xs font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview Card */}
                <Card className="border-2 border-gray-200 mb-6">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-gray-800 mb-4">Preview</h3>
                    <div className="space-y-3">
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
                        <div className="flex justify-between pt-3 border-t border-gray-200">
                          <span className="text-gray-600">XP to earn</span>
                          <span className="font-bold text-[#FF6A00] text-lg">+{computeActivityXP(state.duration)} XP</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sticky CTA Button */}
              <div className="fixed bottom-0 left-0 md:left-[200px] right-0 lg:right-[340px] bg-white border-t border-gray-200 p-4 z-20">
                <div className="max-w-[600px] mx-auto">
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="w-full bg-[#FF6A00] hover:bg-[#E55A00] text-white h-14 text-lg font-bold uppercase tracking-wider disabled:opacity-50 shadow-lg"
                    style={{ borderRadius: '16px' }}
                  >
                    {logMutation.isPending ? 'LOGGING...' : 'LOG ACTIVITY'}
                  </Button>
                </div>
              </div>
            </div>

            {/* ✅ Right Column - 340px */}
            <div className="hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0">
              <CoachFlexCard />
              <WeeklyActivityChallenge />
              <ActivityFactCard />
              <ActivityBadgesCard />
              <AdPlaceholder />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Mobile Bottom Navigation */}
      <div className="md:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
}
```

---

## KEY CHANGES SUMMARY

| Element | Before | After |
|---------|--------|-------|
| **Root container** | `min-h-screen bg-white` | `min-h-screen bg-gray-50` |
| **Sidebar** | ❌ Missing | ✅ `<Sidebar />` |
| **Layout wrapper** | ❌ None | ✅ `flex min-h-screen md:ml-[200px]` |
| **Max width container** | `max-w-md mx-auto` | `flex max-w-[1100px] w-full` |
| **Header style** | `bb-appbar` class | Orange gradient + stats bar |
| **Header gradient** | ❌ None | ✅ `linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)` |
| **Stats bar** | ❌ None | ✅ Streak, XP, Weekly minutes |
| **Content background** | `bg-white` | `bg-gray-50` with white cards |
| **Card styling** | Basic | `bg-white rounded-2xl p-5 shadow-sm border border-gray-200` |
| **Right column** | ❌ Missing | ✅ `w-[340px]` with CoachFlex, badges, facts |
| **Bottom nav (mobile)** | ❌ Missing | ✅ `<BottomNavigation />` |
| **CTA button position** | `fixed bottom-0 left-0 right-0` | `fixed bottom-0 left-0 md:left-[200px] right-0 lg:right-[340px]` |

---

## VISUAL LAYOUT DIAGRAM

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              VIEWPORT                                     │
├─────────┬────────────────────────────────────────────────┬───────────────┤
│         │                                                │               │
│ SIDEBAR │              MAIN CONTENT                      │ RIGHT COLUMN  │
│  200px  │           (flex-1, bg-white)                   │    340px      │
│         │                                                │               │
│ ┌─────┐ │  ┌──────────────────────────────────────────┐ │ ┌───────────┐ │
│ │🍊   │ │  │  HEADER (orange gradient)                │ │ │ 🏃 Coach  │ │
│ │Bite │ │  │  ← Back                                  │ │ │   Flex    │ │
│ │Burst│ │  │  Log Your Activity                       │ │ │ Ready to  │ │
│ └─────┘ │  │  What did you do today?                  │ │ │ move!     │ │
│         │  ├──────────────────────────────────────────┤ │ └───────────┘ │
│ Lessons │  │  🔥 0  │  ⭐ 0 XP  │  🏃 0 min           │ │               │
│ Champs  │  │  Streak   Total     This Week            │ │ ┌───────────┐ │
│ + LOG   │  └──────────────────────────────────────────┘ │ │ 🎯 WEEKLY │ │
│ Profile │                                                │ │ CHALLENGE │ │
│ More    │  ┌──────────────────────────────────────────┐ │ │ Move 150  │ │
│         │  │ Pick your activity                       │ │ │ minutes   │ │
│         │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐│ │ └───────────┘ │
│         │  │ │ ⚽ │ │ 🏃 │ │ 🧘 │ │ 🎯 │ │ 🚴 │ │ 🕺 ││ │               │
│         │  │ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘│ │ ┌───────────┐ │
│         │  └──────────────────────────────────────────┘ │ │ 💡 FUN    │ │
│         │                                                │ │ ACTIVITY  │ │
│         │  ┌──────────────────────────────────────────┐ │ │ FACT      │ │
│         │  │ How long?                                │ │ └───────────┘ │
│         │  │ [5 min] [15 min] [30 min] [60 min]       │ │               │
│         │  └──────────────────────────────────────────┘ │ ┌───────────┐ │
│         │                                                │ │ 🏆 BADGES │ │
│         │  ┌──────────────────────────────────────────┐ │ │ 🏃🔥⏱️🌟 │ │
│         │  │ How did it feel? (optional)              │ │ └───────────┘ │
│         │  │    😃       😐       😴                   │ │               │
│         │  └──────────────────────────────────────────┘ │ ┌───────────┐ │
│         │                                                │ │ 📣 Ad     │ │
│         │  ┌──────────────────────────────────────────┐ │ │ Placeholder│ │
│         │  │         [LOG ACTIVITY]                   │ │ └───────────┘ │
│         │  └──────────────────────────────────────────┘ │               │
└─────────┴────────────────────────────────────────────────┴───────────────┘
```

---

## FILES AFFECTED

| File | Action |
|------|--------|
| `client/src/pages/ActivityLog.tsx` | **REPLACE ENTIRELY** with code above |

**No new files needed** - all components are inline in the main file (matching the pattern used in Lessons.tsx).

---

## IMPORTANT IMPLEMENTATION NOTES

1. **Use existing components:**
   - `Sidebar` from `@/components/Sidebar`
   - `BottomNavigation` from `@/components/BottomNavigation`
   - `LessonMascot` with `topicMascot="fitness"` for Coach Flex

2. **Match exact class names from Lessons.tsx:**
   - Container: `flex max-w-[1100px] w-full`
   - Sidebar offset: `md:ml-[200px]`
   - Right column: `hidden lg:block w-[340px] bg-gray-50 border-l border-gray-200 p-5 space-y-5 flex-shrink-0`
   - Cards: `bg-white rounded-2xl p-5 border border-gray-200 shadow-sm`

3. **CTA button positioning:**
   - Must account for sidebar and right column
   - Use: `fixed bottom-0 left-0 md:left-[200px] right-0 lg:right-[340px]`

4. **Mobile responsive:**
   - Right column hidden on mobile: `hidden lg:block`
   - Sidebar hidden on mobile (handled by Sidebar component)
   - BottomNavigation shown only on mobile: `md:hidden`
