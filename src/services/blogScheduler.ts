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
    // Generate 3 posts
    for (let i = 0; i < 3; i++) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const post = await generateBlogPost(randomTopic);
      
      // Save to database
      await prisma.blogPost.create({
        data: post
      });
    }
  } catch (error) {
    console.error('Error generating daily posts:', error);
  }
}
