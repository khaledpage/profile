'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';
import { TemplateService, ArticleTemplate } from '@/services/templateService';

type Props = {
  config: SiteConfig;
  templateId?: string;
  onArticleCreated?: (articleData: { content: string; metadata: any }) => void;
  onCancel?: () => void;
};

export default function ArticleFromTemplate({ config, templateId, onArticleCreated, onCancel }: Props) {
  const { translations } = useLanguage(config);
  const [template, setTemplate] = useState<ArticleTemplate | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    tags: '',
    excerpt: '',
    featured: false
  });
  const [isCreating, setIsCreating] = useState(false);
  const [previewContent, setPreviewContent] = useState('');

  useEffect(() => {
    if (templateId) {
      const loadedTemplate = TemplateService.getTemplate(templateId);
      if (loadedTemplate) {
        setTemplate(loadedTemplate);
        setFormData({
          title: loadedTemplate.metadata.title,
          slug: generateSlug(loadedTemplate.metadata.title),
          category: loadedTemplate.metadata.category,
          tags: loadedTemplate.metadata.tags.join(', '),
          excerpt: loadedTemplate.metadata.excerpt,
          featured: loadedTemplate.metadata.featured || false
        });
        updatePreview(loadedTemplate, loadedTemplate.metadata.title);
      }
    }
  }, [templateId]);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const updatePreview = (template: ArticleTemplate, title: string) => {
    let content = template.content;
    // Replace template variables
    content = content.replace(/\{\{title\}\}/g, title);
    content = content.replace(/\{\{introduction\}\}/g, '[Your introduction here]');
    content = content.replace(/\{\{conclusion\}\}/g, '[Your conclusion here]');
    // Add more replacements as needed
    setPreviewContent(content);
  };

  const handleInputChange = (field: string, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (field === 'title' && template) {
      newFormData.slug = generateSlug(value);
      setFormData(newFormData);
      updatePreview(template, value);
    }
  };

  const handleCreateArticle = async () => {
    if (!template) return;

    setIsCreating(true);
    try {
      const articleData = TemplateService.createArticleFromTemplate(template.id, {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });

      if (articleData) {
        // Update metadata with form data
        articleData.metadata = {
          ...articleData.metadata,
          excerpt: formData.excerpt,
          featured: formData.featured
        };
        
        onArticleCreated?.(articleData);
      }
    } catch (error) {
      console.error('Error creating article from template:', error);
    } finally {
      setIsCreating(false);
    }
  };

  if (!template) {
    return (
      <div id="template-not-found" className="text-center py-8">
        <div className="text-4xl mb-4">❌</div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
          Template not found
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
          The requested template could not be loaded.
        </p>
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-md transition-colors"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div id="article-from-template-container" className="space-y-6">
      {/* Header */}
      <div id="article-from-template-header" className="flex justify-between items-center">
        <div>
          <h2 id="article-from-template-title" className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            Create Article from Template
          </h2>
          <p id="article-from-template-subtitle" className="text-sm" style={{ color: 'var(--muted)' }}>
            Using template: <span className="font-medium">{template.name}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-md transition-colors"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          >
            Cancel
          </button>
          <button
            id="create-article-button"
            onClick={handleCreateArticle}
            disabled={isCreating || !formData.title.trim()}
            className="px-4 py-2 rounded-md transition-colors disabled:opacity-50"
            style={{
              backgroundColor: 'var(--accent-1)',
              color: 'var(--card-contrast)',
            }}
          >
            {isCreating ? 'Creating...' : 'Create Article'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div id="article-form-section" className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Article Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="article-title" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Title *
              </label>
              <input
                id="article-title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full p-3 border rounded-md"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
                placeholder="Enter article title"
              />
            </div>

            <div>
              <label htmlFor="article-slug" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Slug
              </label>
              <input
                id="article-slug"
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full p-3 border rounded-md"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
                placeholder="article-url-slug"
              />
            </div>

            <div>
              <label htmlFor="article-category" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Category
              </label>
              <input
                id="article-category"
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-3 border rounded-md"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
                placeholder="Article category"
              />
            </div>

            <div>
              <label htmlFor="article-tags" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Tags
              </label>
              <input
                id="article-tags"
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full p-3 border rounded-md"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div>
              <label htmlFor="article-excerpt" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Excerpt
              </label>
              <textarea
                id="article-excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                rows={3}
                className="w-full p-3 border rounded-md"
                style={{
                  backgroundColor: 'var(--card)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
                placeholder="Brief description of the article"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="article-featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="article-featured" className="text-sm" style={{ color: 'var(--foreground)' }}>
                Featured article
              </label>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div id="article-preview-section" className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            Content Preview
          </h3>
          
          <div 
            className="text-sm border rounded-md p-4 max-h-96 overflow-auto"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)',
              borderColor: 'var(--border)',
            }}
          >
            <pre
              className="whitespace-pre-wrap"
              style={{ color: 'var(--foreground)' }}
            >
              {previewContent}
            </pre>
          </div>
          
          <div className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>
            * This is a preview of the article structure. You can edit the content after creation.
          </div>
        </div>
      </div>
    </div>
  );
}
