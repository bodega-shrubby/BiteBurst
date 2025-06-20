# BiteBurst - Gamified Health & Nutrition App for Kids

## Overview
BiteBurst is a web-based MVP designed to help children aged 6–14 build healthy eating and movement habits through a fun, gamified experience. The app uses AI to provide personalized, age-appropriate feedback on meals and activities, while rewarding kids with XP, badges, and streaks to encourage consistency.

## The Problem
Most nutrition and fitness apps are built for adults — they're too technical, not engaging, and fail to connect with kids. BiteBurst makes nutrition fun, motivating, and educational using simple visuals, mascot interaction, and reward-based feedback, making it easier for kids to build long-term healthy habits.

## Target Audience
Children aged 6-14 who need engaging, age-appropriate tools to build healthy eating and movement habits with parental support.

## Key Features
The MVP focuses on four key user interactions:

1. **Logging food and activity** via emoji, text, or photo
2. **Selecting personal goals** (Energy ⚡, Focus 🧠, Strength 💪)
3. **Receiving fun, science-backed explanations** of how their habits support their goals
4. **Earning gamified rewards** and tracking progress through XP and badges

## Design Philosophy
The visual and UX style is inspired by Duolingo — clean layout, scroll-triggered animations, friendly mascots, and engaging micro-interactions. The design features:

- **Orange and white color scheme** with orange slice mascot
- **Engaging animations** and micro-interactions
- **Responsive design** for all devices
- **Age-appropriate visual elements** for 6-14 year olds
- **Consistent mascot presence** throughout interface

## Core Sections

### 1. Hero Section
- Static landing with animated orange slice mascot
- Clear tagline: "The fun, gamified way to eat better and move more!"
- CTA buttons for "Get Started" and "I already have an account"

### 2. Goal Selection System
- Three primary goals: Energy ⚡, Focus 🧠, Strength 💪
- Interactive selection with custom feedback
- Personalized messaging based on selected goal

### 3. Food/Activity Logging
- **Emoji bubble interface** for quick food selection
- **Text input** for detailed logging
- **Photo upload** with camera integration
- Instant feedback on logged items

### 4. XP & Rewards System
- Visual XP meter with progress tracking
- Badge collection system
- Streak counter for consistency
- Mascot reactions to achievements

### 5. AI-Powered Feedback
- Age-appropriate nutritional explanations
- Goal-specific recommendations
- Fun, educational content about food and health

### 6. Scientific Backing
- Credibility content with kid-friendly visuals
- Simple explanations of nutrition science
- Trust-building elements for parents

## Tech Stack

### Frontend
- **HTML5** - Semantic structure
- **CSS3** - Custom animations and responsive design
- **Vanilla JavaScript** - Interactive functionality
- **Responsive design techniques** - Mobile-first approach

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Replit Database** - Data persistence
- **OpenAI API** - AI-powered feedback generation
- **Base64 image processing** - Photo upload handling

## AI Integration
OpenAI generates short, fun explanations of how meals or activities support user goals. The system uses carefully crafted prompts that include:

- User's age (6-14)
- Selected goal (Energy/Focus/Strength)
- Meal/activity data
- Request for age-appropriate, fun explanations

**Example Prompt:**
