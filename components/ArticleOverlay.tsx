'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { FeaturedArticle } from '@/lib/featuredArticleLoader';

interface ArticleOverlayProps {
  article: FeaturedArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleOverlay({ article, isOpen, onClose }: ArticleOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!article || !isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop with slight transparency to show home page behind */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Article Container */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div 
          className={`
            relative w-full max-w-5xl max-h-[90vh] 
            bg-white dark:bg-gray-900 
            rounded-2xl shadow-2xl 
            overflow-hidden
            transform transition-all duration-300
            ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
          `}
        >
          {/* Header with close button */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{article.icon}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {article.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {article.category} • {article.readTime}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close article"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Article Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="p-6">
              {/* Render HTML content with styles */}
              <div 
                className="article-content prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.htmlContent || '' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Article-specific styles */}
      <style jsx global>{`
        .article-content .category-badge {
          @apply inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full mb-4;
        }
        
        .article-content .article-header {
          @apply mb-8 pb-6 border-b border-gray-200 dark:border-gray-700;
        }
        
        .article-content .article-subtitle {
          @apply text-xl text-gray-600 dark:text-gray-400 mb-4;
        }
        
        .article-content .article-meta {
          @apply flex gap-4 text-sm text-gray-500 dark:text-gray-500;
        }
        
        .article-content .article-meta span {
          @apply px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded;
        }
        
        .article-content .benefits-grid {
          @apply grid grid-cols-1 md:grid-cols-2 gap-6 my-8;
        }
        
        .article-content .benefit-card {
          @apply p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow;
        }
        
        .article-content .benefit-icon {
          @apply text-3xl mb-3;
        }
        
        .article-content .benefit-card h3 {
          @apply text-lg font-semibold mb-2 text-gray-900 dark:text-white;
        }
        
        .article-content .process-steps {
          @apply grid grid-cols-1 md:grid-cols-2 gap-6 my-8;
        }
        
        .article-content .step {
          @apply flex gap-4;
        }
        
        .article-content .step-number {
          @apply w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0;
        }
        
        .article-content .stats-container {
          @apply grid grid-cols-1 md:grid-cols-3 gap-6 my-8;
        }
        
        .article-content .stat {
          @apply text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg;
        }
        
        .article-content .stat-number {
          @apply text-3xl font-bold text-blue-600 dark:text-blue-400;
        }
        
        .article-content .stat-label {
          @apply text-sm text-gray-600 dark:text-gray-400 mt-2;
        }
        
        .article-content .cta-section {
          @apply bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-lg mt-8 text-center;
        }
        
        .article-content .cta-buttons {
          @apply flex flex-col sm:flex-row gap-4 justify-center mt-6;
        }
        
        .article-content .cta-primary {
          @apply px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors;
        }
        
        .article-content .cta-secondary {
          @apply px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg font-medium transition-colors;
        }
        
        .article-content .automation-cards {
          @apply grid grid-cols-1 md:grid-cols-2 gap-4 my-6;
        }
        
        .article-content .automation-card {
          @apply p-4 border border-gray-200 dark:border-gray-700 rounded-lg;
        }
        
        .article-content .automation-card h3 {
          @apply font-semibold mb-2 text-gray-900 dark:text-white;
        }
      `}</style>
    </div>
  );
}
