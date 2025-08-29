import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Types for Key-Value API responses
export interface KVUser {
  uid: string;
  displayName: string;
  ageBracket: "6-8" | "9-11" | "12-14";
  goal: "energy" | "focus" | "strength";
  avatar: string;
  email?: string;
  xp: number;
  streak: number;
  badges: string[];
}

export interface KVLog {
  id: string;
  uid: string;
  date: string;
  ts: number;
  type: "food" | "activity";
  entryMethod: "emoji" | "text" | "photo";
  content: {
    emoji?: string[];
    text?: string;
    photoB64?: string;
  };
  goalContext: "energy" | "focus" | "strength";
  aiFeedback?: string;
  xpAwarded: number;
  meta?: Record<string, unknown>;
}

export interface KVStats {
  uid: string;
  xp: number;
  streak: number;
  lastLogDate: string;
  dailyTotals: Record<string, { entries: number; xp: number }>;
  updatedAt: number;
}

export interface KVStreak {
  uid: string;
  current: number;
  longest: number;
  lastActiveDate: string;
  updatedAt: number;
}

export interface KVBadges {
  uid: string;
  earned: Array<{
    id: string;
    name: string;
    ts: number;
  }>;
}

export interface DashboardData {
  user: KVUser;
  stats: KVStats;
  streak: KVStreak;
  badges: KVBadges;
  todayLogs: KVLog[];
  summary: {
    totalXP: number;
    currentStreak: number;
    longestStreak: number;
    totalBadges: number;
    todayEntries: number;
    todayXP: number;
  };
}

// Onboarding hooks
export function useOnboarding(uid: string | null) {
  return useQuery({
    queryKey: [`/api/kv/onboarding/${uid}`],
    enabled: !!uid,
  });
}

export function useSaveOnboarding() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ uid, answers, step }: { uid: string; answers: any; step?: number }) => {
      const response = await apiRequest("POST", `/api/kv/onboarding/${uid}`, {
        answers,
        step
      });
      return response.json();
    },
    onSuccess: (_, { uid }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/kv/onboarding/${uid}`] });
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (uid: string) => {
      const response = await apiRequest("POST", `/api/kv/onboarding/${uid}/complete`);
      return response.json();
    },
    onSuccess: (_, uid) => {
      queryClient.invalidateQueries({ queryKey: [`/api/kv/user/${uid}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${uid}`] });
    },
  });
}

// User data hooks
export function useKVUser(uid: string | null) {
  return useQuery({
    queryKey: [`/api/kv/user/${uid}`],
    enabled: !!uid,
  });
}

export function useKVUserByEmail(email: string | null) {
  return useQuery({
    queryKey: [`/api/kv/user/email/${email}`],
    enabled: !!email,
  });
}

// Dashboard hooks
export function useDashboard(uid: string | null) {
  return useQuery({
    queryKey: [`/api/dashboard/${uid}`],
    enabled: !!uid,
    staleTime: 30000, // Cache for 30 seconds
  });
}

export function useQuickStats(uid: string | null) {
  return useQuery({
    queryKey: [`/api/dashboard/${uid}/quick-stats`],
    enabled: !!uid,
    staleTime: 60000, // Cache for 1 minute
  });
}

export function useRecentActivity(uid: string | null, days: number = 7) {
  return useQuery({
    queryKey: [`/api/dashboard/${uid}/recent`],
    enabled: !!uid,
  });
}

// Stats hooks
export function useKVStats(uid: string | null) {
  return useQuery({
    queryKey: [`/api/kv/user/${uid}/stats`],
    enabled: !!uid,
  });
}

export function useKVStreak(uid: string | null) {
  return useQuery({
    queryKey: [`/api/kv/user/${uid}/streak`],
    enabled: !!uid,
  });
}

export function useKVBadges(uid: string | null) {
  return useQuery({
    queryKey: [`/api/kv/user/${uid}/badges`],
    enabled: !!uid,
  });
}

// Log hooks
export function useKVLogs(uid: string | null, date?: string) {
  return useQuery({
    queryKey: [`/api/kv/user/${uid}/logs`, date],
    enabled: !!uid,
  });
}

export function useAddLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ uid, logData }: { uid: string; logData: Omit<KVLog, 'id' | 'uid' | 'date' | 'ts'> }) => {
      const response = await apiRequest("POST", `/api/kv/user/${uid}/logs`, logData);
      return response.json();
    },
    onSuccess: (_, { uid }) => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: [`/api/kv/user/${uid}/logs`] });
      queryClient.invalidateQueries({ queryKey: [`/api/kv/user/${uid}/stats`] });
      queryClient.invalidateQueries({ queryKey: [`/api/kv/user/${uid}/streak`] });
      queryClient.invalidateQueries({ queryKey: [`/api/kv/user/${uid}/badges`] });
      queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${uid}`] });
    },
  });
}

// Catalog hooks
export function useAvatars() {
  return useQuery({
    queryKey: [`/api/kv/avatars`],
    staleTime: Infinity, // Catalog data doesn't change often
  });
}

export function useGoals() {
  return useQuery({
    queryKey: [`/api/kv/goals`],
    staleTime: Infinity, // Catalog data doesn't change often
  });
}

// Legacy profile creation for backward compatibility
export function useCreateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiRequest("POST", "/api/profile/create", profileData);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.user?.uid) {
        queryClient.invalidateQueries({ queryKey: [`/api/kv/user/${data.user.uid}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/dashboard/${data.user.uid}`] });
      }
    },
  });
}