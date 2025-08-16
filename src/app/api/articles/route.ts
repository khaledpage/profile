import { NextResponse } from 'next/server';
import { getAllArticles } from '@/utils/articles';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const articles = await getAllArticles();
    // Return only what the homepage/explorer needs by default
    const payload = articles.map(a => ({ slug: a.slug, metadata: a.metadata }));
    return NextResponse.json(payload, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
  }
}
 
