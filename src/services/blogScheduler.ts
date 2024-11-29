import { generateBlogPost } from './blogGenerator';
import { BlogService } from './blogService';

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
    
    await BlogService.createPost(post);
    
    console.log('Post saved successfully:', post.title);
  } catch (error) {
    console.error('Error generating daily post:', error);
    throw error;
  }
}
