/**
 * Article Service Module
 * 
 * This module provides a centralized service for all article-related operations.
 * It can be easily extracted and used in other applications focused on article management.
 */

import { Article, ArticleMetadata } from '@/types/article';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

export interface ArticleService {
  // CRUD Operations
  getAllArticles(): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
  createArticle(article: Article): Promise<boolean>;
  updateArticle(slug: string, article: Partial<Article>): Promise<boolean>;
  deleteArticle(slug: string): Promise<boolean>;
  
  // Bulk Operations
  bulkDeleteArticles(slugs: string[]): Promise<{ success: string[]; failed: string[] }>;
  
  // File Operations
  uploadFromZip(zipBuffer: ArrayBuffer): Promise<{ slug: string; title?: string }[]>;
  exportAsZip(slug: string): Promise<ArrayBuffer>;
  exportBulkAsZip(slugs: string[]): Promise<ArrayBuffer>;
  
  // PDF Operations
  generatePDF(slug: string): Promise<ArrayBuffer>;
  
  // Search and Filter
  searchArticles(query: string): Promise<Article[]>;
  getArticlesByTag(tag: string): Promise<Article[]>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  getFeaturedArticles(): Promise<Article[]>;
}

export class FileSystemArticleService implements ArticleService {
  private contentDir: string;
  private publicDir: string;
  private articlesJsonPath: string;

  constructor(options?: {
    contentDir?: string;
    publicDir?: string;
    articlesJsonPath?: string;
  }) {
    this.contentDir = options?.contentDir || path.join(process.cwd(), 'src/content/articles');
    this.publicDir = options?.publicDir || path.join(process.cwd(), 'public/data/articles');
    this.articlesJsonPath = options?.articlesJsonPath || path.join(process.cwd(), 'public/data/articles.json');
  }

  async getAllArticles(): Promise<Article[]> {
    try {
      // Implementation would use existing getAllArticles util
      const { getAllArticles } = await import('@/utils/articles');
      return getAllArticles();
    } catch (error) {
      console.error('Error getting all articles:', error);
      return [];
    }
  }

  async getArticle(slug: string): Promise<Article | null> {
    try {
      const { getAllArticles } = await import('@/utils/articles');
      const articles = await getAllArticles();
      return articles.find(article => article.slug === slug) || null;
    } catch (error) {
      console.error(`Error getting article ${slug}:`, error);
      return null;
    }
  }

  async createArticle(article: Article): Promise<boolean> {
    try {
      // Create content directory
      const articleDir = path.join(this.contentDir, article.slug);
      if (!fs.existsSync(articleDir)) {
        fs.mkdirSync(articleDir, { recursive: true });
      }

      // Write article.md
      const articlePath = path.join(articleDir, 'article.md');
      fs.writeFileSync(articlePath, article.content || '');

      // Write metadata.json
      const metadataPath = path.join(articleDir, 'metadata.json');
      fs.writeFileSync(metadataPath, JSON.stringify(article.metadata, null, 2));

      // Update articles.json
      await this.updateArticlesIndex();

      return true;
    } catch (error) {
      console.error(`Error creating article ${article.slug}:`, error);
      return false;
    }
  }

  async updateArticle(slug: string, updates: Partial<Article>): Promise<boolean> {
    try {
      const existing = await this.getArticle(slug);
      if (!existing) return false;

      const updated = { ...existing, ...updates };
      
      // Update content file if changed
      if (updates.content !== undefined) {
        const articlePath = path.join(this.contentDir, slug, 'article.md');
        fs.writeFileSync(articlePath, updates.content);
      }

      // Update metadata if changed
      if (updates.metadata) {
        const metadataPath = path.join(this.contentDir, slug, 'metadata.json');
        const updatedMetadata = { ...existing.metadata, ...updates.metadata };
        fs.writeFileSync(metadataPath, JSON.stringify(updatedMetadata, null, 2));
      }

      await this.updateArticlesIndex();
      return true;
    } catch (error) {
      console.error(`Error updating article ${slug}:`, error);
      return false;
    }
  }

  async deleteArticle(slug: string): Promise<boolean> {
    try {
      const contentDir = path.join(this.contentDir, slug);
      const publicDir = path.join(this.publicDir, slug);
      
      // Remove directories
      if (fs.existsSync(contentDir)) {
        fs.rmSync(contentDir, { recursive: true, force: true });
      }
      
      if (fs.existsSync(publicDir)) {
        fs.rmSync(publicDir, { recursive: true, force: true });
      }

      // Update articles.json
      await this.updateArticlesIndex();
      
      return true;
    } catch (error) {
      console.error(`Error deleting article ${slug}:`, error);
      return false;
    }
  }

