import uiConfigData from '../config/ui.config.json';
import contentConfigData from '../config/content.config.json';

export interface UIConfig {
  language: string;
  theme: {
    active: string;
    layout: string;
    showSwitcher: boolean;
    randomOnRefresh: boolean;
    randomThemeList: string[];
  };
  sections: {
    hero: {
      enabled: boolean;
      showSocialLinks: boolean;
      showScrollIndicator: boolean;
      showCTAButtons: boolean;
    };
    about: {
      enabled: boolean;
      showSkills: boolean;
      showHighlights: boolean;
    };
    experience: {
      enabled: boolean;
      showProjects: boolean;
      showTechnologies: boolean;
    };
    inspiration: {
      enabled: boolean;
      showStats: boolean;
      showScenarios: boolean;
    };
    motivation: {
      enabled: boolean;
      showCTA: boolean;
    };
    process: {
      enabled: boolean;
      showTimeline: boolean;
    };
    contact: {
      enabled: boolean;
      showForm: boolean;
      showContactInfo: boolean;
      showSocialLinks: boolean;
      showDownloadCV: boolean;
    };
  };
  animations: {
    enabled: boolean;
    backgroundParticles: boolean;
    textAnimations: boolean;
    hoverEffects: boolean;
    scrollAnimations: boolean;
  };
  layout: {
    showNavigation: boolean;
    stickyNav: boolean;
    showFooter: boolean;
    containerMaxWidth: string;
  };
}

export interface ContentConfig {
  site: {
    title: string;
    description: string;
    url: string;
    author: string;
    keywords: string[];
    favicon: string;
  };
  personal: {
    name: string;
    role: string;
    tagline: string;
    email: string;
    phone: string;
    location: string;
    image: string;
    resume: string;
    social: Array<{
      platform: string;
      icon: string;
      url: string;
    }>;
  };
  seo: {
    structuredData: {
      person: {
        name: string;
        alternateName: string;
        description: string;
        jobTitle: string;
        worksFor: {
          type: string;
          name: string;
        };
        address: {
          type: string;
          addressCountry: string;
        };
        knowsAbout: string[];
      };
      professional: {
        name: string;
        jobTitle: string;
        description: string;
        worksFor: {
          type: string;
          name: string;
        };
        knowsAbout: string[];
      };
    };
    social: {
      twitter: {
        handle: string;
      };
      github: string;
      linkedin: string;
    };
    verification: {
      google: string;
    };
  };
  fonts: {
    preconnect: string[];
    stylesheets: string[];
  };
}

// Legacy Config interface for backward compatibility
export interface Config {
  ui: UIConfig;
  site: ContentConfig['site'];
  personal: ContentConfig['personal'];
}

export const uiConfig: UIConfig = uiConfigData as UIConfig;
export const contentConfig: ContentConfig = contentConfigData as ContentConfig;

// Combined config for backward compatibility
export const config = {
  ui: uiConfig,
  site: contentConfig.site,
  personal: contentConfig.personal,
};

// Default export for backward compatibility
export default config;

// Helper function to get content for current language (now handled by contentLoader.ts)
export const getContent = (language: string = 'en') => {
  // This function is deprecated - use loadContent from contentLoader.ts instead
  return null;
};
