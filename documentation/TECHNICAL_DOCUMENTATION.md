# Portfolio Application - Technical Documentation

## Application Architecture Overview

### Tech Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Build Tool**: Turbopack (development)
- **Package Manager**: npm
- **Deployment**: Static Generation (SSG)

## File Architecture

```
my-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/            # React Components
│   ├── content/              # Content Management
│   ├── data/                 # Static Data
│   ├── types/                # TypeScript Definitions
│   └── utils/                # Utility Functions
├── public/                   # Static Assets
└── configuration files
```

## Detailed File Structure & Responsibilities

### 🚀 **Core Application (`src/app/`)**

#### **`src/app/layout.tsx`**
- **Purpose**: Root layout component for the entire application
- **Functionality**: 
  - Global HTML structure
  - Theme provider setup
  - Font loading (Inter)
  - Meta tags and SEO configuration
- **Dependencies**: ThemeController, global CSS

#### **`src/app/page.tsx`**
- **Purpose**: Homepage component
- **Functionality**:
  - Hero section integration
  - Skills showcase
  - Articles preview
  - Project highlights
- **Components Used**: Hero, SkillsShowcase, ArticlesSection

#### **`src/app/globals.css`**
- **Purpose**: Global styling and design system
- **Features**:
  - CSS custom properties for theming
  - Component styling (glass effects, animations)
  - Reading theme for articles
  - Responsive design utilities
  - Dark/light mode support

### 📄 **Articles System (`src/app/articles/`)**

#### **`src/app/articles/page.tsx`**
- **Purpose**: Articles listing page
- **Functionality**:
  - Display all published articles
  - Category filtering
  - Search functionality
  - Pagination support
- **Data Source**: File-based content management

#### **`src/app/articles/[slug]/page.tsx`**
- **Purpose**: Individual article page
- **Functionality**:
  - Dynamic article rendering
  - Markdown + LaTeX processing
  - SEO metadata generation
  - Reading theme integration
  - PDF export capability
- **Features**: Static generation with `generateStaticParams`

### � **Projects System (`src/app/projects/`)**

#### **`src/app/projects/[slug]/page.tsx`**
- **Purpose**: Individual project detail page
- **Functionality**:
  - Loads project data from `src/content/projects.json`
  - Gallery with hero image and thumbnails
  - Tech stack chips and quick metrics
  - Features/challenges lists in a glass card
  - “See also” related projects
  - Fixed back button
  - Breadcrumbs: Home / Projects / {title}
- **Design**:
  - Theme-aware text using CSS variables (`--foreground`, `--muted`)
  - No Tailwind gray classes to preserve readability across themes

### �🛠 **API Routes (`src/app/api/`)**

#### **`src/app/api/articles/route.ts`**
- **Purpose**: Articles data API endpoint
- **Functionality**:
  - Serve article metadata and content
  - Filter published articles
  - Sort by publish date
- **Response**: JSON array of article objects

#### **`src/app/api/articles/[slug]/assets/[filename]/route.ts`**
- **Purpose**: Serve article assets (images, files)
- **Functionality**:
  - Dynamic asset serving
  - MIME type detection
  - Cache headers
  - Error handling for missing assets

#### **`src/app/api/articles/[slug]/pdf/route.ts`**
- **Purpose**: Generate PDF exports of articles
- **Functionality**:
  - Markdown to HTML conversion
  - LaTeX rendering with KaTeX
  - PDF generation using Puppeteer
  - Professional styling for print
- **Dependencies**: Puppeteer, KaTeX

#### **`src/app/api/hero-content/route.ts`**
- **Purpose**: Serve hero section content
- **Functionality**:
  - Dynamic content loading
  - Internationalization support
  - Content caching

### 🧩 **Components Architecture**

#### **Layout Components (`src/components/layout/`)**

##### **`src/components/layout/Header.tsx`**
- **Purpose**: Main navigation header
- **Functionality**:
  - Responsive navigation menu
  - Theme toggle
  - Settings access
  - Mobile hamburger menu
- **State Management**: Local state for menu toggle

#### **Section Components (`src/components/sections/`)**

##### **`src/components/sections/Hero.tsx`**
- **Purpose**: Homepage hero section
- **Functionality**:
  - Dynamic content loading from API
  - Animated particle effects
  - CTA buttons
  - Responsive design
- **Features**: Particle animation system

##### **`src/components/sections/ArticlesSection.tsx`**
- **Purpose**: Articles showcase on homepage
- **Functionality**:
  - Horizontal auto-scrolling layout
  - Featured article highlighting
  - Date-based sorting (newest first)
  - Hover pause animation
