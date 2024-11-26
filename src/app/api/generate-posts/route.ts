import { NextResponse } from 'next/server';
import { generateBlogPost, generateUniqueTopic } from '../../../services/blogGenerator';

export async function POST(request: Request) {
  try {
    const { count = 3 } = await request.json();
    const numPosts = Math.min(Math.max(1, count), 10);

    console.log('Starting post generation, count:', numPosts);

    const generatePromises = Array(numPosts)
      .fill(null)
      .map(async (_, index) => {
        try {
          console.log(`Generating post ${index + 1}/${numPosts}`);
          const topic = await generateUniqueTopic();
          console.log(`Generated topic: ${topic}`);
          return await generateBlogPost(topic);
        } catch (error) {
          console.error(`Error generating post ${index + 1}:`, error);
          throw error;
        }
      });

    const results = await Promise.all(generatePromises);
    
    return NextResponse.json({ 
      success: true,
      count: results.length,
      posts: results 
    });
  } catch (error) {
    console.error('Detailed error in generate-posts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate posts',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
