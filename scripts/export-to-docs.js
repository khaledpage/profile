/*
 Copies the static export from `out/` into a versioned `docs/` folder
 suitable for GitHub Pages (Deploy from Branch). Adds a `.nojekyll` file
 so Pages doesn't process the site.
*/
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'out');
const docsDir = path.join(root, 'docs');

if (!fs.existsSync(outDir)) {
  console.error('Missing out/ folder. Run `npm run build:pages` first.');
  process.exit(1);
}

// Remove docs directory if exists
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true, force: true });
}

fs.mkdirSync(docsDir, { recursive: true });

// Simple recursive copy
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

copyDir(outDir, docsDir);

// Ensure .nojekyll exists
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');

console.log('Copied out/ to docs/ and added .nojekyll.');