- **Features**: CSS animations, infinite scroll effect

##### **`src/components/sections/SkillsShowcase.tsx`**
- **Purpose**: Skills display component
- **Functionality**:
  - Dynamic skill loading
  - Category-based organization
  - Interactive design switching
- **Data Source**: `src/content/skills.json`

#### **UI Components (`src/components/ui/`)**

##### **`src/components/ui/ArticleCard.tsx`**
- **Purpose**: Article preview card
- **Functionality**:
  - Article metadata display
  - Featured article styling
  - Cover image optimization
  - Reading time estimation
- **Variants**: Regular and featured layouts

##### **`src/components/ui/ProjectCard.tsx`**
- **Purpose**: Project showcase card
- **Functionality**:
  - Project metadata display
  - Technology stack visualization
  - Link handling (external/internal)
  - Responsive image loading
  - Theme-aware colors using CSS variables

##### **`src/components/ui/MarkdownRenderer.tsx`**
- **Purpose**: Markdown and LaTeX rendering
- **Functionality**:
  - Markdown to HTML conversion
  - LaTeX math rendering with KaTeX
  - Code syntax highlighting
  - Image asset resolution
- **Dependencies**: KaTeX, custom markdown parser

##### **`src/components/ui/ReadingTheme.tsx`**
- **Purpose**: Reading mode for articles
- **Functionality**:
  - Theme switching for better readability
  - PDF download integration
  - Toggle controls
  - Optimized typography
- **Features**: CSS variable manipulation

##### **`src/components/ui/SettingsPanel.tsx`**
- **Purpose**: User preferences management with enhanced functionality
- **Functionality**:
  - Theme switching with live preview
  - Cookie consent management
  - Animation toggles with comprehensive control
  - Language selection with browser detection
  - **NEW**: Configuration download as JSON file
  - **NEW**: Comprehensive translation integration
  - Persistent storage with consent checking
- **Features**: 
  - **Enhanced**: Download current settings as custom-defaults.json
  - **Enhanced**: All UI text translatable through i18n system
  - **Enhanced**: Real-time theme and animation control
- **Storage**: localStorage with cookie consent validation

##### **`src/components/ui/CookieConsent.tsx`**
- **Purpose**: GDPR cookie consent banner
- **Functionality**:
  - Cookie category management
  - Consent preferences
  - Legal compliance
  - Event-driven updates
- **Categories**: Necessary, Analytics, Preferences, Marketing

##### **`src/components/ThemeController.tsx`**
- **Purpose**: Global theme management with enhanced animation control
- **Functionality**:
  - CSS custom property manipulation
  - Theme persistence with localStorage
  - **ENHANCED**: Animation control for all animated elements
  - **ENHANCED**: Uses querySelectorAll for comprehensive element targeting
  - Color profile switching with real-time updates
- **Features**:
  - **Fixed**: Animation toggle now controls both gradients and particles
  - **Enhanced**: Proper pause/resume for multiple animated elements
  - **Enhanced**: Show/hide functionality for particle effects
- **Control**: Global window.__themeController interface for cross-component access

### 📊 **Content Management (`src/content/`)**

#### **Configuration Files**
- **`config.json`**: Main application configuration with updated defaults
  - **Updated**: Default theme changed to "mintGreenLight"
  - **Updated**: Default language changed to "en" (English)
  - **Updated**: Default skills layout changed to "grid"
  - **Enhanced**: Expanded translation objects for comprehensive i18n support
- **`hero.json`**: Hero section content
- **`projects.json`**: Project portfolio data
- **`skills.json`**: Skills and technologies
- **`contact.json`**: Contact information
- **`custom-defaults.json`** (optional): Developer customization overrides
  - **New Feature**: Allows developers to override any base configuration
  - **Location**: `/public/custom-defaults.json`
  - **Usage**: Automatically loaded and merged with base config on startup
  - **Creation**: Can be generated via settings panel download feature

## 🔧 **Enhanced Configuration Management System**

### Custom Defaults Architecture
The application now supports a two-tier configuration system:

1. **Base Configuration** (`src/content/config.json`)
   - Default application settings
   - Comprehensive translation structure
   - Fallback values for all features

2. **Custom Defaults** (`/public/custom-defaults.json`) 
   - Developer-defined overrides
   - Downloaded from settings panel
   - Merged at runtime with base configuration
   - Enables per-deployment customization

