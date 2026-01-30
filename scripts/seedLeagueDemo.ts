/**
 * Seed script for Leaderboard Demo
 * Creates mock users and XP events for current week to demonstrate leagues
 */

import { db } from "../server/db";
import { users, xpEvents, leagueBoards } from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Demo user data with kid-friendly names and varied XP/streaks
const DEMO_USERS = [
  { name: "Alex K.", avatar: "🟦AK", xp: 120, streak: 7 },
  { name: "Sam P.", avatar: "🟧SP", xp: 115, streak: 5 },
  { name: "Jordan M.", avatar: "🟩JM", xp: 110, streak: 4 },
  { name: "Casey R.", avatar: "🟨CR", xp: 105, streak: 6 },
  { name: "Taylor L.", avatar: "🟪TL", xp: 100, streak: 3 },
  { name: "Riley B.", avatar: "🟫RB", xp: 95, streak: 4 },
  { name: "Morgan W.", avatar: "⬛MW", xp: 90, streak: 2 },
  { name: "Avery C.", avatar: "⬜AC", xp: 85, streak: 5 },
  { name: "Quinn D.", avatar: "🔺QD", xp: 80, streak: 3 },
  { name: "Sage F.", avatar: "🔻SF", xp: 75, streak: 4 },
  { name: "River T.", avatar: "🔶RT", xp: 70, streak: 2 },
  { name: "Rowan H.", avatar: "🔷RH", xp: 65, streak: 3 },
  { name: "Blake S.", avatar: "🔸BS", xp: 60, streak: 1 },
  { name: "Drew N.", avatar: "🔹DN", xp: 55, streak: 4 },
  { name: "Finley G.", avatar: "🔺FG", xp: 50, streak: 2 },
  { name: "Emery J.", avatar: "🟡EJ", xp: 45, streak: 3 },
  { name: "Phoenix V.", avatar: "🔵PV", xp: 40, streak: 1 },
  { name: "Skyler Y.", avatar: "🔴SY", xp: 35, streak: 2 },
  { name: "Dakota Z.", avatar: "🟠DZ", xp: 30, streak: 1 },
  { name: "Hayden X.", avatar: "🟢HX", xp: 25, streak: 2 },
  { name: "Peyton Q.", avatar: "🟣PQ", xp: 20, streak: 1 },
  { name: "Remy U.", avatar: "🟤RU", xp: 18, streak: 1 },
  { name: "Lane I.", avatar: "⚫LI", xp: 15, streak: 1 },
  { name: "Reese O.", avatar: "⚪RO", xp: 12, streak: 0 },
  { name: "Kai E.", avatar: "◼️KE", xp: 10, streak: 1 },
  { name: "Nova A.", avatar: "◻️NA", xp: 8, streak: 0 },
  { name: "Sage M.", avatar: "🔳SM", xp: 5, streak: 0 },
  { name: "River C.", avatar: "🔲RC", xp: 3, streak: 0 },
  { name: "Wren L.", avatar: "🔘WL", xp: 2, streak: 0 },
  { name: "Bay R.", avatar: "🔙BR", xp: 1, streak: 0 },
];

function getCurrentWeekStart(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayOffset = day === 0 ? -6 : 1 - day; // Get to Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

async function clearExistingDemo() {
  console.log("🧹 Clearing existing demo data...");
  
  // Delete mock users and their related data (cascading will handle xp_events, etc.)
  await db.delete(users).where(eq(users.isMock, true));
  
  // Clear league boards for current week
  const weekStart = getCurrentWeekStart();
  await db.delete(leagueBoards).where(eq(leagueBoards.weekStart, weekStart.toISOString().split('T')[0]));
}

async function createMockUsers(): Promise<string[]> {
  console.log("👥 Creating mock users...");
  
  const userIds: string[] = [];
  
  for (const userData of DEMO_USERS) {
    const [user] = await db.insert(users).values({
      displayName: userData.name,
      yearGroup: 'year-5', // All demo users are in Year 5
      goal: 'energy', // Default goal
      email: null,
      parentConsent: true,
      avatarId: 'mascot-01',
      locale: 'en-GB',
      totalXp: userData.xp,
      level: Math.floor(userData.xp / 100) + 1,
      streak: userData.streak,
      isMock: true, // Mark as demo user
      leagueTier: 'bronze', // All start in bronze
    }).returning({ id: users.id });
    
    userIds.push(user.id);
  }
  
  console.log(`✅ Created ${userIds.length} mock users`);
  return userIds;
}

async function seedWeeklyXP(userIds: string[]) {
  console.log("⚡ Seeding weekly XP events...");
  
  const weekStart = getCurrentWeekStart();
  const events = [];
  
  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];
    const targetXP = DEMO_USERS[i].xp;
    
    // Distribute XP across the week with realistic patterns
    const daysInWeek = 7;
    let remainingXP = targetXP;
    
    for (let day = 0; day < daysInWeek && remainingXP > 0; day++) {
      const eventDate = new Date(weekStart);
      eventDate.setDate(weekStart.getDate() + day);
      
      // Vary daily XP (some days more active than others)
      const dailyXP = Math.min(
        remainingXP,
        Math.floor(Math.random() * 30) + 10 // 10-40 XP per day
      );
      
      if (dailyXP > 0) {
        events.push({
          userId,
          amount: dailyXP,
          reason: `Daily activity - day ${day + 1}`,
          ts: eventDate,
        });
        remainingXP -= dailyXP;
      }
    }
  }
  
  // Insert all events
  if (events.length > 0) {
    await db.insert(xpEvents).values(events);
    console.log(`✅ Created ${events.length} XP events for current week`);
  }
}

async function createBronzeLeague(userIds: string[]) {
  console.log("🏆 Creating Bronze League board...");
  
  const weekStart = getCurrentWeekStart();
  
  // Sort users by XP (descending) to create realistic ranking
  const sortedUserIds = [...userIds].sort((a, b) => {
    const aIndex = userIds.indexOf(a);
    const bIndex = userIds.indexOf(b);
    return DEMO_USERS[bIndex].xp - DEMO_USERS[aIndex].xp;
  });
  
  await db.insert(leagueBoards).values({
    weekStart: weekStart.toISOString().split('T')[0],
    leagueTier: 'bronze',
    members: sortedUserIds, // Store as JSON array
  });
  
  console.log(`✅ Created Bronze League with ${userIds.length} members`);
}

export async function seedLeagueDemo() {
  try {
    console.log("🚀 Starting League Demo Seed...");
    
    await clearExistingDemo();
    const userIds = await createMockUsers();
    await seedWeeklyXP(userIds);
    await createBronzeLeague(userIds);
    
    console.log("🎉 League demo seeded successfully!");
    console.log(`📊 Bronze League: ${userIds.length} users`);
    console.log(`📅 Week: ${getCurrentWeekStart().toDateString()}`);
    
  } catch (error) {
    console.error("❌ Error seeding league demo:", error);
    throw error;
  }
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  seedLeagueDemo()
    .then(() => {
      console.log("✅ Seed completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seed failed:", error);
      process.exit(1);
    });
}