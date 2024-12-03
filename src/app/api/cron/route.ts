import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export const maxDuration = 900; // Set maximum duration to 900 seconds (15 minutes)
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('Authorization');
  
  if (process.env.VERCEL_ENV === 'production' && (!authHeader || !authHeader.includes('Bearer'))) {
    console.log('Unauthorized cron attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Cron job started:', new Date().toISOString());
    
    // Set a longer timeout for the generateDailyPosts function
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Function timeout')), 840000); // 14 minutes
    });

    const post = await Promise.race([
      generateDailyPosts(),
      timeoutPromise
    ]);

    console.log('Post generated successfully:', post.title);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post generated successfully',
      title: post.title 
    });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ 
      error: 'Post generation failed', 
      details: String(error)
    }, { status: 500 });
  }
}


