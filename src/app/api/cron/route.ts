import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    // Debug environment variables
    const envDebug = {
      hasCronSecret: !!process.env.CRON_SECRET,
      secretLength: process.env.CRON_SECRET?.length || 0,
      vercelUrl: process.env.VERCEL_URL || 'not set',
      nodeEnv: process.env.NODE_ENV,
      fullUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    };
    console.log('Environment debug:', envDebug);

    const authHeader = request.headers.get('Authorization');
    console.log('Received auth header:', authHeader ? `${authHeader.substring(0, 10)}...` : 'none');

    if (!process.env.CRON_SECRET) {
      console.error('CRON_SECRET environment variable is not set');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    console.log('Making request to:', `${baseUrl}/api/generate-daily-post`);
    
    // Make the request without auth check - we'll let the generate-daily-post endpoint handle auth
    const response = await fetch(`${baseUrl}/api/generate-daily-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || '' // Pass through the original auth header
      }
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Failed to generate post:', {
        status: response.status,
        responsePreview: responseText.substring(0, 100),
        headers: Object.fromEntries([...response.headers])
      });
      return NextResponse.json({ error: 'Post generation failed', details: responseText }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Cron execution error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
