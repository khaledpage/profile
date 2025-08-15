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

### 🛠 **API Routes (`src/app/api/`)**

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
- **Purpose**: User preferences management
- **Functionality**:
  - Theme switching
  - Cookie consent management
  - Animation toggles
  - Language selection
  - Persistent storage
- **Storage**: localStorage with cookie consent

##### **`src/components/ui/CookieConsent.tsx`**
- **Purpose**: GDPR cookie consent banner
- **Functionality**:
  - Cookie category management
  - Consent preferences
  - Legal compliance
  - Event-driven updates
- **Categories**: Necessary, Analytics, Preferences, Marketing

##### **`src/components/ThemeController.tsx`**
- **Purpose**: Global theme management
- **Functionality**:
  - CSS custom property manipulation
  - Theme persistence
  - Animation control
  - Color profile switching
- **Themes**: Multiple color schemes available

### 📊 **Content Management (`src/content/`)**

#### **Configuration Files**
- **`config.json`**: Main application configuration
- **`hero.json`**: Hero section content
- **`projects.json`**: Project portfolio data
- **`skills.json`**: Skills and technologies
- **`contact.json`**: Contact information

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

#### **`src/utils/content.ts`**
- **Purpose**: General content loading utilities
- **Functions**:
  - Configuration file loading
  - JSON parsing with validation
  - Error handling
- **Usage**: Hero, projects, skills content

#### **`src/utils/cookies.ts`**
- **Purpose**: Cookie consent management
- **Functions**:
  - `setCookieConsent()`: Store consent preferences
  - `getCookieConsent()`: Retrieve consent status
  - `canSavePreferences()`: Check storage permissions
  - `shouldShowCookieBanner()`: Banner visibility logic
- **Features**: Expiration handling, validation

#### **`src/utils/i18n.ts`**
- **Purpose**: Internationalization utilities
- **Functions**:
  - Language detection
  - Content localization
  - Fallback handling
- **Status**: Foundation for future i18n support

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

### File Watching
- Hot reload for code changes
- Content changes trigger regeneration
- CSS changes apply immediately

## 🔐 **Security & Privacy**

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
