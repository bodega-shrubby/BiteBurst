import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  serial,
  integer,
  json
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: serial("id").primaryKey(), // Keep existing serial ID
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // BiteBurst specific fields
  username: text("username").unique(),
  password: text("password"),
  name: text("name"),
  displayName: text("display_name"),
  ageBracket: text("age_bracket"), // '6-8', '9-11', '12-14'
  age: integer("age"),
  goal: text("goal"), // 'energy', 'focus', 'strength'
  avatar: text("avatar"), // avatar selection
  onboardingCompleted: integer("onboarding_completed").notNull().default(0), // boolean as int
  xp: integer("xp").notNull().default(0),
  badges: json("badges").$type<string[]>().notNull().default([]),
  streak: integer("streak").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  displayName: true,
  ageBracket: true,
  age: true,
  goal: true,
  avatar: true,
  email: true,
  onboardingCompleted: true,
});

export const insertLogSchema = createInsertSchema(logs).pick({
  userId: true,
  type: true,
  entryMethod: true,
  content: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertLog = z.infer<typeof insertLogSchema>;
export type Log = typeof logs.$inferSelect;
