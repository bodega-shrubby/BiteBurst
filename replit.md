# BiteBurst - Gamified Health & Nutrition App for Kids

## Overview

BiteBurst is a web-based MVP designed to help children aged 6–14 build healthy eating and movement habits through a fun, gamified experience. The app uses AI to provide personalized, age-appropriate feedback and educational content. The platform addresses the gap in the market where most nutrition and fitness apps are built for adults and fail to engage children effectively.

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

### 3. Food/Activity Logging Interface
- **Emoji Bubble Selection**: Quick food logging through emoji interactions
- **Text Input System**: Detailed manual entry for foods and activities
- **Photo Upload**: Camera integration with Base64 conversion for image processing
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

- August 28, 2025: Completed Replit Auth integration
  - Implemented full OpenID Connect authentication system
  - Added proper user upsert logic with email/Replit ID mapping
  - Fixed onboarding flow: Home → Profile Setup → Replit Auth → Authenticated App
  - Resolved database schema conflicts and API parameter issues
- June 20, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.