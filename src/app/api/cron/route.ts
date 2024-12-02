import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    // Simple environment check
    const debug = {
      hasCronSecret: !!process.env.CRON_SECRET,
      env: process.env.NODE_ENV,
      url: process.env.VERCEL_URL
    };
    console.log('Debug:', debug);

    // Basic auth check
    const authHeader = request.headers.get('Authorization');
    if (!process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Simple success response
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });

  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
