/**
 * Article Hooks Module
 * 
 * Reusable React hooks for article management.
 * Can be easily extracted for use in other article-focused applications.
 */

import { useState, useEffect, useCallback } from 'react';
import { Article } from '@/types/article';

export interface UseArticlesOptions {
  search?: string;
  tag?: string;
  category?: string;
  featured?: boolean;
  initialData?: Article[];
}

export interface UseArticlesReturn {
  articles: Article[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  searchArticles: (query: string) => void;
  filterByTag: (tag: string) => void;
  filterByCategory: (category: string) => void;
  clearFilters: () => void;
}

/**
 * Hook for managing articles with search and filtering
 */
export function useArticles(options: UseArticlesOptions = {}): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>(options.initialData || []);
  const [allArticles, setAllArticles] = useState<Article[]>(options.initialData || []);
  const [loading, setLoading] = useState(!options.initialData);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(options.search || '');
  const [tag, setTag] = useState(options.tag || '');
  const [category, setCategory] = useState(options.category || '');

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/articles');
      if (!response.ok) throw new Error('Failed to fetch articles');
      
      const data = await response.json();
      setAllArticles(data);
      
      // Apply initial filters
      let filtered = data;
      if (options.featured) {
        filtered = filtered.filter((article: Article) => article.metadata.featured);
      }
      
      setArticles(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  }, [options.featured]);

  const applyFilters = useCallback(() => {
    let filtered = [...allArticles];

    // Apply search
    if (search) {
      const searchTerm = search.toLowerCase();
      filtered = filtered.filter(article =>
        article.metadata.title.toLowerCase().includes(searchTerm) ||
        article.metadata.summary.toLowerCase().includes(searchTerm) ||
        article.metadata.tags.some(t => t.toLowerCase().includes(searchTerm)) ||
        article.metadata.category.toLowerCase().includes(searchTerm)
      );
    }

    // Apply tag filter
    if (tag) {
      filtered = filtered.filter(article => article.metadata.tags.includes(tag));
    }

    // Apply category filter
    if (category) {
      filtered = filtered.filter(article => article.metadata.category === category);
    }

    // Apply featured filter
    if (options.featured) {
      filtered = filtered.filter(article => article.metadata.featured);
    }

    setArticles(filtered);
  }, [allArticles, search, tag, category, options.featured]);

  const searchArticles = useCallback((query: string) => {
    setSearch(query);
  }, []);

  const filterByTag = useCallback((tagName: string) => {
    setTag(tagName);
  }, []);

  const filterByCategory = useCallback((categoryName: string) => {
    setCategory(categoryName);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch('');
    setTag('');
    setCategory('');
  }, []);

  const refresh = useCallback(fetchArticles, [fetchArticles]);

  useEffect(() => {
    if (!options.initialData) {
      fetchArticles();
    }
  }, [fetchArticles, options.initialData]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return {
    articles,
    loading,
    error,
    refresh,
    searchArticles,
    filterByTag,
    filterByCategory,
    clearFilters,
  };
}

export interface UseArticleReturn {
  article: Article | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing a single article
 */
export function useArticle(slug: string): UseArticleReturn {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/articles/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Article not found');
        }
        throw new Error('Failed to fetch article');
      }
      
      const data = await response.json();
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
      setArticle(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const refresh = useCallback(fetchArticle, [fetchArticle]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    article,
    loading,
    error,
    refresh,
  };
}

export interface UseArticleActionsReturn {
  deleteArticle: (slug: string) => Promise<boolean>;
  bulkDeleteArticles: (slugs: string[]) => Promise<{ success: string[]; failed: string[] }>;
  downloadArticle: (slug: string) => Promise<void>;
  isDeleting: boolean;
  isDownloading: boolean;
}

/**
 * Hook for article actions (admin operations)
 */
export function useArticleActions(): UseArticleActionsReturn {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const deleteArticle = useCallback(async (slug: string): Promise<boolean> => {
    const adminKey = localStorage.getItem('admin-password');
    if (!adminKey) {
      alert('Admin authentication required. Please log in again.');
      window.location.href = '/login';
      return false;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/articles?slug=${slug}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey,
        }
      });

      if (response.ok) {
        return true;
      } else {
        const error = await response.json();
        alert(`Failed to delete article: ${error.error}`);
        return false;
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the article');
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const bulkDeleteArticles = useCallback(async (slugs: string[]): Promise<{ success: string[]; failed: string[] }> => {
    const adminKey = localStorage.getItem('admin-password');
    if (!adminKey) {
      alert('Admin authentication required. Please log in again.');
      window.location.href = '/login';
      return { success: [], failed: slugs };
    }

    setIsDeleting(true);
    const results = { success: [] as string[], failed: [] as string[] };

    try {
      const deletePromises = slugs.map(async (slug) => {
        try {
          const response = await fetch(`/api/articles?slug=${slug}`, {
            method: 'DELETE',
            headers: {
              'x-admin-key': adminKey,
            }
          });
          return { slug, success: response.ok };
        } catch (error) {
          return { slug, success: false };
        }
      });

      const responses = await Promise.all(deletePromises);
      
      responses.forEach(({ slug, success }) => {
        if (success) {
          results.success.push(slug);
        } else {
          results.failed.push(slug);
        }
      });

      return results;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  const downloadArticle = useCallback(async (slug: string): Promise<void> => {
    setIsDownloading(true);
    try {
      // Implementation would download the article as ZIP
      const response = await fetch(`/api/articles/${slug}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download article');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    deleteArticle,
    bulkDeleteArticles,
    downloadArticle,
    isDeleting,
    isDownloading,
  };
}

export interface UseArticleUploadReturn {
  uploadFiles: (files: FileList) => Promise<void>;
  progress: { [fileName: string]: number };
  isUploading: boolean;
  uploadResults: { slug: string; title?: string }[];
}

/**
 * Hook for article upload operations
 */
export function useArticleUpload(): UseArticleUploadReturn {
  const [progress, setProgress] = useState<{ [fileName: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{ slug: string; title?: string }[]>([]);

  const uploadFiles = useCallback(async (files: FileList) => {
    setIsUploading(true);
    setProgress({});
    setUploadResults([]);

    // Implementation would handle file uploads with progress tracking
    // This is a placeholder for the actual upload logic
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = file.name;
        
        // Simulate progress
        setProgress(prev => ({ ...prev, [fileName]: 0 }));
        
        // Simulate upload process
        for (let p = 0; p <= 100; p += 25) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setProgress(prev => ({ ...prev, [fileName]: p }));
        }
      }
      
      // Simulate results
      const results = Array.from(files).map((file, index) => ({
        slug: `uploaded-article-${index}`,
        title: file.name.replace('.zip', '')
      }));
      
      setUploadResults(results);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadFiles,
    progress,
    isUploading,
    uploadResults,
  };
}
