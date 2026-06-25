const { execSync } = require('child_process');

function sleep(seconds) {
  execSync(`sleep ${seconds}`);
}

function ensureDatabaseUrl(url) {
  if (!url) return url;
  if (url.includes('sslmode=')) return url;
  if (url.includes('render.com')) {
    return `${url}${url.includes('?') ? '&' : '?'}sslmode=require`;
  }
  return url;
}

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set.');
  console.error('Render -> avto-dubai-khori-api -> Environment -> add database URL');
  process.exit(1);
}

process.env.DATABASE_URL = ensureDatabaseUrl(process.env.DATABASE_URL);

console.log('Applying database schema...');
let pushed = false;
for (let attempt = 1; attempt <= 5; attempt += 1) {
  try {
    execSync('npx prisma db push', { stdio: 'inherit' });
    pushed = true;
    break;
  } catch (error) {
    if (attempt === 5) throw error;
    console.warn(`Database not ready (attempt ${attempt}/5), retrying in 5s...`);
    sleep(5);
  }
}

if (!pushed) process.exit(1);

try {
  console.log('Seeding database...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
} catch (error) {
  console.warn('Seed step warning:', error.message);
}

console.log('Starting API...');
execSync('npx tsx src/index.ts', { stdio: 'inherit' });
