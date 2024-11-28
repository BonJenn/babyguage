// scheduler.ts
import cron from 'node-cron';
import { generateDailyPosts } from '../services/blogScheduler';

// Schedule the task to run every 2 hours
cron.schedule('0 */2 * * *', async () => {
  try {
    await generateDailyPosts();
    console.log('Blog posts generated successfully.');
  } catch (error) {
    console.error('Error generating blog posts:', error);
  }
});

console.log('Cron job scheduled to run every 2 hours.');