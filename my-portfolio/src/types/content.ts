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
  fadeDurationSec?: number;   // duration of opacity fade in/out cycle
  fadeMin?: number;           // min opacity 0..1
  fadeMax?: number;           // max opacity 0..1
  enabled?: boolean;
}

export interface SiteConfig {
  colorProfile: string; // key of palettes
  palettes: Record<string, ColorPalette>;
  animation?: AnimationConfig;
}
