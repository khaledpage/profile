export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  featured?: boolean;
  overview?: string;
  techStack?: string[];
  features?: string[];
  challenges?: string[];
  metrics?: { label: string; value: string }[];
  meta?: {
    role?: string;
    duration?: string;
    year?: string;
    teamSize?: string;
  };
  gallery?: string[];
  links?: {
    live?: string;
    repo?: string;
    docs?: string;
  };
}

export interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
}

interface Button {
  text: string;
  link: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  primaryButton: Button;
  secondaryButton: Button;
  content: string;
}

export interface ProjectsContent {
  title: string;
  subtitle: string;
  projects: Project[];
}

export interface ContactContent {
  title: string;
  subtitle: string;
  description: string;
  formFields: FormField[];
  submitButton: {
    text: string;
    color: string;
  };
}

export interface SiteContent {
  hero: HeroContent;
  projects: ProjectsContent;
  contact: ContactContent;
  skills?: SkillsContent;
}

// Configuration types
export interface ColorPalette {
  name: string;
  background: string;
  foreground: string;
  muted: string;
  card: string;
  cardContrast: string;
  accent1: string;
  accent2: string;
}

export interface AnimationConfig {
  rotateDurationSec?: number; // duration of rotation cycle
  fadeDurationSec?: number;   // legacy: symmetric fade duration
  fadeOutDurationSec?: number; // duration to fade out
  fadeInAfterSec?: number;     // wait time before fading back in
  fadeMin?: number;           // min opacity 0..1
  fadeMax?: number;           // max opacity 0..1
  enabled?: boolean;
}

export interface PaletteGroup {
  name: string;
  palettes: Record<string, ColorPalette>;
}

export interface SiteConfig {
  colorProfile: string; // key of palettes
  palettes?: Record<string, ColorPalette>; // legacy support
  paletteGroups?: Record<string, PaletteGroup>; // new grouped structure
  animation?: AnimationConfig;
  colorRotation?: {
    enabled?: boolean;
    intervalSec?: number;
    candidates?: string[]; // keys of palettes
  };
  i18n?: {
    defaultLocale: string;
    languages: Record<string, {
      nav: { about: string; projects: string; skills: string; articles: string; contact: string };
      cta: { talk: string };
      common: {
        back: string;
        seeAlso: string;
        liveView?: string;
        viewProject?: string;
        downloadSettings?: string;
        enableAnimations?: string;
        colorThemes?: string;
        language?: string;
        skillsLayout?: string;
        home?: string;
        login?: string;
        logout?: string;
        adminMode?: string;
      };
      workflow?: {
        title: string;
        subtitle: string;
        steps: {
          idea: {
            title: string;
            description: string;
            details: string[];
          };
          concept: {
            title: string;
            description: string;
            details: string[];
          };
          code: {
            title: string;
            description: string;
            details: string[];
          };
          goal: {
            title: string;
            description: string;
            details: string[];
          };
          business: {
            title: string;
            description: string;
            details: string[];
          };
        };
        cta: {
          title: string;
          description: string;
          button: string;
        };
      };
      login?: {
        title: string;
        username: string;
        password: string;
        login: string;
        logging_in: string;
        back_to_home: string;
      };
      cookies?: {
        consent_required: string;
        admin_login_message: string;
        deny: string;
        accept: string;
      };
      analytics?: {
        title: string;
        subtitle: string;
        loading: string;
        noData: string;
        startTracking: string;
        clearData: string;
        clearButton: string;
        totalViews: string;
        uniqueVisitors: string;
        avgReadingTime: string;
        trackedArticles: string;
        weeklyViews: string;
        topArticles: string;
        deviceBreakdown: string;
      };
      admin?: {
        backendSelector?: {
          title: string;
          configure: string;
          currentBackend: string;
          testConnection: string;
          selectBackend: string;
          databaseType: string;
          host: string;
          port: string;
          database: string;
          username: string;
          filename: string;
          cmsType: string;
          apiUrl: string;
          apiKey: string;
          advancedOptions: string;
          enableSync: string;
          saveConfig: string;
          testNewBackend: string;
        };
        templates?: {
          title: string;
          subtitle: string;
          createNew: string;
          useTemplate: string;
          preview: string;
          delete: string;
          noTemplates: string;
          categories: {
            all: string;
            tutorial: string;
            review: string;
            caseStudy: string;
            news: string;
            documentation: string;
            custom: string;
          };
        };
      };
    }>;
  };
  interactiveEffects?: {
    enabled?: boolean;
    triggerChance?: number; // 0..1 probability per eligible pointermove
    minIntervalSec?: number; // min seconds between effects
    maxPerMinute?: number; // cap
    ripple?: {
      sizePx?: number; // base size
      durationMs?: number; // animation duration
      color?: string; // fallback color; default uses accent vars
    };
  };
  settings?: {
    enabled?: boolean;
    showIcon?: boolean;
    allowThemeChange?: boolean;
    allowAnimationToggle?: boolean;
    allowLanguageChange?: boolean;
    cookieConsent?: boolean;
    /** If true, the Settings panel is only visible when Admin mode is enabled */
    adminOnly?: boolean;
  };
  skillsDisplay?: {
    design?: string;
    availableDesigns?: string[];
    allowDesignChange?: boolean;
  };
  /** Default homepage sections order and visibility */
  homeSections?: {
    order: Array<'hero' | 'about' | 'skills' | 'projects' | 'articles' | 'workflow' | 'contact'>;
    hidden?: Array<'hero' | 'about' | 'skills' | 'projects' | 'articles' | 'workflow' | 'contact'>;
  };
  /** Admin configuration and feature flags */
  admin?: {
    /** Admin mode default on (can be toggled in Settings if allowToggle is true) */
    enabledByDefault?: boolean;
    /** Allow toggling Admin mode from the UI */
    allowToggle?: boolean;
    /** Enable per-article ZIP download */
    allowZipDownload?: boolean;
    /** Enable uploading article ZIPs client-side */
    allowZipUpload?: boolean;
    /** Show login/logout navigation in header */
    showLoginNavigation?: boolean;
  };
}

// Skills content types
export interface SkillItem {
  name: string;
  level?: string; // e.g., Beginner/Intermediate/Advanced/Expert or custom
  years?: number;
  description?: string;
  tags?: string[];
  link?: string;
}

export interface SkillGroup {
  key: string;
  title: string;
  direction?: 'left' | 'right';
  speedSec?: number; // scroll duration
  items: SkillItem[];
}

export interface SkillsContent {
  title?: string;
  groups: SkillGroup[];
}
