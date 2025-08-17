# GitHub Pages Deployment Guide

## Quick Deployment Steps

### 1. Build and Export
```bash
npm run export
```

### 2. Commit and Push
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 3. Configure GitHub Pages
1. Go to your repository: `https://github.com/khaledpage/profile`
2. Click on **Settings**
3. Scroll down to **Pages** section
4. Under **Source**, select "Deploy from a branch"
5. Under **Branch**, select "main"
6. Under **Folder**, select "/docs"
7. Click **Save**

### 4. Access Your Site
Your portfolio will be available at: `https://khaledpage.github.io/profile`

## Troubleshooting

### If the page shows "404 Not Found":
1. Make sure you've pushed the `docs/` folder to GitHub
2. Check that GitHub Pages is configured to use the `docs` folder
3. Wait 5-10 minutes for GitHub Pages to update
4. Ensure the `.nojekyll` file is present in the docs folder

### If styles/images are not loading:
1. Verify that the `basePath` in `next.config.js` matches your repository name
2. Check that the `site.url` in `config.json` is correct
3. Ensure all asset paths in `config.json` start with `/assets/`

### If you make changes:
1. Run `npm run export` to rebuild
2. Commit and push the updated `docs/` folder
3. Wait for GitHub Pages to update (usually 1-5 minutes)

## Configuration Summary

- **Repository**: khaledpage/profile
- **Branch**: main
- **Folder**: /docs
- **URL**: https://khaledpage.github.io/profile
- **Base Path**: /profile
- **Asset Prefix**: /profile (in production)

## Files Created by Export
- `docs/index.html` - Main page
- `docs/_next/` - Next.js assets
- `docs/assets/` - Images and files
- `docs/.nojekyll` - GitHub Pages configuration
