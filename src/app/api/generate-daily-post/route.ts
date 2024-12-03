import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export async function POST(request: Request) {
  console.log('Generate-daily-post endpoint hit');
  
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Raw auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Invalid authorization header');
      return NextResponse.json({ error: 'Invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (token !== 'test') {
      console.error('Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('Authorization successful, generating post...');
    const post = await generateDailyPosts();
    return NextResponse.json({ success: true, post });

  } catch (error) {
    console.error('Generate-daily-post error:', error);
    return NextResponse.json({ error: 'Failed to generate post' }, { status: 500 });
  }
}
