# Portfolio

A Next.js-based portfolio with articles, projects, LaTeX rendering, PDF export (server only), cookie-aware preferences, and optional Vite-built widgets.

## Scripts

- dev: Next dev server
- build: Next production build
- start: Next prod server
- lint: ESLint
- build:pages: Static export build for GitHub Pages (sets env flags, prepares static content, then runs Next build)
- build:widgets: Build standalone browser widgets with Vite to `public/widgets/`
- export:docs: Assemble `docs/` from Next 15 build artifacts (`.next/server/app` and `_next/static`) and copy `public/` assets
- pages:publish: Run `build:pages` then `export:docs` in one step

## Vite Widgets

This repo includes an optional Vite bundle for small browser widgets.

- Entry: `widgets/src/index.ts`
- Config: `vite.widgets.config.ts`
- Output: `public/widgets/widgets.es.js` and `public/widgets/widgets.iife.js`

You can load the IIFE bundle on any static page:

```html
<script src="/widgets/widgets.iife.js"></script>
<div data-widget="greeting"></div>
```

## Notes

- On GitHub Pages, API routes and server-side PDF export are disabled; UI handles this gracefully.
- Theme, buttons, and project pages use CSS variables for readable contrast across themes.

## Deploy to GitHub Pages (manual, no Actions)

1. Build a static export with the Pages flags:

```bash
npm run build:pages
```

1. Assemble the `docs/` folder from the build output:

```bash
npm run export:docs
```

Alternatively, run both in one step:

```bash
npm run pages:publish
```

3. Push to the `main` branch and enable GitHub Pages → Deploy from Branch → Branch: `main`, Folder: `/docs`.
4. If your repo name isn’t `profile`, set `NEXT_PUBLIC_BASE_PATH` to `/<repo>` when building.
