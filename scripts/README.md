# Deployment Scripts

This directory contains automated deployment scripts for GitHub Pages.

## Available Scripts

### 🚀 deploy-to-github-pages.sh (Unix/Linux/macOS)
- **Purpose**: Complete automated deployment to GitHub Pages
- **Usage**: `npm run deploy` or `./scripts/deploy-to-github-pages.sh`
- **Features**:
  - Cleans previous builds
  - Builds and exports Next.js app
  - Prepares files for GitHub Pages
  - Commits with random message
  - Pushes to GitHub automatically

### 🚀 deploy-to-github-pages.bat (Windows)
- **Purpose**: Windows-compatible deployment script
- **Usage**: `scripts\deploy-to-github-pages.bat`
- **Features**: Same as the shell script but Windows-compatible

## What the Scripts Do

1. **Pre-deployment Checks**:
   - Verifies you're in a git repository
   - Checks for uncommitted changes and commits them if needed

2. **Build Process**:
   - Cleans previous builds (`.next`, `out`, `docs` folders)
   - Installs dependencies if `node_modules` doesn't exist
   - Runs production build with `NODE_ENV=production npm run export`

3. **GitHub Pages Preparation**:
   - Creates `docs/` folder with exported files
   - Adds `.nojekyll` file for GitHub Pages compatibility
   - Copies `CNAME` file if it exists (for custom domains)
   - Adds `robots.txt` if not present

4. **Git Operations**:
   - Stages all changes
   - Commits with a random motivational message
   - Pushes to the current branch

## Random Commit Messages

The script randomly selects from 20 different commit messages including:
- 🚀 Deploy latest portfolio updates
- ✨ Fresh deployment with new features
- 🔄 Portfolio refresh and optimizations
- 📦 Build and deploy updated content
- And 16 more creative options...

## Usage Examples

### Quick Deploy
```bash
npm run deploy
```

### Get Help
```bash
npm run deploy-help
```

### Manual Script Execution
```bash
# Unix/Linux/macOS
./scripts/deploy-to-github-pages.sh

# Windows
scripts\deploy-to-github-pages.bat
```

## Prerequisites

- Git repository initialized
- Remote origin configured
- Node.js and npm installed
- Clean working directory (or script will commit changes automatically)

## Output

The script provides colored output with:
- 🔵 **[INFO]** - Process information
- 🟢 **[SUCCESS]** - Successful operations
- 🟡 **[WARNING]** - Non-critical warnings
- 🔴 **[ERROR]** - Critical errors

## Deployment Statistics

After successful deployment, you'll see:
- Number of files deployed
- Total deployment size
- Commit hash
- Branch name
- Timestamp

## Troubleshooting

### Common Issues:

1. **"Not in a git repository!"**
   - Ensure you're in the project root with `.git` folder

2. **"Build failed!"**
   - Check for TypeScript/ESLint errors
   - Ensure all dependencies are installed

3. **"Push failed!"**
   - Check your git credentials
   - Ensure remote origin is configured
   - Check internet connection

### Manual Recovery:

If something goes wrong, you can manually:
```bash
# Reset to previous state
git reset --hard HEAD~1

# Clean build artifacts
rm -rf .next out docs

# Try again
npm run deploy
```

## Configuration

### Custom Domain
- Place a `CNAME` file in the project root
- The script will automatically copy it to `docs/`

### Robots.txt
- The script creates a default `robots.txt` if none exists
- To customize, create your own `robots.txt` in `public/`

## GitHub Pages Settings

After first deployment, configure GitHub Pages:
1. Go to repository Settings
2. Navigate to Pages section
3. Set Source to "Deploy from a branch"
4. Select "main" branch and "/docs" folder
5. Save settings

Your site will be available at:
- `https://username.github.io/repository-name`
- Or your custom domain if configured
