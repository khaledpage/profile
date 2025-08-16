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
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const response = await fetch(`${base}/data/articles.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
  // Ensure data has expected shape
  const list = Array.isArray(data) ? data : [];
  setArticles(list.slice(0, 6)); // Show only first 6 articles on homepage
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
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
              Latest Articles
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Insights and tutorials on web development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-video" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
                <div className="p-6">
                  <div className="h-4 rounded mb-3" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
                  <div className="h-6 rounded mb-3" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
                  <div className="h-16 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)' }}></div>
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
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Latest Articles
          </h2>
          <p style={{ color: 'var(--muted)' }}>
            {error}
          </p>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Latest Articles
          </h2>
          <p style={{ color: 'var(--muted)' }}>
            No articles available at the moment.
          </p>
        </div>
      </section>
    );
  }

  // Sort articles by date (newest first)
  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = new Date(a.metadata.publishDate);
    const dateB = new Date(b.metadata.publishDate);
    return dateB.getTime() - dateA.getTime();
  });

  const featuredArticle = sortedArticles.find(article => article.metadata.featured);
  // Show all articles in the scroll except the featured one (if it exists and is shown separately)
  const scrollArticles = featuredArticle ? 
    sortedArticles.filter(article => !article.metadata.featured) : 
    sortedArticles;

  return (
    <section id="articles" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Latest Articles
          </h2>
          <p style={{ color: 'var(--muted)' }}>
            Insights and tutorials on web development, design, and technology
          </p>
        </div>

        {/* Featured Article - if exists */}
        {featuredArticle && (
          <div className="mb-12">
            <div className="text-left mb-6">
              <h3 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                Featured Article
              </h3>
            </div>
            <div className="max-w-4xl mx-auto">
              <ArticleCard article={featuredArticle} featured />
            </div>
          </div>
        )}

        {/* Horizontal Scrollable Articles */}
        <div className="mb-8">
          <div className="text-left mb-6">
            <h3 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
              {featuredArticle ? 'More Articles' : 'All Articles'}
            </h3>
          </div>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex gap-6 animate-scroll hover:animate-pause"
              style={{
                width: 'max-content',
                '--scroll-duration': '30s'
              } as React.CSSProperties}
            >
              {/* Duplicate articles multiple times for infinite scroll effect */}
              {Array.from({ length: Math.max(3, Math.ceil(12 / scrollArticles.length)) }, (_, repeatIndex) => 
                scrollArticles.map((article, index) => (
                  <div key={`${article.slug}-${repeatIndex}-${index}`} className="flex-shrink-0 w-80">
                    <ArticleCard article={article} />
                  </div>
                ))
              ).flat()}
            </div>
          </div>
        </div>

        {articles.length > 0 && (
          <div className="text-center">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 10%)',
                color: 'var(--accent-1)',
                border: '1px solid color-mix(in srgb, var(--accent-1), transparent 70%)',
              }}
            >
              View All Articles
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
