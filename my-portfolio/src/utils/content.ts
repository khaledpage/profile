import fs from 'fs';
import path from 'path';
import { SiteContent, HeroContent, ProjectsContent, ContactContent } from '@/types/content';

const contentDirectory = path.join(process.cwd(), 'src/content');

export async function getContentData(filename: string) {
  const fullPath = path.join(contentDirectory, `${filename}.json`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  return JSON.parse(fileContents);
}

export async function getHeroContent(): Promise<HeroContent> {
  return getContentData('hero');
}

export async function getProjectsContent(): Promise<ProjectsContent> {
  return getContentData('projects');
}

export async function getContactContent(): Promise<ContactContent> {
  return getContentData('contact');
}

export async function getAllContent(): Promise<SiteContent> {
  const [hero, projects, contact] = await Promise.all([
    getHeroContent(),
    getProjectsContent(),
    getContactContent(),
  ]);

  return {
    hero,
    projects,
    contact,
  };
}