### Configuration Loading Flow
1. **Startup**: Load base configuration from `src/content/config.json`
2. **Enhancement**: Attempt to fetch `/custom-defaults.json`
3. **Merging**: Overlay custom settings on base configuration
4. **Caching**: Cache merged configuration for performance
5. **Application**: Use merged configuration throughout app

### Browser Language Detection
- **Auto-detection**: Uses `navigator.language` API on first visit
- **Fallback Chain**: Checks language availability and falls back intelligently
- **Preference Storage**: Saves user language choice in localStorage
- **Precedence**: User selection > stored preference > browser language > default

### Translation System Enhancement
- **Comprehensive Coverage**: All UI text now translatable
- **Common Strings**: Shared translations in `config.common` object
- **Component Integration**: All components use translation hooks
- **Expandable Structure**: Easy to add new languages and text keys

#### **Articles (`src/content/articles/`)**
- **Structure**: Folder-based organization
- **Format**: `[slug]/article.md` + `metadata.json`
- **Assets**: `[slug]/assets/` for images and files
- **Features**: LaTeX support, code highlighting, SEO optimization

### 🔧 **Utilities (`src/utils/`)**

#### **`src/utils/articles.ts`**
- **Purpose**: Article content management
- **Functions**:
  - `getAllArticles()`: Load all article metadata
  - `getArticleBySlug()`: Load specific article with content
  - `generateStaticParams()`: Support for static generation
- **Features**: File system integration, metadata parsing

#### **`src/utils/custom-defaults.ts`**
- **Purpose**: Custom configuration management system
- **Functions**:
  - `loadCustomDefaults()`: Fetch custom-defaults.json from public folder
  - `mergeCustomDefaults()`: Overlay custom settings on base configuration
  - Client-side caching for performance optimization
- **Features**: Developer customization support, graceful fallback handling

#### **`src/utils/content.ts`**
- **Purpose**: General content loading utilities
- **Functions**:
  - `getSiteConfig()`: Enhanced with custom defaults integration
  - Configuration file loading with custom overlay support
  - JSON parsing with validation
  - Error handling
- **Usage**: Hero, projects, skills content with developer customization

#### **`src/utils/cookies.ts`**
- **Purpose**: Cookie consent management
- **Functions**:
  - `setCookieConsent()`: Store consent preferences
  - `getCookieConsent()`: Retrieve consent status
  - `canSavePreferences()`: Check storage permissions
  - `shouldShowCookieBanner()`: Banner visibility logic
- **Features**: Expiration handling, validation

#### **`src/utils/i18n.ts`**
- **Purpose**: Internationalization utilities with browser language detection
- **Functions**:
  - `useLanguage()`: Enhanced with automatic browser language detection
  - `getBrowserLanguage()`: Parse navigator.language API
  - Language availability checking with intelligent fallbacks
  - Content localization with localStorage persistence
- **Features**: Auto-detection, fallback chain, preference persistence

### 📱 **Type Definitions (`src/types/`)**

#### **`src/types/article.ts`**
- **Purpose**: Article-related TypeScript interfaces
- **Types**:
  - `Article`: Complete article object
  - `ArticleMetadata`: SEO and publication data
  - `ArticleContent`: Markdown content structure

#### **`src/types/content.ts`**
- **Purpose**: General content type definitions
- **Types**:
  - `UserPreferences`: Settings and theme preferences
  - `ProjectData`: Project portfolio structure
  - `SkillCategory`: Skills organization
  - `HeroContent`: Hero section data

## 🎨 **Design System**

### CSS Custom Properties
```css
:root {
  --background: #0a0b10;
  --foreground: #e7e7ea;
  --muted: #9aa0aa;
  --accent-1: #7c3aed;
  --accent-2: #4f46e5;
  --card: #0f1117;
  --card-contrast: #11131a;
}
```

### Component Patterns
- **Glass Effects**: `backdrop-filter: blur(12px)` with transparency
- **Color Mixing**: `color-mix(in srgb, var(--accent-1), transparent 10%)`
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Animations**: CSS animations with `animation-play-state` control

## 🔄 **Data Flow**

### Content Loading
1. **Static Generation**: Articles pre-rendered at build time
2. **API Routes**: Dynamic content served via Next.js API
3. **Client Hydration**: Interactive features activated on client

### State Management
1. **Local State**: React useState for component-level state
2. **Global State**: CSS custom properties for themes
3. **Persistent Storage**: localStorage for user preferences
4. **Event System**: Custom events for cross-component communication

