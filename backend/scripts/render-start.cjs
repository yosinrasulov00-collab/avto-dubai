const { execSync } = require('child_process');

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set.');
  console.error('Render -> avto-dubai-khori-api -> Environment -> add Internal Database URL');
  process.exit(1);
}

console.log('Applying database schema...');
execSync('npx prisma db push', { stdio: 'inherit' });

try {
  console.log('Seeding database...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
} catch (error) {
  console.warn('Seed step warning:', error.message);
}

console.log('Starting API...');
execSync('npx tsx src/index.ts', { stdio: 'inherit' });
