/**
 * CMS Article Service Implementation
 * 
 * This service provides article management through various CMS backends.
 * Supports headless CMS platforms like Strapi, Contentful, Sanity, etc.
 */

import { Article, ArticleMetadata } from '@/types/article';
import { ArticleService } from './articleService';

export interface CMSConfig {
  type: 'strapi' | 'contentful' | 'sanity' | 'ghost' | 'custom';
  apiUrl: string;
  apiKey?: string;
  projectId?: string; // For Sanity
  dataset?: string; // For Sanity
  spaceId?: string; // For Contentful
  environment?: string; // For Contentful
  customHeaders?: Record<string, string>;
}

export class CMSArticleService implements ArticleService {
  private config: CMSConfig;
  private apiClient: unknown;

  constructor(config: CMSConfig) {
    this.config = config;
    this.initializeAPI();
  }

  private initializeAPI() {
    // Initialize API client based on CMS type
    switch (this.config.type) {
      case 'strapi':
        // Initialize Strapi client
        this.apiClient = {
          baseURL: this.config.apiUrl,
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        };
        break;
      case 'contentful':
        // Initialize Contentful client
        // this.apiClient = contentful.createClient({
        //   space: this.config.spaceId,
        //   accessToken: this.config.apiKey,
        //   environment: this.config.environment || 'master'
        // });
        break;
      case 'sanity':
        // Initialize Sanity client
        // this.apiClient = sanityClient({
        //   projectId: this.config.projectId,
        //   dataset: this.config.dataset,
        //   token: this.config.apiKey,
        //   useCdn: false
        // });
        break;
      case 'ghost':
        // Initialize Ghost client
        // this.apiClient = new GhostContentAPI({
        //   url: this.config.apiUrl,
        //   key: this.config.apiKey,
        //   version: 'v5.0'
        // });
        break;
      case 'custom':
        // Initialize custom API client
        this.apiClient = {
          baseURL: this.config.apiUrl,
          headers: {
            ...this.config.customHeaders,
            'Content-Type': 'application/json'
          }
        };
        break;
    }
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Record<string, unknown>> {
    const url = `${this.config.apiUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(this.apiClient as { headers?: Record<string, string> })?.headers,
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`CMS API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  private transformCMSToArticle(cmsData: Record<string, unknown>): Article {
    // Transform CMS data structure to our Article type
    // Implementation varies based on CMS schema
    switch (this.config.type) {
      case 'strapi':
        const strapiAttrs = (cmsData.attributes as Record<string, unknown>) || {};
        return {
          slug: String(strapiAttrs.slug || ''),
          content: String(strapiAttrs.content || ''),
          metadata: {
            title: String(strapiAttrs.title || ''),
            summary: String(strapiAttrs.summary || strapiAttrs.description || ''),
            author: String(strapiAttrs.author || ''),
            publishDate: String(strapiAttrs.publishedDate || ''),
            lastModified: String(strapiAttrs.lastModified || ''),
            tags: Array.isArray(strapiAttrs.tags) ? strapiAttrs.tags.map(String) : [],
            category: String(strapiAttrs.category || ''),
            coverImage: String(strapiAttrs.coverImage || ''),
            readingTime: Number(strapiAttrs.readingTime) || 0,
            featured: Boolean(strapiAttrs.featured),
            published: strapiAttrs.published !== false,
            seo: {
              metaDescription: String(strapiAttrs.metaDescription || strapiAttrs.summary || ''),
              keywords: Array.isArray(strapiAttrs.keywords) ? strapiAttrs.keywords.map(String) : (Array.isArray(strapiAttrs.tags) ? strapiAttrs.tags.map(String) : [])
            }
          },
          assets: Array.isArray(strapiAttrs.assets) ? strapiAttrs.assets.map(String) : []
        };
      case 'contentful':
        const contentfulFields = (cmsData.fields as Record<string, unknown>) || {};
        return {
          slug: String(contentfulFields.slug || ''),
          content: String(contentfulFields.content || ''),
          metadata: {
            title: String(contentfulFields.title || ''),
            summary: String(contentfulFields.summary || contentfulFields.description || ''),
            author: String(contentfulFields.author || ''),
            publishDate: String(contentfulFields.publishedDate || ''),
            lastModified: String(contentfulFields.lastModified || ''),
            tags: Array.isArray(contentfulFields.tags) ? contentfulFields.tags.map(String) : [],
            category: String(contentfulFields.category || ''),
            coverImage: String(contentfulFields.coverImage || ''),
            readingTime: Number(contentfulFields.readingTime) || 0,
            featured: Boolean(contentfulFields.featured),
            published: contentfulFields.published !== false,
            seo: {
              metaDescription: String(contentfulFields.metaDescription || contentfulFields.summary || ''),
              keywords: Array.isArray(contentfulFields.keywords) ? contentfulFields.keywords.map(String) : (Array.isArray(contentfulFields.tags) ? contentfulFields.tags.map(String) : [])
            }
          },
          assets: Array.isArray(contentfulFields.assets) ? contentfulFields.assets.map(String) : []
        };
      default:
        // Generic transformation
        return {
          slug: String(cmsData.slug || ''),
          content: String(cmsData.content || ''),
          metadata: {
            title: String(cmsData.title || ''),
            summary: String(cmsData.summary || cmsData.description || ''),
            author: String(cmsData.author || ''),
            publishDate: String(cmsData.publishedDate || cmsData.publishDate || ''),
            lastModified: String(cmsData.lastModified || ''),
            tags: Array.isArray(cmsData.tags) ? cmsData.tags.map(String) : [],
            category: String(cmsData.category || ''),
            coverImage: String(cmsData.coverImage || ''),
            readingTime: Number(cmsData.readingTime) || 0,
            featured: Boolean(cmsData.featured),
            published: cmsData.published !== false,
            seo: {
              metaDescription: String(cmsData.metaDescription || cmsData.summary || ''),
              keywords: Array.isArray(cmsData.keywords) ? cmsData.keywords.map(String) : (Array.isArray(cmsData.tags) ? cmsData.tags.map(String) : [])
            }
          },
          assets: Array.isArray(cmsData.assets) ? cmsData.assets.map(String) : []
        };
    }
  }

  private transformArticleToCMS(article: Article): Record<string, unknown> {
    // Transform our Article type to CMS data structure
    switch (this.config.type) {
      case 'strapi':
        return {
          data: {
            slug: article.slug,
            title: article.metadata.title,
            content: article.content,
            summary: article.metadata.summary,
            description: article.metadata.summary,
            author: article.metadata.author,
            publishedDate: article.metadata.publishDate,
            lastModified: article.metadata.lastModified,
            featured: article.metadata.featured,
            published: article.metadata.published,
            readingTime: article.metadata.readingTime,
            category: article.metadata.category,
            tags: article.metadata.tags,
            coverImage: article.metadata.coverImage,
            metaDescription: article.metadata.seo.metaDescription,
            keywords: article.metadata.seo.keywords,
            assets: article.assets
          }
        };
      default:
        return {
          slug: article.slug,
          title: article.metadata.title,
          content: article.content,
          summary: article.metadata.summary,
          description: article.metadata.summary,
          author: article.metadata.author,
          publishedDate: article.metadata.publishDate,
          lastModified: article.metadata.lastModified,
          featured: article.metadata.featured,
          published: article.metadata.published,
          readingTime: article.metadata.readingTime,
          category: article.metadata.category,
          tags: article.metadata.tags,
          coverImage: article.metadata.coverImage,
          metaDescription: article.metadata.seo.metaDescription,
          keywords: article.metadata.seo.keywords,
          assets: article.assets
        };
    }
  }

  async getAllArticles(): Promise<Article[]> {
    try {
      let endpoint = '';
      switch (this.config.type) {
        case 'strapi':
          endpoint = '/api/articles?populate=*&sort=publishedDate:desc';
          break;
        case 'contentful':
          // Use contentful client directly
          // const entries = await this.apiClient.getEntries({ content_type: 'article' });
          // return entries.items.map(this.transformCMSToArticle);
          break;
        case 'ghost':
          endpoint = '/ghost/api/content/posts/';
          break;
        default:
          endpoint = '/articles';
      }

      if (this.config.type === 'contentful') {
        // Handle Contentful separately due to different client
        return [];
      }

      const response = await this.makeRequest(endpoint);
      const articles = this.config.type === 'strapi' ? ((response.data as unknown) as unknown[]) : ((response as unknown) as unknown[]);
      
      return (Array.isArray(articles) ? articles : []).map((item) => this.transformCMSToArticle(item as Record<string, unknown>));
    } catch (error) {
      console.error('Error fetching articles from CMS:', error);
      return [];
    }
  }

  async getArticle(slug: string): Promise<Article | null> {
    try {
      let endpoint = '';
      switch (this.config.type) {
        case 'strapi':
          endpoint = `/api/articles?filters[slug][$eq]=${slug}&populate=*`;
          break;
        case 'contentful':
          // Use contentful client
          // const entries = await this.apiClient.getEntries({ 
          //   content_type: 'article',
          //   'fields.slug': slug
          // });
          // return entries.items.length > 0 ? this.transformCMSToArticle(entries.items[0]) : null;
          break;
        case 'ghost':
          endpoint = `/ghost/api/content/posts/slug/${slug}/`;
          break;
        default:
          endpoint = `/articles/${slug}`;
      }

      if (this.config.type === 'contentful') {
        return null; // Placeholder
      }

      const response = await this.makeRequest(endpoint);
      const responseData = response as Record<string, unknown>;
      const article = this.config.type === 'strapi' && responseData.data ? 
        ((responseData.data as unknown[]))[0] : 
        responseData;
      
      return article ? this.transformCMSToArticle(article as Record<string, unknown>) : null;
    } catch (error) {
      console.error('Error fetching article from CMS:', error);
      return null;
    }
  }

  async createArticle(article: Article): Promise<boolean> {
    try {
      let endpoint = '';
      const data = this.transformArticleToCMS(article);

      switch (this.config.type) {
        case 'strapi':
          endpoint = '/api/articles';
          break;
        case 'contentful':
          // Use contentful management API
          return false; // Requires different approach
        case 'sanity':
          // Use sanity client
          // await this.apiClient.create(data);
          return true;
        default:
          endpoint = '/articles';
      }

      await this.makeRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      return true;
    } catch (error) {
      console.error('Error creating article in CMS:', error);
      return false;
    }
  }

  async updateArticle(slug: string, article: Partial<Article>): Promise<boolean> {
    try {
      // First get the article ID from CMS
      const existingArticle = await this.getArticle(slug);
      if (!existingArticle) return false;

      let endpoint = '';
      const data = this.transformArticleToCMS({ ...existingArticle, ...article });

      switch (this.config.type) {
        case 'strapi':
          // Need to get the article ID first
          endpoint = `/api/articles/${slug}`; // This would need the actual ID
          break;
        default:
          endpoint = `/articles/${slug}`;
      }

      await this.makeRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
      });

      return true;
    } catch (error) {
      console.error('Error updating article in CMS:', error);
      return false;
    }
  }

