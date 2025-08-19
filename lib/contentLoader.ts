import { SupportedLanguage, DEFAULT_LANGUAGE, isLanguageEnabled } from './languages';

// Import all language content files
import enContent from '../config/content/en.json';
import deContent from '../config/content/de.json';
import arContent from '../config/content/ar.json';
import trContent from '../config/content/tr.json';

// Content type definitions
export interface ContentData {
  hero: {
    greeting: string;
    name: string;
    roles: string[];
    description: string;
    cta: {
      primary: string;
      secondary: string;
    };
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    highlights: string[];
    skills: Array<{
      name: string;
      technologies: string[];
    }>;
  };
  experience: {
    title: string;
    subtitle: string;
    projects: Array<{
      title: string;
      description: string;
      technologies: string[];
      image: string;
      demo: string;
      github: string;
      featured: boolean;
    }>;
  };
  inspiration: {
    title: string;
    subtitle: string;
    description: string;
    scenarios?: Array<{
      title: string;
      description: string;
      benefits: string[];
      icon: string;
      actionText: string;
    }>;
    featuredArticles?: Array<{
      title: string;
      description: string;
      benefits: string[];
      icon: string;
      actionText: string;
    }>;
    cta: {
      title: string;
      description: string;
      primaryButton: string;
      secondaryButton: string;
    };
    stats: {
      title: string;
      items: Array<{
        number: string;
        description: string;
      }>;
    };
  };
  motivation: {
    title: string;
    subtitle: string;
    points: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    cta: {
      title: string;
      description: string;
      button: string;
    };
  };
  process: {
    title: string;
    subtitle: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
      icon: string;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    info: Array<{
      icon: string;
      label: string;
      value: string;
    }>;
    form: {
      name: string;
      email: string;
      subject: string;
      message: string;
      submit: string;
      sending: string;
      successMessage: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      subjectPlaceholder: string;
      messagePlaceholder: string;
    };
    social: {
      title: string;
      description: string;
    };
    cta: {
      title: string;
      description: string;
      email: string;
      resume: string;
    };
  };
  navigation: {
    home: string;
    about: string;
    experience: string;
    motivation: string;
    process: string;
    contact: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    close: string;
    menu: string;
  };
}

// Content storage
const contentStorage: Record<SupportedLanguage, ContentData> = {
  en: enContent,
  de: deContent,
  ar: arContent,
  tr: trContent,
};

/**
 * Load content for a specific language
 */
export function loadContent(language: SupportedLanguage): ContentData {
  // If language is disabled, fallback to default language
  if (!isLanguageEnabled(language)) {
    console.warn(`Language ${language} is disabled, falling back to ${DEFAULT_LANGUAGE}`);
    return contentStorage[DEFAULT_LANGUAGE];
  }
  
  return contentStorage[language] || contentStorage[DEFAULT_LANGUAGE];
}

/**
 * Load content asynchronously (for future dynamic imports if needed)
 */
export async function loadContentAsync(language: SupportedLanguage): Promise<ContentData> {
  try {
    // For now, return synchronously. In the future, we could implement dynamic imports:
    // const content = await import(`../content/${language}.json`);
    // return content.default;
    
    return loadContent(language);
  } catch (error) {
    console.warn(`Failed to load content for language ${language}, falling back to ${DEFAULT_LANGUAGE}:`, error);
    return loadContent(DEFAULT_LANGUAGE);
  }
}

/**
 * Check if a language is supported and enabled
 */
export function isLanguageSupported(language: string): language is SupportedLanguage {
  return Object.keys(contentStorage).includes(language) && isLanguageEnabled(language as SupportedLanguage);
}

/**
 * Get all available (enabled) languages
 */
export function getAvailableLanguages(): SupportedLanguage[] {
  return Object.keys(contentStorage).filter(lang => 
    isLanguageEnabled(lang as SupportedLanguage)
  ) as SupportedLanguage[];
}
