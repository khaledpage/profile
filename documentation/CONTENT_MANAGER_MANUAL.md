# Content Manager Manual

## Overview

This manual provides comprehensive guidance for managing content, configuration, and customization of the portfolio website. The system uses a combination of JSON configuration files, Markdown content, and a dynamic settings panel.

## 📁 File Structure

```
src/content/
├── config.json          # Main application configuration
├── hero.json           # Hero section content
├── projects.json       # Project portfolio data
├── skills.json         # Skills and technologies
├── contact.json        # Contact information
└── articles/           # Article content folder
    ├── article-slug/
    │   ├── article.md     # Article content (Markdown)
    │   ├── metadata.json  # Article metadata
    │   └── assets/        # Article images and files
    └── ...

public/
└── custom-defaults.json # Optional: Override configuration
```

## ⚙️ Configuration Management

### Main Configuration (config.json)

The primary configuration file controls all aspects of the website:

```json
{
  "colorProfile": "mintGreenLight",
  "i18n": {
    "defaultLocale": "en",
    "languages": {
      "en": { "navigation": {...}, "common": {...} },
      "de": { "navigation": {...}, "common": {...} }
    }
  },
  "skillsDisplay": { "design": "grid" },
  "settings": {
    "enabled": true,
    "showIcon": true,
    "allowThemeChange": true,
    "cookieConsent": true
  },
  "animation": { "enabled": true },
  "paletteGroups": {...}
}
```

#### Key Configuration Sections:

**Color Theming:**
- `colorProfile`: Active theme name
- `paletteGroups`: Organized theme collections (dark, light, vibrant)

**Internationalization:**
- `defaultLocale`: Default language (en/de)
- `languages`: Translation objects for each language

**Skills Display:**
- `design`: Layout type (grid, marquee, carousel, masonry, timeline)

**Settings Panel:**
- `enabled`: Show/hide settings functionality
- `showIcon`: Display settings icon
- `allowThemeChange`: Enable theme switching

### Custom Defaults Override

Create `public/custom-defaults.json` to override any base configuration:

```json
{
  "colorProfile": "oceanBlueDark",
  "i18n": { "defaultLocale": "de" },
  "settings": { "enabled": false },
  "animation": { "enabled": false }
}
```

## 🎨 Theme Management

### Available Theme Groups:

1. **Dark Themes**: Professional dark color schemes
   - indigoPurpleDark, oceanBlueDark, emeraldForestDark, etc.

2. **Light Themes**: Clean light color schemes  
   - cloudWhite, warmCream, softBlue, mintGreenLight, etc.

3. **Vibrant Themes**: High-contrast colorful themes
   - neonCyan, hotPink, electricBlue, etc.

### Adding New Themes:

```json
"paletteGroups": {
  "dark": {
    "name": "Dark Themes",
    "palettes": {
      "yourThemeName": {
        "name": "Your Theme Display Name",
        "background": "#0a0b14",
        "foreground": "#e8e9f2", 
        "muted": "#9ca0b3",
        "card": "#0f1118",
        "cardContrast": "#14161f",
        "accent1": "#7c3aed",
        "accent2": "#4338ca"
      }
    }
  }
}
```

## 🌍 Language Management

### Adding New Languages:

1. Add language to config.json:
```json
"languages": {
  "fr": {
    "navigation": {
      "home": "Accueil",
      "about": "À propos",
      "projects": "Projets",
      "skills": "Compétences",
      "articles": "Articles",
      "contact": "Contact"
    },
    "common": {
      "home": "Accueil",
      "back": "Retour",
      "liveView": "Voir en direct",
      "downloadSettings": "Télécharger les paramètres",
      "colorThemes": "Thèmes de couleur",
      "language": "Langue",
      "skillsLayout": "Disposition des compétences",
      "enableAnimations": "Activer les animations"
    },
    "cta": {
      "talk": "Parlons"
    }
  }
}
```

2. Update browser language detection in `src/utils/i18n.ts` if needed

### Translation Structure:

