import { NextResponse } from 'next/server';
import { getAllArticles } from '@/utils/articles';
import { Article } from '@/types/article';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const articles = await getAllArticles();
    // Return only what the homepage/explorer needs by default
    const payload = articles.map((a: Article) => ({ slug: a.slug, metadata: a.metadata }));
    return NextResponse.json(payload, { status: 200 });
  } catch (_e) {
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Check for admin authentication
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const adminKey = request.headers.get('x-admin-key');

    if (!adminKey || adminKey !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'Article slug is required' }, { status: 400 });
    }

    // Define article paths
    const contentDir = path.join(process.cwd(), 'src/content/articles', slug);
    const publicDir = path.join(process.cwd(), 'public/data/articles', slug);
    
    // Remove article directories
    if (fs.existsSync(contentDir)) {
      fs.rmSync(contentDir, { recursive: true, force: true });
    }
    
    if (fs.existsSync(publicDir)) {
      fs.rmSync(publicDir, { recursive: true, force: true });
    }

    // Update articles.json in public/data
    const articlesJsonPath = path.join(process.cwd(), 'public/data/articles.json');
    if (fs.existsSync(articlesJsonPath)) {
      const articlesData = JSON.parse(fs.readFileSync(articlesJsonPath, 'utf8'));
      const updatedArticles = articlesData.filter((article: { slug: string }) => article.slug !== slug);
      fs.writeFileSync(articlesJsonPath, JSON.stringify(updatedArticles, null, 2));
    }

    return NextResponse.json({ message: 'Article deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
 