  async deleteArticle(slug: string): Promise<boolean> {
    try {
      let endpoint = '';
      switch (this.config.type) {
        case 'strapi':
          // Need to get the article ID first
          endpoint = `/api/articles/${slug}`; // This would need the actual ID
          break;
        default:
          endpoint = `/articles/${slug}`;
      }

      await this.makeRequest(endpoint, {
        method: 'DELETE'
      });

      return true;
    } catch (error) {
      console.error('Error deleting article from CMS:', error);
      return false;
    }
  }

  async bulkDeleteArticles(slugs: string[]): Promise<{ success: string[]; failed: string[] }> {
    const success: string[] = [];
    const failed: string[] = [];

    // Most CMS don't support bulk delete, so we'll do it one by one
    for (const slug of slugs) {
      const result = await this.deleteArticle(slug);
      if (result) {
        success.push(slug);
      } else {
        failed.push(slug);
      }
    }

    return { success, failed };
  }

  async uploadFromZip(zipBuffer: ArrayBuffer): Promise<{ slug: string; title?: string }[]> {
    // CMS typically requires individual uploads
    // Implementation would extract ZIP and create entries one by one
    return [];
  }

  async exportAsZip(slug: string): Promise<ArrayBuffer> {
    // Implementation would fetch from CMS and create ZIP
    return new ArrayBuffer(0);
  }

