/**
 * Auto-seeding for Leaderboard on server startup
 * Ensures mock users always exist for demo purposes
 */

import { db } from "./db";
import { users, children, xpEvents, leagueBoards } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

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
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

async function checkMockUsersExist(): Promise<boolean> {
  const mockUsers = await db.select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.isMock, true));
  return (mockUsers[0]?.count || 0) > 0;
}

async function checkCurrentWeekLeague(): Promise<boolean> {
  const weekStart = getCurrentWeekStart();
  const leagues = await db.select({ count: sql<number>`count(*)` })
    .from(leagueBoards)
    .where(eq(leagueBoards.weekStart, weekStart.toISOString().split('T')[0]));
  return (leagues[0]?.count || 0) > 0;
}

async function createMockUsers(): Promise<string[]> {
  const childIds: string[] = [];
  
  for (let i = 0; i < DEMO_USERS.length; i++) {
    const userData = DEMO_USERS[i];
    const mockEmail = `mock-${userData.name.toLowerCase().replace(/[^a-z]/g, '')}-${i}@biteburst.mock`;
    
    const [user] = await db.insert(users).values({
      displayName: userData.name,
      goal: 'energy',
      email: mockEmail,
      parentConsent: true,
      avatarId: 'mascot-01',
      locale: 'en-GB',
      totalXp: userData.xp,
      level: Math.floor(userData.xp / 100) + 1,
      streak: userData.streak,
      isMock: true,
      leagueTier: 'bronze',
    }).returning({ id: users.id });
    
    const [child] = await db.insert(children).values({
      parentId: user.id,
      name: userData.name,
      username: `MOCK${userData.name.replace(/[^a-zA-Z]/g, '').toUpperCase()}${i}`,
      avatar: userData.avatar,
      age: 8,
      locale: 'en-GB',
      goal: 'energy',
      totalXp: userData.xp,
      level: Math.floor(userData.xp / 100) + 1,
      streak: userData.streak,
    }).returning({ id: children.id });
    
    childIds.push(child.id);
  }
  
  return childIds;
}

async function seedWeeklyXP(userIds: string[]) {
  const weekStart = getCurrentWeekStart();
  const events = [];
  
  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];
    const userData = DEMO_USERS[i];
    const xpPerEvent = Math.ceil(userData.xp / 3);
    
    for (let j = 0; j < 3; j++) {
      const eventDate = new Date(weekStart);
      eventDate.setDate(eventDate.getDate() + j);
      
      events.push({
        userId,
        amount: j === 2 ? userData.xp - (xpPerEvent * 2) : xpPerEvent,
        reason: 'lesson',
        ts: eventDate,
      });
    }
  }
  
  if (events.length > 0) {
    await db.insert(xpEvents).values(events);
  }
}

async function createLeagueBoard(userIds: string[]) {
  const weekStart = getCurrentWeekStart();
  const weekStartStr = weekStart.toISOString().split('T')[0];
  
  const members = userIds.map((userId, index) => ({
    userId,
    weeklyXp: DEMO_USERS[index].xp,
    rank: index + 1,
    streak: DEMO_USERS[index].streak,
  }));
  
  await db.insert(leagueBoards).values({
    leagueTier: 'bronze',
    weekStart: weekStartStr,
    members,
  });
}

export async function ensureLeaderboardData(): Promise<void> {
  try {
    const hasLeague = await checkCurrentWeekLeague();
    
    if (!hasLeague) {
      console.log("🏆 Auto-seeding leaderboard data for current week...");
      
      // Clear old mock users first (children cascade-deleted via FK)
      await db.delete(users).where(eq(users.isMock, true));
      
      // Create fresh mock users
      const userIds = await createMockUsers();
      console.log(`✅ Created ${userIds.length} mock users`);
      
      // Seed XP events
      await seedWeeklyXP(userIds);
      console.log("✅ Created weekly XP events");
      
      // Create league board
      await createLeagueBoard(userIds);
      console.log("✅ Created Bronze League board");
      
      console.log("🎉 Leaderboard auto-seeded successfully!");
    } else {
      console.log("✅ Leaderboard data exists for current week");
    }
  } catch (error) {
    console.error("⚠️ Failed to auto-seed leaderboard:", error);
  }
}
