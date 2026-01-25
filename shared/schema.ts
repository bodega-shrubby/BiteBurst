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
  pgEnum,
  uuid
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create enums to match database
export const ageBracketEnum = pgEnum('age_bracket', ['6-8', '9-11', '12-14']);
export const goalEnum = pgEnum('goal_enum', ['energy', 'focus', 'strength']);
export const logTypeEnum = pgEnum('log_type', ['food', 'activity']);
export const entryMethodEnum = pgEnum('entry_method', ['emoji', 'text', 'photo']);
export const questionTypeEnum = pgEnum('question_type', ['multiple-choice', 'true-false', 'matching']);

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
  email: text("email").unique().notNull(),
  parentEmail: text("parent_email"),
  parentConsent: boolean("parent_consent").notNull().default(false),
  authProvider: text("auth_provider").notNull().default("supabase"),
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
  // Leaderboard fields
  leaderboardOptOut: boolean("leaderboard_opt_out").notNull().default(false),
  leagueTier: text("league_tier").notNull().default("bronze"),
  isMock: boolean("is_mock").notNull().default(false),
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

// League Boards table for weekly groupings
export const leagueBoards = pgTable("league_boards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekStart: date("week_start").notNull(),
  leagueTier: text("league_tier").notNull(),
  members: jsonb("members").notNull(), // array of user_ids in rank order
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Leaderboard Cache table for performance
export const leaderboardCache = pgTable("leaderboard_cache", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metric: text("metric").notNull(), // 'xp_week'
  leagueTier: text("league_tier").notNull(),
  weekStart: date("week_start").notNull(),
  payload: jsonb("payload").notNull(),
  computedAt: timestamp("computed_at").notNull().defaultNow(),
}, (table) => ({
  unique: { name: "leaderboard_cache_unique", columns: [table.metric, table.leagueTier, table.weekStart] }
}));

// Lesson tables
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  targetAgeBracket: ageBracketEnum("target_age_bracket").notNull(),
  totalSteps: integer("total_steps").notNull(),
  category: text("category").notNull().default('nutrition'),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lessonSteps = pgTable("lesson_steps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  stepNumber: integer("step_number").notNull(),
  questionType: questionTypeEnum("question_type").notNull(),
  question: text("question").notNull(),
  content: jsonb("content").notNull(), // Stores options, correct answers, feedback, etc.
  xpReward: integer("xp_reward").notNull().default(10),
  mascotAction: text("mascot_action"), // For future mascot integration
  retryConfig: jsonb("retry_config"), // Stores maxAttempts, XP tiers, and messages for retry flow
}, (table) => ({
  unique: { name: "lesson_steps_unique", columns: [table.lessonId, table.stepNumber] },
  lessonIdIdx: index("lesson_steps_lesson_id_idx").on(table.lessonId)
}));

export const userLessonProgress = pgTable("user_lesson_progress", {
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  currentStep: integer("current_step").notNull().default(1),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  totalXpEarned: integer("total_xp_earned").notNull().default(0),
  hearts: integer("hearts").notNull().default(3), // Track hearts/lives internally
  startedAt: timestamp("started_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  pk: { name: "user_lesson_progress_pkey", columns: [table.userId, table.lessonId] }
}));

// Lesson attempt analytics table  
export const lessonAttempts = pgTable("lesson_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  stepId: varchar("step_id").notNull().references(() => lessonSteps.id, { onDelete: 'cascade' }),
  stepNumber: integer("step_number").notNull(),
  attemptNumber: integer("attempt_number").notNull(), // 1, 2, or 3 (learn card)
  isCorrect: boolean("is_correct").notNull(),
  selectedAnswer: text("selected_answer"), // The answer they selected
  timeOnStepMs: integer("time_on_step_ms"), // Time spent on this step
  heartsRemaining: integer("hearts_remaining").notNull(),
  xpEarned: integer("xp_earned").notNull().default(0),
  usedLearnCard: boolean("used_learn_card").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  userLessonIdx: index("lesson_attempts_user_lesson_idx").on(table.userId, table.lessonId),
  stepIdx: index("lesson_attempts_step_idx").on(table.stepId)
}));

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
export type LeagueBoard = typeof leagueBoards.$inferSelect;
export type InsertLeagueBoard = typeof leagueBoards.$inferInsert;
export type LeaderboardCache = typeof leaderboardCache.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;
export type LessonStep = typeof lessonSteps.$inferSelect;
export type InsertLessonStep = typeof lessonSteps.$inferInsert;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type InsertUserLessonProgress = typeof userLessonProgress.$inferInsert;
export type LessonAttempt = typeof lessonAttempts.$inferSelect;
export type InsertLessonAttempt = typeof lessonAttempts.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  displayName: true,
  ageBracket: true,
  goal: true,
  email: true,
  parentEmail: true,
  parentConsent: true,
  authProvider: true,
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

export const insertLessonSchema = createInsertSchema(lessons).pick({
  title: true,
  description: true,
  targetAgeBracket: true,
  totalSteps: true,
  category: true,
  isActive: true,
});

export const insertLessonStepSchema = createInsertSchema(lessonSteps).pick({
  lessonId: true,
  stepNumber: true,
  questionType: true,
  question: true,
  content: true,
  xpReward: true,
  mascotAction: true,
  retryConfig: true,
});

export const insertUserLessonProgressSchema = createInsertSchema(userLessonProgress).pick({
  userId: true,
  lessonId: true,
  currentStep: true,
  // Note: completed, completedAt, totalXpEarned, hearts are server-controlled only for security
});

export const insertLessonAttemptSchema = createInsertSchema(lessonAttempts).pick({
  userId: true,
  lessonId: true,
  stepId: true,
  stepNumber: true,
  attemptNumber: true,
  isCorrect: true,
  selectedAnswer: true,
  timeOnStepMs: true,
  heartsRemaining: true,
  xpEarned: true,
  usedLearnCard: true,
});

export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertLogType = z.infer<typeof insertLogSchema>;
export type InsertLessonType = z.infer<typeof insertLessonSchema>;
export type InsertLessonStepType = z.infer<typeof insertLessonStepSchema>;
export type InsertUserLessonProgressType = z.infer<typeof insertUserLessonProgressSchema>;
