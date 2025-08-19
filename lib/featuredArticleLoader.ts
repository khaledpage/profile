import fs from 'fs';
import path from 'path';

export interface FeaturedArticle {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  benefits: string[];
  icon: string;
  actionText: string;
  category: string;
  tags: string[];
  readTime: string;
  difficulty: string;
  impact: string;
  publishDate: string;
  author: string;
  featured: boolean;
  order: number;
  htmlContent?: string;
}

export interface FeaturedArticlesData {
  featuredArticles: FeaturedArticle[];
  categories: string[];
  tags: string[];
}

/**
 * Dynamically loads all featured articles from the inspiration folder
 * This function scans the /config/content/inspiration/ directory and loads
 * metadata.json and article.html from each subfolder
 */
export function loadFeaturedArticles(): FeaturedArticlesData {
  const articlesData: FeaturedArticle[] = [];
  const categories = new Set<string>();
  const tags = new Set<string>();

  try {
    const inspirationPath = path.join(process.cwd(), 'config', 'content', 'inspiration');
    
    // Check if inspiration directory exists
    if (!fs.existsSync(inspirationPath)) {
      console.warn('Inspiration directory not found, returning empty articles');
      return { featuredArticles: [], categories: [], tags: [] };
    }

    // Get all subdirectories in inspiration folder
    const articleFolders = fs.readdirSync(inspirationPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const folderName of articleFolders) {
      try {
        const articlePath = path.join(inspirationPath, folderName);
        const metadataPath = path.join(articlePath, 'metadata.json');
        const htmlPath = path.join(articlePath, 'article.html');

        // Check if both metadata.json and article.html exist
        if (fs.existsSync(metadataPath) && fs.existsSync(htmlPath)) {
          // Load metadata
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
          const metadata: FeaturedArticle = JSON.parse(metadataContent);

          // Load HTML content
          const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
          
          // Combine metadata with HTML content
          const article: FeaturedArticle = {
            ...metadata,
            htmlContent
          };

          articlesData.push(article);
          categories.add(metadata.category);
          metadata.tags.forEach(tag => tags.add(tag));
        } else {
          console.warn(`Missing files in article folder: ${folderName}. Expected metadata.json and article.html`);
        }
      } catch (error) {
        console.error(`Error loading article from folder ${folderName}:`, error);
      }
    }

    // Sort articles by order
    articlesData.sort((a, b) => a.order - b.order);

  } catch (error) {
    console.error('Error loading featured articles:', error);
  }

  return {
    featuredArticles: articlesData,
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort()
  };
}

/**
 * Get a specific article by ID
 */
export function getFeaturedArticleById(id: string): FeaturedArticle | null {
  const { featuredArticles } = loadFeaturedArticles();
  return featuredArticles.find(article => article.id === id) || null;
}

/**
 * Get articles by category
 */
export function getFeaturedArticlesByCategory(category: string): FeaturedArticle[] {
  const { featuredArticles } = loadFeaturedArticles();
  return featuredArticles.filter(article => article.category === category);
}

/**
 * Get articles by tag
 */
export function getFeaturedArticlesByTag(tag: string): FeaturedArticle[] {
  const { featuredArticles } = loadFeaturedArticles();
  return featuredArticles.filter(article => article.tags.includes(tag));
}

/**
 * Search articles by title or description
 */
export function searchFeaturedArticles(query: string): FeaturedArticle[] {
  const { featuredArticles } = loadFeaturedArticles();
  const searchTerm = query.toLowerCase();
  
  return featuredArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.description.toLowerCase().includes(searchTerm) ||
    article.shortDescription.toLowerCase().includes(searchTerm) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export default loadFeaturedArticles;
