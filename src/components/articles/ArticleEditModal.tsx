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
    if (isOpen && article) {
      const currentContent = content || '';
      const originalContent = article.content || '';
      
      setHasUnsavedChanges(
        title !== article.metadata.title ||
        summary !== article.metadata.summary ||
        tags !== article.metadata.tags.join(', ') ||
        category !== article.metadata.category ||
        featured !== article.metadata.featured ||
        coverImage !== (article.metadata.coverImage || '') ||
        currentContent !== originalContent
      );
    }
  }, [title, summary, tags, category, featured, coverImage, content, isOpen, article]);

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!hasUnsavedChanges || isSaving) return;
    
    // Inline save logic to avoid circular dependency
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
      }
    } catch (error) {
      console.error('Failed to auto-save article:', error);
    } finally {
      setIsSaving(false);
    }
  }, [hasUnsavedChanges, isSaving, article, title, summary, tags, category, featured, coverImage, content, onSave]);

  useEffect(() => {
    if (!isOpen || !hasUnsavedChanges) return;
    
    const autoSaveTimer = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(autoSaveTimer);
  }, [isOpen, hasUnsavedChanges, autoSave]);

  // Enhanced handleClose with better UX
  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close without saving?')) {
        // Reset form state
        setTitle('');
        setSummary('');
        setContent('');
        setTags('');
        setCategory('');
        setFeatured(false);
        setCoverImage('');
        setHasUnsavedChanges(false);
        setShowPreview(false);
        onClose();
      }
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, onClose]);

  // Enhanced save handler with better feedback
  const handleSave = useCallback(async () => {
    if (isSaving || !hasUnsavedChanges) return;

    // Validate required fields
    if (!title.trim()) {
      alert('Please enter a title for the article.');
      return;
    }

    if (!content.trim()) {
      alert('Please enter some content for the article.');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const updatedArticle: Article = {
        ...article,
        metadata: {
          ...article.metadata,
          title: title.trim(),
          summary: summary.trim(),
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          category: category.trim(),
          featured,
          ...(coverImage.trim() && { coverImage: coverImage.trim() }),
        },
        content
      };

      const success = await onSave(updatedArticle);
      
      if (success) {
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        
        // Show success feedback
        setTimeout(() => {
          setLastSaved(prev => prev); // Trigger re-render to show "Saved" status
        }, 100);
      } else {
        alert('Failed to save the article. Please try again.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [article, title, summary, content, tags, category, featured, coverImage, hasUnsavedChanges, isSaving, onSave]);

  // Enhanced preview toggle with better state management
  const handlePreviewToggle = useCallback(() => {
    setShowPreview(prev => !prev);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && !isSaving) {
          handleSave();
        }
      }

      // Ctrl/Cmd + P to toggle preview
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handlePreviewToggle();
      }

      // Ctrl/Cmd + B for bold
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (textarea && document.activeElement === textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const selectedText = content.substring(start, end);
          const newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
          setContent(newText);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + 2, end + 2);
          }, 0);
        }
      }

      // Ctrl/Cmd + I for italic
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
        if (textarea && document.activeElement === textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const selectedText = content.substring(start, end);
          const newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
          setContent(newText);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + 1, end + 1);
          }, 0);
        }
      }

      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasUnsavedChanges, isSaving, content, handleSave, handlePreviewToggle, handleClose]);

  if (!isOpen) return null;

  return (
    <div 
      id="article-edit-modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div 
        id="article-edit-modal"
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col overflow-hidden border"
        style={{ 
          backgroundColor: 'var(--card)',
          color: 'var(--foreground)',
          border: '1px solid var(--muted)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Enhanced Header */}
        <div 
          id="modal-header"
          className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r"
          style={{ 
            borderColor: 'var(--muted)',
            background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
            color: 'white'
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white bg-opacity-20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-bold">Edit Article</h2>
              <p id="modal-subtitle" className="text-sm opacity-90">
                {article.slug}
              </p>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center gap-3 ml-6">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500 bg-opacity-20 text-yellow-200">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-xs font-medium">Unsaved Changes</span>
                </div>
              )}
              
              {isSaving && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500 bg-opacity-20 text-blue-200">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  <span className="text-xs font-medium">Saving...</span>
                </div>
              )}
              
              {lastSaved && !hasUnsavedChanges && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500 bg-opacity-20 text-green-200">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-xs font-medium">
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="preview-toggle-button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105"
              style={{
                backgroundColor: showPreview ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={showPreview ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"} />
              </svg>
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            
            <button
              id="save-button"
              onClick={() => handleSave()}
              disabled={!hasUnsavedChanges || isSaving}
              className="px-5 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: hasUnsavedChanges ? 'rgba(34, 197, 94, 0.9)' : 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(4px)',
                boxShadow: hasUnsavedChanges ? '0 4px 15px rgba(34, 197, 94, 0.3)' : 'none'
              }}
              title={!hasUnsavedChanges ? 'No changes to save' : isSaving ? 'Saving...' : 'Save changes'}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save
                </>
              )}
            </button>
            
            <button
              id="close-button"
              onClick={handleClose}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                color: 'white',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div id="modal-content" className="flex-1 flex overflow-hidden">
          {/* Enhanced Metadata Panel */}
          <div 
            id="metadata-panel"
            className="w-80 border-r overflow-y-auto"
            style={{ 
              borderColor: 'var(--muted)',
              background: 'linear-gradient(180deg, var(--card) 0%, color-mix(in srgb, var(--card), var(--background) 30%) 100%)'
            }}
          >
            {/* Panel Header */}
            <div className="px-6 py-4 border-b bg-gradient-to-r from-transparent to-transparent" 
                 style={{ borderColor: 'var(--muted)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                     style={{ backgroundColor: 'var(--accent-1)', color: 'white' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg">Article Metadata</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="edit-title" className="flex items-center gap-2 text-sm font-medium">
                  <svg className="w-4 h-4" style={{ color: 'var(--accent-1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--muted)'
                  }}
                />
              </div>

              {/* Summary Field */}
              <div className="space-y-2">
                <label htmlFor="edit-summary" className="flex items-center gap-2 text-sm font-medium">
                  <svg className="w-4 h-4" style={{ color: 'var(--accent-1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Summary
                </label>
                <textarea
                  id="edit-summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--muted)'
                  }}
                />
              </div>

              {/* Tags Field */}
              <div className="space-y-2">
                <label htmlFor="edit-tags" className="flex items-center gap-2 text-sm font-medium">
                  <svg className="w-4 h-4" style={{ color: 'var(--accent-1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Tags
                </label>
                <input
                  id="edit-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="react, javascript, tutorial"
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--muted)'
                  }}
                />
                <p className="text-xs opacity-70">Separate tags with commas</p>
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label htmlFor="edit-category" className="flex items-center gap-2 text-sm font-medium">
                  <svg className="w-4 h-4" style={{ color: 'var(--accent-1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Category
                </label>
                <input
                  id="edit-category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--muted)'
                  }}
                />
              </div>

              {/* Cover Image Field */}
              <div className="space-y-2">
                <label htmlFor="edit-cover-image" className="flex items-center gap-2 text-sm font-medium">
                  <svg className="w-4 h-4" style={{ color: 'var(--accent-1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Cover Image URL
                </label>
                <input
                  id="edit-cover-image"
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--muted)'
                  }}
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 p-4 rounded-lg border"
                   style={{ borderColor: 'var(--muted)', backgroundColor: 'var(--background)' }}>
                <input
                  id="edit-featured"
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: 'var(--accent-1)' }}
                />
                <label htmlFor="edit-featured" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <svg className="w-4 h-4" style={{ color: 'var(--accent-1)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Featured Article
                </label>
              </div>
            </div>
          </div>

          {/* Enhanced Editor/Preview Panel */}
          <div id="editor-panel" className="flex-1 flex flex-col">
            {showPreview ? (
              <div id="preview-panel" className="flex-1 flex flex-col">
                {/* Preview Header */}
                <div className="px-6 py-4 border-b bg-gradient-to-r from-transparent to-transparent"
                     style={{ borderColor: 'var(--muted)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                         style={{ backgroundColor: 'var(--accent-2)', color: 'white' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">Live Preview</h3>
                    <div className="ml-auto px-3 py-1 rounded-full text-xs font-medium"
                         style={{ backgroundColor: 'var(--accent-2)', color: 'white', opacity: 0.8 }}>
                      Real-time
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6 overflow-y-auto"
                     style={{ backgroundColor: 'var(--background)' }}>
                  <div 
                    id="preview-content"
                    className="prose prose-lg max-w-none"
                    style={{ color: 'var(--foreground)' }}
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdownSync(content)
                    }}
                  />
                </div>
              </div>
            ) : (
              <div id="editor-container" className="flex-1 flex flex-col">
                {/* Editor Header */}
                <div className="px-6 py-4 border-b bg-gradient-to-r from-transparent to-transparent"
                     style={{ borderColor: 'var(--muted)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                         style={{ backgroundColor: 'var(--accent-1)', color: 'white' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg">Content Editor</h3>
                    <div className="ml-auto flex items-center gap-4 text-sm opacity-70">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Markdown supported
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {content.split(/\s+/).filter(word => word).length} words
                      </div>
                    </div>
                  </div>
                  
                  {/* Keyboard Shortcuts Help */}
                  <div className="px-6 py-2 border-b text-xs flex items-center gap-4 opacity-60"
                       style={{ borderColor: 'var(--muted)', backgroundColor: 'var(--card)' }}>
                    <span><kbd className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--muted)' }}>Ctrl+S</kbd> Save</span>
                    <span><kbd className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--muted)' }}>Ctrl+P</kbd> Preview</span>
                    <span><kbd className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--muted)' }}>Ctrl+B</kbd> Bold</span>
                    <span><kbd className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--muted)' }}>Ctrl+I</kbd> Italic</span>
                    <span><kbd className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--muted)' }}>Esc</kbd> Close</span>
                  </div>
                </div>
                
                <div className="flex-1 p-6 flex flex-col"
                     style={{ backgroundColor: 'var(--background)' }}>
                  {isLoading ? (
                    <div id="editor-loading" className="flex-1 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-transparent border-t-2" 
                             style={{ borderTopColor: 'var(--accent-1)' }}></div>
                        <span className="text-sm opacity-70">Loading content...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Markdown Toolbar */}
                      <div className="mb-4 flex items-center gap-2 p-3 rounded-lg border"
                           style={{ borderColor: 'var(--muted)', backgroundColor: 'var(--card)' }}>
                        <span className="text-sm font-medium opacity-70">Quick Tools:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
                            if (textarea) {
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const selectedText = content.substring(start, end);
                              const newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
                              setContent(newText);
                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + 2, end + 2);
                              }, 0);
                            }
                          }}
                          className="px-3 py-1 rounded text-sm font-medium transition-colors hover:opacity-80"
                          style={{ backgroundColor: 'var(--accent-1)', color: 'white' }}
                          title="Bold (Ctrl+B)"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16h4.5a3.5 3.5 0 001.989-6.367A3.5 3.5 0 0011.5 4H7z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12h4" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
                            if (textarea) {
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const selectedText = content.substring(start, end);
                              const newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
                              setContent(newText);
                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + 1, end + 1);
                              }, 0);
                            }
                          }}
                          className="px-3 py-1 rounded text-sm font-medium transition-colors hover:opacity-80"
                          style={{ backgroundColor: 'var(--accent-2)', color: 'white' }}
                          title="Italic (Ctrl+I)"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4l-1 16m4-16l-1 16" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
                            if (textarea) {
                              const start = textarea.selectionStart;
                              const lines = content.split('\n');
                              let lineStart = 0;
                              let lineIndex = 0;
                              
                              // Find which line the cursor is on
                              for (let i = 0; i < lines.length; i++) {
                                if (lineStart + lines[i].length >= start) {
                                  lineIndex = i;
                                  break;
                                }
                                lineStart += lines[i].length + 1;
                              }
                              
                              // Add heading
                              lines[lineIndex] = '## ' + lines[lineIndex];
                              setContent(lines.join('\n'));
                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + 3, start + 3);
                              }, 0);
                            }
                          }}
                          className="px-3 py-1 rounded text-sm font-medium transition-colors hover:opacity-80"
                          style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                          title="Heading"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
                            if (textarea) {
                              const start = textarea.selectionStart;
                              const end = textarea.selectionEnd;
                              const selectedText = content.substring(start, end);
                              const newText = content.substring(0, start) + `\`${selectedText}\`` + content.substring(end);
                              setContent(newText);
                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + 1, end + 1);
                              }, 0);
                            }
                          }}
                          className="px-3 py-1 rounded text-sm font-medium transition-colors hover:opacity-80"
                          style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                          title="Code"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
                            if (textarea) {
                              const start = textarea.selectionStart;
                              const newText = content.substring(0, start) + '[Link Text](https://example.com)' + content.substring(start);
                              setContent(newText);
                              setTimeout(() => {
                                textarea.focus();
                                textarea.setSelectionRange(start + 1, start + 10);
                              }, 0);
                            }
                          }}
                          className="px-3 py-1 rounded text-sm font-medium transition-colors hover:opacity-80"
                          style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
                          title="Link"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </button>
                      </div>
                      
                      <textarea
                        id="content-editor"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="flex-1 p-6 rounded-xl font-mono text-sm resize-none transition-all duration-200 focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: 'var(--card)',
                          border: '2px solid var(--muted)',
                          color: 'var(--foreground)',
                          lineHeight: '1.6',
                          fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace'
                        }}
                        placeholder="# Your Article Title

Start writing your article content here using Markdown...

## Features you can use:
- **Bold text**
- *Italic text*
- `Code snippets`
- [Links](https://example.com)
- Lists and more!

Use the toolbar above for quick formatting or keyboard shortcuts:
- Ctrl+S to save
- Ctrl+P to preview  
- Ctrl+B for bold
- Ctrl+I for italic"
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
