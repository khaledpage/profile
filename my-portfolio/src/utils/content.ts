import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import { SiteContent } from '@/types/content';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const contentDirectory = path.join(process.cwd(), 'src/content');

export async function getContentData(filename: string) {
  const fullPath = path.join(contentDirectory, `${filename}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  let parsedContent;
  try {
    // Versuche den Content als JSON zu parsen, falls es sich um strukturierte Daten handelt
    parsedContent = JSON.parse(content.trim());
  } catch {
    // Wenn es kein JSON ist, parse es als Markdown
    parsedContent = md.render(content);
  }

  return {
    ...data,
    content: parsedContent,
  };
}

export async function getAllContent(): Promise<SiteContent> {
  const files = fs.readdirSync(contentDirectory);
  const content = {} as SiteContent;

  for (const file of files) {
    const name = file.replace(/\.md$/, '') as keyof SiteContent;
    const data = await getContentData(name);
    content[name] = data as SiteContent[keyof SiteContent];
  }

  return content;
}
