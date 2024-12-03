import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export async function POST(request: Request) {
  console.log('Generate-daily-post endpoint hit');
  
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Auth check:', {
      headerReceived: !!authHeader,
      secretConfigured: !!process.env.CRON_SECRET,
      headerStart: authHeader?.substring(0, 10)
    });

    if (!process.env.CRON_SECRET) {
      console.error('CRON_SECRET not configured in environment');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Auth failed. Expected:', `Bearer ${process.env.CRON_SECRET.substring(0, 10)}...`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Authorization successful, generating post...');
    const post = await generateDailyPosts();
    
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
      error: 'Failed to generate post',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
