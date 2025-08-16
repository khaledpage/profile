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
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/profile';

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
  rewriteBasePaths(destFile);
}

// Iterate .next/server/app
const entries = fs.readdirSync(serverAppDir, { withFileTypes: true });
for (const entry of entries) {
  const p = path.join(serverAppDir, entry.name);
  if (entry.isFile() && entry.name.endsWith('.html')) {
    if (entry.name === '_not-found.html') {
      const notFound = path.join(docsDir, '404.html');
      fs.copyFileSync(p, notFound);
      rewriteBasePaths(notFound);
    } else if (entry.name === 'articles.html') {
      writeRouteHtml(p, '/articles');
    } else {
      // If root page html exists (e.g., index.html), copy to docs/index.html
      if (entry.name === 'index.html') {
        const idx = path.join(docsDir, 'index.html');
        fs.copyFileSync(p, idx);
        rewriteBasePaths(idx);
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

// Rewrites absolute href/src URLs in an HTML file to include the basePath.
function rewriteBasePaths(filePath) {
  try {
    let html = fs.readFileSync(filePath, 'utf8');
    // Prefix any href/src starting with "/" that isn't already under the basePath
    const generic = new RegExp('(href|src)="\/(?!' + basePath.replace(/^\//, '') + '\/)','g');
    html = html.replace(generic, `$1="${basePath}/`);

    // Fix srcset/srcSet where multiple URLs may appear separated by commas/spaces
    // This captures occurrences of space or comma followed by /path and prefixes the basePath
    const srcsetPattern = new RegExp('((?:,|\s))\/(?!' + basePath.replace(/^\//, '') + '\/)', 'g');
    html = html.replace(srcsetPattern, `$1${basePath}/`);

    // Be explicit for a few known cases too (idempotent)
    html = html
      .replaceAll('href="/_next', `href="${basePath}/_next`)
      .replaceAll('src="/_next', `src="${basePath}/_next`)
      .replaceAll('href="/favicon.ico', `href="${basePath}/favicon.ico`);

    // Some Next inline streaming chunks reference "/_next" inside JS strings; rewrite those too.
    html = html.replaceAll('"/_next/', `"${basePath}/_next/`).replaceAll("'/_next/", `'${basePath}/_next/`);
    fs.writeFileSync(filePath, html, 'utf8');
  } catch (e) {
    console.warn('Failed to rewrite base paths for', filePath, e?.message || e);
  }
}
