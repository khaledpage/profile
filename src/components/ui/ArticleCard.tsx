'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import ArticleEditModal from '@/components/articles/ArticleEditModal';
import LoadingLink from '@/components/ui/LoadingLink';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  adminEnabled?: boolean;
  allowZipDownload?: boolean;
  onDelete?: (slug: string) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelectionChange?: (slug: string, selected: boolean) => void;
}

export default function ArticleCard({ 
  article, 
  featured = false, 
  adminEnabled = false, 
  allowZipDownload = false, 
  onDelete,
  selectable = false,
  selected = false,
  onSelectionChange
}: ArticleCardProps) {
  const { metadata, slug } = article;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSelectionChange) {
      onSelectionChange(slug, e.target.checked);
    }
  };

  const handleDownloadZip = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`${base}/data/articles/${slug}.json`, { cache: 'force-cache' });
      if (!res.ok) throw new Error('Failed to load article data');
      const data: Article = await res.json();
      const zip = new JSZip();
      zip.file('article.md', data.content || '');
      zip.file('metadata.json', JSON.stringify(data.metadata, null, 2));
      // fetch assets
      for (const name of data.assets || []) {
        const ares = await fetch(`${base}/articles/${slug}/assets/${name}`);
        if (ares.ok) {
          const arrayBuffer = await ares.arrayBuffer();
          zip.file(`assets/${name}`, Buffer.from(arrayBuffer));
        }
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${slug}.zip`);
    } catch (err) {
      console.error('ZIP download failed', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Are you sure you want to delete the article "${metadata.title}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      let adminKey = localStorage.getItem('admin-password');
      
      // If no stored password but admin is enabled by default, use default password
      if (!adminKey) {
        // Use default admin password when admin mode is enabled by default
        adminKey = 'admin'; // This matches ADMIN_PASSWORD in .env.local
      }
      
      const response = await fetch(`/api/articles?slug=${slug}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey,
        }
      });

      if (response.ok) {
        alert('Article deleted successfully');
        if (onDelete) {
          onDelete(slug);
        }
        // Reload the page to refresh the article list
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to delete article: ${error.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the article');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleEditComplete = async (updatedArticle: Article): Promise<boolean> => {
    try {
      let adminKey = localStorage.getItem('admin-password');
      
      // If no stored password but admin is enabled by default, use default password
      if (!adminKey) {
        // Use default admin password when admin mode is enabled by default
        adminKey = 'admin'; // This matches ADMIN_PASSWORD in .env.local
      }

      const response = await fetch('/api/articles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify({
          slug: updatedArticle.slug,
          article: updatedArticle
        }),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        // Reload the page to show updated content
        window.location.reload();
        return true;
      } else {
        const error = await response.json();
        alert(`Failed to save article: ${error.error}`);
        return false;
      }
    } catch (error) {
      console.error('Error saving article:', error);
      alert('An error occurred while saving the article');
      return false;
    }
  };
  
  return (
    <>
      <LoadingLink href={`/articles/${slug}`} id={`article-card-link-${slug}`} className="group block">
        <article 
          id={`article-card-${slug}`}
          className={`glass rounded-2xl overflow-hidden transition-all duration-300 lift h-full max-h-[450px] flex flex-col ${
            featured ? 'col-span-full lg:col-span-2' : ''
          } ${selected ? 'ring-2 ring-blue-500' : ''}`}
        >
        {selectable && adminEnabled && (
          <div className="absolute top-3 left-3 z-10">
            <input
              type="checkbox"
              checked={selected}
              onChange={handleSelectionChange}
              className="w-5 h-5 rounded border-2 focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: selected ? 'var(--accent-1)' : 'var(--card)',
                borderColor: 'var(--accent-1)'
              }}
            />
          </div>
        )}
        <div id={`article-image-container-${slug}`} className="relative aspect-video overflow-hidden">
          <Image
            id={`article-image-${slug}`}
            src={metadata.coverImage}
            alt={metadata.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {adminEnabled && (
            <div id={`article-admin-controls-${slug}`} className="absolute bottom-3 right-3 flex gap-2">
              {allowZipDownload && (
                <button
                  id={`article-download-button-${slug}`}
                  onClick={handleDownloadZip}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border backdrop-blur-sm hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--background), transparent 20%)',
                    color: 'var(--foreground)',
                    borderColor: 'color-mix(in srgb, var(--card), transparent 60%)'
                  }}
                >
                  Download ZIP
                </button>
              )}
              <button
                id={`article-edit-button-${slug}`}
                onClick={handleEdit}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border backdrop-blur-sm hover:scale-105 hover:shadow-lg transition-all flex items-center gap-1"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 85%)',
                  color: 'var(--accent-1)',
                  borderColor: 'var(--accent-1)'
                }}
                title="Edit this article in real-time"
              >
                <span>✏️</span>
                <span>Edit</span>
              </button>
              <button
                id={`article-delete-button-${slug}`}
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border backdrop-blur-sm hover:opacity-80 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--background), transparent 20%)',
                  color: '#ef4444',
                  borderColor: '#ef4444'
                }}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
          
          {metadata.featured && (
            <div 
              id={`article-featured-badge-${slug}`}
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'var(--accent-1)',
                color: 'var(--card-contrast)',
              }}
            >
              Featured
            </div>
          )}
          
          <div 
            id={`article-reading-time-${slug}`}
            className="absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--background), transparent 20%)',
              color: 'var(--foreground)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {metadata.readingTime} min read
          </div>
        </div>
        
        <div id={`article-content-${slug}`} className="p-6 flex-1 flex flex-col justify-between">
          <div id={`article-meta-${slug}`} className="flex items-center gap-2 mb-3">
            <span 
              id={`article-category-${slug}`}
              className="px-2 py-1 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--accent-2), transparent 70%)',
                color: 'var(--accent-2)',
              }}
            >
              {metadata.category}
            </span>
            <span id={`article-date-${slug}`} className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(metadata.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <h3 
            id={`article-title-${slug}`}
            className={`font-bold mb-3 group-hover:text-accent-1 transition-colors ${
              featured ? 'text-2xl' : 'text-xl'
            }`}
            style={{ color: 'var(--foreground)' }}
          >
            {metadata.title}
          </h3>
          
          <p 
            id={`article-summary-${slug}`}
            className={`line-clamp-3 mb-4 ${featured ? 'text-base' : 'text-sm'}`}
            style={{ color: 'var(--muted)' }}
          >
            {metadata.summary}
          </p>
          
          <div id={`article-footer-${slug}`} className="flex items-center justify-between">
            <div id={`article-tags-${slug}`} className="flex flex-wrap gap-2">
              {metadata.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={tag}
                  id={`article-tag-${slug}-${index}`}
                  className="px-2 py-1 rounded-lg text-xs"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--card), transparent 30%)',
                    color: 'var(--muted)',
                  }}
                >
                  {tag}
                </span>
              ))}
              {metadata.tags.length > 3 && (
                <span 
                  id={`article-more-tags-${slug}`}
                  className="text-xs"
                  style={{ color: 'var(--muted)' }}
                >
                  +{metadata.tags.length - 3} more
                </span>
              )}
            </div>
            
            <div 
              id={`article-read-more-${slug}`}
              className="text-sm font-medium group-hover:translate-x-1 transition-transform"
              style={{ color: 'var(--accent-1)' }}
            >
              Read more →
            </div>
          </div>
        </div>
      </article>
    </LoadingLink>
    
    {/* Article Edit Modal */}
    <ArticleEditModal
      article={article}
      isOpen={isEditModalOpen}
      onClose={() => setIsEditModalOpen(false)}
      onSave={handleEditComplete}
    />
  </>
  );
}
