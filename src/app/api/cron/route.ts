import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  console.log('Environment check:', {
    hasCronSecret: !!process.env.CRON_SECRET,
    envVars: Object.keys(process.env).filter(key => key.includes('CRON'))
  });
  
  try {
    const authHeader = request.headers.get('Authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    console.log('Auth debug:', {
      received: authHeader?.substring(0, 15),
      expected: expectedAuth.substring(0, 15),
      match: authHeader === expectedAuth,
      headerLength: authHeader?.length,
      expectedLength: expectedAuth.length
    });

    if (!process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 401 });
    }

    if (authHeader !== expectedAuth) {
      return NextResponse.json({ 
        error: 'Invalid authorization',
        debug: {
          receivedLength: authHeader?.length,
          expectedLength: expectedAuth.length,
          firstCharsMatch: authHeader?.substring(0, 10) === expectedAuth.substring(0, 10)
        }
      }, { status: 401 });
    }

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    console.log('Making request to:', `${baseUrl}/api/generate-daily-post`);

    const response = await fetch(`${baseUrl}/api/generate-daily-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': expectedAuth
      }
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Error response:', {
        status: response.status,
        body: responseText.substring(0, 200)
      });
      
      return NextResponse.json({ 
        error: `Failed to trigger post generation: ${response.status}`,
        details: responseText.substring(0, 500)
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
