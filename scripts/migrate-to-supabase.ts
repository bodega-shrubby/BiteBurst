import pg from 'pg';
const { Pool } = pg;

const OLD_DATABASE_URL = process.env.OLD_DATABASE_URL;
const DATABASE_URL = process.env.DATABASE_URL;

if (!OLD_DATABASE_URL) {
  console.error('OLD_DATABASE_URL environment variable is required');
  process.exit(1);
}

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const oldPool = new Pool({ connectionString: OLD_DATABASE_URL });
const newPool = new Pool({ connectionString: DATABASE_URL });

const tables = [
  'avatars',
  'goals',
  'badge_catalog',
  'users',
  'streaks',
  'badges',
  'xp_events',
  'logs',
  'lessons',
  'lesson_steps',
  'user_lesson_progress',
  'lesson_attempts',
  'league_boards',
  'leaderboard_cache'
];

const columnExclusions: Record<string, string[]> = {
  users: ['xp']
};

async function getTargetColumns(tableName: string): Promise<string[]> {
  const result = await newPool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = $1 ORDER BY ordinal_position`,
    [tableName]
  );
  return result.rows.map(r => r.column_name);
}

async function migrateTable(tableName: string): Promise<number> {
  try {
    const targetColumns = await getTargetColumns(tableName);
    if (targetColumns.length === 0) {
      console.log(`  ${tableName}: table does not exist in target (skipping)`);
      return 0;
    }

    const result = await oldPool.query(`SELECT * FROM ${tableName}`);
    const rows = result.rows;
    
    if (rows.length === 0) {
      console.log(`  ${tableName}: 0 rows (empty table)`);
      return 0;
    }

    const sourceColumns = Object.keys(rows[0]);
    const excludedColumns = columnExclusions[tableName] || [];
    
    const columnsToMigrate = sourceColumns.filter(col => 
      targetColumns.includes(col) && !excludedColumns.includes(col)
    );

    if (columnsToMigrate.length === 0) {
      console.log(`  ${tableName}: no matching columns to migrate`);
      return 0;
    }

    const columnList = columnsToMigrate.map(c => `"${c}"`).join(', ');
    const valuePlaceholders = columnsToMigrate.map((_, i) => `$${i + 1}`).join(', ');
    
    let insertedCount = 0;
    let errorCount = 0;
    
    for (const row of rows) {
      const values = columnsToMigrate.map(col => row[col]);
      try {
        await newPool.query(
          `INSERT INTO ${tableName} (${columnList}) VALUES (${valuePlaceholders}) ON CONFLICT DO NOTHING`,
          values
        );
        insertedCount++;
      } catch (err: any) {
        errorCount++;
        if (errorCount <= 3) {
          console.error(`    Error in ${tableName}: ${err.message}`);
        }
      }
    }
    
    if (errorCount > 3) {
      console.log(`    ... and ${errorCount - 3} more errors`);
    }
    
    console.log(`  ${tableName}: ${insertedCount}/${rows.length} rows migrated`);
    return insertedCount;
  } catch (err: any) {
    if (err.message.includes('does not exist')) {
      console.log(`  ${tableName}: table does not exist in source (skipping)`);
      return 0;
    }
    console.error(`  ${tableName}: Error - ${err.message}`);
    return 0;
  }
}

async function main() {
  console.log('Starting migration from Neon to Supabase...\n');
  
  console.log('Testing connections...');
  try {
    await oldPool.query('SELECT 1');
    console.log('  Old database (Neon): Connected');
  } catch (err: any) {
    console.error('  Old database (Neon): Connection failed -', err.message);
    process.exit(1);
  }
  
  try {
    await newPool.query('SELECT 1');
    console.log('  New database (Supabase): Connected');
  } catch (err: any) {
    console.error('  New database (Supabase): Connection failed -', err.message);
    process.exit(1);
  }
  
  console.log('\nMigrating tables in order...\n');
  
  let totalMigrated = 0;
  
  for (const table of tables) {
    const count = await migrateTable(table);
    totalMigrated += count;
  }
  
  console.log(`\nMigration complete! Total rows migrated: ${totalMigrated}`);
  
  await oldPool.end();
  await newPool.end();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
