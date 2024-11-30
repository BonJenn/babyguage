import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    // Debug environment variables
    const envDebug = {
      hasCronSecret: !!process.env.CRON_SECRET,
      secretLength: process.env.CRON_SECRET?.length || 0,
      vercelUrl: process.env.VERCEL_URL || 'not set',
      nodeEnv: process.env.NODE_ENV
    };
    console.log('Environment debug:', envDebug);

    // Debug headers safely
    const headers = request.headers;
    const debugHeaders = {
      authorization: headers.get('authorization')?.substring(0, 20) + '...',
      host: headers.get('host'),
      'user-agent': headers.get('user-agent')
    };
    console.log('Request headers:', debugHeaders);

    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

    if (!process.env.CRON_SECRET) {
      console.error('CRON_SECRET environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (authHeader !== expectedAuth) {
      console.error('Authorization mismatch:', {
        headerPresent: !!authHeader,
        headerPrefix: authHeader?.substring(0, 7),
        expectedPrefix: expectedAuth.substring(0, 7),
        lengthMatch: authHeader?.length === expectedAuth.length
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/generate-daily-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': expectedAuth
      }
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Failed to generate post:', {
        status: response.status,
        responsePreview: responseText.substring(0, 100)
      });
      return NextResponse.json({ error: 'Post generation failed' }, { status: response.status });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cron execution error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
