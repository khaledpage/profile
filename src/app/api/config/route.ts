import { NextResponse } from 'next/server';
import { getSiteConfig } from '@/utils/content';

export async function GET() {
  try {
    const config = await getSiteConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error loading config:', error);
    return NextResponse.json(
      { error: 'Failed to load configuration' },
      { status: 500 }
    );
  }
}
