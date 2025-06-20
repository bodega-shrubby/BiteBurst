import { pgTable, text, serial, integer, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  goal: text("goal").notNull(), // 'energy', 'focus', 'strength'
  xp: integer("xp").notNull().default(0),
  badges: json("badges").$type<string[]>().notNull().default([]),
  streak: integer("streak").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'food' or 'activity'
  entryMethod: text("entry_method").notNull(), // 'emoji', 'text', 'photo'
  content: text("content").notNull(), // food/activity description or base64 image
  feedback: text("feedback"), // AI generated feedback
  xpEarned: integer("xp_earned").notNull().default(0),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  age: true,
  goal: true,
});

export const insertLogSchema = createInsertSchema(logs).pick({
  userId: true,
  type: true,
  entryMethod: true,
  content: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;
export type Log = typeof logs.$inferSelect;
