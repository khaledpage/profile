# Language Configuration Guide

This portfolio supports 4 languages: English, German, Arabic, and Turkish. You can easily enable or disable any language using the configuration system.

## How to Enable/Disable Languages

### Quick Method
Edit the `language.config.json` file in the project root:

```json
{
  "languages": {
    "en": { "enabled": true },   // English (always keep enabled)
    "de": { "enabled": true },   // German
    "ar": { "enabled": false },  // Arabic (disabled)
    "tr": { "enabled": true }    // Turkish
  }
}
```

### Examples

**To disable Arabic:**
```json
"ar": { "enabled": false }
```

**To enable Arabic:**
```json
"ar": { "enabled": true }
```

**To disable Turkish:**
```json
"tr": { "enabled": false }
```

## Current Language Status

| Language | Code | Status | RTL Support |
|----------|------|--------|-------------|
| English  | en   | ✅ Enabled (Default) | No |
| German   | de   | ✅ Enabled | No |
| Arabic   | ar   | ❌ Disabled | Yes |
| Turkish  | tr   | ✅ Enabled | No |

## Features

### ✅ **Language Activation System**
- **Easy Configuration**: Edit one JSON file to enable/disable languages
- **Automatic Fallback**: Disabled languages automatically fall back to English
- **Browser Detection**: Only detects enabled languages from browser settings
- **Storage Validation**: Won't store preferences for disabled languages

### ✅ **Smart Language Switching**
- **UI Updates**: Language switcher only shows enabled languages
- **Graceful Handling**: Prevents switching to disabled languages
- **Warning Messages**: Console warnings when attempting to use disabled languages

### ✅ **RTL Support**
- **Arabic Support**: Automatic right-to-left layout when Arabic is enabled
- **CSS Direction**: Document direction and language attributes set automatically
- **Font Loading**: Arabic fonts loaded only when Arabic is enabled

## Important Notes

1. **English Must Stay Enabled**: English serves as the fallback language and should never be disabled
2. **Restart Required**: After changing language settings, restart the development server
3. **Build Impact**: Disabled languages still get included in the build but won't be accessible via UI

## Technical Details

### Files Involved
- `language.config.json` - Main configuration file
- `lib/languages.ts` - Language detection and management
- `lib/contentLoader.ts` - Content loading with language validation
- `components/LanguageSwitcher.tsx` - UI component for language switching

### How It Works
1. **Configuration Loading**: Language settings loaded from `language.config.json`
2. **Runtime Filtering**: Only enabled languages appear in the UI
3. **Automatic Fallback**: Disabled languages redirect to English content
4. **Browser Detection**: Only enabled languages are detected from browser settings

## Troubleshooting

**Language switcher not showing a language?**
- Check if the language is enabled in `language.config.json`
- Restart the development server after changes

**Getting fallback to English message?**
- This is normal when accessing disabled languages
- Check console for warning messages

**RTL layout not working for Arabic?**
- Make sure Arabic is enabled in the configuration
- RTL styles are only applied when Arabic is the active language

## Future Enhancements

- **Dynamic Loading**: Load only enabled language files to reduce bundle size
- **Admin Interface**: Web UI for enabling/disabling languages
- **Language Analytics**: Track which languages are most used
