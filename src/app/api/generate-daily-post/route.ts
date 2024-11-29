import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export const maxDuration = 300; // 5 minutes

export async function POST(request: Request) {
  try {
    // Verify the request
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Unauthorized post generation attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting post generation in background...');
    const post = await generateDailyPosts();
    
    console.log('Post generation completed:', post.title);
    return NextResponse.json({ 
      success: true,
      post: {
        title: post.title,
        slug: post.slug
      }
    });
  } catch (error) {
    console.error('Post generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate post',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