  async bulkDeleteArticles(slugs: string[]): Promise<{ success: string[]; failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] };
    
    for (const slug of slugs) {
      const success = await this.deleteArticle(slug);
      if (success) {
        results.success.push(slug);
      } else {
        results.failed.push(slug);
      }
    }
    
    return results;
  }

  async uploadFromZip(zipBuffer: ArrayBuffer): Promise<{ slug: string; title?: string }[]> {
    try {
      const zip = await JSZip.loadAsync(zipBuffer);
      const results: { slug: string; title?: string }[] = [];

      // Process each file in the ZIP
      for (const [filepath, file] of Object.entries(zip.files)) {
        if (file.dir) continue; // Skip directories

        // Look for metadata.json files to identify articles
        if (filepath.endsWith('metadata.json')) {
          try {
            const metadataContent = await file.async('text');
            const metadata: ArticleMetadata = JSON.parse(metadataContent);
            
            // Generate slug from title or use directory name
            const slug = this.generateSlugFromTitle(metadata.title) || 
                        filepath.split('/')[filepath.split('/').length - 2] || 
                        `imported-${Date.now()}`;

            // Find corresponding article.md file
            const articlePath = filepath.replace('metadata.json', 'article.md');
            const articleFile = zip.files[articlePath];
            
            if (!articleFile) {
              console.warn(`No article.md found for ${filepath}, skipping`);
              continue;
            }

            const content = await articleFile.async('text');

            // Create the article directories
            const contentDir = path.join(this.contentDir, slug);
            const publicDir = path.join(this.publicDir, slug);

            // Ensure directories exist
            if (!fs.existsSync(contentDir)) {
              fs.mkdirSync(contentDir, { recursive: true });
            }
            if (!fs.existsSync(publicDir)) {
              fs.mkdirSync(publicDir, { recursive: true });
            }

            // Write metadata.json
            fs.writeFileSync(
              path.join(contentDir, 'metadata.json'),
              JSON.stringify(metadata, null, 2)
            );

            // Write article.md
            fs.writeFileSync(path.join(contentDir, 'article.md'), content);

            // Handle assets
            const assetDir = path.join(contentDir, 'assets');
            const publicAssetDir = path.join(publicDir, 'assets');
            
            // Process assets if they exist
            const basePath = filepath.replace('/metadata.json', '');
            for (const [assetPath, assetFile] of Object.entries(zip.files)) {
              if (assetPath.startsWith(basePath + '/assets/') && !assetFile.dir) {
                const assetName = path.basename(assetPath);
                
                // Ensure asset directories exist
                if (!fs.existsSync(assetDir)) {
                  fs.mkdirSync(assetDir, { recursive: true });
                }
                if (!fs.existsSync(publicAssetDir)) {
                  fs.mkdirSync(publicAssetDir, { recursive: true });
                }

                // Write asset files
                const assetBuffer = await assetFile.async('nodebuffer');
                fs.writeFileSync(path.join(assetDir, assetName), assetBuffer);
                fs.writeFileSync(path.join(publicAssetDir, assetName), assetBuffer);
              }
            }

            // Create public JSON file for the article
            const articleData = {
              slug,
              metadata,
              content,
              assets: fs.existsSync(assetDir) ? fs.readdirSync(assetDir) : []
            };

            fs.writeFileSync(
              path.join(publicDir, 'article.json'),
              JSON.stringify(articleData, null, 2)
            );

            results.push({ slug, title: metadata.title });
          } catch (error) {
            console.error(`Error processing article from ${filepath}:`, error);
            // Continue processing other articles
          }
        }
      }

      // Update articles.json index
      if (results.length > 0) {
        await this.updateArticlesIndex();
      }

      return results;
    } catch (error) {
      console.error('Error uploading from ZIP:', error);
      throw new Error(`Failed to process ZIP file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateSlugFromTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  async exportAsZip(slug: string): Promise<ArrayBuffer> {
    // Implementation for single article ZIP export
    throw new Error('ZIP export not implemented yet');
  }

  async exportBulkAsZip(slugs: string[]): Promise<ArrayBuffer> {
    // Implementation for bulk ZIP export
    throw new Error('Bulk ZIP export not implemented yet');
  }

  async generatePDF(slug: string): Promise<ArrayBuffer> {
    // Implementation for PDF generation
    throw new Error('PDF generation not implemented yet');
  }

  async searchArticles(query: string): Promise<Article[]> {
    const articles = await this.getAllArticles();
    const searchTerm = query.toLowerCase();
    
    return articles.filter(article => 
      article.metadata.title.toLowerCase().includes(searchTerm) ||
      article.metadata.summary.toLowerCase().includes(searchTerm) ||
      article.metadata.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      article.metadata.category.toLowerCase().includes(searchTerm)
    );
  }

  async getArticlesByTag(tag: string): Promise<Article[]> {
    const articles = await this.getAllArticles();
    return articles.filter(article => 
      article.metadata.tags.includes(tag)
    );
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    const articles = await this.getAllArticles();
    return articles.filter(article => 
      article.metadata.category === category
    );
  }

  async getFeaturedArticles(): Promise<Article[]> {
    const articles = await this.getAllArticles();
    return articles.filter(article => article.metadata.featured);
  }

  private async updateArticlesIndex(): Promise<void> {
    try {
      const articles = await this.getAllArticles();
      const articleData = articles.map(article => ({
        slug: article.slug,
        ...article.metadata
      }));
      
      fs.writeFileSync(this.articlesJsonPath, JSON.stringify(articleData, null, 2));
    } catch (error) {
      console.error('Error updating articles index:', error);
    }
  }
}

// Export singleton instance
export const articleService = new FileSystemArticleService();

// Export factory function for custom configurations
export function createArticleService(config?: {
  contentDir?: string;
  publicDir?: string;
  articlesJsonPath?: string;
}): ArticleService {
  return new FileSystemArticleService(config);
}
