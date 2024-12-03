import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export async function POST(request: Request) {
  console.log('Generate-daily-post endpoint hit');
  
  try {
    const headers = [...request.headers].reduce((obj, [key, value]) => {
      obj[key] = value;
      return obj;
    }, {} as Record<string, string>);
    
    console.log('Received headers:', headers);
    
    const authHeader = request.headers.get('Authorization');
    console.log('Raw auth header:', authHeader);

    if (!authHeader) {
      console.error('No authorization header received');
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    console.log('Authorization successful, generating post...');
    const post = await generateDailyPosts();
    return NextResponse.json({ success: true, post });

  } catch (error) {
    console.error('Generate-daily-post error:', error);
    return NextResponse.json({ error: 'Failed to generate post' }, { status: 500 });
  }
}
