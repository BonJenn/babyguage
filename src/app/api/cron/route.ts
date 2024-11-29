import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Cron received auth header:', authHeader?.slice(0, 20) + '...');
    
    if (!process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 401 });
    }

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Invalid authorization' }, { status: 401 });
    }

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    console.log('Making request to:', `${baseUrl}/api/generate-daily-post`);

    const response = await fetch(`${baseUrl}/api/generate-daily-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', responseText.slice(0, 200));

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Failed to trigger post generation: ${response.status}`,
        details: responseText
      }, { status: response.status });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
