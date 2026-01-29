# BiteBurst - Gamified Health & Nutrition App for Kids

## Overview

BiteBurst is a web-based MVP designed to help children aged 5–14 build healthy eating and movement habits through a fun, gamified experience. The app uses AI to provide personalized, age-appropriate feedback and educational content. The platform addresses the gap in the market where most nutrition and fitness apps are built for adults and fail to engage children effectively.

The application follows a Duolingo-inspired design philosophy with clean layouts, scroll-triggered animations, friendly mascots (orange slice character), and engaging micro-interactions. The core user experience revolves around making nutrition fun, motivating, and educational through simple visual interfaces.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Library**: Radix UI components with shadcn/ui implementation
- **Styling**: Tailwind CSS with custom theming (orange and white color scheme)
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Connect-pg-simple for PostgreSQL session store
- **API Design**: RESTful API with /api prefix routing

### Development Environment
- **Platform**: Replit with Node.js 20, web, and PostgreSQL 16 modules
- **Development Server**: Concurrent frontend (Vite) and backend (tsx) serving
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend

## Key Components

### 1. User Authentication System
- User registration and login functionality
- Password-based authentication with session management
- PostgreSQL user storage with unique username constraints

### 2. Goal Selection System
- Three primary goals: Energy ⚡, Focus 🧠, Strength 💪
- Interactive selection interface with personalized messaging
- Goal-based content customization and feedback

### 3. Meal-Based Food Logging System
- **3-Step Flow**: Meal Type → Categories → Items (matches how kids think about eating)
- **Meal Types**: Breakfast, Lunch, Dinner, Snack with time-based recommendations
- **Multi-Category Support**: Add items from multiple categories (fruits + dairy + drinks) in one meal
- **Running Total Display**: Shows all selected items and XP preview throughout flow
- **Text Input Fallback**: Available as alternative for foods not in emoji list
- **Touch-Optimized**: 72px+ touch targets for items, smooth framer-motion transitions
- **Activity Selection**: Sports, meditation, and movement tracking

### 4. Gamification Engine
- **XP System**: Experience points with visual progress meters
- **Badge Collection**: Achievement system with unlock animations
- **Streak Counter**: Consistency tracking with visual indicators
- **Level Progression**: Animated XP meter with level advancement

### 5. AI Integration Layer
- OpenAI API integration for personalized feedback generation
- Age-appropriate nutritional explanations
- Science-backed habit formation guidance
- Real-time content generation based on user logs

## Data Flow

### User Interaction Flow
1. **Registration/Login**: User creates account or authenticates
2. **Goal Selection**: User chooses primary health goal (Energy/Focus/Strength)
3. **Content Logging**: User logs food/activity via emoji, text, or photo
4. **AI Processing**: System generates personalized feedback based on logs and goals
5. **Reward Distribution**: XP, badges, and streaks updated based on activity
6. **Progress Tracking**: Visual dashboard shows advancement and achievements

### Data Storage Pattern
- **User Data**: Stored in PostgreSQL with Drizzle ORM schema management
- **Session Data**: PostgreSQL session store for authentication persistence
- **Images**: Base64 encoding for photo uploads (MVP approach)
- **AI Responses**: Generated in real-time, optionally cached for performance

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **AI Services**: OpenAI API for content generation
- **UI Components**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS for responsive design

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Production bundling for backend
- **Vite Plugins**: Development tooling and error handling

## Deployment Strategy

### Production Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle pushes schema changes to production database

### Replit Deployment Configuration
- **Build Command**: `npm run build` (builds both frontend and backend)
- **Start Command**: `npm run start` (runs production server)
- **Port Configuration**: Internal port 5000, external port 80
- **Autoscale Deployment**: Configured for automatic scaling based on traffic

### Environment Requirements
- **NODE_ENV**: Production/development environment detection
- **DATABASE_URL**: PostgreSQL connection string (required)
- **OpenAI API Key**: For AI-powered feedback generation

## Changelog

- January 29, 2026: **Duolingo-Inspired Lesson Path UI Overhaul**
  - Completely redesigned lesson path with 3D coin-style nodes
  - New components and enhancements:
    - `CurvySpine.tsx` - Dramatic winding S-curve path with gradient, glow effects, traveling dots
    - `PathNode.tsx` - 3D coin nodes with fruit/veggie color cycling (7 colors), size variations (64/72/84px)
    - `PathDecorations.tsx` - Floating food emoji decorations with bobbing animation
    - `Confetti.tsx` - Enhanced with fruit emoji particles, burst physics, spiral motion
  - New CSS keyframe animations in tokens.css:
    - node-pop-in, node-glow-pulse, shimmer-sweep, float-bob, bounce-in, bounce-subtle
    - All animations respect prefers-reduced-motion accessibility setting
  - Node states with distinct visuals:
    - Locked: 64px, grayscale, lock icon, no interaction
    - Complete: 72px, vibrant color, checkmark overlay, gold star badge
    - Unlocked: 84px, pulsing glow, bouncing START button
  - Updated Lessons.tsx to use new components with gradient background

