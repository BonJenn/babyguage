import { config } from 'dotenv';
import { resolve } from 'path';
import { generateDailyPosts } from '../services/blogScheduler';
import cron from 'node-cron';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Verify environment variables are loaded
console.log('Environment check:', {
  MONGODB_URI: process.env.MONGODB_URI ? '✓' : '✗',
  OPENAI_API_KEY_2: process.env.OPENAI_API_KEY_2 ? '✓' : '✗',
  MONGODB_DB: process.env.MONGODB_DB ? '✓' : '✗'
});

async function generatePost() {
  try {
    console.log('Starting automated post generation:', new Date().toISOString());
    const post = await generateDailyPosts();
    console.log('Successfully generated post:', post.title);
  } catch (error) {
    console.error('Error generating post:', error);
  }
}

// Run every 2 hours
cron.schedule('0 */2 * * *', generatePost);

// Run once immediately on startup
generatePost();

console.log('Auto post generator started - running every 2 hours');

// Keep the process alive
process.stdin.resume();
