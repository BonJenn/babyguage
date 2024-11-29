import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export async function GET(request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  // Verify the request is from Vercel
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('Unauthorized cron attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Start the generation process without awaiting it
  generateDailyPosts().catch(error => {
    console.error('Error in background post generation:', error);
  });

  // Return immediately
  return NextResponse.json({ 
    success: true,
    message: 'Post generation started',
    timestamp: new Date().toISOString()
  });
}
