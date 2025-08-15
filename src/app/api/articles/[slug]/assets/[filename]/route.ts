import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RouteParams {
  params: Promise<{
    slug: string;
    filename: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug, filename } = await params;
    
    // Construct path to the asset file
    const articlesDir = path.join(process.cwd(), 'src/content/articles');
    const assetPath = path.join(articlesDir, slug, 'assets', filename);
    
    // Security check: ensure the path is within the articles directory
    const resolvedPath = path.resolve(assetPath);
    const resolvedArticlesDir = path.resolve(articlesDir);
    
    if (!resolvedPath.startsWith(resolvedArticlesDir)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
    }
    
    // Check if file exists
    if (!fs.existsSync(assetPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    // Read file
    const fileBuffer = fs.readFileSync(assetPath);
    
    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.pdf':
        contentType = 'application/pdf';
        break;
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error serving article asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
