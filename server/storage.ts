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
  getUserByEmail(email: string): Promise<User | undefined>;
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
    // Try to find existing user by replit ID first
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
    
    // If no replit ID match, check for existing email (BiteBurst profile)
    if (userData.email) {
      const existingUserByEmail = await db.select().from(users).where(eq(users.email, userData.email));
      if (existingUserByEmail.length > 0) {
        // Update existing user with Replit ID mapping
        const [user] = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingUserByEmail[0].id))
          .returning();
        return user;
      }
    }
    
    // Create new user if no existing user found
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }
}

// Keep PostgreSQL as backup
export const postgresStorage = new DatabaseStorage();

// Use Key-Value storage as primary
import { keyValueStorage } from "./storage/keyValueStorage";
export const storage = keyValueStorage;
