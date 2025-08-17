import uiConfigData from '../ui.config.json';
import contentConfigData from '../content.config.json';

export interface UIConfig {
  language: string;
  theme: {
    active: string;
    layout: string;
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
  content: {
    [language: string]: {
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
    };
  };
}

// Legacy Config interface for backward compatibility
export interface Config {
  ui: UIConfig;
  site: ContentConfig['site'];
  personal: ContentConfig['personal'];
  content: ContentConfig['content'];
}

export const uiConfig: UIConfig = uiConfigData as UIConfig;
export const contentConfig: ContentConfig = contentConfigData as ContentConfig;

// Combined config for backward compatibility
export const config: Config = {
  ui: uiConfig,
  site: contentConfig.site,
  personal: contentConfig.personal,
  content: contentConfig.content,
};

// Helper function to get content for current language
export const getContent = (language: string = 'en') => {
  return contentConfig.content[language] || contentConfig.content.en;
};

export default config;
