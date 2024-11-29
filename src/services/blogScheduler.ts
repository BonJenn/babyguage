import { generateBlogPost } from './blogGenerator';

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
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), 8000);
    });

    const post = await Promise.race([
      generateBlogPost(randomTopic),
      timeoutPromise
    ]);

    console.log('Post generated successfully:', post.title);
    return post;
    
  } catch (error) {
    console.error('Error generating daily post:', error);
    throw error;
  }
}
