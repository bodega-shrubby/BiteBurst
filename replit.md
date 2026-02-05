# BiteBurst - Gamified Health & Nutrition App for Kids

## Overview

BiteBurst is a web-based MVP designed to engage children aged 5–14 in building healthy eating and movement habits through gamification. The app utilizes AI for personalized, age-appropriate feedback and educational content, addressing the lack of child-focused nutrition and fitness applications. It adopts a Duolingo-inspired design with clean layouts, engaging animations, friendly mascots, and micro-interactions, aiming to make nutrition fun, motivating, and educational.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI**: Radix UI components with shadcn/ui, Tailwind CSS (orange and white theme)
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX Decisions**: Duolingo-inspired design, scroll-triggered animations, friendly mascots, micro-interactions, 72px+ touch targets for touch-optimized experiences, 3D coin-style nodes for lesson paths with fruit/veggie color cycling, size variations, and distinct visual states (Locked, Complete, Unlocked). Responsive positioning for lesson paths to stay within screen bounds.

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM (type-safe operations)
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL session store
- **API Design**: RESTful API with `/api` prefix

### Key Features
- **User Authentication**: Registration, login, password-based authentication, session management, unique username constraints.
- **Goal Selection**: Interactive choice between Energy ⚡, Focus 🧠, Strength 💪 with personalized content.
- **Meal-Based Food Logging**: A 3-step flow (Meal Type → Categories → Items) with time-based recommendations, multi-category support, running total display, text input fallback, and touch-optimized design. Includes activity tracking (sports, meditation, movement).
- **Gamification Engine**: XP system with progress meters, badge collection, streak counter, and level progression with animations.
- **AI Integration**: OpenAI API for personalized feedback, age-appropriate nutritional explanations, and science-backed habit formation guidance.
- **Age-Based Lesson Delivery**: Content is filtered by child's age (6-14 years) with locale selection (en-GB for UK, en-US for US). Lessons are organized into topics with mascot integration.
- **Parent-First Onboarding**: Parents create accounts and link child profiles, with support for multiple children.

### Database Architecture (Parent/Child Separation)
- **Users Table (Parent Accounts)**: Stores authentication credentials (email, password hash, parentAuthId), subscription info (plan, children limit), and activeChildId reference. No child-specific data like XP, streak, or age.
- **Children Table (Child Profiles)**: Stores ALL child profiles including the first child created during onboarding. Contains: name, username, avatar, age (6-14), locale (en-GB/en-US), goal, favorites, totalXp, level, streak, lastLogAt, tz.
- **Data Access Pattern**: All data fetching uses child IDs, not parent IDs. Logs, badges, and progress are keyed to childId.
- **Key Storage Methods**: 
  - `getParentByAuthId()` - Find parent account
  - `getChildById()`, `getChildrenByParentId()` - Get child profiles
  - `createChildProfile()` - Create new child
  - `updateChildProgress()` - Update XP, streak, level
  - `setActiveChildId()` - Switch active child

### Data Flow
- **User Interaction**: Registration/Login (creates parent + first child), Goal Selection, Content Logging (food/activity), AI Processing for feedback, Reward Distribution (XP, badges, streaks), Progress Tracking.
- **Data Storage**: Parent accounts and child profiles in PostgreSQL. Logs keyed to childId. Images as Base64 (MVP). AI responses cached for performance.

## External Dependencies

- **Database**: Neon Database (serverless PostgreSQL)
- **AI Services**: OpenAI API
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Type Checking**: TypeScript
- **Database Tools**: Drizzle Kit (migrations, schema management)
- **Bundling**: ESBuild (backend), Vite (frontend)

## Recent Changes

### Schema & API Migration (Feb 2026)
- **Simplified filtering system**: Replaced `yearGroup` + `curriculumId` with simple `age` (6-14) based filtering for lessons and topics
- **Locale support**: Added explicit `locale` field (en-GB or en-US) for UK/US English content variants
- **New question type**: Added `lesson-content` question type for educational learning steps (no quiz validation)
- **Content localization**: Lesson steps now support `contentVariants` for locale-specific content (e.g., "crisps" vs "chips")
- **Removed tables**: `curriculums` and `year_group_mappings` tables removed from database
- **API endpoints**: 
  - `/api/lessons/age/:age` - Get lessons by age
  - `/api/topics/age/:age` - Get topics by age
  - `/api/lessons/:lessonId?locale=en-GB` - Get lesson with locale-specific content