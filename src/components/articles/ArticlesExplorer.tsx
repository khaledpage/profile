'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/utils/i18n';
import { Article } from '@/types/article';
import { SiteConfig } from '@/types/content';
import ArticleCard from '@/components/ui/ArticleCard';

interface ArticlesExplorerProps {
  config: SiteConfig;
}

export default function ArticlesExplorer({ config }: ArticlesExplorerProps) {
  const { translations } = useLanguage(config);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load articles from static JSON file
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/articles.json');
        if (!response.ok) {
          throw new Error('Failed to load articles');
        }
        const data = await response.json();
        setArticles(data.articles || []);
        setError(null);
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('Failed to load articles');
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Filter articles based on search term, tag, and category
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = !searchTerm || 
        article.metadata.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.metadata.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = !selectedTag || 
        article.metadata.tags?.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        article.metadata.category?.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesTag && matchesCategory;
    });
  }, [articles, searchTerm, selectedTag, selectedCategory]);

    // Get all unique tags and categories for filters
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    articles.forEach(article => {
      article.metadata.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [articles]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    articles.forEach(article => {
      if (article.metadata.category) {
        categories.add(article.metadata.category);
      }
    });
    return Array.from(categories).sort();
  }, [articles]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-1 mx-auto"></div>
          <p className="mt-4 text-lg" style={{ color: 'var(--foreground-muted)' }}>
            Loading articles...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg" style={{ color: 'var(--error)' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--card-border)',
              color: 'var(--foreground)',
            }}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--card-border)',
              color: 'var(--foreground)',
            }}
          >
            <option value="">All Categories</option>
            {allCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--card-border)',
              color: 'var(--foreground)',
            }}
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {(searchTerm || selectedTag || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTag('');
                setSelectedCategory('');
              }}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: 'var(--accent-1)',
                color: 'var(--card-contrast)',
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6 text-center">
        <p style={{ color: 'var(--foreground-muted)' }}>
          {filteredArticles.length === articles.length 
            ? `${articles.length} article${articles.length !== 1 ? 's' : ''}`
            : `${filteredArticles.length} of ${articles.length} articles`
          }
        </p>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl mb-4" style={{ color: 'var(--foreground)' }}>
            No articles found
          </p>
          <p style={{ color: 'var(--foreground-muted)' }}>
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}
