// Language management utilities
import languageConfig from '../language.config.json';

export type SupportedLanguage = 'en' | 'de' | 'ar' | 'tr';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
  enabled: boolean;
}

// Language activation configuration - controlled by language.config.json
export const LANGUAGE_SETTINGS: Record<SupportedLanguage, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
    enabled: languageConfig.languages.en.enabled,
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    flag: '🇩🇪',
    enabled: languageConfig.languages.de.enabled,
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
    enabled: languageConfig.languages.ar.enabled,
  },
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    direction: 'ltr',
    flag: '🇹🇷',
    enabled: languageConfig.languages.tr.enabled,
  },
};

// Get only enabled languages
export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = Object.fromEntries(
  Object.entries(LANGUAGE_SETTINGS).filter(([_, config]) => config.enabled)
) as Record<SupportedLanguage, LanguageConfig>;

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * Check if a language is enabled
 */
export function isLanguageEnabled(language: SupportedLanguage): boolean {
  return LANGUAGE_SETTINGS[language]?.enabled ?? false;
}

/**
 * Get all enabled languages
 */
export function getEnabledLanguages(): SupportedLanguage[] {
  return Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[];
}

/**
 * Detect browser language and return supported language code
 */
export function detectBrowserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const browserLang = navigator.language.toLowerCase();
  
  // Map browser languages to supported languages
  const languageMap: Record<string, SupportedLanguage> = {
    'en': 'en',
    'en-us': 'en',
    'en-gb': 'en',
    'de': 'de',
    'de-de': 'de',
    'de-at': 'de',
    'de-ch': 'de',
    'ar': 'ar',
    'ar-sa': 'ar',
    'ar-ae': 'ar',
    'ar-eg': 'ar',
    'tr': 'tr',
    'tr-tr': 'tr',
  };

  // Check exact match first
  const detectedLang = languageMap[browserLang];
  if (detectedLang && isLanguageEnabled(detectedLang)) {
    return detectedLang;
  }

  // Check language prefix (e.g., 'de' from 'de-ch')
  const langPrefix = browserLang.split('-')[0];
  const prefixLang = languageMap[langPrefix];
  if (prefixLang && isLanguageEnabled(prefixLang)) {
    return prefixLang;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Get or set language preference in localStorage
 */
export function getStoredLanguage(): SupportedLanguage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem('preferred-language');
    if (stored && Object.keys(SUPPORTED_LANGUAGES).includes(stored) && isLanguageEnabled(stored as SupportedLanguage)) {
      return stored as SupportedLanguage;
    }
  } catch (error) {
    console.warn('Failed to read language preference from localStorage:', error);
  }

  return null;
}

export function setStoredLanguage(language: SupportedLanguage): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Only store if language is enabled
  if (!isLanguageEnabled(language)) {
    console.warn(`Attempted to store disabled language: ${language}`);
    return;
  }

  try {
    localStorage.setItem('preferred-language', language);
  } catch (error) {
    console.warn('Failed to store language preference:', error);
  }
}

/**
 * Determine the best language to use based on stored preference and browser detection
 */
export function determineLanguage(): SupportedLanguage {
  // First check stored preference
  const stored = getStoredLanguage();
  if (stored) {
    return stored;
  }

  // Fall back to browser detection
  return detectBrowserLanguage();
}

/**
 * Apply RTL/LTR direction to document
 */
export function applyLanguageDirection(language: SupportedLanguage): void {
  if (typeof document === 'undefined') {
    return;
  }

  const config = SUPPORTED_LANGUAGES[language];
  document.documentElement.dir = config.direction;
  document.documentElement.lang = language;
}
