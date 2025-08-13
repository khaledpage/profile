export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  featured?: boolean;
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
