import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export const maxDuration = 300; // 5 minutes

export async function POST(request: Request) {
  try {
    // Verify the request
    const authHeader = request.headers.get('Authorization');
    console.log('Generate-daily-post received auth:', authHeader?.substring(0, 10) + '...');

    if (!process.env.CRON_SECRET) {
      console.error('CRON_SECRET not configured in generate-daily-post');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Unauthorized post generation attempt');
      console.error('Expected:', `Bearer ${process.env.CRON_SECRET?.substring(0, 10)}...`);
      console.error('Received:', authHeader);
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
