'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';
import { TemplateService, ArticleTemplate, TemplateCategory } from '@/services/templateService';

type Props = {
  config: SiteConfig;
  onCreateFromTemplate?: (templateId: string) => void;
};

export default function TemplateManager({ config, onCreateFromTemplate }: Props) {
  const { translations } = useLanguage(config);
  const [templates, setTemplates] = useState<ArticleTemplate[]>([]);
  const [categories] = useState<TemplateCategory[]>(TemplateService.getCategories());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ArticleTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ArticleTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewTemplate) {
        setPreviewTemplate(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [previewTemplate]);

  const loadTemplates = () => {
    setTemplates(TemplateService.getAllTemplates());
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      TemplateService.deleteTemplate(templateId);
      loadTemplates();
    }
  };

  const handleCreateFromTemplate = (templateId: string) => {
    onCreateFromTemplate?.(templateId);
  };

  return (
    <div id="template-manager-container" className="space-y-6">
      {/* Header */}
      <div id="template-manager-header" className="flex justify-between items-center">
        <div>
          <h2 id="template-manager-title" className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            {translations?.admin?.templates?.title || 'Article Templates'}
          </h2>
          <p id="template-manager-subtitle" className="text-sm" style={{ color: 'var(--muted)' }}>
            {translations?.admin?.templates?.subtitle || 'Create and manage reusable article templates'}
          </p>
        </div>
        <button
          id="create-template-button"
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 rounded-md transition-colors"
          style={{
            backgroundColor: 'var(--accent-1)',
            color: 'var(--card-contrast)',
          }}
        >
          {translations?.admin?.templates?.createNew || 'Create Template'}
        </button>
      </div>

      {/* Category Filter */}
      <div id="template-category-filter" className="flex gap-2 flex-wrap">
        <button
          id="category-filter-all"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-md border transition-colors ${
            selectedCategory === 'all'
              ? 'border-accent-1 bg-accent-1/10'
              : 'border-border hover:border-accent-1/50'
          }`}
          style={{
            color: selectedCategory === 'all' ? 'var(--accent-1)' : 'var(--foreground)',
          }}
        >
          All Templates ({templates.length})
        </button>
        {categories.map((category) => {
          const count = templates.filter(t => t.category === category.id).length;
          return (
            <button
              key={category.id}
              id={`category-filter-${category.id}`}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-md border transition-colors ${
                selectedCategory === category.id
                  ? 'border-accent-1 bg-accent-1/10'
                  : 'border-border hover:border-accent-1/50'
              }`}
              style={{
                color: selectedCategory === category.id ? 'var(--accent-1)' : 'var(--foreground)',
              }}
            >
              {category.icon} {category.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div id="templates-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            id={`template-card-${template.id}`}
            className="glass rounded-xl p-6 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {categories.find(c => c.id === template.category)?.icon || '📄'}
                </span>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {template.name}
                  </h3>
                  <p className="text-xs capitalize" style={{ color: 'var(--muted)' }}>
                    {template.category}
                  </p>
                </div>
              </div>
              {template.category === 'custom' && (
                <button
                  id={`delete-template-${template.id}`}
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {template.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {template.metadata.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 80%)',
                    color: 'var(--accent-1)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                id={`preview-template-${template.id}`}
                onClick={() => setPreviewTemplate(template)}
                className="flex-1 px-3 py-2 text-sm border rounded-md transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              >
                Preview
              </button>
              <button
                id={`use-template-${template.id}`}
                onClick={() => handleCreateFromTemplate(template.id)}
                className="flex-1 px-3 py-2 text-sm rounded-md transition-colors"
                style={{
                  backgroundColor: 'var(--accent-1)',
                  color: 'var(--card-contrast)',
                }}
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div id="templates-empty-state" className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
            No templates found
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
            {selectedCategory === 'all' 
              ? 'Create your first template to get started'
              : `No templates in the ${categories.find(c => c.id === selectedCategory)?.name} category`
            }
          </p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: 'var(--accent-1)',
              color: 'var(--card-contrast)',
            }}
          >
            Create Template
          </button>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <div id="template-preview-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'color-mix(in srgb, var(--background), transparent 20%)' }}
            onClick={() => setPreviewTemplate(null)}
          />
          <div
            className="relative glass rounded-xl p-6 max-w-4xl max-h-[80vh] overflow-auto w-full"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                Template Preview: {previewTemplate.name}
              </h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-foreground/10 rounded transition-colors"
                style={{ color: 'var(--foreground)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Metadata</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Title:</span>
                    <span className="ml-2" style={{ color: 'var(--foreground)' }}>{previewTemplate.metadata.title}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Category:</span>
                    <span className="ml-2" style={{ color: 'var(--foreground)' }}>{previewTemplate.metadata.category}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Reading Time:</span>
                    <span className="ml-2" style={{ color: 'var(--foreground)' }}>{previewTemplate.metadata.readingTime} min</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Tags:</span>
                    <span className="ml-2" style={{ color: 'var(--foreground)' }}>{previewTemplate.metadata.tags.join(', ')}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Content Structure</h4>
                <pre
                  className="text-sm p-4 rounded border overflow-auto max-h-96"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)',
                    color: 'var(--foreground)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {previewTemplate.content}
                </pre>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  handleCreateFromTemplate(previewTemplate.id);
                  setPreviewTemplate(null);
                }}
                className="px-4 py-2 rounded-md transition-colors"
                style={{
                  backgroundColor: 'var(--accent-1)',
                  color: 'var(--card-contrast)',
                }}
              >
                Use This Template
              </button>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 border rounded-md transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
