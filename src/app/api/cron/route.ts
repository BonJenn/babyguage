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

    // Wait for post generation to complete
    const post = await generateDailyPosts();
    console.log('Post generation completed:', post.title);

    return NextResponse.json({ 
      success: true, 
      message: 'Post generated successfully',
      title: post.title
    });

  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate post',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
