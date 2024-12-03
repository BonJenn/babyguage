import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    console.log('Auth check:', {
      headerReceived: !!authHeader,
      secretConfigured: !!process.env.CRON_SECRET,
      headerStart: authHeader?.substring(0, 10),
      secretStart: process.env.CRON_SECRET?.substring(0, 10)
    });
    
    if (!process.env.CRON_SECRET) {
      console.error('CRON_SECRET not configured in environment');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Invalid or missing authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Authorization successful, starting post generation...');
    const post = await generateDailyPosts();
    return NextResponse.json({ success: true, post });

  } catch (error) {
    console.error('Generate-daily-post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