### Cookie Consent Flow
1. **Initial Load**: Check existing consent in localStorage
2. **Banner Display**: Show if no consent found
3. **User Action**: Accept/decline with category selection
4. **Storage**: Save preferences with timestamp
5. **Application**: Enable/disable features based on consent

## 🚀 **Performance Optimizations**

### Static Generation
- All articles pre-rendered at build time
- Metadata extraction during build process
- Asset optimization with Next.js Image component

### Code Splitting
- Automatic route-based code splitting
- Component-level lazy loading where appropriate
- Dynamic imports for heavy features (PDF generation)

### Caching Strategy
- Static assets cached with long expiration
- API responses with appropriate cache headers
- Service worker for offline functionality (future)

## 🧪 **Development Workflow**

### Commands
- `npm run dev`: Development server with Turbopack
- `npm run build`: Production build
- `npm run start`: Production server
- `npm run lint`: ESLint validation
- `npm run build:pages`: Static export build (GitHub Pages)
- `npm run export:docs`: Assemble `docs/` from Next 15 build artifacts for manual GitHub Pages
- `npm run pages:publish`: Build and export to `docs/` in one step

### File Watching
- Hot reload for code changes
- Content changes trigger regeneration
- CSS changes apply immediately

## � **Recent Feature Implementations (2024)**

### Configuration Management System
- **Custom Defaults**: New `src/utils/custom-defaults.ts` utility for loading developer-specific overrides
- **Download Feature**: Settings panel now includes download button to export current configuration as JSON
- **Automatic Merging**: System automatically merges custom defaults with base configuration at startup
- **Developer Workflow**: Developers can download settings, save as `/public/custom-defaults.json`, and distribute

### Enhanced Internationalization
- **Browser Detection**: Automatic language detection using `navigator.language` API
- **Intelligent Fallbacks**: Smart fallback chain from browser language to available languages to default
- **Preference Persistence**: User language choices stored in localStorage with consent
- **Comprehensive Coverage**: All UI text now uses translation system including settings panel, navigation, common strings

### Animation System Improvements
- **Fixed Toggle Bug**: Animation toggle now properly controls all animated elements (gradients and particles)
- **Enhanced Targeting**: Uses `querySelectorAll` instead of `querySelector` for multiple element control
- **Comprehensive Control**: Properly pauses/resumes animations and shows/hides particle effects
- **Cross-Component**: Global `window.__themeController` interface for cross-component animation control

### Updated Application Defaults
- **Theme**: Changed default from dark indigo/purple to mint green light theme
- **Language**: Changed default from German to English for broader accessibility  
- **Skills Layout**: Changed default from marquee to grid for better readability
- **Enhanced UX**: Improved user experience with modern, accessible defaults

### Translation System Expansion
- **Common Strings**: Added `config.common` object for shared UI translations
- **Settings Panel**: Complete translation integration for all settings controls and labels
- **Navigation**: Back buttons, breadcrumbs, and navigation elements use translation system
- **Expandable Structure**: Easy addition of new languages and text keys

## �🔐 **Security & Privacy**

### Cookie Consent
- GDPR compliance with category-based consent
- Transparent data usage
- User control over data storage

### Content Security
- Sanitized markdown rendering
- Asset validation
- XSS prevention

## 📈 **SEO Optimization**

### Metadata Generation
- Dynamic meta tags for articles
- Open Graph support
- JSON-LD structured data (future)

### Static Generation
- Fast loading times
- Search engine friendly URLs
- Proper heading hierarchy

## 🔧 **Configuration**

### Environment Variables
- Build-time configuration
- API endpoints
- Feature flags


### Content Configuration
- JSON-based content management
- Internationalization ready
- Theme customization

## 📦 **Dependencies**

### Core Dependencies
- `next`: React framework
- `react`: UI library
- `typescript`: Type safety
- `tailwindcss`: Utility-first CSS

### Feature Dependencies
- `katex`: LaTeX math rendering
- `puppeteer`: PDF generation
- `lucide-react`: Icon library

### Development Dependencies
- `eslint`: Code linting
- `@types/*`: TypeScript definitions
- `postcss`: CSS processing

## 🚀 **Deployment**

### Build Process
1. TypeScript compilation
2. Static page generation
3. Asset optimization
4. Bundle analysis

### Output
- Static HTML files
- Optimized JavaScript bundles
- Compressed assets
- API routes as serverless functions

### Hosting Requirements
- Node.js 18+ for API routes
- Static file hosting
- CDN for global distribution

---

*This documentation is maintained alongside the codebase and updated with each major feature addition.*
