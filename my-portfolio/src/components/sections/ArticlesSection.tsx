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
        const response = await fetch('/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        setArticles(data.slice(0, 6)); // Show only first 6 articles on homepage
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

  const featuredArticle = articles.find(article => article.metadata.featured);
  const regularArticles = articles.filter(article => !article.metadata.featured);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {featuredArticle && (
            <ArticleCard article={featuredArticle} featured />
          )}
          
          <div className={`grid grid-cols-1 gap-6 ${featuredArticle ? 'lg:col-span-1' : 'lg:col-span-3 md:grid-cols-2 lg:grid-cols-3'}`}>
            {regularArticles.slice(0, featuredArticle ? 2 : 6).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
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
