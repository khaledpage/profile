import { NextResponse } from 'next/server';
import { getAllArticles } from '@/utils/articles';

export async function GET() {
  try {
    const articles = await getAllArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
