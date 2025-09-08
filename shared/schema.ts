import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  date,
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create enums to match database
export const ageBracketEnum = pgEnum('age_bracket', ['6-8', '9-11', '12-14']);
export const goalEnum = pgEnum('goal_enum', ['energy', 'focus', 'strength']);
export const logTypeEnum = pgEnum('log_type', ['food', 'activity']);
export const entryMethodEnum = pgEnum('entry_method', ['emoji', 'text', 'photo']);

// Catalog tables
export const avatars = pgTable("avatars", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  src: text("src").notNull(),
});

export const goals = pgTable("goals", {
  id: goalEnum("id").primaryKey(),
  label: text("label").notNull(),
});

// Users table with UUID and proper types
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  displayName: text("display_name").notNull(),
  ageBracket: ageBracketEnum("age_bracket").notNull(),
  goal: goalEnum("goal").notNull().references(() => goals.id),
  email: text("email").unique(),
  parentConsent: boolean("parent_consent").notNull().default(false),
  avatarId: text("avatar_id").references(() => avatars.id),
  locale: text("locale").default('en-GB'),
  tz: text("tz"),
  totalXp: integer("total_xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  streak: integer("streak").notNull().default(0),
  lastLogAt: timestamp("last_log_at"),
  status: text("status").notNull().default('active'),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Logs table with UUID and proper types
export const logs = pgTable("logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  logDate: date("log_date").notNull().default(sql`CURRENT_DATE`),
  ts: timestamp("ts").notNull().defaultNow(),
  type: logTypeEnum("type").notNull(),
  entryMethod: entryMethodEnum("entry_method").notNull(),
  content: jsonb("content"),
  goalContext: goalEnum("goal_context"),
  aiFeedback: text("ai_feedback"),
  xpAwarded: integer("xp_awarded").notNull().default(0),
  durationMin: integer("duration_min"), // For activity logs: duration in minutes
  mood: varchar("mood", { length: 10 }), // For activity logs: 'happy', 'ok', 'tired'
});

// Streaks table
export const streaks = pgTable("streaks", {
  userId: varchar("user_id").primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  current: integer("current").notNull().default(0),
  longest: integer("longest").notNull().default(0),
  lastActive: date("last_active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Badge Catalog table (seeded, read-only)
export const badgeCatalog = pgTable("badge_catalog", {
  code: varchar("code").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(),
  tier: integer("tier").notNull(), // 1=bronze, 2=silver, 3=gold
  threshold: integer("threshold").notNull(),
  icon: varchar("icon").notNull(),
  rarity: varchar("rarity").notNull(),
  active: boolean("active").notNull().default(true),
});

// User Badges (earned badges tracking) - UUID to match users table
export const badges = pgTable("badges", {
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  badgeCode: varchar("badge_code").notNull().references(() => badgeCatalog.code),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
  progress: integer("progress").default(0), // Current progress toward threshold
}, (table) => ({
  pk: { name: "badges_pkey", columns: [table.userId, table.badgeCode] }
}));

// XP Events table
export const xpEvents = pgTable("xp_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: integer("amount").notNull(),
  reason: text("reason"),
  refLog: varchar("ref_log").references(() => logs.id),
  ts: timestamp("ts").notNull().defaultNow(),
});

// Note: Indexes are created via SQL commands, not in Drizzle schema

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Log = typeof logs.$inferSelect;
export type InsertLog = typeof logs.$inferInsert;
export type Avatar = typeof avatars.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type Streak = typeof streaks.$inferSelect;
export type BadgeCatalogItem = typeof badgeCatalog.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type XpEvent = typeof xpEvents.$inferSelect;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  displayName: true,
  ageBracket: true,
  goal: true,
  email: true,
  parentConsent: true,
  avatarId: true,
  locale: true,
  tz: true,
});

export const insertLogSchema = createInsertSchema(logs).pick({
  userId: true,
  type: true,
  entryMethod: true,
  content: true,
  goalContext: true,
  aiFeedback: true,
  xpAwarded: true,
  durationMin: true,
  mood: true,
});

export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertLogType = z.infer<typeof insertLogSchema>;