  async exportBulkAsZip(slugs: string[]): Promise<ArrayBuffer> {
    // Implementation would fetch multiple articles from CMS and create ZIP
    return new ArrayBuffer(0);
  }

  async generatePDF(slug: string): Promise<ArrayBuffer> {
    // Implementation would fetch from CMS and generate PDF
    return new ArrayBuffer(0);
  }

  async searchArticles(query: string): Promise<Article[]> {
    try {
      let endpoint = '';
      switch (this.config.type) {
        case 'strapi':
          endpoint = `/api/articles?filters[$or][0][title][$containsi]=${query}&filters[$or][1][content][$containsi]=${query}&populate=*`;
          break;
        case 'contentful':
          // Use contentful client search
          // const entries = await this.apiClient.getEntries({
          //   content_type: 'article',
          //   query: query
          // });
          // return entries.items.map(this.transformCMSToArticle);
          break;
        case 'ghost':
          endpoint = `/ghost/api/content/posts/?filter=title:~'${query}',excerpt:~'${query}'`;
          break;
        default:
          endpoint = `/articles/search?q=${encodeURIComponent(query)}`;
      }

      if (this.config.type === 'contentful') {
        return []; // Placeholder
      }

      const response = await this.makeRequest(endpoint);
      const articles = this.config.type === 'strapi' ? ((response.data as unknown) as unknown[]) : ((response as unknown) as unknown[]);
      
      return (Array.isArray(articles) ? articles : []).map((item) => this.transformCMSToArticle(item as Record<string, unknown>));
    } catch (error) {
      console.error('Error searching articles in CMS:', error);
      return [];
    }
  }

