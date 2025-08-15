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

export interface SiteConfig {
  colorProfile: string; // key of palettes
  palettes: Record<string, ColorPalette>;
  animation?: AnimationConfig;
  colorRotation?: {
    enabled?: boolean;
    intervalSec?: number;
    candidates?: string[]; // keys of palettes
  };
  i18n?: {
    defaultLocale: string;
    languages: Record<string, {
      nav: { about: string; projects: string; skills: string; contact: string };
      cta: { talk: string };
      common: { back: string; seeAlso: string };
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
  };
  skillsDisplay?: {
    design?: string;
    availableDesigns?: string[];
    allowDesignChange?: boolean;
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