- January 27, 2026: **Meal-Based Food Logging System**
  - Implemented 3-step flow: Meal Type → Categories → Items
  - New TypeScript architecture:
    - `client/src/types/food-logging.ts` - FoodItem, MealType, MealLog interfaces
    - `client/src/constants/food-data.ts` - MEAL_TYPES, FOOD_CATEGORIES, FOOD_ITEMS with XP values
    - `client/src/hooks/useFoodLogging.ts` - State management for multi-step flow
  - New components:
    - `MealTypeScreen.tsx` - Step 1 with time-based "Right now!" recommendations
    - `CategoryScreen.tsx` - Step 2 with meal summary card and category grid
    - `ItemSelectionScreen.tsx` - Step 3 with multi-select and running total
    - `FoodLogBreadcrumb.tsx` - Navigation context (Breakfast > Fruits)
    - `MealSummaryCard.tsx` - Running total of items and XP
  - Features: Multi-category support, mealType in submission payload, text input clears selections
  - UI: 72px touch targets, green checkmark animations, smooth framer-motion transitions

- January 28, 2026: **Curriculum-Aware Lesson Delivery System**
  - Updated age brackets from 6-8/9-11/12-14 to 5-7/7-11/11-14 to match UK/US educational stages
  - Enhanced onboarding flow with country-first curriculum selection:
    - Step 4: Select curriculum country (UK or US) with flag icons
    - Step 5: Age bracket selection with curriculum-specific labels (Key Stages vs Grades)
  - New curriculum IDs mapping:
    - UK: uk-ks1 (5-7), uk-ks2 (7-11), uk-ks3 (11-14)
    - US: us-k2 (5-7), us-35 (7-11), us-68 (11-14)
  - Database schema additions:
    - `mascots` table for lesson mascot characters
    - `curriculums` table for UK/US curriculum definitions
    - `units` table for lesson grouping within curriculums
    - Extended `lessons` table with curriculum/unit/mascot integration
  - Storage layer updates:
    - getMascots, getMascotById for mascot management
    - getCurriculums, getCurriculumsByCountry for curriculum filtering
    - getUnitsByCurriculum, getLessonsByUnit for curriculum-aware lesson retrieval
  - Guard added to AgeStep to ensure curriculum country is selected first

- January 25, 2026: **Parent-First Onboarding Flow with Curriculum Selection**
  - Implemented parent-first authentication architecture:
    - Parent creates Supabase auth account with email/password
    - Child profiles linked via parent_auth_id column
    - Future-proofed for multiple children per parent account
  - Added curriculum selection (US Common Core / UK KS2-KS3):
    - New curriculum column in users table
    - CurriculumSelector component with flag icons
    - Curriculum displayed in profile summary
  - Restructured onboarding flow (11 steps total):
    1. Welcome/Mascot Intro
    2. Parent Account (email + password + consent combined)
    3. Child Name
    4. Child Age
    5. Curriculum Selection
    6. Goal Selection
    7-10. Food Preferences (Fruits, Veggies, Foods, Sports)
    11. Account Summary/Review
  - Backend updates:
    - /api/auth/signup now accepts parentEmail, childName, age, curriculum, goal
    - /api/auth/login fetches child profiles by parent_auth_id with fallback
    - /api/auth/me returns child profile based on parent auth
    - Added getUserByParentAuthId storage method
  - Database indexes added for performance (logs, users, xp_events)

- August 31, 2025: **Phase 2 Complete - Database Schema Upgraded to Specification**
  - Successfully migrated to UUID primary keys for all tables
  - Implemented proper PostgreSQL ENUMs (age_bracket, goal_enum, log_type, entry_method)
  - Added comprehensive schema matching uploaded specification:
    - `avatars` and `goals` catalog tables with seed data
    - `streaks` table for dedicated streak tracking
    - `badges` table for achievement system
    - `xp_events` table for XP transaction ledger
  - Enhanced data integrity with foreign key constraints and proper indexes
  - Updated Drizzle ORM schema to match new database structure
  - Migrated existing user data successfully (4 users preserved)
  - Authentication system updated to work with UUID primary keys
  - Storage layer completely rewritten for new schema
- August 30, 2025: **Reverted to PostgreSQL Database**
  - User requested reversion from Key-Value to PostgreSQL database
  - Restored original PostgreSQL storage implementation
  - Removed Key-Value database routes and components
  - Database schema maintained with Drizzle ORM
  - Profile creation API restored to PostgreSQL backend
- August 29, 2025: **Phase 1 Complete - Replit Key-Value Database Implementation**
  - Completely migrated from PostgreSQL to Replit Key-Value Database architecture
  - Implemented comprehensive TypeScript schema matching provided specification
  - Built complete helper function library for all database operations
  - Created full API layer with validation and error handling
  - Successfully tested: onboarding, user management, stats, streaks, badges, logging
  - PostgreSQL maintained as backup storage system
  - **Phase 2: Frontend Integration completed**
- August 28, 2025: Completed Replit Auth integration (later removed per user request)
  - Implemented full OpenID Connect authentication system
  - Added proper user upsert logic with email/Replit ID mapping
  - Fixed onboarding flow: Home → Profile Setup → Replit Auth → Authenticated App
  - Resolved database schema conflicts and API parameter issues
- June 20, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.