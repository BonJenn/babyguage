import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';
import { BlogPost } from '../../../types/blog';

export const maxDuration = 900;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');
  
  if (process.env.VERCEL_ENV === 'production' && (!authHeader || !authHeader.includes('Bearer'))) {
    console.log('Unauthorized cron attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Cron job started:', new Date().toISOString());
    
    const timeoutPromise = new Promise<BlogPost>((_, reject) => {
      setTimeout(() => reject(new Error('Function timeout')), 840000);
    });

    const post = await Promise.race<BlogPost>([
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


