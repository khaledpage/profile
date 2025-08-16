'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  adminEnabled?: boolean;
  allowZipDownload?: boolean;
  onDelete?: (slug: string) => void;
}

export default function ArticleCard({ article, featured = false, adminEnabled = false, allowZipDownload = false, onDelete }: ArticleCardProps) {
  const { metadata, slug } = article;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const [isDeleting, setIsDeleting] = useState(false);

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
          const blob = await ares.blob();
          zip.file(`assets/${name}`, blob as Blob);
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
      const adminKey = localStorage.getItem('admin-password') || process.env.ADMIN_PASSWORD;
      const response = await fetch(`/api/articles?slug=${slug}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey || '',
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
  
  return (
    <Link href={`/articles/${slug}`} id={`article-card-link-${slug}`} className="group block">
      <article 
        id={`article-card-${slug}`}
        className={`glass rounded-2xl overflow-hidden transition-all duration-300 lift ${
          featured ? 'col-span-full lg:col-span-2' : ''
        }`}
      >
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
        
        <div id={`article-content-${slug}`} className="p-6">
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
    </Link>
  );
}
