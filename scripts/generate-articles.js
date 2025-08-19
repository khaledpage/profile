#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Build script to generate static featured articles data from the file system
 * This reads the article folders and generates a static TypeScript file
 */

const inspirationPath = path.join(process.cwd(), 'config', 'content', 'inspiration');
const outputPath = path.join(process.cwd(), 'lib', 'generatedFeaturedArticles.ts');

function generateStaticArticles() {
  const articlesData = [];
  const categories = new Set();
  const tags = new Set();

  try {
    // Check if inspiration directory exists
    if (!fs.existsSync(inspirationPath)) {
      console.warn('Inspiration directory not found');
      return;
    }

    // Get all subdirectories in inspiration folder
    const articleFolders = fs.readdirSync(inspirationPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`Found ${articleFolders.length} article folders`);

    for (const folderName of articleFolders) {
      const articlePath = path.join(inspirationPath, folderName);
      const metadataPath = path.join(articlePath, 'metadata.json');
      const htmlPath = path.join(articlePath, 'article.html');

      // Check if both required files exist
      if (fs.existsSync(metadataPath) && fs.existsSync(htmlPath)) {
        try {
          // Read and parse metadata
          const metadataContent = fs.readFileSync(metadataPath, 'utf8');
          const metadata = JSON.parse(metadataContent);

          // Read HTML content
          const htmlContent = fs.readFileSync(htmlPath, 'utf8');

          // Create article object
          const article = {
            ...metadata,
            htmlContent: htmlContent
          };

          articlesData.push(article);

          // Collect categories and tags
          if (metadata.category) {
            categories.add(metadata.category);
          }
          if (metadata.tags && Array.isArray(metadata.tags)) {
            metadata.tags.forEach(tag => tags.add(tag));
          }

          console.log(`Loaded article: ${metadata.title}`);
        } catch (error) {
          console.error(`Error processing article ${folderName}:`, error.message);
        }
      } else {
        console.warn(`Missing files in ${folderName} - requires metadata.json and article.html`);
      }
    }

    // Sort articles by order field
    articlesData.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Generate TypeScript file content
    const tsContent = `// Auto-generated file - DO NOT EDIT MANUALLY
// Generated on ${new Date().toISOString()}
// Run 'npm run generate-articles' to regenerate this file

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

export const generatedFeaturedArticles: FeaturedArticle[] = ${JSON.stringify(articlesData, null, 2)};

/**
 * Load featured articles - returns generated data from article folders
 */
export async function loadFeaturedArticles(): Promise<FeaturedArticlesData> {
  const categories = Array.from(new Set(generatedFeaturedArticles.map(article => article.category)));
  const tags = Array.from(new Set(generatedFeaturedArticles.flatMap(article => article.tags)));
  
  return {
    featuredArticles: generatedFeaturedArticles.sort((a, b) => a.order - b.order),
    categories,
    tags
  };
}

/**
 * Get a specific featured article by ID
 */
export function getFeaturedArticleById(id: string): FeaturedArticle | undefined {
  return generatedFeaturedArticles.find(article => article.id === id);
}

/**
 * Search featured articles by query
 */
export function searchFeaturedArticles(query: string): FeaturedArticle[] {
  const searchTerm = query.toLowerCase();
  return generatedFeaturedArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm) ||
    article.description.toLowerCase().includes(searchTerm) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    article.category.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get featured articles by category
 */
export function getFeaturedArticlesByCategory(category: string): FeaturedArticle[] {
  return generatedFeaturedArticles.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get featured articles by tags
 */
export function getFeaturedArticlesByTags(tags: string[]): FeaturedArticle[] {
  return generatedFeaturedArticles.filter(article =>
    tags.some(tag => 
      article.tags.some(articleTag => 
        articleTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  );
}
`;

    // Write the generated file
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    
    console.log(`✅ Generated static articles file with ${articlesData.length} articles`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 Categories: ${Array.from(categories).join(', ')}`);
    console.log(`🏷️  Tags: ${Array.from(tags).join(', ')}`);

  } catch (error) {
    console.error('Error generating static articles:', error);
    process.exit(1);
  }
}

// Run the generator
generateStaticArticles();
