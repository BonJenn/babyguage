import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    console.log('Auth check:', {
      headerReceived: !!authHeader,
      secretConfigured: !!process.env.CRON_SECRET,
      headerLength: authHeader?.length,
      expectedLength: expectedAuth.length
    });
    
    if (!process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 401 });
    }

    if (!authHeader || authHeader.trim() !== expectedAuth.trim()) {
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
