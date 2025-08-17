# Personal Portfolio Website

A modern, responsive portfolio website built with Next.js featuring multilingual support, dynamic theming, and animated backgrounds. Fully configurable through a single JSON file.

## ✨ Features

- **🎨 14 Built-in Themes** - Dark, light, monochrome, and retro color schemes
- **🌍 Multilingual Support** - English and German translations
- **⚡ Dynamic Configuration** - All content and UI elements configurable via JSON
- **🎭 Animated Backgrounds** - 5 different animation types (particles, gradients, matrix rain, etc.)
- **📱 Fully Responsive** - Optimized for mobile, tablet, and desktop
- **🚀 Static Export Ready** - Pre-configured for GitHub Pages deployment
- **⚙️ Modular Sections** - Enable/disable any section independently
- **🎯 Modern Design** - Clean, professional UI with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khaledpage/profile.git
   cd profile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run export` | Build and export static files for GitHub Pages |

## 🎨 Theme Configuration

### Changing the Active Theme

Edit `config.json` to change the active theme:

```json
{
  "ui": {
    "theme": {
      "active": "arctic-minimal",
      "layout": "modern"
    }
  }
}
```

### Available Themes

#### Dark Themes
- `midnight-gradient` - Deep blue gradient with purple accents
- `deep-ocean` - Ocean depths with cyan highlights  
- `cosmic-purple` - Purple cosmic theme with neon accents
- `neon-cyber` - Cyberpunk neon with bright colors

#### Light Themes
- `arctic-minimal` - Clean white with blue accents
- `warm-sand` - Warm beige with orange highlights
- `soft-lavender` - Light purple with gentle tones

#### Monochrome Themes
- `classic-mono` - Pure black and white
- `high-contrast` - Maximum contrast for accessibility
- `monochrome-dark` - Dark monochrome with subtle grays
- `monochrome-light` - Light monochrome theme

#### Retro Themes
- `retro-neon` - 80s synthwave style
- `synthwave` - Vaporwave aesthetics
- `sunset-vibes` - Warm sunset colors
- `forest-earth` - Natural green tones
- `royal-gold` - Elegant gold and black

### Creating Custom Themes

Add a new theme to `lib/themes.ts`:

```typescript
export const themes = {
  "my-custom-theme": {
    name: "My Custom Theme",
    colors: {
      primary: "#your-primary-color",
      secondary: "#your-secondary-color",
      accent: "#your-accent-color",
      background: "linear-gradient(135deg, #color1 0%, #color2 100%)",
      surface: "rgba(255, 255, 255, 0.05)",
      text: "#ffffff",
      textSecondary: "#94a3b8",
      border: "rgba(255, 255, 255, 0.1)",
      gradient: "linear-gradient(135deg, #color1 0%, #color2 100%)"
    },
    fonts: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif"
    },
    effects: {
      glass: "backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.05);",
      shadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      blur: "blur(10px)"
    }
  }
};
```

## 🌍 Language & Translation Configuration

### Switching Default Language

Change the default language in `config.json`:

```json
{
  "ui": {
    "language": "en"  // or "de" for German
  }
}
```

### Adding New Translations

Update the `content` section in `config.json`:

```json
{
  "content": {
    "en": {
      "hero": {
        "greeting": "Hello, I'm",
        "name": "Your Name",
        // ... other content
      }
    },
    "de": {
      "hero": {
        "greeting": "Hallo, ich bin",
        "name": "Ihr Name",
        // ... other content
      }
    },
    "fr": {  // Add new language
      "hero": {
        "greeting": "Bonjour, je suis",
        "name": "Votre Nom",
        // ... other content
      }
    }
  }
}
```

## ⚙️ UI Configuration

### Section Management

Enable or disable sections in `config.json`:

```json
{
  "ui": {
    "sections": {
      "hero": { "enabled": true },
      "about": { "enabled": true },
      "experience": { "enabled": false },  // Disable this section
      "motivation": { "enabled": true },
      "process": { "enabled": true },
      "contact": { "enabled": true }
    }
  }
}
```

### Animation Settings

Control animations globally:

```json
{
  "ui": {
    "animations": {
      "enabled": true,
      "backgroundParticles": true,
      "textAnimations": true,
      "hoverEffects": true,
      "scrollAnimations": true
    }
  }
}
```

### Layout Options

Customize layout elements:

```json
{
  "ui": {
    "layout": {
      "showNavigation": true,
      "stickyNav": true,
      "showFooter": true,
      "containerMaxWidth": "7xl"  // Options: xl, 2xl, 4xl, 6xl, 7xl
    }
  }
}
```

## 📝 Content Configuration

### Personal Information

Update your personal details:

```json
{
  "personal": {
    "name": "Your Name",
    "role": "Your Title",
    "tagline": "Your Professional Tagline",
    "email": "your.email@example.com",
    "phone": "+1234567890",
    "location": "Your Location",
    "image": "/assets/your-photo.jpg",
    "resume": "/assets/your-resume.pdf",
    "social": [
      {
        "platform": "GitHub",
        "icon": "Github",
        "url": "https://github.com/yourusername"
      }
    ]
  }
}
```

### Site Metadata

Configure SEO and site information:

```json
{
  "site": {
    "title": "Your Name - Portfolio",
    "description": "Your professional description",
    "url": "https://yourusername.github.io/repository-name",
    "author": "Your Name",
    "keywords": ["developer", "portfolio", "web development"],
    "favicon": "/favicon.ico"
  }
}
```

## 🚀 Deployment

### GitHub Pages Deployment

1. **Update repository settings in `config.json`:**
   ```json
   {
     "site": {
       "url": "https://khaledpage.github.io/profile"
     }
   }
   ```

2. **Update `next.config.js` with your repository name:**
   ```javascript
   const nextConfig = {
     assetPrefix: process.env.NODE_ENV === 'production' ? '/profile' : '',
     basePath: process.env.NODE_ENV === 'production' ? '/profile' : '',
   }
   ```

3. **Build and export:**
   ```bash
   npm run export
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

