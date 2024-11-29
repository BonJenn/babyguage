import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Generate-daily-post auth:', authHeader ? 'Present' : 'Missing');
    
    if (!process.env.CRON_SECRET) {
      throw new Error('CRON_SECRET not configured');
    }

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new Error('Invalid authorization');
    }

    console.log('Starting post generation...');
    const post = await generateDailyPosts();
    console.log('Post generated:', post.title);

    return NextResponse.json({ 
      success: true,
      post: {
        title: post.title,
        slug: post.slug
      }
    });

  } catch (error) {
    console.error('Generate-daily-post error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
