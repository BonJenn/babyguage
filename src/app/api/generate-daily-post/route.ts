import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export async function POST(request: Request) {
  console.log('Generate-daily-post endpoint hit');
  
  try {
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = 'Bearer youwillneverknow64';
    
    console.log('Auth check:', {
      headerReceived: !!authHeader,
      headerMatches: authHeader === expectedAuth,
      headerLength: authHeader?.length,
      expectedLength: expectedAuth.length
    });

    if (!authHeader || authHeader !== expectedAuth) {
      console.error('Auth failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Authorization successful, generating post...');
    const post = await generateDailyPosts();
    return NextResponse.json({ success: true, post });

  } catch (error) {
    console.error('Generate-daily-post error:', error);
    return NextResponse.json({ error: 'Failed to generate post' }, { status: 500 });
  }
}
