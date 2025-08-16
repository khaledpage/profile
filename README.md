# Portfolio

A modern, customizable Next.js portfolio featuring dynamic theming, multilingual support, articles with LaTeX rendering, project showcases, and comprehensive settings management. Includes browser language detection, custom configuration downloads, and both development and static deployment options.

## ✨ Key Features

- **🎨 Advanced Theming**: 16+ color themes with real-time switching and automatic rotation
- **🌍 Multilingual Support**: Browser language detection with English/German support
- **⚙️ Settings Management**: Downloadable configuration JSON for custom defaults  
- **📱 Responsive Design**: Mobile-first with consistent floating navigation
- **🎭 Smooth Animations**: Configurable background animations and interactive effects
- **📊 Skills Showcase**: Multiple layout options (Grid, Marquee, Carousel, Masonry, Timeline)
- **📝 Article System**: LaTeX support, PDF export (server), reading mode
- **🚀 Deployment Ready**: GitHub Pages support with manual and automated builds

## 🛠 Scripts

- `dev`: Next dev server
- `build`: Next production build  
- `start`: Next prod server
- `lint`: ESLint
- `build:pages`: Static export build for GitHub Pages (sets env flags, prepares content)
- `build:widgets`: Build standalone browser widgets with Vite to `public/widgets/`
- `export:docs`: Assemble `docs/` from Next build artifacts for GitHub Pages
- `pages:publish`: Complete static build + export pipeline

## ⚙️ Configuration System

### Base Configuration

The main configuration lives in `src/content/config.json` with these defaults:

- **Theme**: Mint Green Light
- **Language**: English (with browser detection fallback)
- **Skills Layout**: Grid
- **Animations**: Enabled

### Custom Defaults

Create a `public/custom-defaults.json` file to override base settings:

```json
{
  "colorProfile": "oceanBlueDark",
  "skillsDisplay": { "design": "marquee" },
  "i18n": { "defaultLocale": "de" },
  "animation": { "enabled": false },
  "settings": { "enabled": false }
}
```

#### Downloading Configuration from Live Site

1. **Visit your deployed site** and open the Settings panel (⚙️ icon)
2. **Adjust settings** to your preferred configuration (theme, language, skills layout, etc.)
3. **Click the download button** (⬇️) in the settings panel
4. **Save the downloaded file** as `custom-defaults.json` in your project's `public/` folder
5. **Redeploy** your site - it will now use your custom defaults

#### Disabling Settings Panel

To hide the settings panel after applying custom defaults, add this to your `custom-defaults.json`:

```json
{
  "settings": {
    "enabled": false,
    "showIcon": false
  }
}
```

This prevents end users from changing settings while keeping your custom configuration active.

**📥 Download from Settings**: Use the settings panel to download your current preferences as a JSON file, then save it as `custom-defaults.json` in your `public/` folder.

## 🌐 Multilingual System

- **Auto-detection**: Detects browser language on first visit
- **Fallback**: Uses English if browser language not available  
- **Storage**: Saves user preference in localStorage
- **Components**: All UI text uses translation system

Available languages: English (en), German (de)

## 🎨 Theming & Animations

- **16+ Themes**: Dark, light, and vibrant color palettes
- **Live Switching**: Instant theme changes without page reload
- **Auto Rotation**: Optional theme cycling with configurable intervals
- **CSS Variables**: Consistent theming across all components
- **Animation Control**: Toggle background effects and particles
- **Accessibility**: High contrast ratios for readability

## 📱 Navigation & UX

- **Floating Controls**: Consistent back/home buttons positioned to avoid overlap
- **Breadcrumbs**: Clear navigation context on all pages
- **Reading Mode**: Optimized article viewing experience
- **Mobile First**: Responsive design with touch-friendly interactions

## 🔧 Vite Widgets

Optional standalone browser widgets for embedding:

- **Entry**: `widgets/src/index.ts`
- **Config**: `vite.widgets.config.ts`
- **Output**: `public/widgets/widgets.es.js` and `public/widgets/widgets.iife.js`

```html
<script src="/widgets/widgets.iife.js"></script>
<div data-widget="greeting"></div>
```

## � Docker Deployment

### Using Docker/Podman

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or with Podman Compose
podman-compose up --build

# Development mode with hot reload
docker-compose --profile dev up

# Production mode only
docker-compose up portfolio
```

### Volume Mounts

The Docker setup includes volume mounts for easy customization:

- `./src/content:/app/content` - Configuration and content files
- `./src/content/articles:/app/articles` - Articles content
- `./public/custom-defaults.json:/app/custom-config/custom-defaults.json` - Custom configuration

### Environment Variables

- `NODE_ENV=production` - Production mode
- `NEXT_TELEMETRY_DISABLED=1` - Disable Next.js telemetry

## �🚀 Deploy to GitHub Pages

1. Build static export:

   ```bash
   npm run build:pages
   ```

2. Generate docs folder:

   ```bash
   npm run export:docs
   ```

   Or run both: `npm run pages:publish`

3. Push to `main` branch and enable GitHub Pages → Deploy from Branch → Branch: `main`, Folder: `/docs`

4. For custom repo names, set `NEXT_PUBLIC_BASE_PATH=/your-repo` when building

## 📋 Notes

- **GitHub Pages**: API routes and server-side PDF export disabled (UI handles gracefully)
- **Theme System**: CSS variables ensure readable contrast across all themes
- **Performance**: Optimized builds with Next.js 15 and static generation
- **Browser Support**: Modern browsers with CSS Grid and Custom Properties
