'use client';

import { useState, useEffect, useCallback } from 'react';
import { Article } from '@/types/article';
import { renderMarkdownSync } from '@/utils/markdown';

interface ArticleEditModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedArticle: Article) => Promise<boolean>;
}

export default function ArticleEditModal({ article, isOpen, onClose, onSave }: ArticleEditModalProps) {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load article data when modal opens
  useEffect(() => {
    if (isOpen && article) {
      setTitle(article.metadata.title);
      setSummary(article.metadata.summary);
      setTags(article.metadata.tags.join(', '));
      setCategory(article.metadata.category);
      setFeatured(article.metadata.featured);
      setCoverImage(article.metadata.coverImage || '');
      setHasUnsavedChanges(false);
      
      // Load article content
      loadArticleContent();
    }
  }, [isOpen, article]);

  const loadArticleContent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/articles/${article.slug}/content`);
      if (response.ok) {
        const { content } = await response.json();
        setContent(content);
      }
    } catch (error) {
      console.error('Failed to load article content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Track changes
  useEffect(() => {
    if (isOpen) {
      setHasUnsavedChanges(
        title !== article.metadata.title ||
        summary !== article.metadata.summary ||
        tags !== article.metadata.tags.join(', ') ||
        category !== article.metadata.category ||
        featured !== article.metadata.featured ||
        coverImage !== (article.metadata.coverImage || '') ||
        content !== (article.content || '')
      );
    }
  }, [title, summary, tags, category, featured, coverImage, content, isOpen, article]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges || isSaving) return;
    
    await handleSave(true);
  }, [hasUnsavedChanges, isSaving]);

  useEffect(() => {
    if (!isOpen || !hasUnsavedChanges) return;
    
    const autoSaveTimer = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(autoSaveTimer);
  }, [isOpen, hasUnsavedChanges, autoSave]);

  const handleSave = async (isAutoSave = false) => {
    setIsSaving(true);
    
    try {
      const updatedArticle: Article = {
        ...article,
        metadata: {
          ...article.metadata,
          title,
          summary,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          category,
          featured,
          ...(coverImage && { coverImage }),
        },
        content
      };

      const success = await onSave(updatedArticle);
      
      if (success) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        
        if (!isAutoSave) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('Failed to save article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const confirmClose = confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      id="article-edit-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div 
        id="article-edit-modal"
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col"
        style={{ 
          backgroundColor: 'var(--card)',
          color: 'var(--foreground)',
          border: '1px solid var(--muted)'
        }}
      >
        {/* Header */}
        <div 
          id="modal-header"
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--muted)' }}
        >
          <div>
            <h2 id="modal-title" className="text-xl font-bold">Edit Article</h2>
            <p id="modal-subtitle" className="text-sm" style={{ color: 'var(--muted)' }}>
              {article.slug}
              {lastSaved && (
                <span className="ml-2">
                  • Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              {hasUnsavedChanges && (
                <span className="ml-2 text-orange-500">• Unsaved changes</span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              id="preview-toggle-button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 rounded border"
              style={{
                backgroundColor: showPreview ? 'var(--accent-1)' : 'transparent',
                color: showPreview ? 'white' : 'var(--foreground)',
                borderColor: 'var(--accent-1)'
              }}
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            <button
              id="save-button"
              onClick={() => handleSave()}
              disabled={!hasUnsavedChanges || isSaving}
              className="px-4 py-2 rounded text-white disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-1)' }}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            
            <button
              id="close-button"
              onClick={handleClose}
              className="px-4 py-2 rounded border"
              style={{
                borderColor: 'var(--muted)',
                color: 'var(--foreground)'
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div id="modal-content" className="flex-1 flex overflow-hidden">
          {/* Metadata Panel */}
          <div 
            id="metadata-panel"
            className="w-80 p-6 border-r overflow-y-auto"
            style={{ borderColor: 'var(--muted)' }}
          >
            <h3 className="font-semibold mb-4">Article Metadata</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--muted)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>

              <div>
                <label htmlFor="edit-summary" className="block text-sm font-medium mb-1">
                  Summary
                </label>
                <textarea
                  id="edit-summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--muted)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>

              <div>
                <label htmlFor="edit-tags" className="block text-sm font-medium mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  id="edit-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, javascript, tutorial"
                  className="w-full px-3 py-2 border rounded"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--muted)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>

              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <input
                  id="edit-category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--muted)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>

              <div>
                <label htmlFor="edit-cover-image" className="block text-sm font-medium mb-1">
                  Cover Image URL
                </label>
                <input
                  id="edit-cover-image"
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--muted)',
                    color: 'var(--foreground)'
                  }}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="edit-featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="edit-featured" className="text-sm font-medium">
                  Featured Article
                </label>
              </div>
            </div>
          </div>

          {/* Editor/Preview Panel */}
          <div id="editor-panel" className="flex-1 flex flex-col">
            {showPreview ? (
              <div id="preview-panel" className="flex-1 p-6 overflow-y-auto">
                <h3 className="font-semibold mb-4">Preview</h3>
                <div 
                  id="preview-content"
                  className="prose prose-lg max-w-none"
                  style={{ color: 'var(--foreground)' }}
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdownSync(content)
                  }}
                />
              </div>
            ) : (
              <div id="editor-container" className="flex-1 flex flex-col p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Content Editor</h3>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>
                    Markdown supported
                  </span>
                </div>
                
                {isLoading ? (
                  <div id="editor-loading" className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
                         style={{ borderColor: 'var(--accent-1)' }}></div>
                  </div>
                ) : (
                  <textarea
                    id="content-editor"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 p-4 border rounded font-mono text-sm resize-none"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--muted)',
                      color: 'var(--foreground)'
                    }}
                    placeholder="Write your article content here using Markdown..."
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
