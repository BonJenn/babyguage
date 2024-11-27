import { config } from 'dotenv';
import { resolve } from 'path';
import { generateBlogPost } from '../services/blogGenerator';

// Load environment vars from .env.local
const result = config({ path: resolve(process.cwd(), '.env.local') });

console.log('Environment loading result:', result);
console.log('Current working directory:', process.cwd());
console.log('Environment variables loaded:', {
  MONGODB_URI: process.env.MONGODB_URI || 'Not found - Please check your .env.local file',
  MONGODB_DB: process.env.MONGODB_DB || 'Not found - Please check your .env.local file',
  OPENAI_API_KEY_2: process.env.OPENAI_API_KEY_2 || 'Not found - Please check your .env.local file'
});

const initialTopics = [
  "Understanding Ovulation and Fertility Windows",
  "Early Pregnancy Signs You Might Miss",
  "Natural Ways to Boost Fertility",
  "Common Fertility Myths Debunked",
  "Understanding Your Menstrual Cycle",
  "The Role of Diet in Fertility",
];

async function generateInitialPosts() {
  try {
    console.log('Starting initial blog post generation...');
    
    for (const topic of initialTopics) {
      console.log(`Generating post for topic: ${topic}`);
      await generateBlogPost(topic);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('Successfully generated initial blog posts!');
  } catch (error) {
    console.error('Error generating initial posts:', error);
    process.exit(1);
  }
}

generateInitialPosts();
