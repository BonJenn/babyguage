import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('Authorization');
  
  if (process.env.VERCEL_ENV === 'production' && (!authHeader || !authHeader.includes('Bearer'))) {
    console.log('Unauthorized cron attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Cron job started:', new Date().toISOString());
    const post = await generateDailyPosts();
    console.log('Post generated successfully:', post.title);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Post generated successfully',
      title: post.title 
    });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}


