import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    const authHeader = request.headers.get('Authorization');
    console.log('Cron received auth:', authHeader ? 'Present' : 'Missing');
    
    if (!process.env.CRON_SECRET) {
      throw new Error('CRON_SECRET not configured');
    }

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      throw new Error('Invalid authorization');
    }

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    console.log('Making request to:', `${baseUrl}/api/generate-daily-post`);

    const response = await fetch(`${baseUrl}/api/generate-daily-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`
      }
    });

    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response text:', responseText);

    if (!response.ok) {
      throw new Error(`Failed to trigger post generation: ${response.status} ${responseText}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
