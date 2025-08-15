'use client';

import { useState, useEffect } from 'react';
import type { SiteConfig } from '@/types/content';

export function useLanguage(config?: SiteConfig) {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return config?.i18n?.defaultLocale || 'de';
    }
    
    // Try to get from stored preferences
    try {
      const stored = localStorage.getItem('user-preferences');
      if (stored) {
        const prefs = JSON.parse(stored);
        return prefs.language || config?.i18n?.defaultLocale || 'de';
      }
    } catch {
      // Fallback to default
    }
    
    return config?.i18n?.defaultLocale || 'de';
  });

  useEffect(() => {
    // Listen for language changes from settings panel
    const handleLanguageChange = (event: CustomEvent) => {
      if (event.detail?.language) {
        setCurrentLanguage(event.detail.language);
      }
    };

    // Listen for storage changes from other tabs
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem('user-preferences');
        if (stored) {
          const prefs = JSON.parse(stored);
          if (prefs.language && prefs.language !== currentLanguage) {
            setCurrentLanguage(prefs.language);
          }
        }
      } catch {
        // Ignore storage errors
      }
    };

    window.addEventListener('preferencesUpdated', handleLanguageChange as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('preferencesUpdated', handleLanguageChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentLanguage]);

  // Get translations for current language
  const getTranslations = () => {
    if (!config?.i18n?.languages) return null;
    return config.i18n.languages[currentLanguage] || config.i18n.languages[config.i18n.defaultLocale || 'de'];
  };

  return {
    currentLanguage,
    translations: getTranslations(),
    availableLanguages: config?.i18n?.languages ? Object.keys(config.i18n.languages) : [],
  };
}

export function getServerLanguage(config?: SiteConfig): string {
  return config?.i18n?.defaultLocale || 'de';
}

export function getServerTranslations(config?: SiteConfig, language?: string) {
  if (!config?.i18n?.languages) return null;
  const lang = language || config.i18n.defaultLocale || 'de';
  return config.i18n.languages[lang] || config.i18n.languages[config.i18n.defaultLocale || 'de'];
}
