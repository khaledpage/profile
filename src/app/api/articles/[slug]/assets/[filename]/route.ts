import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

// Parse slug and filename from the request URL to avoid strict typing issues on the context param
function parseParamsFromUrl(url: string): { slug: string | null; filename: string | null } {
  try {
    const { pathname } = new URL(url);
    const parts = pathname.split('/').filter(Boolean);
    // Expect .../api/articles/:slug/assets/:filename
    const apiIdx = parts.indexOf('api');
    const articlesIdx = parts.indexOf('articles', apiIdx >= 0 ? apiIdx + 1 : 0);
    const assetsIdx = parts.indexOf('assets', articlesIdx >= 0 ? articlesIdx + 1 : 0);
    const slug = articlesIdx >= 0 && parts[articlesIdx + 1] ? decodeURIComponent(parts[articlesIdx + 1]) : null;
    const filename = assetsIdx >= 0 && parts[assetsIdx + 1] ? decodeURIComponent(parts[assetsIdx + 1]) : null;
    return { slug, filename };
  } catch {
    return { slug: null, filename: null };
  }
}

export async function GET(req: Request) {
  const { slug, filename } = parseParamsFromUrl(req.url);
  if (!slug || !filename) {
    return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
  }

  const assetPath = path.join(process.cwd(), 'src', 'content', 'articles', slug, 'assets', filename);
  if (!fs.existsSync(assetPath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const type = ext === '.png' ? 'image/png'
    : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
    : ext === '.gif' ? 'image/gif'
    : ext === '.svg' ? 'image/svg+xml'
    : 'application/octet-stream';

  const data = fs.readFileSync(assetPath);
  return new NextResponse(data, {
    status: 200,
    headers: {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
 
