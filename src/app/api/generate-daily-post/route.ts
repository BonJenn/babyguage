import { NextResponse } from 'next/server';
import { generateDailyPosts } from '../../../services/blogScheduler';

export async function POST(request: Request) {
  console.log('Generate-daily-post endpoint hit');
  
  try {
    const headerObj: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headerObj[key] = value;
    });
    console.log('Received headers:', headerObj);
    
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
