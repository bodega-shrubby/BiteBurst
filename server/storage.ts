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
  userLessonProgress,
  mascots,
  curriculums,
  topics,
  children,
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
  type Topic,
  type Child,
  type InsertChild,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // Parent User operations (new architecture)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByDisplayName(displayName: string): Promise<User | undefined>;
  getUserByParentAuthId(parentAuthId: string): Promise<User | undefined>;
  getParentByAuthId(authId: string): Promise<User | undefined>;
  createUser(insertUser: Partial<InsertUser>): Promise<User>;
  createUserWithId(userData: Partial<InsertUser> & { id: string }): Promise<User>;
  createParentUser(data: {
    parentAuthId: string;
    email: string;
    parentEmail?: string;
    parentConsent: boolean;
    authProvider: string;
    subscriptionPlan?: string;
    subscriptionChildrenLimit?: number;
    displayName?: string;
  }): Promise<User>;
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
  
  // XP operations (legacy - kept for backwards compatibility)
  updateUserXP(userId: string, updates: { totalXp: number; level: number; streak: number; lastLogAt: Date }): Promise<User>;
  logXPEvent(event: { userId: string; amount: number; reason: string; refLog?: string }): Promise<any>;
  
  // Child progress operations (new architecture)
  updateChildProgress(childId: string, data: {
    totalXp?: number;
    level?: number;
    streak?: number;
    lastLogAt?: Date;
  }): Promise<Child>;
  
  // Lesson attempt operations
  logLessonAttempt(insertAttempt: InsertLessonAttempt): Promise<LessonAttempt>;
  markLessonComplete(userId: string, lessonId: string, xpEarned: number, childId?: string): Promise<void>;
  
  // Lesson operations
  getLessonWithSteps(lessonId: string): Promise<{ 
    id: string; 
    title: string; 
    description?: string; 
    totalSteps: number; 
    steps: any[];
    learningTakeaway?: string;
    mascotIntro?: string;
    mascotId?: string;
    orderInUnit?: number;
    iconEmoji?: string;
  } | undefined>;
  
  // Mascot operations
  getMascots(): Promise<Mascot[]>;
  getMascotById(id: string): Promise<Mascot | undefined>;
  
  // Curriculum operations  
  getCurriculums(): Promise<Curriculum[]>;
  getCurriculumsByCountry(country: string): Promise<Curriculum[]>;
  
  // Topic operations
  getTopicsByCurriculum(curriculumId: string): Promise<Topic[]>;
  getTopicsByYearGroup(yearGroup: string): Promise<Topic[]>;
  getTopicById(topicId: string): Promise<Topic | undefined>;
  
  // Lesson by topic operations
  getLessonsByTopic(topicId: string): Promise<Lesson[]>;
  
  // Lesson progress operations
  getCompletedLessonIds(userId: string, childId?: string): Promise<string[]>;
  
  // Lesson by year group operations
  getLessonsByYearGroup(yearGroup: string): Promise<Lesson[]>;
  
  // Children operations (new architecture - ALL children including first)
  getChildren(parentId: string): Promise<Child[]>;
  getChildrenByParentId(parentId: string): Promise<Child[]>;
  getChild(childId: string): Promise<Child | undefined>;
  getChildById(childId: string): Promise<Child | undefined>;
  createChild(insertChild: InsertChild): Promise<Child>;
  createChildProfile(data: {
    parentId: string;
    name: string;
    username: string;
    avatar?: string;
    yearGroup: string;
    curriculumId: string;
    curriculumCountry?: string;
    goal?: string;
    favoriteFruits?: string[];
    favoriteVeggies?: string[];
    favoriteFoods?: string[];
    favoriteSports?: string[];
    locale?: string;
    tz?: string;
  }): Promise<Child>;
  updateChild(childId: string, updates: Partial<InsertChild>): Promise<Child>;
  updateChildProfile(childId: string, updates: Partial<Child>): Promise<Child>;
  deleteChild(childId: string): Promise<void>;
  isChildOwnedByParent(childId: string, parentId: string): Promise<boolean>;
  
  // Subscription operations
  updateSubscription(userId: string, plan: string, childrenLimit: number): Promise<User>;
  setActiveChild(userId: string, childId: string | null): Promise<User>;
  setActiveChildId(parentId: string, childId: string | null): Promise<User>;
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

  // Find parent user by Supabase auth ID (new architecture)
  async getUserByParentAuthId(parentAuthId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.parentAuthId, parentAuthId));
    return user || undefined;
  }

  // Alias for consistency with new architecture
  async getParentByAuthId(authId: string): Promise<User | undefined> {
    return this.getUserByParentAuthId(authId);
  }

  // Create a parent user (auth only, no child data) - new architecture
  async createParentUser(data: {
    parentAuthId: string;
    email: string;
    parentEmail?: string;
    parentConsent: boolean;
    authProvider: string;
    subscriptionPlan?: string;
    subscriptionChildrenLimit?: number;
    displayName?: string;
  }): Promise<User> {
    const [user] = await db.insert(users).values({
      parentAuthId: data.parentAuthId,
      email: data.email,
      parentEmail: data.parentEmail || data.email,
      parentConsent: data.parentConsent,
      authProvider: data.authProvider,
      displayName: data.displayName || data.email.split('@')[0],
      // Default values for legacy fields (child data now in children table)
      goal: 'energy',
      yearGroup: 'year-1',
      curriculum: 'uk-ks1',
      curriculumCountry: 'uk',
      subscriptionPlan: data.subscriptionPlan || 'free',
      subscriptionChildrenLimit: data.subscriptionChildrenLimit || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any).returning();
    return user;
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
  
  async getLessonWithSteps(lessonId: string): Promise<{ 
    id: string; 
    title: string; 
    description?: string; 
    totalSteps: number; 
    steps: any[];
    learningTakeaway?: string;
    mascotIntro?: string;
    mascotId?: string;
    orderInUnit?: number;
    iconEmoji?: string;
  } | undefined> {
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
      learningTakeaway: lesson.learningTakeaway || undefined,
      mascotIntro: lesson.mascotIntro || undefined,
      mascotId: lesson.mascotId || undefined,
      orderInUnit: lesson.orderInUnit || undefined,
      iconEmoji: lesson.iconEmoji || undefined,
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
  
  // Topic operations
  async getTopicsByCurriculum(curriculumId: string): Promise<Topic[]> {
    return await db.select().from(topics)
      .where(and(eq(topics.curriculumId, curriculumId), eq(topics.isActive, true)))
      .orderBy(topics.orderPosition);
  }
  
  async getTopicsByYearGroup(yearGroup: string): Promise<Topic[]> {
    return await db.select().from(topics)
      .where(and(eq(topics.yearGroup, yearGroup), eq(topics.isActive, true)))
      .orderBy(topics.orderPosition);
  }
  
  async getTopicById(topicId: string): Promise<Topic | undefined> {
    const [topic] = await db.select().from(topics).where(eq(topics.id, topicId));
    return topic || undefined;
  }
  
  // Lesson by topic operations
  async getLessonsByTopic(topicId: string): Promise<Lesson[]> {
    return await db.select().from(lessons)
      .where(and(eq(lessons.topicId, topicId), eq(lessons.isActive, true)))
      .orderBy(lessons.orderInUnit);
  }
  
  // Get completed lesson IDs for a user or child
  async getCompletedLessonIds(userId: string, childId?: string): Promise<string[]> {
    // If childId is provided, fetch progress for that specific child
    if (childId) {
      // Check lesson_attempts for the child
      const attemptResults = await db
        .selectDistinct({ lessonId: lessonAttempts.lessonId })
        .from(lessonAttempts)
        .where(and(
          eq(lessonAttempts.childId, childId),
          eq(lessonAttempts.isCorrect, true)
        ));
      
      return attemptResults.map(r => r.lessonId);
    }
    
    // For primary child (no childId), use userId
    // First check user_lesson_progress table for explicitly completed lessons
    const progressResults = await db
      .select({ lessonId: userLessonProgress.lessonId })
      .from(userLessonProgress)
      .where(and(
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.completed, true)
      ));
    
    // Also check lesson_attempts for backwards compatibility (where childId is null)
    const attemptResults = await db
      .selectDistinct({ lessonId: lessonAttempts.lessonId })
      .from(lessonAttempts)
      .where(and(
        eq(lessonAttempts.userId, userId),
        eq(lessonAttempts.isCorrect, true),
        sql`${lessonAttempts.childId} IS NULL`
      ));
    
    // Combine both sources
    const completedIds = new Set([
      ...progressResults.map(r => r.lessonId),
      ...attemptResults.map(r => r.lessonId)
    ]);
    
    return Array.from(completedIds);
  }
  
  // Mark a lesson as complete
  async markLessonComplete(userId: string, lessonId: string, xpEarned: number, childId?: string): Promise<void> {
    if (childId) {
      // For additional children, we track completion via lesson_attempts with childId
      // Check if there's already a completion record
      const existing = await db
        .select()
        .from(lessonAttempts)
        .where(and(
          eq(lessonAttempts.childId, childId),
          eq(lessonAttempts.lessonId, lessonId),
          eq(lessonAttempts.isCorrect, true)
        ))
        .limit(1);
      
      if (existing.length === 0) {
        // Get the first step of the lesson to use as reference
        const steps = await db.select().from(lessonSteps).where(eq(lessonSteps.lessonId, lessonId)).limit(1);
        const stepId = steps[0]?.id || 'completion-step';
        
        // Insert a completion record
        await db.insert(lessonAttempts).values({
          userId,
          childId,
          lessonId,
          stepId,
          stepNumber: 999,
          attemptNumber: 1,
          isCorrect: true,
          heartsRemaining: 5,
          xpEarned,
        });
      }
    } else {
      // For primary child, use user_lesson_progress
      await db
        .insert(userLessonProgress)
        .values({
          userId,
          lessonId,
          currentStep: 999, // All steps done
          completed: true,
          completedAt: new Date(),
          totalXpEarned: xpEarned,
          hearts: 5,
        })
        .onConflictDoUpdate({
          target: [userLessonProgress.userId, userLessonProgress.lessonId],
          set: {
            completed: true,
            completedAt: new Date(),
            totalXpEarned: xpEarned,
            updatedAt: new Date(),
          }
        });
    }
  }
  
  // Get lessons by year group
  async getLessonsByYearGroup(yearGroup: string): Promise<Lesson[]> {
    return await db.select().from(lessons)
      .where(and(
        eq(lessons.yearGroup, yearGroup),
        eq(lessons.isActive, true)
      ))
      .orderBy(lessons.orderInUnit);
  }
  
  // Children operations (new architecture - ALL children including first)
  async getChildren(parentId: string): Promise<Child[]> {
    return await db.select().from(children)
      .where(eq(children.parentId, parentId))
      .orderBy(children.createdAt);
  }
  
  // Alias for consistency with new architecture
  async getChildrenByParentId(parentId: string): Promise<Child[]> {
    return this.getChildren(parentId);
  }
  
  async getChild(childId: string): Promise<Child | undefined> {
    const [child] = await db.select().from(children).where(eq(children.id, childId));
    return child || undefined;
  }
  
  // Alias for consistency with new architecture
  async getChildById(childId: string): Promise<Child | undefined> {
    return this.getChild(childId);
  }
  
  async createChild(insertChild: InsertChild): Promise<Child> {
    const [child] = await db
      .insert(children)
      .values(insertChild as any)
      .returning();
    return child;
  }
  
  // Create a child profile (used for ALL children, including first) - new architecture
  async createChildProfile(data: {
    parentId: string;
    name: string;
    username: string;
    avatar?: string;
    yearGroup: string;
    curriculumId: string;
    curriculumCountry?: string;
    goal?: string;
    favoriteFruits?: string[];
    favoriteVeggies?: string[];
    favoriteFoods?: string[];
    favoriteSports?: string[];
    locale?: string;
    tz?: string;
  }): Promise<Child> {
    const [child] = await db.insert(children).values({
      parentId: data.parentId,
      name: data.name,
      username: data.username,
      avatar: data.avatar || '🧒',
      yearGroup: data.yearGroup,
      curriculumId: data.curriculumId,
      curriculumCountry: data.curriculumCountry || null,
      goal: data.goal || null,
      totalXp: 0,
      level: 1,
      streak: 0,
      favoriteFruits: data.favoriteFruits || [],
      favoriteVeggies: data.favoriteVeggies || [],
      favoriteFoods: data.favoriteFoods || [],
      favoriteSports: data.favoriteSports || [],
      locale: data.locale || null,
      tz: data.tz || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();
    return child;
  }
  
  async updateChild(childId: string, updates: Partial<InsertChild>): Promise<Child> {
    const [child] = await db
      .update(children)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(children.id, childId))
      .returning();
    return child;
  }
  
  // Update child profile (alias for consistency)
  async updateChildProfile(childId: string, updates: Partial<Child>): Promise<Child> {
    const [child] = await db
      .update(children)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(children.id, childId))
      .returning();
    return child;
  }
  
  // Update child XP/level/streak - new architecture
  async updateChildProgress(childId: string, data: {
    totalXp?: number;
    level?: number;
    streak?: number;
    lastLogAt?: Date;
  }): Promise<Child> {
    const [child] = await db.update(children)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(children.id, childId))
      .returning();
    return child;
  }
  
  async deleteChild(childId: string): Promise<void> {
    await db.delete(children).where(eq(children.id, childId));
  }
  
  // Check if child belongs to parent - new architecture
  async isChildOwnedByParent(childId: string, parentId: string): Promise<boolean> {
    const child = await this.getChildById(childId);
    return child ? child.parentId === parentId : false;
  }
  
  // Subscription operations
  async updateSubscription(userId: string, plan: string, childrenLimit: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        subscriptionPlan: plan,
        subscriptionChildrenLimit: childrenLimit,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  async setActiveChild(userId: string, childId: string | null): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        activeChildId: childId,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }
  
  // Alias for consistency with new architecture
  async setActiveChildId(parentId: string, childId: string | null): Promise<User> {
    return this.setActiveChild(parentId, childId);
  }
}

// Use PostgreSQL as primary database
export const storage = new DatabaseStorage();
