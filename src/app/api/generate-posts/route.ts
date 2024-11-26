import { NextResponse } from 'next/server';
import { generateBlogPost } from '../../../services/blogGenerator';

const topics = [
  "Early Pregnancy Symptoms",
  "Fertility Foods",
  "Ovulation Tracking Methods",
  "Natural Fertility Boosters",
  "Understanding Your Cycle",
  // Add more topics...
];

export async function POST() {
  try {
    // Generate 3 posts
    const generatePromises = Array(3)
      .fill(null)
      .map(() => {
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        return generateBlogPost(randomTopic);
      });

    await Promise.all(generatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error generating posts:', error);
    return NextResponse.json(
      { error: 'Failed to generate posts' },
      { status: 500 }
    );
  }
}
