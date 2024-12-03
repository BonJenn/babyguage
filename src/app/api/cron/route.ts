import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    console.log('Making request to:', `${baseUrl}/api/generate-daily-post`);
    
    const response = await fetch(`${baseUrl}/api/generate-daily-post`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test'
      }
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers));
      console.error('Response body:', responseText);
      throw new Error(`Failed to generate post: ${response.status}. Response: ${responseText}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
