/* Build static JSON and copy assets for GitHub Pages static export */
const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(process.cwd(), 'src/content/articles');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUT_ASSETS_ROOT = path.join(PUBLIC_DIR, 'articles');
const DATA_ROOT = path.join(PUBLIC_DIR, 'data', 'articles');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function copyFileSync(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('No content directory found, skipping static content build');
    return;
  }

  ensureDir(OUT_ASSETS_ROOT);
  ensureDir(DATA_ROOT);

  const dirs = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const index = [];

  for (const slug of dirs) {
    const articleDir = path.join(CONTENT_DIR, slug);
    const metaPath = path.join(articleDir, 'metadata.json');
    const mdPath = path.join(articleDir, 'article.md');
    if (!fs.existsSync(metaPath) || !fs.existsSync(mdPath)) continue;

    const metadata = readJSON(metaPath);
    const markdown = fs.readFileSync(mdPath, 'utf8');

    // Copy assets
    const assetsDir = path.join(articleDir, 'assets');
    const assetFiles = [];
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      for (const file of files) {
        const src = path.join(assetsDir, file);
        if (!fs.statSync(src).isFile()) continue;
        const dest = path.join(OUT_ASSETS_ROOT, slug, 'assets', file);
        copyFileSync(src, dest);
        assetFiles.push(file);
      }
    }

    // Normalize coverImage to static path if present
    if (metadata.coverImage) {
      const cover = String(metadata.coverImage);
      const isExternal = /^(https?:)?\/\//.test(cover);
      const isAbsolutePath = cover.startsWith('/');
      // Only normalize when the path points to our local assets folder
      if (!isExternal && !isAbsolutePath) {
        const name = cover
          .replace(/^\.\/assets\//, '')
          .replace(/^assets\//, '');
        metadata.coverImage = `/articles/${slug}/assets/${name}`;
      }
      // else keep as-is (external URL or already-absolute path)
    }

    const data = {
      slug,
      metadata,
      content: markdown,
      assets: assetFiles,
    };

    // Write per-article JSON
    const perPath = path.join(DATA_ROOT, `${slug}.json`);
    ensureDir(path.dirname(perPath));
    fs.writeFileSync(perPath, JSON.stringify(data));

    // Minimal info for index list
    index.push({ slug, metadata });
  }

  // Write index JSON
  const indexPath = path.join(PUBLIC_DIR, 'data', 'articles.json');
  ensureDir(path.dirname(indexPath));
  fs.writeFileSync(indexPath, JSON.stringify(index));

  console.log(`Static content built: ${index.length} articles`);
}

main();
