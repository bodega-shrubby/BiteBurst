import {
  users,
  type User,
  type UpsertUser,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByReplitId(replitId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Other operations
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: any): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    // First try to find by replit ID, then by regular ID
    let user = await this.getUserByReplitId(id);
    if (!user) {
      const numericId = parseInt(id);
      if (!isNaN(numericId)) {
        const [foundUser] = await db.select().from(users).where(eq(users.id, numericId));
        user = foundUser;
      }
    }
    return user;
  }

  async getUserByReplitId(replitId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.replitId, replitId));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Try to find existing user by replit ID
    if (userData.replitId) {
      const existingUser = await this.getUserByReplitId(userData.replitId);
      if (existingUser) {
        // Update existing user
        const [user] = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingUser.id))
          .returning();
        return user;
      }
    }
    
    // Create new user
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  // Other operations
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        id: undefined, // Let database generate UUID
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
