'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/utils/i18n';
import { Article } from '@/types/article';
import { SiteConfig } from '@/types/content';
import ArticleCard from '@/components/ui/ArticleCard';
import { useArticles, useArticleActions, useArticleUpload } from '@/hooks/useArticles';
import { isAdminEnabled } from '@/utils/admin';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ArticlesExplorerProps {
  config: SiteConfig;
}

export default function ArticlesExplorer({ config }: ArticlesExplorerProps) {
  const { translations } = useLanguage(config);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  // Use modular hooks
  const { 
    articles, 
    loading, 
    error,
    refresh,
    searchArticles,
    filterByTag,
    filterByCategory,
    clearFilters
  } = useArticles();
  
  const {
    deleteArticle,
    bulkDeleteArticles,
    downloadArticle,
    isDeleting
  } = useArticleActions();
  
  const {
    uploadFiles,
    progress,
    isUploading,
    uploadResults
  } = useArticleUpload();

  // Check admin status on mount
  useEffect(() => {
    setIsAdmin(isAdminEnabled());
  }, []);

  // Handle search term changes
  useEffect(() => {
    searchArticles(searchTerm);
  }, [searchTerm, searchArticles]);

  // Handle tag filter changes
  useEffect(() => {
    filterByTag(selectedTag);
  }, [selectedTag, filterByTag]);

  // Handle category filter changes
  useEffect(() => {
    filterByCategory(selectedCategory);
  }, [selectedCategory, filterByCategory]);

  // Get unique tags and categories from all articles
  const { tags, categories } = useMemo(() => {
    const allTags = new Set<string>();
    const allCategories = new Set<string>();
    
    articles.forEach(article => {
      article.metadata.tags.forEach(tag => allTags.add(tag));
      allCategories.add(article.metadata.category);
    });
    
    return {
      tags: Array.from(allTags).sort(),
      categories: Array.from(allCategories).sort()
    };
  }, [articles]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
    setSelectedCategory('');
    clearFilters();
  };

  const handleArticleSelect = (slug: string, selected: boolean) => {
    const newSelected = new Set(selectedArticles);
    if (selected) {
      newSelected.add(slug);
    } else {
      newSelected.delete(slug);
    }
    setSelectedArticles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedArticles.size === articles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(articles.map(a => a.slug)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedArticles.size === 0) return;
    
    const confirmation = confirm(`Delete ${selectedArticles.size} selected articles?`);
    if (!confirmation) return;

    const slugs = Array.from(selectedArticles);
    const results = await bulkDeleteArticles(slugs);
    
    if (results.success.length > 0) {
      setSelectedArticles(new Set());
      await refresh();
    }
    
    if (results.failed.length > 0) {
      alert(`Failed to delete ${results.failed.length} articles`);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    await uploadFiles(files);
    await refresh();
    
    // Reset input
    event.target.value = '';
  };

  if (loading) {
    return (
      <div id="articles-explorer-loading" className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-1"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="articles-explorer-error" className="text-center py-8 text-red-500">
        <p>Error loading articles: {error}</p>
        <button 
          id="articles-explorer-retry-button"
          onClick={refresh}
          className="mt-4 px-4 py-2 bg-accent-1 text-white rounded hover:bg-accent-2"
        >
          Retry
        </button>
      </div>
    );
  };

  return (
    <div id="articles-explorer-container" className="w-full max-w-6xl mx-auto p-4">
      {/* Header with Search and Controls */}
      <div id="articles-explorer-header" className="mb-6">
        <div id="articles-explorer-search-bar" className="mb-4">
          <input
            id="articles-search-input"
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-accent-1"
          />
        </div>

        {/* Admin Upload Controls */}
        {isAdmin && (
          <div id="articles-explorer-admin-controls" className="mb-4 p-4 border rounded-lg bg-card">
            <div className="flex flex-wrap gap-4 items-center">
              <label htmlFor="article-upload-input" className="btn-primary cursor-pointer">
                {isUploading ? 'Uploading...' : 'Upload Articles'}
              </label>
              <input
                id="article-upload-input"
                type="file"
                multiple
                accept=".zip"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              
              <button
                id="bulk-mode-toggle"
                onClick={() => setBulkMode(!bulkMode)}
                className={`px-4 py-2 rounded ${bulkMode ? 'bg-accent-1 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Bulk Mode
              </button>

              {bulkMode && selectedArticles.size > 0 && (
                <div className="flex gap-2">
                  <button
                    id="bulk-delete-button"
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : `Delete ${selectedArticles.size}`}
                  </button>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {Object.keys(progress).length > 0 && (
              <div id="upload-progress-container" className="mt-4">
                <h4 className="font-semibold mb-2">Upload Progress:</h4>
                {Object.entries(progress).map(([fileName, percent]) => (
                  <div key={fileName} className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span>{fileName}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-accent-1 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Results */}
            {uploadResults.length > 0 && (
              <div id="upload-results-container" className="mt-4">
                <h4 className="font-semibold mb-2">Upload Results:</h4>
                <ul className="text-sm">
                  {uploadResults.map((result, index) => (
                    <li key={index} className="text-green-600">
                      ✓ {result.title || result.slug}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div id="articles-explorer-filters" className="flex flex-wrap gap-4 mb-4">
          {/* Tag Filter */}
          {tags.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Tag:</label>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    id={`tag-filter-${tag}`}
                    onClick={() => handleTagFilter(tag)}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedTag === tag
                        ? 'bg-accent-1 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Category:</label>
              <select
                id="category-filter-select"
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="px-3 py-2 border rounded bg-card text-foreground"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Filters */}
          {(searchTerm || selectedTag || selectedCategory) && (
            <button
              id="clear-filters-button"
              onClick={handleClearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Bulk Selection Controls */}
        {bulkMode && (
          <div id="bulk-selection-controls" className="mb-4 p-3 border rounded bg-gray-50">
            <div className="flex items-center gap-4">
              <button
                id="select-all-button"
                onClick={handleSelectAll}
                className="text-sm text-accent-1 hover:text-accent-2"
              >
                {selectedArticles.size === articles.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-sm text-gray-600">
                {selectedArticles.size} of {articles.length} selected
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Articles Grid */}
      <div id="articles-explorer-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard
            key={article.slug}
            article={article}
            adminEnabled={isAdmin}
            allowZipDownload={true}
            onDelete={async () => {
              const success = await deleteArticle(article.slug);
              if (success) {
                await refresh();
              }
            }}
            selectable={bulkMode}
            selected={selectedArticles.has(article.slug)}
            onSelectionChange={(slug, selected) => handleArticleSelect(slug, selected)}
          />
        ))}
      </div>

      {/* No Results Message */}
      {articles.length === 0 && (
        <div id="no-articles-message" className="text-center py-12 text-gray-500">
          <p className="text-lg">
            {searchTerm || selectedTag || selectedCategory
              ? 'No articles found matching your filters.'
              : 'No articles available.'}
          </p>
          {(searchTerm || selectedTag || selectedCategory) && (
            <button
              id="clear-filters-from-empty"
              onClick={handleClearFilters}
              className="mt-4 text-accent-1 hover:text-accent-2 underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
