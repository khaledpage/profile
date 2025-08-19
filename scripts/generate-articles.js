#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Build script to generate static featured articles data from the file system
 * This reads the article folders and generates a static TypeScript file with multilingual support
 */

const inspirationPath = path.join(process.cwd(), 'config', 'content', 'inspiration');
const outputPath = path.join(process.cwd(), 'lib', 'generatedFeaturedArticles.ts');

// Supported languages
const supportedLanguages = ['en', 'de', 'tr', 'ar'];

function generateStaticArticles() {
  const articlesData = {};
  const categories = new Set();
  const tags = new Set();

  // Initialize data structure for each language
  supportedLanguages.forEach(lang => {
    articlesData[lang] = [];
  });

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
      
      // Process each language
      for (const lang of supportedLanguages) {
        const metadataPath = path.join(articlePath, `${lang}.json`);
        const htmlPath = path.join(articlePath, `${lang}.html`);
        
        // Fallback to legacy files if language-specific files don't exist
        const fallbackMetadataPath = path.join(articlePath, 'metadata.json');
        const fallbackHtmlPath = path.join(articlePath, 'article.html');
        
        let finalMetadataPath = metadataPath;
        let finalHtmlPath = htmlPath;
        
        // Check if language-specific files exist, otherwise use fallbacks
        if (!fs.existsSync(metadataPath)) {
          if (fs.existsSync(fallbackMetadataPath)) {
            finalMetadataPath = fallbackMetadataPath;
            console.log(`Using fallback metadata for ${folderName} (${lang})`);
          } else {
            console.warn(`No metadata found for ${folderName} (${lang})`);
            continue;
          }
        }
        
        if (!fs.existsSync(htmlPath)) {
          if (fs.existsSync(fallbackHtmlPath)) {
            finalHtmlPath = fallbackHtmlPath;
            console.log(`Using fallback HTML for ${folderName} (${lang})`);
          } else {
            console.warn(`No HTML content found for ${folderName} (${lang})`);
            continue;
          }
        }

        try {
          // Read and parse metadata
          const metadataContent = fs.readFileSync(finalMetadataPath, 'utf8');
          const metadata = JSON.parse(metadataContent);

          // Read HTML content
          const htmlContent = fs.readFileSync(finalHtmlPath, 'utf8');

          // Create article object
          const article = {
            ...metadata,
            htmlContent: htmlContent
          };

          articlesData[lang].push(article);

          // Collect categories and tags
          if (metadata.category) {
            categories.add(metadata.category);
          }
          if (metadata.tags && Array.isArray(metadata.tags)) {
            metadata.tags.forEach(tag => tags.add(tag));
          }

          console.log(`Loaded article: ${metadata.title} (${lang})`);
        } catch (error) {
          console.error(`Error processing article ${folderName} (${lang}):`, error.message);
        }
      }
    }

    // Sort articles by order field for each language
    supportedLanguages.forEach(lang => {
      articlesData[lang].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

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

export interface MultilingualFeaturedArticles {
  en: FeaturedArticle[];
  de: FeaturedArticle[];
  tr: FeaturedArticle[];
  ar: FeaturedArticle[];
}

export const generatedFeaturedArticles: MultilingualFeaturedArticles = ${JSON.stringify(articlesData, null, 2)};

/**
 * Load featured articles for a specific language - returns generated data from article folders
 */
export async function loadFeaturedArticles(language: string = 'en'): Promise<FeaturedArticlesData> {
  const articles = generatedFeaturedArticles[language as keyof MultilingualFeaturedArticles] || generatedFeaturedArticles.en;
  const categories = Array.from(new Set(articles.map(article => article.category)));
  const tags = Array.from(new Set(articles.flatMap(article => article.tags)));
  
  return {
    featuredArticles: articles.sort((a, b) => a.order - b.order),
    categories,
    tags
  };
}

/**
 * Get a specific featured article by ID for a language
 */
export function getFeaturedArticleById(id: string, language: string = 'en'): FeaturedArticle | undefined {
  const articles = generatedFeaturedArticles[language as keyof MultilingualFeaturedArticles] || generatedFeaturedArticles.en;
  return articles.find(article => article.id === id);
}

/**
 * Search featured articles by query for a language
 */
export function searchFeaturedArticles(query: string, language: string = 'en'): FeaturedArticle[] {
  const articles = generatedFeaturedArticles[language as keyof MultilingualFeaturedArticles] || generatedFeaturedArticles.en;
  const searchTerm = query.toLowerCase();
  
  return articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.description.toLowerCase().includes(searchTerm) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    article.category.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get featured articles by category for a language
 */
export function getFeaturedArticlesByCategory(category: string, language: string = 'en'): FeaturedArticle[] {
  const articles = generatedFeaturedArticles[language as keyof MultilingualFeaturedArticles] || generatedFeaturedArticles.en;
  return articles.filter(article => article.category === category);
}

/**
 * Get featured articles by tags for a language
 */
export function getFeaturedArticlesByTags(tags: string[], language: string = 'en'): FeaturedArticle[] {
  const articles = generatedFeaturedArticles[language as keyof MultilingualFeaturedArticles] || generatedFeaturedArticles.en;
  return articles.filter(article => 
    article.tags.some(tag => tags.includes(tag))
  );
}
`;

    // Write the file
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    
    // Calculate total articles across all languages
    const totalArticles = Object.values(articlesData).reduce((sum, langArticles) => sum + langArticles.length, 0);
    
    console.log(`✅ Generated static articles file with ${totalArticles} total articles`);
    console.log(`📁 Output: ${outputPath}`);
    console.log(`📊 Categories: ${Array.from(categories).join(', ')}`);
    console.log(`🏷️  Tags: ${Array.from(tags).join(', ')}`);
    console.log(`🌐 Languages: ${supportedLanguages.join(', ')}`);
    
    // Show articles per language
    supportedLanguages.forEach(lang => {
      console.log(`   ${lang.toUpperCase()}: ${articlesData[lang].length} articles`);
    });

  } catch (error) {
    console.error('❌ Error generating articles:', error);
    process.exit(1);
  }
}

// Run the generation
console.log('🚀 Starting article generation...');
generateStaticArticles();
console.log('✨ Article generation complete!');
