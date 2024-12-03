import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    if (!process.env.CRON_SECRET) {
      throw new Error('CRON_SECRET not configured');
    }

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    console.log('Making request to:', `${baseUrl}/api/generate-daily-post`);
    
    const authHeader = `Bearer ${process.env.CRON_SECRET}`;
    console.log('Using auth header (first 10 chars):', authHeader.substring(0, 10));

    const response = await fetch(`${baseUrl}/api/generate-daily-post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response status:', response.status);
      console.error('Response status text:', response.statusText);
      throw new Error(`Failed to generate post: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Failed to generate post' }, { status: 500 });
  }
}
