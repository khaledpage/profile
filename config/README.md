# Configuration Directory

This directory contains all configuration files and content for the portfolio website.

## Structure

```
/config/
├── ui.config.json              # UI settings (theme, sections, animations, layout)
├── content.config.json         # Site metadata, personal info, SEO configuration
├── language.config.json        # Language activation settings
├── content/                    # Content directory
│   ├── en.json                 # English content
│   ├── de.json                 # German content  
│   ├── ar.json                 # Arabic content
│   ├── tr.json                 # Turkish content
│   └── csm_Khaled_Alabsi_Portraet_6d491f1c81.jpg  # Profile image
└── README.md                   # This documentation
```

## Configuration Files

### ui.config.json
Contains all UI-related configuration:
- Language settings
- Theme configuration
- Section visibility settings
- Animation preferences
- Layout options

### content.config.json
Contains content and metadata configuration:
- Site metadata (title, description, keywords)
- Personal information (name, role, contact info)
- SEO configuration (structured data, social links)
- Font configuration

### language.config.json
Controls which languages are available in the application.

### content/ directory
Contains:
- Language-specific content files (JSON format)
- Profile image and other content assets

## Usage

These configurations are automatically loaded by:
- `lib/config.ts` - Loads UI and content configurations
- `lib/layoutConfig.ts` - Provides layout-specific configuration
- `lib/contentLoader.ts` - Loads language-specific content

## Benefits of This Structure

1. **Separation of Concerns**: UI settings are separate from content
2. **Content Organization**: All content (text + images) in one place
3. **Easy Configuration**: Clear distinction between different types of settings
4. **Maintainability**: Easier to update specific aspects without affecting others
5. **Type Safety**: Strong TypeScript interfaces for all configurations
