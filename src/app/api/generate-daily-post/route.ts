import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Generate-daily-post auth header:', authHeader?.slice(0, 20) + '...');
    console.log('Expected auth:', `Bearer ${process.env.CRON_SECRET?.slice(0, 20)}...`);
    
    if (!process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 401 });
    }

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Invalid authorization' }, { status: 401 });
    }

    console.log('Authorization successful, starting post generation...');
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
