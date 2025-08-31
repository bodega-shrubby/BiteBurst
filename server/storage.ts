import {
  users,
  logs,
  streaks,
  badges,
  xpEvents,
  avatars,
  goals,
  type User,
  type InsertUser,
  type Log,
  type InsertLog,
  type Streak,
  type Badge,
  type Avatar,
  type Goal,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByDisplayName(displayName: string): Promise<User | undefined>;
  createUser(insertUser: Partial<InsertUser>): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  
  // Avatar and Goal operations
  getAvatars(): Promise<Avatar[]>;
  getGoals(): Promise<Goal[]>;
  
  // Log operations
  createLog(insertLog: Partial<InsertLog>): Promise<Log>;
  getUserLogs(userId: string, limit?: number): Promise<Log[]>;
  
  // Streak operations
  getUserStreak(userId: string): Promise<Streak | undefined>;
  updateStreak(userId: string, current: number, longest: number): Promise<Streak>;
  
  // Badge operations
  getUserBadges(userId: string): Promise<Badge[]>;
  awardBadge(userId: string, badgeId: string): Promise<Badge>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  // Add method for finding user by display name (used as username)
  async getUserByDisplayName(displayName: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.displayName, displayName));
    return user || undefined;
  }

  async createUser(insertUser: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAvatars(): Promise<Avatar[]> {
    return await db.select().from(avatars);
  }

  async getGoals(): Promise<Goal[]> {
    return await db.select().from(goals);
  }

  async createLog(insertLog: Partial<InsertLog>): Promise<Log> {
    const [log] = await db
      .insert(logs)
      .values(insertLog)
      .returning();
    return log;
  }

  async getUserLogs(userId: string, limit: number = 20): Promise<Log[]> {
    return await db
      .select()
      .from(logs)
      .where(eq(logs.userId, userId))
      .orderBy(desc(logs.ts))
      .limit(limit);
  }

  async getUserStreak(userId: string): Promise<Streak | undefined> {
    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
    return streak || undefined;
  }

  async updateStreak(userId: string, current: number, longest: number): Promise<Streak> {
    const [streak] = await db
      .insert(streaks)
      .values({
        userId,
        current,
        longest,
        lastActive: new Date().toISOString().split('T')[0],
      })
      .onConflictDoUpdate({
        target: streaks.userId,
        set: {
          current,
          longest,
          lastActive: new Date().toISOString().split('T')[0],
          updatedAt: new Date(),
        },
      })
      .returning();
    return streak;
  }

  async getUserBadges(userId: string): Promise<Badge[]> {
    return await db
      .select()
      .from(badges)
      .where(eq(badges.userId, userId))
      .orderBy(desc(badges.awardedAt));
  }

  async awardBadge(userId: string, badgeId: string): Promise<Badge> {
    const [badge] = await db
      .insert(badges)
      .values({ userId, badgeId })
      .onConflictDoNothing()
      .returning();
    return badge;
  }
}

// Use PostgreSQL as primary database
export const storage = new DatabaseStorage();
