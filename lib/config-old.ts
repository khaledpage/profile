import configData from '../config.json';

export interface Config {
  site: {
    title: string;
    description: string;
    url: string;
  };
  theme: {
    active: string;
    layout: string;
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
      level: number;
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
      impact: string;
    }>;
  };
  motivation: {
    title: string;
    subtitle: string;
    points: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
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
  };
}

export const config: Config = configData as Config;

export default config;