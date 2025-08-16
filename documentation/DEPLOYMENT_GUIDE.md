# 🚀 Deployment Guide

This comprehensive guide covers all deployment options for the portfolio application across different environments and platforms.

## 📋 Table of Contents

- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [GitHub Pages Deployment](#github-pages-deployment)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## 🖥️ Local Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to `http://localhost:3000`
   - Hot reload enabled for development

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🐳 Docker Deployment

### Option 1: Docker Compose (Recommended)

**Development Mode**
```bash
# Start development environment with hot reload
docker-compose --profile dev up

# Build and start fresh
docker-compose --profile dev up --build
```

**Production Mode**
```bash
# Start production environment
docker-compose up

# Background mode
docker-compose up -d

# Build and start fresh
docker-compose up --build
```

### Option 2: Podman Compose

```bash
# Same commands as Docker Compose
podman-compose up --build
podman-compose --profile dev up
```

### Option 3: Manual Docker Build

```bash
# Build production image
docker build -t portfolio:latest .

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  portfolio:latest

# Development build
docker build -f Dockerfile.dev -t portfolio:dev .
docker run -p 3000:3000 -v $(pwd)/src:/app/src portfolio:dev
```

### Docker Configuration

**Volume Mounts (for customization):**
- `./src/content:/app/content` - Configuration files
- `./src/content/articles:/app/articles` - Articles content
- `./public/custom-defaults.json:/app/custom-config/custom-defaults.json` - Custom settings

**Environment Variables:**
- `NODE_ENV=production` - Production mode
- `NEXT_TELEMETRY_DISABLED=1` - Disable Next.js telemetry

## 📄 GitHub Pages Deployment

### Manual Deployment

1. **Build static export**
   ```bash
   npm run build:pages
   ```

2. **Generate docs folder**
   ```bash
   npm run export:docs
   ```

3. **Complete pipeline**
   ```bash
   npm run pages:publish
   ```

4. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/docs`

### Custom Repository Names

For custom repository names, set the base path:

```bash
NEXT_PUBLIC_BASE_PATH=/your-repo npm run build:pages
NEXT_PUBLIC_BASE_PATH=/your-repo npm run export:docs
```

### Static Export Configuration

The build process automatically:
- Sets `NEXT_PUBLIC_STATIC_EXPORT=true`
- Configures proper asset paths
- Disables API routes for static compatibility
- Generates all pages as static HTML

## ⚙️ GitHub Actions CI/CD

### Basic Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build:pages
        env:
          NEXT_PUBLIC_BASE_PATH: /portfolio

      - name: Export static files
        run: npm run export:docs

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./docs

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Advanced Workflow with Caching

```yaml
name: Advanced Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build and export
        run: npm run pages:publish
        env:
          NEXT_PUBLIC_BASE_PATH: /portfolio
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./docs

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Node environment | `development` | No |
| `NEXT_PUBLIC_STATIC_EXPORT` | Enable static export | `false` | For static builds |
| `NEXT_PUBLIC_BASE_PATH` | Base path for assets | `/` | For GitHub Pages |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | `false` |
| `PORT` | Server port | `3000` |

### Setting Environment Variables

**Local Development (.env.local):**
```bash
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

**Production (.env.production):**
```bash
NODE_ENV=production
NEXT_PUBLIC_STATIC_EXPORT=true
NEXT_PUBLIC_BASE_PATH=/portfolio
```

**Docker:**
```bash
docker run -e NODE_ENV=production -e NEXT_TELEMETRY_DISABLED=1 portfolio:latest
```

## 🛠️ Troubleshooting

### Common Issues

**Build Timeouts**
```bash
# Kill stuck processes
pkill -f "next build" || pkill -f "node.*build"

# Clean and rebuild
rm -rf .next
npm run build
```

**Static Export Failures**
- Check for API routes in static export mode
- Ensure all images have proper paths
- Verify no server-side only features

**Docker Issues**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t portfolio:latest .
```

**GitHub Pages 404 Errors**
- Verify `NEXT_PUBLIC_BASE_PATH` matches repository name
- Check that `docs/` folder contains `index.html`
- Ensure GitHub Pages is enabled and configured correctly

### Performance Optimization

**Build Performance:**
- Use `npm ci` instead of `npm install` in CI
- Enable dependency caching in GitHub Actions
- Consider splitting large builds

**Runtime Performance:**
- Enable compression in production
- Use CDN for static assets
- Monitor bundle size with `npm run analyze`

### Debug Commands

```bash
# Check build output
npm run build -- --debug

# Analyze bundle size
npm run analyze

# Check static export
npm run build:pages -- --debug

# Validate generated files
ls -la docs/
```

## 📞 Support

For deployment issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [bug fix log](BUG_FIX_LOG.md)
3. Check GitHub Actions logs for CI/CD issues
4. Verify environment variables are set correctly

## 🔄 Updates

This deployment guide is regularly updated. Check the latest version for:
- New deployment platforms
- Updated dependency versions
- Security improvements
- Performance optimizations
