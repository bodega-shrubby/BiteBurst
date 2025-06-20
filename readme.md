# BiteBurst

## Overview
BiteBurst is a web-based MVP designed to help children aged 6–14 build healthy eating and movement habits through a fun, gamified experience. The app uses AI to provide personalized, age-appropriate feedback on meals and activities, while rewarding kids with XP, badges, and streaks to encourage consistency.

## The Problem We Solve
Most nutrition and fitness apps are built for adults — they're too technical, not engaging, and fail to connect with kids. BiteBurst makes nutrition fun, motivating, and educational using simple visuals, mascot interaction, and reward-based feedback, making it easier for kids to build long-term healthy habits.

## Key MVP Features

### Core User Interactions
1. **Logging food and activity** via emoji, text, or photo
2. **Selecting personal goals** (Energy ⚡, Focus 🧠, Strength 💪)
3. **Receiving fun, science-backed explanations** of how their habits support their goals
4. **Earning gamified rewards** and tracking progress through XP and badges

### Homepage Sections

#### 1. Hero Section
- Static landing with mascot, tagline, and buttons
- Animations on scroll and hover
- Buttons: "Get Started", "I already have an account"

#### 2. Why BiteBurst Works
- Explains AI-powered feedback
- Visual: XP meter, mascot scanning plate, glowing food icons

#### 3. Fun Logging
- Users can tap emojis, take/upload photo, or select activity
- Emoji bubble logging (🍎 🥦 🍞 🧃 / ⚽ 🧘 🏃 🎯)
- Camera integration (with fallback for manual entry)

#### 4. Earn XP
- XP meter, badges, and streak system
- Mascot reactions based on logging

#### 5. Personalization
- Goal selection: Energy, Focus, Strength
- Visuals: Powering-up avatar
- Mascot shown doing pull-up for Strength, child reading book for Focus, girl playing hockey for Energy
- Feedback on meals linked to chosen goal

#### 6. Scientific Backing
- Static content section with visuals of kid + scientist + mascot

#### 7. CTA Panel
- Text: "Join thousands of kids building healthy habits with BiteBurst."
- Button: 🟧 Let's Go!
- Visuals: Treasure chest with fruit, protein, vegetables, yoghurt, fitness elements, and XP
- Background: Sparkling orange splash

#### 8. Footer
- Links: About, Blog, Support, Privacy
- Icons: TikTok, YouTube, Instagram
- Language selector

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express or Replit's built-in server handler
- **Database**: Replit DB
- **AI**: OpenAI API for feedback generation
- **Image Handling**: Base64 conversion (for simplicity in MVP)

## AI Integration
OpenAI will generate short, fun explanations of how meals or activities support user goals. The prompt will include age, selected goal, and meal or activity data.

**Example prompt:**
"The user is 10 years old with a goal to improve focus. They ate: apple, peanut butter, and yogurt. What's a fun, kid-friendly explanation of how this helps them in school? Keep it short and age-appropriate."

## Image Handling Strategy (MVP)
- User-uploaded images are converted to base64 strings on the client
- Stored temporarily and sent to OpenAI API when needed
- Simplifies architecture and avoids external image storage or CDN setup
- Ideal for MVP; may evolve to CDN in later versions

## Database Schema

### users
- id
- name
- age
- goal
- XP
- badges[]
- streak

### logs
- id
- user_id
- type: food or activity
- entry_method: emoji | text | photo
- content: string or base64
- feedback: string
- timestamp

## API Endpoints
- `POST /log` – Save log and send to OpenAI for feedback
- `GET /user/:id` – Fetch user data
- `POST /user` – Create new user
- `POST /goal` – Update user goal

## UI Design Guidelines
- Use uploaded homepage and section designs as visual reference
- White backgrounds throughout
- Consistent use of sliced orange mascot with outlined arms/legs
- Black body text and orange headers
- Friendly, modern layout inspired by Duolingo (not copied)
- Custom age-appropriate characters targeting ages 6–14
- Include subtle animations and hover effects for engagement

## Developer Notes
- Use Replit's built-in base64 tools for handling images
- Animate buttons and UI elements (scroll, hover, progress bar)
- Track XP and streaks visually with progress meters and rewards
- Ensure mascot and theme is consistent across all sections
- Designs are final and must be followed closely for the MVP