# Multilingual Content Structure

This project now supports a structured, multilingual content organization where each UI section has its own content folder with language-specific files.

## Content Structure

```
config/content/
├── inspiration/              # Featured articles section
│   ├── automated-reporting/
│   │   ├── en.json          # English metadata
│   │   ├── de.json          # German metadata
│   │   ├── tr.json          # Turkish metadata
│   │   ├── ar.json          # Arabic metadata
│   │   ├── en.html          # English article content
│   │   ├── de.html          # German article content
│   │   ├── metadata.json    # Fallback metadata (legacy)
│   │   └── article.html     # Fallback content (legacy)
│   ├── inventory-management/
│   │   ├── en.json
│   │   ├── de.json
│   │   └── ...
│   └── ...
├── hero/                    # Hero section content (planned)
├── about/                   # About section content (planned)
├── experience/              # Experience section content (planned)
├── motivation/              # Motivation section content (planned)
├── process/                 # Process section content (planned)
├── contact/                 # Contact section content (planned)
├── navigation/              # Navigation content (planned)
├── common/                  # Common/shared content (planned)
├── en.json                  # Legacy language files
├── de.json
├── tr.json
└── ar.json
```

## Article Structure

### Metadata Format (`[lang].json`)

Each article metadata file contains:

```json
{
  "id": "article-id",
  "title": "Article Title",
  "description": "Article description",
  "shortDescription": "Short summary",
  "benefits": ["Benefit 1", "Benefit 2"],
  "icon": "📊",
  "actionText": "Call to action",
  "category": "Category Name",
  "tags": ["tag1", "tag2"],
  "readTime": "5 min read",
  "difficulty": "Intermediate",
  "impact": "High",
  "publishDate": "2025-08-19",
  "author": "Author Name",
  "featured": true,
  "order": 1
}
```

### Content Format (`[lang].html`)

Each article content file contains complete HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article Title</title>
</head>
<body>
    <article class="featured-article">
        <header class="article-header">
            <div class="category-badge">Category</div>
            <h1>Article Title</h1>
            <p class="article-subtitle">Subtitle</p>
            <div class="article-meta">
                <span class="read-time">5 min read</span>
                <span class="difficulty">Intermediate</span>
                <span class="impact">High Impact</span>
            </div>
        </header>
        
        <section class="article-content">
            <!-- Article content here -->
        </section>
    </article>
</body>
</html>
```

## Build Process

1. **Generate Articles**: `npm run generate-articles`
   - Scans all article folders
   - Loads language-specific files for en, de, tr, ar
   - Falls back to legacy `metadata.json` and `article.html` if language files don't exist
   - Generates `lib/generatedFeaturedArticles.ts` with multilingual data

2. **Build**: `npm run build`
   - Automatically runs `generate-articles`
   - Builds the Next.js application with generated article data

## Language Support

- **English (en)**: Primary language
- **German (de)**: Full translation support
- **Turkish (tr)**: Full translation support  
- **Arabic (ar)**: Full translation support with RTL layout

## Fallback System

The system includes a robust fallback mechanism:

1. Try to load `[lang].json` and `[lang].html`
2. If not found, fall back to `metadata.json` and `article.html`
3. If neither exists, skip the article for that language
4. At runtime, if requested language articles don't exist, fall back to English

## Usage in Components

```typescript
import { loadFeaturedArticles } from '../lib/generatedFeaturedArticles';

// Load articles for specific language
const articlesData = await loadFeaturedArticles('de'); // German articles
const articlesData = await loadFeaturedArticles('en'); // English articles
const articlesData = await loadFeaturedArticles();     // Default to English
```

## Adding New Articles

1. Create new folder in `config/content/inspiration/`
2. Add language-specific files:
   - `en.json` and `en.html` (required)
   - `de.json` and `de.html` (optional)
   - `tr.json` and `tr.html` (optional)
   - `ar.json` and `ar.html` (optional)
3. Run `npm run generate-articles` to regenerate
4. Articles will automatically appear in the application

## Migration Status

- ✅ **Articles**: Fully migrated to multilingual system
- 🔄 **Other UI Sections**: Planned for future implementation
- ✅ **Build System**: Updated for multilingual support
- ✅ **Static Generation**: Compatible with static builds
