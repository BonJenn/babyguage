import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';
import { config } from 'dotenv';

export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await generateDailyPosts();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Failed to generate posts' }, { status: 500 });
  }
}
