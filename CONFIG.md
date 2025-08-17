# Configuration Documentation

## Overview

The portfolio configuration has been split into two files for better organization and maintainability:

- `ui.config.json` - UI/interface configuration
- `content.config.json` - Content and data configuration

## Configuration Files

### ui.config.json

Contains all UI-related settings:

- **Language**: Current language setting (`en`/`de`)
- **Theme**: Active theme and layout configuration
- **Sections**: Enable/disable sections and their features
- **Animations**: Animation settings
- **Layout**: Navigation and layout options

```json
{
  "language": "en",
  "theme": {
    "active": "monochrome-light",
    "layout": "modern"
  },
  "sections": {
    "hero": { "enabled": true, ... },
    "about": { "enabled": true, ... },
    ...
  },
  "animations": { ... },
  "layout": { ... }
}
```

### content.config.json

Contains all content and data:

- **Site**: SEO and metadata
- **Personal**: Profile information and social links
- **Content**: Multilingual content for all sections

```json
{
  "site": {
    "title": "...",
    "description": "...",
    "keywords": [...],
    ...
  },
  "personal": {
    "name": "...",
    "email": "...",
    "social": [...],
    ...
  },
  "content": {
    "en": { ... },
    "de": { ... }
  }
}
```

## Usage

The configuration files are automatically loaded and combined in `lib/config.ts`:

```typescript
import { uiConfig, contentConfig, config } from '@/lib/config';

// Use split configs
const theme = uiConfig.theme.active;
const siteTitle = contentConfig.site.title;

// Or use combined config (backward compatibility)
const language = config.ui.language;
```

## Benefits

1. **Separation of Concerns**: UI settings are separate from content
2. **Better Organization**: Easier to locate and modify specific settings
3. **Team Collaboration**: Designers can focus on UI config, content teams on content config
4. **Maintainability**: Smaller, focused configuration files
5. **Backward Compatibility**: Existing code continues to work unchanged

## Migration

The old `config.json` has been backed up as `config.json.backup`. All existing functionality remains unchanged due to the backward compatibility layer in `lib/config.ts`.
