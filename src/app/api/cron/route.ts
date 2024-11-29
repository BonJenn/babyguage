import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export async function GET(request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    // Verify the request is from Vercel
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Unauthorized cron attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Start the post generation in the background
    generateDailyPosts().catch(error => {
      console.error('Background post generation failed:', error);
    });

    // Return success immediately
    return NextResponse.json({ 
      message: 'Post generation started',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
