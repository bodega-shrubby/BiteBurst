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
export const goalEnum = pgEnum('goal_enum', ['energy', 'focus', 'strength']);
export const logTypeEnum = pgEnum('log_type', ['food', 'activity']);
export const entryMethodEnum = pgEnum('entry_method', ['emoji', 'text', 'photo']);
export const questionTypeEnum = pgEnum('question_type', ['multiple-choice', 'true-false', 'matching', 'tap-pair', 'fill-blank', 'ordering', 'label-reading']);
export const curriculumEnum = pgEnum('curriculum', ['us-common-core', 'uk-ks2-ks3']);
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['free', 'individual', 'family']);

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

// Mascots table for lesson characters
export const mascots = pgTable("mascots", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  description: text("description"),
  personality: text("personality"),
  imagePath: text("image_path"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Curriculums table for UK/US educational standards
export const curriculums = pgTable("curriculums", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Topics table for organizing lessons within a curriculum
export const topics = pgTable("topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  curriculumId: varchar("curriculum_id").notNull().references(() => curriculums.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  iconEmoji: text("icon_emoji"),
  orderPosition: integer("order_position").notNull(),
  defaultMascotId: varchar("default_mascot_id").references(() => mascots.id),
  yearGroup: varchar("year_group"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Users table with UUID and proper types
// Note: id is the child profile ID (auto-generated), NOT the Supabase auth ID
// parent_auth_id links to the parent's Supabase auth.users account
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentAuthId: text("parent_auth_id"), // Links to parent's Supabase auth user ID (nullable for migration)
  displayName: text("display_name").notNull(),
  yearGroup: text("year_group"), // e.g., "year-5", "grade-3"
  goal: goalEnum("goal").notNull().references(() => goals.id),
  curriculum: text("curriculum").default('us-common-core'), // Legacy field - "us-common-core" | "uk-ks2-ks3"
  curriculumId: varchar("curriculum_id").references(() => curriculums.id), // New FK to curriculums table
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
  // Subscription fields
  subscriptionPlan: text("subscription_plan").notNull().default('free'), // 'free', 'individual', 'family'
  subscriptionChildrenLimit: integer("subscription_children_limit").notNull().default(1), // 1 for free/individual, 2-4 for family
  isParent: boolean("is_parent").notNull().default(false), // true for parent accounts
  curriculumCountry: text("curriculum_country"), // 'uk' or 'us' - inherited by children
  activeChildId: varchar("active_child_id"), // Reference to active child profile
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  parentAuthIdx: index("users_parent_auth_idx").on(table.parentAuthId),
}));

// Children table for family plan - child profiles linked to parent
export const children = pgTable("children", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  parentId: varchar("parent_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  username: text("username").notNull(),
  avatar: text("avatar").notNull().default('child'),
  // Year Group / Grade (NOT age)
  yearGroup: text("year_group").notNull(), // e.g., 'year-5', 'grade-3'
  curriculumId: text("curriculum_id").notNull(), // e.g., 'uk-ks2', 'us-35'
  // Learning preferences
  goal: text("goal"), // 'energy', 'focus', 'strength'
  favoriteFruits: text("favorite_fruits").array(),
  favoriteVeggies: text("favorite_veggies").array(),
  favoriteFoods: text("favorite_foods").array(),
  favoriteSports: text("favorite_sports").array(),
  // Progress tracking
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  parentIdIdx: index("children_parent_id_idx").on(table.parentId),
}));

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
}, (table) => ({
  userIdIdx: index("logs_user_id_idx").on(table.userId),
  logDateIdx: index("logs_log_date_idx").on(table.logDate),
  userDateIdx: index("logs_user_date_idx").on(table.userId, table.logDate),
}));

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
}, (table) => ({
  userIdIdx: index("xp_events_user_id_idx").on(table.userId),
}));

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
  yearGroup: varchar("year_group"),
  totalSteps: integer("total_steps").notNull(),
  category: text("category").notNull().default('nutrition'),
  isActive: boolean("is_active").notNull().default(true),
  // New columns for curriculum-aware lesson system
  learningTakeaway: text("learning_takeaway"),
  mascotId: varchar("mascot_id").references(() => mascots.id),
  mascotIntro: text("mascot_intro"),
  curriculumId: varchar("curriculum_id").references(() => curriculums.id),
  topicId: varchar("topic_id").references(() => topics.id),
  difficultyLevel: integer("difficulty_level").default(1),
  orderInUnit: integer("order_in_unit"),
  estimatedMinutes: integer("estimated_minutes").default(5),
  iconEmoji: text("icon_emoji"),
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
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  childId: varchar("child_id").references(() => children.id, { onDelete: 'cascade' }), // For additional children from children table
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
  childLessonIdx: index("lesson_attempts_child_lesson_idx").on(table.childId, table.lessonId),
  stepIdx: index("lesson_attempts_step_idx").on(table.stepId)
}));

// Note: Indexes are created via SQL commands, not in Drizzle schema

// Year group mappings table for UK/US year group labels
export const yearGroupMappings = pgTable("year_group_mappings", {
  id: varchar("id").primaryKey(),
  label: text("label").notNull(),
  country: text("country").notNull(),
  curriculumId: varchar("curriculum_id").notNull().references(() => curriculums.id),
  displayOrder: integer("display_order").notNull(),
});

// Type exports
export type YearGroupMapping = typeof yearGroupMappings.$inferSelect;
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
export type Mascot = typeof mascots.$inferSelect;
export type Curriculum = typeof curriculums.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;
export type LessonStep = typeof lessonSteps.$inferSelect;
export type InsertLessonStep = typeof lessonSteps.$inferInsert;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type InsertUserLessonProgress = typeof userLessonProgress.$inferInsert;
export type LessonAttempt = typeof lessonAttempts.$inferSelect;
export type InsertLessonAttempt = typeof lessonAttempts.$inferInsert;
export type Child = typeof children.$inferSelect;
export type InsertChild = typeof children.$inferInsert;

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  parentAuthId: true,
  displayName: true,
  yearGroup: true,
  goal: true,
  curriculum: true,
  curriculumId: true,
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
  yearGroup: true,
  totalSteps: true,
  category: true,
  isActive: true,
  learningTakeaway: true,
  mascotId: true,
  mascotIntro: true,
  curriculumId: true,
  topicId: true,
  difficultyLevel: true,
  orderInUnit: true,
  estimatedMinutes: true,
  iconEmoji: true,
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
  childId: true, // For additional children from children table
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

export const insertChildSchema = createInsertSchema(children).pick({
  parentId: true,
  name: true,
  username: true,
  avatar: true,
  yearGroup: true,
  curriculumId: true,
  goal: true,
  favoriteFruits: true,
  favoriteVeggies: true,
  favoriteFoods: true,
  favoriteSports: true,
});

export type InsertUserType = z.infer<typeof insertUserSchema>;
export type InsertLogType = z.infer<typeof insertLogSchema>;
export type InsertLessonType = z.infer<typeof insertLessonSchema>;
export type InsertLessonStepType = z.infer<typeof insertLessonStepSchema>;
export type InsertUserLessonProgressType = z.infer<typeof insertUserLessonProgressSchema>;
export type InsertChildType = z.infer<typeof insertChildSchema>;
