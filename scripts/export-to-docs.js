/*
 Copies the static export from `out/` into a versioned `docs/` folder
 suitable for GitHub Pages (Deploy from Branch). Adds a `.nojekyll` file
 so Pages doesn't process the site.
*/
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
// Next 15 with output: export writes prerendered HTML to .next/server/app
const serverAppDir = path.join(root, '.next', 'server', 'app');
const nextStaticDir = path.join(root, '.next', 'static');
const docsDir = path.join(root, 'docs');

if (!fs.existsSync(serverAppDir)) {
  console.error('Missing .next/server/app folder. Run `npm run build:pages` first.');
  process.exit(1);
}

// Remove docs directory if exists
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}

fs.mkdirSync(docsDir, { recursive: true });

// Copy public/ (static assets referenced directly)
const publicDir = path.join(root, 'public');
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, docsDir);
}

// Copy Next static assets to _next/static
if (fs.existsSync(nextStaticDir)) {
  copyDir(nextStaticDir, path.join(docsDir, '_next', 'static'));
}

// Simple recursive copy helper
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// Map HTML files from .next/server/app to docs/ routes
function writeRouteHtml(srcHtml, routePath) {
  // Normalize like /articles -> docs/articles/index.html
  const segments = routePath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
  const destDir = path.join(docsDir, ...segments);
  fs.mkdirSync(destDir, { recursive: true });
  const destFile = path.join(destDir, 'index.html');
  fs.copyFileSync(srcHtml, destFile);
}

// Iterate .next/server/app
const entries = fs.readdirSync(serverAppDir, { withFileTypes: true });
for (const entry of entries) {
  const p = path.join(serverAppDir, entry.name);
  if (entry.isFile() && entry.name.endsWith('.html')) {
    if (entry.name === '_not-found.html') {
      fs.copyFileSync(p, path.join(docsDir, '404.html'));
    } else if (entry.name === 'articles.html') {
      writeRouteHtml(p, '/articles');
    } else {
      // If root page html exists (e.g., index.html), copy to docs/index.html
      if (entry.name === 'index.html') {
        fs.copyFileSync(p, path.join(docsDir, 'index.html'));
      }
    }
  } else if (entry.isDirectory()) {
    // Handle nested routes like articles/* or projects/*
    const dir = entry.name;
    const htmlFiles = fs.readdirSync(p).filter((n) => n.endsWith('.html'));
    for (const f of htmlFiles) {
      const route = `/${dir}/${f.replace(/\.html$/, '')}`;
      writeRouteHtml(path.join(p, f), route);
    }
  }
}

// Ensure .nojekyll exists
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');

console.log('Created docs/ from .next/server/app and _next/static, and added .nojekyll.');
