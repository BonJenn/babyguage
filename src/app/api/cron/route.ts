import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    // Verify the request is from Vercel
    const authHeader = request.headers.get('Authorization');
    console.log('Received auth header:', authHeader?.substring(0, 10) + '...');
    
    if (!process.env.CRON_SECRET) {
      console.error('CRON_SECRET not configured');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Unauthorized cron attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Make POST request to generate-daily-post endpoint
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    console.log('Making request to:', baseUrl);

    const response = await fetch(`${baseUrl}/api/generate-daily-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response not OK:', response.status, errorText);
      throw new Error(`Failed to trigger post generation: ${response.status} ${response.statusText}`);
    }

    return NextResponse.json({ 
      message: 'Post generation triggered successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