  async getArticlesByTag(tag: string): Promise<Article[]> {
    try {
      let endpoint = '';
      switch (this.config.type) {
        case 'strapi':
          endpoint = `/api/articles?filters[tags][$containsi]=${tag}&populate=*`;
          break;
        case 'contentful':
          // Use contentful client
          // const entries = await this.apiClient.getEntries({
          //   content_type: 'article',
          //   'fields.tags[in]': tag
          // });
          // return entries.items.map(this.transformCMSToArticle);
          break;
        default:
          endpoint = `/articles/tag/${tag}`;
      }

      if (this.config.type === 'contentful') {
        return []; // Placeholder
      }

      const response = await this.makeRequest(endpoint);
      const articles = this.config.type === 'strapi' ? ((response.data as unknown) as unknown[]) : ((response as unknown) as unknown[]);
      
      return (Array.isArray(articles) ? articles : []).map((item) => this.transformCMSToArticle(item as Record<string, unknown>));
    } catch (error) {
      console.error('Error fetching articles by tag from CMS:', error);
      return [];
    }
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    try {
      let endpoint = '';
      switch (this.config.type) {
        case 'strapi':
          endpoint = `/api/articles?filters[category][$eq]=${category}&populate=*`;
          break;
        case 'contentful':
          // Use contentful client
          // const entries = await this.apiClient.getEntries({
          //   content_type: 'article',
          //   'fields.category': category
          // });
          // return entries.items.map(this.transformCMSToArticle);
          break;
        default:
          endpoint = `/articles/category/${category}`;
      }

      if (this.config.type === 'contentful') {
        return []; // Placeholder
      }

      const response = await this.makeRequest(endpoint);
      const articles = this.config.type === 'strapi' ? ((response.data as unknown) as unknown[]) : ((response as unknown) as unknown[]);
      
      return (Array.isArray(articles) ? articles : []).map((item) => this.transformCMSToArticle(item as Record<string, unknown>));
    } catch (error) {
      console.error('Error fetching articles by category from CMS:', error);
      return [];
    }
  }

  async getFeaturedArticles(): Promise<Article[]> {
    try {
      let endpoint = '';
      switch (this.config.type) {
        case 'strapi':
          endpoint = '/api/articles?filters[featured][$eq]=true&populate=*';
          break;
        case 'contentful':
          // Use contentful client
          // const entries = await this.apiClient.getEntries({
          //   content_type: 'article',
          //   'fields.featured': true
          // });
          // return entries.items.map(this.transformCMSToArticle);
          break;
        default:
          endpoint = '/articles/featured';
      }

      if (this.config.type === 'contentful') {
        return []; // Placeholder
      }

      const response = await this.makeRequest(endpoint);
      const articles = this.config.type === 'strapi' ? ((response.data as unknown) as unknown[]) : ((response as unknown) as unknown[]);
      
      return (Array.isArray(articles) ? articles : []).map((item) => this.transformCMSToArticle(item as Record<string, unknown>));
    } catch (error) {
      console.error('Error fetching featured articles from CMS:', error);
      return [];
    }
  }
}
