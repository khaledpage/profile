import { NextResponse } from 'next/server';
import { getAllArticles } from '@/utils/articles';
import { Article } from '@/types/article';
import { createArticleService } from '@/services/articleService';
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

export async function POST(request: Request) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    if (!adminKey || adminKey !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the uploaded files from FormData
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const service = createArticleService();
    const results: { slug: string; title?: string }[] = [];
    const errors: string[] = [];

    // Process each uploaded ZIP file
    for (const file of files) {
      try {
        if (!file.name.endsWith('.zip')) {
          errors.push(`${file.name}: Only ZIP files are allowed`);
          continue;
        }

        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Upload the ZIP file using the service
        const uploadResults = await service.uploadFromZip(arrayBuffer);
        results.push(...uploadResults);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({ 
      success: true, 
      results, 
      errors: errors.length > 0 ? errors : undefined 
    });
  } catch (error) {
    console.error('POST /api/articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    if (!adminKey || adminKey !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { slug, article } = body;

    if (!slug || !article) {
      return NextResponse.json({ error: 'Missing slug or article data' }, { status: 400 });
    }

    const service = createArticleService();
    const updated = await service.updateArticle(slug, article);

    if (updated) {
      return NextResponse.json({ success: true, slug });
    } else {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('PUT /api/articles error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 
