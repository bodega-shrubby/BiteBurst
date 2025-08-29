import { 
  User as KVUser, 
  Log as KVLog, 
  OnboardingSession,
  UserStats,
  UserStreak,
  UserBadges
} from "@shared/types";
import {
  getUser,
  findUserByEmail,
  updateUser,
  saveOnboarding,
  getOnboarding,
  finalizeProfile,
  addLog,
  getDayLogs,
  getUserStats,
  getUserStreak,
  getUserBadges,
  initializeCatalogs,
  getAvatarCatalog,
  getGoalsCatalog,
  getDateString
} from "../database/keyValue";

// Import existing interfaces for compatibility
import type { IStorage } from "../storage";
import type { User as PostgresUser } from "@shared/schema";

/**
 * Key-Value Storage implementation for BiteBurst
 * Implements the IStorage interface for backward compatibility
 * while using Replit's Key-Value Database internally
 */
export class KeyValueStorage implements IStorage {
  constructor() {
    // Initialize catalogs on startup
    this.initializeCatalogs();
  }

  private async initializeCatalogs() {
    try {
      await initializeCatalogs();
      console.log("Catalogs initialized successfully");
    } catch (error) {
      console.error("Failed to initialize catalogs:", error);
    }
  }

  // Convert KV User to Postgres User format for compatibility
  private kvUserToPostgresUser(kvUser: KVUser): PostgresUser {
    return {
      id: parseInt(kvUser.uid.replace(/\D/g, '')) || 1, // Extract numbers or default
      email: kvUser.email || null,
      firstName: kvUser.displayName.split(' ')[0] || null,
      lastName: kvUser.displayName.split(' ')[1] || null,
      profileImageUrl: null,
      replitId: kvUser.uid,
      username: kvUser.displayName.toLowerCase().replace(/\s+/g, ''),
      password: null,
      name: kvUser.displayName,
      displayName: kvUser.displayName,
      ageBracket: kvUser.ageBracket,
      age: parseInt(kvUser.ageBracket.split('-')[0]) || 10,
      goal: kvUser.goal,
      avatar: kvUser.avatar,
      onboardingCompleted: 1,
      xp: kvUser.xp,
      badges: kvUser.badges,
      streak: kvUser.streak,
      createdAt: new Date(kvUser.createdAt),
      updatedAt: new Date(kvUser.updatedAt)
    };
  }

  // IStorage interface implementation
  async getUser(id: string): Promise<PostgresUser | undefined> {
    const kvUser = await getUser(id);
    return kvUser ? this.kvUserToPostgresUser(kvUser) : undefined;
  }

  async getUserByReplitId(replitId: string): Promise<PostgresUser | undefined> {
    return this.getUser(replitId);
  }

  async getUserByUsername(username: string): Promise<PostgresUser | undefined> {
    // Note: KV database doesn't have username index, would need to implement if needed
    return undefined;
  }

  async getUserByEmail(email: string): Promise<PostgresUser | undefined> {
    const kvUser = await findUserByEmail(email);
    return kvUser ? this.kvUserToPostgresUser(kvUser) : undefined;
  }

  async upsertUser(userData: any): Promise<PostgresUser> {
    const kvUser: KVUser = {
      uid: userData.replitId || userData.uid || `user-${Date.now()}`,
      displayName: userData.displayName || userData.name || userData.firstName || '',
      ageBracket: userData.ageBracket || '9-11',
      goal: userData.goal || 'energy',
      avatar: userData.avatar || 'mascot-01',
      email: userData.email,
      parentConsent: userData.parentConsent || true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      xp: userData.xp || 0,
      streak: userData.streak || 0,
      badges: userData.badges || [],
      locale: userData.locale || 'en-US',
      tz: userData.tz || 'UTC',
      status: 'active'
    };

    // Check if user exists
    const existingUser = await getUser(kvUser.uid);
    if (existingUser) {
      // Update existing user
      const updatedUser = await updateUser(kvUser.uid, kvUser);
      return this.kvUserToPostgresUser(updatedUser);
    } else {
      // Create new user (this should go through onboarding)
      throw new Error("User creation should go through onboarding process");
    }
  }

  async createUser(insertUser: any): Promise<PostgresUser> {
    // For backward compatibility, create user directly
    const uid = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const kvUser: KVUser = {
      uid,
      displayName: insertUser.displayName || insertUser.name,
      ageBracket: insertUser.ageBracket || '9-11',
      goal: insertUser.goal || 'energy',
      avatar: insertUser.avatar || 'mascot-01',
      email: insertUser.email,
      parentConsent: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      xp: 0,
      streak: 0,
      badges: [],
      locale: 'en-US',
      tz: 'UTC',
      status: 'active'
    };

    // Save user and initialize associated data
    const user = await finalizeProfile(uid);
    
    // Set the onboarding data first
    await saveOnboarding(uid, {
      displayName: kvUser.displayName,
      ageBracket: kvUser.ageBracket,
      goal: kvUser.goal,
      avatar: kvUser.avatar,
      email: kvUser.email,
      parentConsent: kvUser.parentConsent
    });
    
    return this.kvUserToPostgresUser(user);
  }

  // Key-Value specific methods
  async saveOnboardingData(uid: string, answers: Partial<OnboardingSession['answers']>, step?: number): Promise<void> {
    await saveOnboarding(uid, answers, step);
  }

  async getOnboardingData(uid: string): Promise<OnboardingSession | null> {
    return await getOnboarding(uid);
  }

  async completeOnboarding(uid: string): Promise<PostgresUser> {
    const user = await finalizeProfile(uid);
    return this.kvUserToPostgresUser(user);
  }

  async addUserLog(uid: string, logData: {
    type: 'food' | 'activity';
    entryMethod: 'emoji' | 'text' | 'photo';
    content: {
      emoji?: string[];
      text?: string;
      photoB64?: string;
    };
    goalContext: 'energy' | 'focus' | 'strength';
    aiFeedback?: string;
    xpAwarded: number;
    meta?: Record<string, unknown>;
  }): Promise<KVLog> {
    return await addLog(uid, logData);
  }

  async getUserDayLogs(uid: string, date?: string): Promise<KVLog[]> {
    const dateStr = date || getDateString();
    return await getDayLogs(uid, dateStr);
  }

  async getUserStatsData(uid: string): Promise<UserStats | null> {
    return await getUserStats(uid);
  }

  async getUserStreakData(uid: string): Promise<UserStreak | null> {
    return await getUserStreak(uid);
  }

  async getUserBadgesData(uid: string): Promise<UserBadges | null> {
    return await getUserBadges(uid);
  }

  async getAvatars(): Promise<any[]> {
    return await getAvatarCatalog();
  }

  async getGoals(): Promise<any[]> {
    return await getGoalsCatalog();
  }
}

export const keyValueStorage = new KeyValueStorage();