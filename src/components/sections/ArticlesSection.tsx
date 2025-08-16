'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ArticleCard from '@/components/ui/ArticleCard';
import { Article } from '@/types/article';

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        // Prefer API in runtime; fallback to static JSON if needed (e.g., GitHub Pages)
        let list: Article[] = [] as unknown as Article[];
        try {
          const apiRes = await fetch('/api/articles', { cache: 'no-store' });
          if (apiRes.ok) {
            const items: { slug: string; metadata: Article['metadata'] }[] = await apiRes.json();
            list = items.map((a) => ({ slug: a.slug, metadata: a.metadata, content: '', assets: [] } as Article));
          }
        } catch {}

        if (!list || list.length === 0) {
          const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
          const response = await fetch(`${base}/data/articles.json`, { cache: 'force-cache' });
          if (response.ok) {
            const data = await response.json();
            list = Array.isArray(data) ? data : [];
          }
        }

        setArticles(list.slice(0, 9)); // Show up to 9 articles on homepage
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles');
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section id="articles-section-loading" className="py-20">
        <div id="articles-loading-container" className="container mx-auto px-6">
          <div id="articles-loading-header" className="text-center mb-12">
            <h2 id="articles-loading-title" className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Latest Articles
            </h2>
            <p id="articles-loading-subtitle" style={{ color: 'var(--muted)' }}>
              Insights and tutorials on web development
            </p>
          </div>
          
          <div id="articles-loading-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} id={`article-skeleton-${i}`} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div id={`article-skeleton-image-${i}`} className="aspect-video" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
                <div id={`article-skeleton-content-${i}`} className="p-6">
                  <div id={`article-skeleton-line1-${i}`} className="h-4 rounded mb-3" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
                  <div id={`article-skeleton-line2-${i}`} className="h-6 rounded mb-3" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
                  <div id={`article-skeleton-line3-${i}`} className="h-16 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
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
      <section id="articles-section-error" className="py-20">
        <div id="articles-error-container" className="container mx-auto px-6 text-center">
          <h2 id="articles-error-title" className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Latest Articles
          </h2>
          <p id="articles-error-message" style={{ color: 'var(--muted)' }}>
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section id="articles-section-empty" className="py-20">
        <div id="articles-empty-container" className="container mx-auto px-6 text-center">
          <h2 id="articles-empty-title" className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Latest Articles
          </h2>
          <p id="articles-empty-message" style={{ color: 'var(--muted)' }}>
            No articles available at the moment.
          </p>
        </div>
      </section>
    );
  }

  // Sort articles by date (newest first) for main display
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = new Date(a.metadata.publishDate);
    const dateB = new Date(b.metadata.publishDate);
    return dateB.getTime() - dateA.getTime();
  });

  const featuredArticle = sortedArticles.find(article => article.metadata.featured);
  
  // For horizontal scroll: show ALL articles sorted from old to new (chronological order)
  // This ensures the scroll shows the same articles as the /articles page
  const scrollArticles = [...sortedArticles].sort((a, b) => {
    const dateA = new Date(a.metadata.publishDate);
    const dateB = new Date(b.metadata.publishDate);
    return dateA.getTime() - dateB.getTime(); // Oldest first for scroll
  });

  // Fallback: ensure we always have some articles to display
  const fallbackArticles = scrollArticles.length === 0 ? [
    {
      slug: 'coming-soon',
      metadata: {
        title: 'More Articles Coming Soon',
        summary: 'Stay tuned for more exciting content',
        author: 'Khaled Alabsi',
        publishDate: new Date().toISOString(),
        tags: ['Updates'],
        category: 'General',
        coverImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop&crop=entropy&auto=format',
        readingTime: 1,
        featured: false,
        published: true,
        seo: {
          metaDescription: 'More articles coming soon',
          keywords: ['updates', 'coming soon']
        }
      },
      content: '',
      assets: []
    }
  ] : scrollArticles;

  return (
    <section id="articles" className="py-20">
      <div id="articles-container" className="container mx-auto px-6">
        <div id="articles-header" className="text-center mb-12">
          <h2 id="articles-title" className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Latest Articles
          </h2>
          <p id="articles-subtitle" style={{ color: 'var(--muted)' }}>
            Insights and tutorials on web development, design, and technology
          </p>
        </div>

        {/* Featured Article - if exists */}
        {featuredArticle && (
          <div id="featured-article-section" className="mb-12">
            <div id="featured-article-header" className="text-left mb-6">
              <h3 id="featured-article-title" className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                Featured Article
              </h3>
            </div>
            <div id="featured-article-container" className="max-w-4xl mx-auto">
              <ArticleCard article={featuredArticle} featured />
            </div>
          </div>
        )}

        {/* Horizontal Scrollable Articles */}
        <div id="articles-scroll-section" className="mb-8">
          <div id="articles-scroll-header" className="text-left mb-6">
            <h3 id="articles-scroll-title" className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
              All Articles ({fallbackArticles.length})
            </h3>
          </div>
          
          <div id="articles-scroll-container" className="relative overflow-hidden">
            <div
              id="articles-scroll-track"
              className="flex gap-6 animate-scroll hover:animate-pause"
              style={{
                width: 'max-content',
                '--scroll-duration': `${Math.max(40, fallbackArticles.length * 10)}s`
              } as React.CSSProperties}
            >
              {/* Duplicate articles enough times for smooth infinite scroll */}
              {Array.from({ length: Math.max(6, Math.ceil(20 / Math.max(1, fallbackArticles.length))) }, (_, repeatIndex) => 
                fallbackArticles.map((article, index) => (
                  <div key={`${article.slug}-${repeatIndex}-${index}`} id={`article-scroll-item-${article.slug}-${repeatIndex}-${index}`} className="flex-shrink-0 w-80">
                    <ArticleCard article={article} />
                  </div>
                ))
              ).flat()}
            </div>
          </div>
        </div>

        {articles.length > 0 && (
          <div id="articles-view-all" className="text-center">
            <Link
              id="articles-view-all-button"
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 10%)',
                color: 'var(--foreground)',
                border: '1px solid color-mix(in srgb, var(--accent-1), transparent 70%)',
              }}
            >
              View All Articles
              <span id="articles-view-all-arrow" className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