5. **Configure GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "Deploy from a branch"
   - Select "main" branch and "/docs" folder
   - Save settings

6. **Access your site:**
   Your portfolio will be available at: `https://khaledpage.github.io/profile`

### Other Deployment Options

#### Vercel
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Deploy automatically on push

#### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build && npm run export`
3. Set publish directory: `docs`
4. Deploy automatically on push

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── About.tsx         # About section
│   ├── Hero.tsx          # Hero section
│   ├── Nav.tsx           # Navigation
│   └── ...               # Other components
├── lib/                  # Utility libraries
│   ├── config.ts         # Configuration loader
│   └── themes.ts         # Theme definitions
├── public/               # Static assets
│   ├── assets/          # Images, PDFs, etc.
│   └── favicon.ico      # Site favicon
├── docs/                 # GitHub Pages build output
├── config.json          # Main configuration file
└── next.config.js       # Next.js configuration
```

## 🔧 Customization

### Adding New Sections

1. Create a new component in `/components/`
2. Import and use it in `app/page.tsx`
3. Add section configuration to `config.json`
4. Add content translations for the section

### Modifying Animations

Edit animation settings in:
- `components/AnimatedBackground.tsx` - Background animations
- `app/globals.css` - CSS animations and transitions
- Individual components for specific animations

### Custom Styling

- **Global styles:** `app/globals.css`
- **Component styles:** Tailwind classes in component files
- **Theme variables:** `lib/themes.ts`

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading on GitHub Pages:**
   - Check that paths in `config.json` start with `/assets/`
   - Ensure images are in the `public/assets/` directory

2. **Theme not applying:**
   - Verify theme name exists in `lib/themes.ts`
   - Check browser console for errors
   - Clear browser cache

3. **Build failures:**
   - Run `npm run lint` to check for code issues
   - Ensure all imported files exist
   - Check that `config.json` has valid JSON syntax

### Getting Help

- Check the [Issues](https://github.com/khaledpage/profile/issues) page
- Review the configuration examples above
- Ensure all required dependencies are installed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/khaledpage/profile/issues).

---

Built with ❤️ using Next.js, React, and Tailwind CSS