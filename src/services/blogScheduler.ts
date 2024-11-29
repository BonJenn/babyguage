import { generateBlogPost } from './blogGenerator';
import { prisma } from '../lib/prisma';

const topics = [
  "Early Pregnancy Symptoms",
  "Fertility Foods",
  "Ovulation Tracking Methods",
  "Natural Fertility Boosters",
  "Understanding Your Cycle",
  // Add more topics...
];

export async function generateDailyPosts() {
  try {
    // Generate 1 post
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const post = await generateBlogPost(randomTopic);
    
    // Save to database
    await prisma.blogPost.create({
      data: post
    });
    
    console.log(`Generated post: ${post.title}`);
  } catch (error) {
    console.error('Error generating daily posts:', error);
  }
}