- **navigation**: Menu items and navigation labels
- **common**: Shared UI text (buttons, labels, actions)
- **cta**: Call-to-action text
- **hero**: Hero section content (stored in hero.json)

## 📊 Skills Management

### Skills Configuration (skills.json):

```json
{
  "groups": [
    {
      "title": "Frontend Development",
      "direction": "left",
      "speed": 50,
      "items": [
        {
          "name": "React",
          "level": "Expert",
          "years": 5,
          "description": "Building complex web applications",
          "tags": ["JavaScript", "Hooks", "Context"],
          "link": "https://reactjs.org"
        }
      ]
    }
  ]
}
```

### Skill Display Layouts:

1. **Grid**: Static grid layout
2. **Marquee**: Scrolling horizontal animation
3. **Carousel**: Interactive slide-through
4. **Masonry**: Pinterest-style layout
5. **Timeline**: Chronological display

## � Workflow Section Management

### Overview

The WorkflowSection component displays an interactive visualization of the development process from idea to business value. This section motivates visitors to engage by showing the systematic approach to project development.

### Component Features:

- **Interactive Steps**: 5-stage workflow (Idea → Concept → Development → Achievement → Business Impact)
- **Responsive Design**: Horizontal layout for desktop, vertical for mobile
- **Expandable Details**: Click any step to see detailed information
- **Visual Indicators**: Color-coded steps with progress indicators
- **Call-to-Action**: Integrated contact encouragement

### Customizing Workflow Steps:

Edit `src/components/sections/WorkflowSection.tsx` to modify:

```typescript
const workflowSteps = [
  {
    id: 'idea',
    icon: '💡',
    title: 'Your Idea',
    description: 'Share your vision, challenge, or business concept',
    color: 'var(--accent-1)',
    details: [
      'Business problem identification',
      'Market opportunity analysis',
      // Add more details as needed
    ]
  },
  // ... other steps
];
```

### Styling Customization:

The component uses CSS-in-JS with theme variables:
- Uses `var(--accent-1)`, `var(--accent-2)` for theming
- Responsive breakpoints with `lg:` prefixes
- Glass morphism effects with `glass` class
- Smooth animations with CSS transitions

### Adding/Removing Steps:

1. **Add Step**: Insert new step object in `workflowSteps` array
2. **Remove Step**: Delete step object and update grid classes
3. **Reorder**: Change array order to modify workflow sequence

### Integration:

The WorkflowSection is automatically included in the homepage layout between ArticlesSection and ContactSection. To move or remove:

1. Edit `src/app/page.tsx`
2. Adjust component placement or remove import/usage

## �📝 Article Management

### Creating New Articles:

1. **Create folder**: `src/content/articles/your-article-slug/`

2. **Add metadata.json**:
```json
{
  "title": "Your Article Title",
  "summary": "Brief description",
  "publishDate": "2024-01-15",
  "lastModified": "2024-01-15",
  "author": "Your Name",
  "tags": ["react", "typescript"],
  "category": "tutorial",
  "featured": false,
  "coverImage": "/articles/your-article-slug/cover.jpg",
  "seo": {
    "metaDescription": "SEO description",
    "keywords": ["react", "tutorial", "typescript"]
  }
}
```

3. **Write article.md**:
```markdown
# Your Article Title

Introduction paragraph...

## Section Heading

Content with LaTeX support: $E = mc^2$

Display math:
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

![Description](./assets/image.jpg)
```

4. **Add assets**: Place images in `assets/` subfolder

### Downloading Articles as ZIP (Admin)

- When Admin mode is enabled and allowed in `config.json` (`admin.allowZipDownload = true`), each article card shows a "Download ZIP" button.
- The downloaded archive contains:
  - `article.md`
  - `metadata.json`
  - `assets/` (if any)

Note: In static builds (GitHub Pages), the ZIP is assembled client-side from published JSON and assets.

### Uploading Articles as ZIP (Admin)

- On the Articles page, Admins can upload one or more `.zip` files when `admin.allowZipUpload = true`.
- Each ZIP should contain an article folder or files with at least:
  - `metadata.json` (required)
  - `article.md` (required)
  - `assets/` (optional)
