import {
  users,
  logs,
  streaks,
  badges,
  xpEvents,
  avatars,
  goals,
  lessons,
  lessonSteps,
  lessonAttempts,
  mascots,
  curriculums,
  units,
  type User,
  type InsertUser,
  type Log,
  type InsertLog,
  type Streak,
  type Badge,
  type Avatar,
  type Goal,
  type Lesson,
  type LessonStep,
  type LessonAttempt,
  type InsertLessonAttempt,
  type Mascot,
  type Curriculum,
  type Unit,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByDisplayName(displayName: string): Promise<User | undefined>;
  getUserByParentAuthId(parentAuthId: string): Promise<User | undefined>;
  createUser(insertUser: Partial<InsertUser>): Promise<User>;
  createUserWithId(userData: Partial<InsertUser> & { id: string }): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  
  // Avatar and Goal operations
  getAvatars(): Promise<Avatar[]>;
  getGoals(): Promise<Goal[]>;
  
  // Log operations
  createLog(insertLog: Partial<InsertLog>): Promise<Log>;
  getUserLogs(userId: string, limit?: number): Promise<Log[]>;
  updateLogFeedback(logId: string, feedback: string): Promise<void>;
  
  // Streak operations
  getUserStreak(userId: string): Promise<Streak | undefined>;
  updateStreak(userId: string, updates: Partial<{ current: number; longest: number; lastActive: Date }>): Promise<Streak>;
  
  // Badge operations
  getUserBadges(userId: string): Promise<Badge[]>;
  awardBadge(userId: string, badgeId: string): Promise<Badge>;
  
  // XP operations
  updateUserXP(userId: string, updates: { totalXp: number; level: number; streak: number; lastLogAt: Date }): Promise<User>;
  logXPEvent(event: { userId: string; amount: number; reason: string; refLog?: string }): Promise<any>;
  
  // Lesson attempt operations
  logLessonAttempt(insertAttempt: InsertLessonAttempt): Promise<LessonAttempt>;
  
  // Lesson operations
  getLessonWithSteps(lessonId: string): Promise<{ id: string; title: string; description?: string; totalSteps: number; steps: any[] } | undefined>;
  
  // Mascot operations
  getMascots(): Promise<Mascot[]>;
  getMascotById(id: string): Promise<Mascot | undefined>;
  
  // Curriculum operations  
  getCurriculums(): Promise<Curriculum[]>;
  getCurriculumsByCountry(country: string): Promise<Curriculum[]>;
  
  // Unit operations
  getUnitsByCurriculum(curriculumId: string): Promise<Unit[]>;
  
  // Lesson by unit operations
  getLessonsByUnit(unitId: string): Promise<Lesson[]>;
  
  // Lesson progress operations
  getCompletedLessonIds(userId: string): Promise<string[]>;
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

  // Find child profile by parent's Supabase auth ID
  async getUserByParentAuthId(parentAuthId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.parentAuthId, parentAuthId));
    return user || undefined;
  }

  async createUser(insertUser: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser as any)
      .returning();
    return user;
  }

  async createUserWithId(userData: Partial<InsertUser> & { id: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData as any)
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
      .values(insertLog as any)
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

  async updateLogFeedback(logId: string, feedback: string): Promise<void> {
    await db
      .update(logs)
      .set({ aiFeedback: feedback })
      .where(eq(logs.id, logId));
  }

  async getUserStreak(userId: string): Promise<Streak | undefined> {
    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
    return streak || undefined;
  }

  async updateStreak(userId: string, updates: Partial<{ current: number; longest: number; lastActive: Date }>): Promise<Streak> {
    const [streak] = await db
      .insert(streaks)
      .values({
        userId,
        current: updates.current || 0,
        longest: updates.longest || 0,
        lastActive: updates.lastActive?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      })
      .onConflictDoUpdate({
        target: streaks.userId,
        set: {
          current: updates.current || 0,
          longest: updates.longest || 0,
          lastActive: updates.lastActive?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
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
      .orderBy(desc(badges.earnedAt));
  }

  async awardBadge(userId: string, badgeCode: string): Promise<Badge> {
    const [badge] = await db
      .insert(badges)
      .values({ userId, badgeCode })
      .onConflictDoNothing()
      .returning();
    return badge;
  }

  async updateUserXP(userId: string, updates: { totalXp: number; level: number; streak: number; lastLogAt: Date }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        totalXp: updates.totalXp,
        level: updates.level,
        streak: updates.streak,
        lastLogAt: updates.lastLogAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async logXPEvent(event: { userId: string; amount: number; reason: string; refLog?: string }): Promise<any> {
    const [xpEvent] = await db
      .insert(xpEvents)
      .values({
        userId: event.userId,
        amount: event.amount,
        reason: event.reason,
        refLog: event.refLog,
      })
      .returning();
    return xpEvent;
  }

  async logLessonAttempt(insertAttempt: InsertLessonAttempt): Promise<LessonAttempt> {
    const [attempt] = await db
      .insert(lessonAttempts)
      .values(insertAttempt as any)
      .returning();
    return attempt;
  }
  
  async getLessonWithSteps(lessonId: string): Promise<{ id: string; title: string; description?: string; totalSteps: number; steps: any[] } | undefined> {
    // Get lesson data
    const [lesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId));
    
    if (!lesson) {
      return undefined;
    }
    
    // Get lesson steps
    const steps = await db
      .select()
      .from(lessonSteps)
      .where(eq(lessonSteps.lessonId, lessonId))
      .orderBy(lessonSteps.stepNumber);
    
    // DEBUG: Log raw step data from Drizzle
    if (steps.length > 0) {
      console.log('DEBUG STORAGE - Raw step[0] keys:', Object.keys(steps[0]));
      console.log('DEBUG STORAGE - step[0].retryConfig:', steps[0]?.retryConfig);
      console.log('DEBUG STORAGE - Raw step[0]:', JSON.stringify(steps[0], null, 2));
    }
    
    return {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || undefined,
      totalSteps: lesson.totalSteps || steps.length,
      steps: steps.map(step => ({
        id: step.id,
        stepNumber: step.stepNumber,
        questionType: step.questionType,
        question: step.question,
        content: step.content,
        xpReward: step.xpReward,
        mascotAction: step.mascotAction || undefined,
        retryConfig: step.retryConfig || undefined,
      }))
    };
  }
  
  // Mascot operations
  async getMascots(): Promise<Mascot[]> {
    return await db.select().from(mascots).where(eq(mascots.isActive, true));
  }
  
  async getMascotById(id: string): Promise<Mascot | undefined> {
    const [mascot] = await db.select().from(mascots).where(eq(mascots.id, id));
    return mascot || undefined;
  }
  
  // Curriculum operations
  async getCurriculums(): Promise<Curriculum[]> {
    return await db.select().from(curriculums).where(eq(curriculums.isActive, true));
  }
  
  async getCurriculumsByCountry(country: string): Promise<Curriculum[]> {
    return await db.select().from(curriculums).where(
      and(eq(curriculums.country, country), eq(curriculums.isActive, true))
    );
  }
  
  // Unit operations
  async getUnitsByCurriculum(curriculumId: string): Promise<Unit[]> {
    return await db.select().from(units)
      .where(and(eq(units.curriculumId, curriculumId), eq(units.isActive, true)))
      .orderBy(units.orderPosition);
  }
  
  // Lesson by unit operations
  async getLessonsByUnit(unitId: string): Promise<Lesson[]> {
    return await db.select().from(lessons)
      .where(and(eq(lessons.unitId, unitId), eq(lessons.isActive, true)))
      .orderBy(lessons.orderInUnit);
  }
  
  // Get completed lesson IDs for a user (based on lesson_attempts with isCorrect=true for all steps)
  async getCompletedLessonIds(userId: string): Promise<string[]> {
    // Get all unique lessonIds where user has at least one correct answer
    // This is a simplified approach - ideally should check if ALL steps are completed
    const results = await db
      .selectDistinct({ lessonId: lessonAttempts.lessonId })
      .from(lessonAttempts)
      .where(and(
        eq(lessonAttempts.userId, userId),
        eq(lessonAttempts.isCorrect, true)
      ));
    return results.map(r => r.lessonId);
  }
}

// Use PostgreSQL as primary database
export const storage = new DatabaseStorage();
