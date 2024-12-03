import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/generate-daily-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to generate post: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate post',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
