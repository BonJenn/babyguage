import { generateBlogPost } from './blogGenerator';
import { prisma } from '../lib/prisma';

const topics = [
  "Early Pregnancy Symptoms",
  "Fertility Foods",
  "Ovulation Tracking Methods",
  "Natural Fertility Boosters",
  "Understanding Your Cycle",
];

export async function generateDailyPosts() {
  try {
    console.log('Starting post generation:', new Date().toISOString());
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    console.log('Selected topic:', randomTopic);
    
    const post = await generateBlogPost(randomTopic);
    console.log('Post generated, saving to database...');
    
    await prisma.blogPost.create({
      data: post
    });
    
    console.log('Post saved successfully:', post.title);
  } catch (error) {
    console.error('Error generating daily post:', error);
    // You might want to add error reporting here (e.g., Sentry)
    throw error;
  }
}
