import { NextResponse } from 'next/server';

export async function GET(_request: Request) {
  console.log('Cron job started:', new Date().toISOString());
  
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'Cron endpoint reached',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cron error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
