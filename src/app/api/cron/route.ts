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

    console.log('Starting post generation...');
    await generateDailyPosts();
    console.log('Posts generated successfully');
    
    return NextResponse.json({ 
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ 
      error: 'Failed to generate posts',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
