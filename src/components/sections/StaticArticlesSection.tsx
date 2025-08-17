'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

type StaticArticle = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  publishDate: string;
  tags: string[];
  category: string;
  readingTime: number;
  featured?: boolean;
};

type Props = {
  config: SiteConfig;
};

export default function StaticArticlesSection({ config }: Props) {
  const { translations } = useLanguage(config);
  const [articles, setArticles] = useState<StaticArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaticArticles() {
      try {
        const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const response = await fetch(`${base}/data/static-articles.json`, { cache: 'force-cache' });
        if (response.ok) {
          const data = await response.json();
          setArticles(Array.isArray(data) ? data : []);
        } else {
          // Fallback to empty array if no static articles exist
          setArticles([]);
        }
      } catch (err) {
        console.error('Error fetching static articles:', err);
        setError(err instanceof Error ? err.message : 'Failed to load static articles');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchStaticArticles();
  }, []);

  if (loading) {
    return (
      <section id="static-articles-section-loading" className="py-20">
        <div id="static-articles-loading-container" className="container mx-auto px-6">
          <div id="static-articles-loading-header" className="text-center mb-12">
            <h2 id="static-articles-loading-title" className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              {'Static Articles'}
            </h2>
            <p id="static-articles-loading-subtitle" style={{ color: 'var(--muted)' }}>
              {'HTML-only articles and tutorials'}
            </p>
          </div>
          <div id="static-articles-loading-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} id={`static-article-skeleton-${i}`} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div id={`static-article-skeleton-image-${i}`} className="aspect-video" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
                <div id={`static-article-skeleton-content-${i}`} className="p-6">
                  <div id={`static-article-skeleton-line1-${i}`} className="h-4 rounded mb-3" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
                  <div id={`static-article-skeleton-line2-${i}`} className="h-6 rounded mb-3" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
                  <div id={`static-article-skeleton-line3-${i}`} className="h-16 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="static-articles-section-error" className="py-20">
        <div id="static-articles-error-container" className="container mx-auto px-6 text-center">
          <h2 id="static-articles-error-title" className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            {'Static Articles'}
          </h2>
          <p id="static-articles-error-message" style={{ color: 'var(--muted)' }}>
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section id="static-articles-section-empty" className="py-20">
        <div id="static-articles-empty-container" className="container mx-auto px-6 text-center">
          <h2 id="static-articles-empty-title" className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            {'Static Articles'}
          </h2>
          <p id="static-articles-empty-message" style={{ color: 'var(--muted)' }}>
            {'No static articles available at the moment.'}
          </p>
        </div>
      </section>
    );
  }

  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = new Date(a.publishDate);
    const dateB = new Date(b.publishDate);
    return dateB.getTime() - dateA.getTime();
  });

  // Get featured and regular articles
  const featuredArticle = sortedArticles.find(article => article.featured);
  const scrollArticles = sortedArticles.filter(article => !article.featured);

  return (
    <section id="static-articles" className="py-20">
      <div id="static-articles-container" className="container mx-auto px-6">
        <div id="static-articles-header" className="text-center mb-12">
          <h2 id="static-articles-title" className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            {'Static Articles'}
          </h2>
          <p id="static-articles-subtitle" style={{ color: 'var(--muted)' }}>
            {'HTML-only articles and tutorials'}
          </p>
        </div>

        {/* Featured Article - if exists */}
        {featuredArticle && (
          <div id="featured-static-article-section" className="mb-12">
            <div id="featured-static-article-header" className="text-left mb-6">
              <h3 id="featured-static-article-title" className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                {'Featured Article'}
              </h3>
            </div>
            <div id="featured-static-article-container" className="max-w-4xl mx-auto">
              <StaticArticleCard article={featuredArticle} featured />
            </div>
          </div>
        )}

        {/* Horizontal Scrollable Articles */}
        {scrollArticles.length > 0 && (
          <div id="static-articles-scroll-section" className="mb-8">
            <div id="static-articles-scroll-header" className="text-left mb-6">
              <h3 id="static-articles-scroll-title" className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                {`All Static Articles (${scrollArticles.length})`}
              </h3>
            </div>
            
            <div id="static-articles-scroll-container" className="relative overflow-hidden min-h-[600px] py-4">
              <div
                id="static-articles-scroll-track"
                className="flex gap-6 animate-scroll hover:animate-pause items-stretch h-full"
                style={{
                  width: 'max-content',
                  '--scroll-duration': `${Math.max(90, scrollArticles.length * 20)}s`,
                  minHeight: '520px'
                } as React.CSSProperties}
              >
                {/* Duplicate articles enough times for smooth infinite scroll */}
                {Array.from({ length: Math.max(6, Math.ceil(20 / Math.max(1, scrollArticles.length))) }, (_, repeatIndex) => 
                  scrollArticles.map((article, index) => (
                    <div key={`${article.slug}-${repeatIndex}-${index}`} id={`static-article-scroll-item-${article.slug}-${repeatIndex}-${index}`} className="flex-shrink-0 w-80 h-full py-2">
                      <div className="h-full">
                        <StaticArticleCard article={article} />
                      </div>
                    </div>
                  ))
                ).flat()}
              </div>
            </div>
          </div>
        )}

        {articles.length > 0 && (
          <div id="static-articles-view-all" className="text-center">
            <Link
              id="static-articles-view-all-button"
              href="/static-articles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 10%)',
                color: 'var(--foreground)',
                border: '1px solid color-mix(in srgb, var(--accent-1), transparent 70%)',
              }}
            >
              {'View All Static Articles'}
              <span id="static-articles-view-all-arrow" className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

// Static Article Card Component
function StaticArticleCard({ article, featured = false }: { article: StaticArticle; featured?: boolean }) {
  return (
    <article 
      id={`static-article-card-${article.slug}`}
      className={`glass rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
        featured ? 'lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center' : 'h-full flex flex-col'
      }`}
    >
      {/* Cover Image */}
      {article.coverImage && (
        <div id={`static-article-image-${article.slug}`} className={`${featured ? 'order-2' : 'aspect-video'} overflow-hidden`}>
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Content */}
      <div id={`static-article-content-${article.slug}`} className={`${featured ? 'order-1 lg:p-12 p-8' : 'p-6 flex-1 flex flex-col'}`}>
        {/* Category & Date */}
        <div id={`static-article-meta-${article.slug}`} className="flex items-center gap-3 mb-4">
          <span 
            id={`static-article-category-${article.slug}`}
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 85%)',
              color: 'var(--accent-1)',
            }}
          >
            {article.category}
          </span>
          <span id={`static-article-date-${article.slug}`} className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date(article.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <span id={`static-article-read-time-${article.slug}`} className="text-sm" style={{ color: 'var(--muted)' }}>
            {article.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <h3 id={`static-article-title-${article.slug}`} className={`font-bold mb-3 group-hover:text-accent-1 transition-colors ${featured ? 'text-3xl' : 'text-xl'}`} style={{ color: 'var(--foreground)' }}>
          {article.title}
        </h3>

        {/* Excerpt */}
        <p id={`static-article-excerpt-${article.slug}`} className={`mb-4 ${featured ? 'text-lg' : 'text-sm flex-1'}`} style={{ color: 'var(--muted)' }}>
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div id={`static-article-tags-${article.slug}`} className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                id={`static-article-tag-${article.slug}-${index}`}
                className="px-2 py-1 text-xs rounded"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)',
                  color: 'var(--muted)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More Link */}
        <Link
          href={`/static-articles/${article.slug}`}
          id={`static-article-link-${article.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent-1"
          style={{ color: 'var(--accent-1)' }}
        >
          Read Article
          <span className="transform transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
