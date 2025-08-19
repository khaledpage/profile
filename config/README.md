# Configuration Directory

This directory contains all configuration files and assets for the portfolio website, organized for better maintainability.

## Files

### Configuration Files
- **`config.json`** - Main configuration file containing:
  - UI settings (theme, sections, animations)
  - Site metadata (title, description, SEO keywords)
  - Personal information (name, contact, social links)

- **`content.config.json`** - Legacy content configuration (can be removed as content is now in `/content/` language files)

- **`language.config.json`** - Language activation settings
  - Controls which languages are available
  - Fallback configuration

### Assets
- **`csm_Khaled_Alabsi_Portraet_6d491f1c81.jpg`** - Profile image
  - Also copied to `/public/assets/` for web serving
  - Used for SEO meta tags and social media previews

## Why This Organization?

1. **Centralized Configuration**: All settings in one place
2. **Version Control**: Easy to track configuration changes
3. **Asset Management**: Profile image stored with configuration
4. **Clear Separation**: UI/content configuration separate from code

## SEO Benefits

The main config includes enhanced keywords for "Khaled Alabsi" searches:
- Personal name variations
- Professional titles
- Location-based keywords
- Technology expertise
- Service offerings

## Usage

Most components import configuration from `/lib/config.ts` which reads from these files.

To modify:
1. Edit the relevant JSON file
2. The changes will be reflected after restart/rebuild
3. No code changes needed for content updates
