import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Read the article content from markdown file
    const articlePath = path.join(process.cwd(), 'src/content/articles', slug, 'article.md');
    
    if (!fs.existsSync(articlePath)) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }
    
    const content = fs.readFileSync(articlePath, 'utf-8');
    
    return NextResponse.json({ content });
    
  } catch (error) {
    console.error('Error reading article content:', error);
    return NextResponse.json(
      { error: 'Failed to read article content' },
      { status: 500 }
    );
  }
}
