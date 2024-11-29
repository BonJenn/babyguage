import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    // Verify the request is from Vercel
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Unauthorized cron attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Make POST request to generate-daily-post endpoint
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/generate-daily-post`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-cron-secret': process.env.CRON_SECRET || ''
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to trigger post generation: ${response.statusText} - ${errorText}`);
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
