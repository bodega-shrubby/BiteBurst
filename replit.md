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
- **Curriculum-Aware Lesson Delivery**: Onboarding flow with country-specific curriculum selection (UK/US) and age bracket mapping (e.g., Key Stages vs. Grades). Lessons are organized into topics with mascot integration.
- **Parent-First Onboarding**: Parents create accounts and link child profiles, with support for multiple children.

### Data Flow
- **User Interaction**: Registration/Login, Goal Selection, Content Logging (food/activity), AI Processing for feedback, Reward Distribution (XP, badges, streaks), Progress Tracking.
- **Data Storage**: User and session data in PostgreSQL. Images as Base64 (MVP). AI responses cached for performance.

## External Dependencies

- **Database**: Neon Database (serverless PostgreSQL)
- **AI Services**: OpenAI API
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Type Checking**: TypeScript
- **Database Tools**: Drizzle Kit (migrations, schema management)
- **Bundling**: ESBuild (backend), Vite (frontend)