- After upload, the app produces a merged `imported-articles.zip` that groups uploaded articles by slug. Extract it into `src/content/articles/` locally and rebuild:

```text
src/content/articles/
  your-article-slug/
    article.md
    metadata.json
    assets/
```

This ensures the build script (`scripts/build-static-content.js`) copies assets to `public/articles/<slug>/assets/` and writes JSON under `public/data/articles/<slug>.json`.

### Article Features:

- **LaTeX Support**: Inline `$...$` and display `$$...$$` math
- **Local Assets**: Reference images as `./assets/filename.jpg`
- **Code Highlighting**: Automatic syntax highlighting for code blocks
- **SEO Optimization**: Automatic meta tags and OpenGraph
- **Reading Mode**: Enhanced typography for article viewing

## 🚀 Project Management

### Projects Configuration (projects.json):

```json
{
  "projects": [
    {
      "id": "project-id",
      "title": "Project Name",
      "description": "Brief description",
      "longDescription": "Detailed description",
      "techStack": ["React", "TypeScript", "Node.js"],
      "features": ["Feature 1", "Feature 2"],
      "challenges": ["Challenge 1", "Challenge 2"],
      "metrics": {
        "users": "10K+",
        "performance": "95%",
        "uptime": "99.9%"
      },
      "gallery": {
        "hero": "/images/projects/hero.jpg",
        "thumbnails": ["/images/projects/thumb1.jpg"]
      },
      "links": {
        "live": "https://example.com",
        "repo": "https://github.com/user/repo"
      },
      "featured": true,
      "status": "completed"
    }
  ]
}
```

## 🔧 Advanced Configuration

### Settings Panel Control:

```json
"settings": {
  "enabled": true,           // Show settings functionality
  "showIcon": true,          // Display settings icon
  "allowThemeChange": true,  // Enable theme switching
  "cookieConsent": true      // Require consent for storage
}
```

  ### Admin Role and Feature Flags

  Add to `config.json` to control Admin features:

  ```json
  "admin": {
    "enabledByDefault": true,
    "allowToggle": true,
    "allowZipDownload": true,
    "allowZipUpload": true
  },
  "settings": { "adminOnly": false }
  ```

  Notes:

  - Admin mode can be toggled in the Settings panel (if `allowToggle` is true).
  - If `settings.adminOnly` is true, the Settings icon appears only for Admins.

### Animation Control:

```json
"animation": {
  "enabled": true,
  "fadeOutDurationSec": 3,
  "fadeInAfterSec": 2
}
```

### Cookie Consent:

```json
"cookieConsent": {
  "enabled": true,
  "categories": ["necessary", "analytics", "preferences"]
}
```

## 📱 Responsive Configuration

All themes automatically adapt to:
- Mobile devices (320px+)
- Tablets (768px+) 
- Desktop (1024px+)
- Large screens (1280px+)

## 🔄 Deployment Workflow

### Development:
```bash
npm run dev
```

### Production Build:
```bash
npm run build
```

### GitHub Pages:
```bash
npm run pages:publish
```

### Docker:
```bash
docker-compose up --build
```

## 🐛 Troubleshooting

### Common Issues:

1. **Articles not showing**: Check article metadata.json format
2. **Themes not working**: Verify paletteGroups structure
3. **Translations missing**: Ensure all required keys exist
4. **Images not loading**: Check asset paths and file existence

### Debug Mode:

Enable detailed logging by setting:
```bash
NODE_ENV=development
```

## 📊 Performance Tips

1. **Optimize images**: Use WebP format when possible
2. **Minimize config**: Remove unused themes and languages
3. **Article assets**: Keep images under 1MB
4. **Translation coverage**: Only include needed languages

## 🔐 Security Considerations

1. **Cookie consent**: Required for EU compliance
2. **Content validation**: Sanitize user-generated content
3. **Asset security**: Validate image uploads
4. **Configuration**: Avoid sensitive data in JSON files

---

*This manual covers all aspects of content management. For technical implementation details, see TECHNICAL_DOCUMENTATION.md*
