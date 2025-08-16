/**
 * Backend Configuration Manager
 * 
 * This service manages the configuration and initialization of different
 * article service backends (filesystem, database, CMS).
 */

import { ArticleService } from './articleService';
import { FileSystemArticleService } from './articleService';
import { DatabaseArticleService, DatabaseConfig } from './databaseArticleService';
import { CMSArticleService, CMSConfig } from './cmsArticleService';

export type BackendType = 'filesystem' | 'database' | 'cms';

export interface BackendConfig {
  type: BackendType;
  filesystem?: {
    articlesPath: string;
    assetsPath: string;
  };
  database?: DatabaseConfig;
  cms?: CMSConfig;
}

export interface BackendSettings {
  primary: BackendConfig;
  fallback?: BackendConfig;
  syncEnabled?: boolean;
  migrationSettings?: {
    batchSize: number;
    preserveAssets: boolean;
    backupBefore: boolean;
  };
}

export class BackendConfigManager {
  private currentService: ArticleService | null = null;
  private fallbackService: ArticleService | null = null;
  private settings: BackendSettings;

  constructor(settings: BackendSettings) {
    this.settings = settings;
    this.initializePrimaryService();
    if (settings.fallback) {
      this.initializeFallbackService();
    }
  }

  private initializePrimaryService() {
    this.currentService = this.createService(this.settings.primary);
  }

  private initializeFallbackService() {
    if (this.settings.fallback) {
      this.fallbackService = this.createService(this.settings.fallback);
    }
  }

  private createService(config: BackendConfig): ArticleService {
    switch (config.type) {
      case 'filesystem':
        return new FileSystemArticleService({
          contentDir: config.filesystem?.articlesPath || './src/content/articles',
          publicDir: config.filesystem?.assetsPath || './public/data/articles'
        });
      case 'database':
        if (!config.database) {
          throw new Error('Database configuration is required for database backend');
        }
        return new DatabaseArticleService(config.database);
      case 'cms':
        if (!config.cms) {
          throw new Error('CMS configuration is required for CMS backend');
        }
        return new CMSArticleService(config.cms);
      default:
        throw new Error(`Unsupported backend type: ${config.type}`);
    }
  }

  public getService(): ArticleService {
    if (!this.currentService) {
      throw new Error('No article service is configured');
    }
    return this.currentService;
  }

  public async switchBackend(newConfig: BackendConfig): Promise<boolean> {
    try {
      const newService = this.createService(newConfig);
      
      // Test the new service
      await newService.getAllArticles();
      
      // If successful, update the current service
      this.currentService = newService;
      this.settings.primary = newConfig;
      
      return true;
    } catch (error) {
      console.error('Failed to switch backend:', error);
      return false;
    }
  }

  public async migrateToBackend(targetConfig: BackendConfig, options?: {
    includeAssets?: boolean;
    batchSize?: number;
    dryRun?: boolean;
  }): Promise<{ success: number; failed: number; errors: string[] }> {
    const opts = {
      includeAssets: true,
      batchSize: 10,
      dryRun: false,
      ...options
    };

    const errors: string[] = [];
    let success = 0;
    let failed = 0;

    try {
      if (!this.currentService) {
        throw new Error('No source service available');
      }

      const targetService = this.createService(targetConfig);
      const sourceArticles = await this.currentService.getAllArticles();

      // Process articles in batches
      for (let i = 0; i < sourceArticles.length; i += opts.batchSize) {
        const batch = sourceArticles.slice(i, i + opts.batchSize);
        
        for (const article of batch) {
          try {
            if (!opts.dryRun) {
              const result = await targetService.createArticle(article);
              if (result) {
                success++;
              } else {
                failed++;
                errors.push(`Failed to create article: ${article.slug}`);
              }
            } else {
              // Dry run - just count
              success++;
            }
          } catch (error) {
            failed++;
            errors.push(`Error migrating article ${article.slug}: ${error}`);
          }
        }
      }

      return { success, failed, errors };
    } catch (error) {
      errors.push(`Migration failed: ${error}`);
      return { success, failed, errors };
    }
  }

  public async testConnection(config?: BackendConfig): Promise<boolean> {
    try {
      const testConfig = config || this.settings.primary;
      const service = this.createService(testConfig);
      
      // Try to get articles to test connection
      await service.getAllArticles();
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  public async syncBackends(): Promise<{ synced: number; errors: string[] }> {
    if (!this.settings.syncEnabled || !this.fallbackService || !this.currentService) {
      return { synced: 0, errors: ['Sync not enabled or services not configured'] };
    }

    const errors: string[] = [];
    let synced = 0;

    try {
      const primaryArticles = await this.currentService.getAllArticles();
      const fallbackArticles = await this.fallbackService.getAllArticles();

      // Create a map of fallback articles for quick lookup
      const fallbackMap = new Map(fallbackArticles.map(a => [a.slug, a]));

      // Sync articles from primary to fallback
      for (const article of primaryArticles) {
        try {
          const fallbackArticle = fallbackMap.get(article.slug);
          
          if (!fallbackArticle) {
            // Article doesn't exist in fallback, create it
            await this.fallbackService.createArticle(article);
            synced++;
          } else {
            // Check if update is needed (compare lastModified)
            const primaryModified = new Date(article.metadata.lastModified || article.metadata.publishDate);
            const fallbackModified = new Date(fallbackArticle.metadata.lastModified || fallbackArticle.metadata.publishDate);
            
            if (primaryModified > fallbackModified) {
              await this.fallbackService.updateArticle(article.slug, article);
              synced++;
            }
          }
        } catch (error) {
          errors.push(`Failed to sync article ${article.slug}: ${error}`);
        }
      }

      return { synced, errors };
    } catch (error) {
      errors.push(`Sync operation failed: ${error}`);
      return { synced: 0, errors };
    }
  }

  public getBackendInfo() {
    return {
      primary: this.settings.primary.type,
      fallback: this.settings.fallback?.type || null,
      syncEnabled: this.settings.syncEnabled || false
    };
  }

  public updateSettings(newSettings: Partial<BackendSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    
    // Reinitialize services if backend configs changed
    if (newSettings.primary) {
      this.initializePrimaryService();
    }
    if (newSettings.fallback) {
      this.initializeFallbackService();
    }
  }
}
