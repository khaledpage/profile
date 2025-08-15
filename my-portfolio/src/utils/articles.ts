import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article, ArticleMetadata } from '@/types/article';

const ARTICLES_DIRECTORY = path.join(process.cwd(), 'src/content/articles');

export async function getAllArticles(): Promise<Article[]> {
  if (!fs.existsSync(ARTICLES_DIRECTORY)) {
    return [];
  }

  const articleFolders = fs.readdirSync(ARTICLES_DIRECTORY, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const articles: Article[] = [];

  for (const folder of articleFolders) {
    try {
      const article = await getArticleBySlug(folder);
      if (article && article.metadata.published) {
        articles.push(article);
      }
    } catch (error) {
      console.warn(`Failed to load article from folder: ${folder}`, error);
    }
  }

  // Sort by publish date (newest first)
  return articles.sort((a, b) => 
    new Date(b.metadata.publishDate).getTime() - new Date(a.metadata.publishDate).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articleDir = path.join(ARTICLES_DIRECTORY, slug);
  
  if (!fs.existsSync(articleDir)) {
    return null;
  }

  const markdownFile = path.join(articleDir, 'article.md');
  const metadataFile = path.join(articleDir, 'metadata.json');

  if (!fs.existsSync(markdownFile) || !fs.existsSync(metadataFile)) {
    return null;
  }

  try {
    // Read metadata
    const metadataContent = fs.readFileSync(metadataFile, 'utf8');
    const metadata: ArticleMetadata = JSON.parse(metadataContent);

    // Read markdown content
    const markdownContent = fs.readFileSync(markdownFile, 'utf8');
    const { content } = matter(markdownContent);

    // Get list of assets in the folder
    const assetsDir = path.join(articleDir, 'assets');
    let assets: string[] = [];
    
    if (fs.existsSync(assetsDir)) {
      assets = fs.readdirSync(assetsDir)
        .filter(file => {
          const filePath = path.join(assetsDir, file);
          return fs.statSync(filePath).isFile();
        });
    }

    return {
      slug,
      metadata,
      content,
      assets
    };
  } catch (error) {
    console.error(`Failed to load article: ${slug}`, error);
    return null;
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(article => article.metadata.featured);
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(article => 
    article.metadata.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getArticlesByTag(tag: string): Promise<Article[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter(article => 
    article.metadata.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function getAssetUrl(slug: string, assetName: string): string {
  return `/content/articles/${slug}/assets/${assetName}`;
}
