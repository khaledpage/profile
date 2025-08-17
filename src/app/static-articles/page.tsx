import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig } from '@/utils/content';
import { useLanguage } from '@/utils/i18n';

export const metadata: Metadata = {
  title: 'Static Articles - Khaled Alabsi',
  description: 'HTML-only articles and tutorials - no backend required.',
};

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

async function getStaticArticles(): Promise<StaticArticle[]> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${base}/data/static-articles.json`, { 
      cache: 'force-cache' 
    });
    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error('Error fetching static articles:', error);
  }
  return [];
}

export default async function StaticArticlesPage() {
  const config = await getSiteConfig();
  const articles = await getStaticArticles();

  const featuredArticles = articles.filter(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm">
            <Link href="/" className="hover:text-accent-1 transition-colors" style={{ color: 'var(--muted)' }}>
              Home
            </Link>
            <span className="mx-2" style={{ color: 'var(--muted)' }}>→</span>
            <span style={{ color: 'var(--foreground)' }}>Static Articles</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            Static Articles
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: 'var(--muted)' }}>
            HTML-only articles and tutorials that work without any backend or API dependencies.
          </p>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                Featured Articles
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <StaticArticleCard key={article.slug} article={article} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles */}
      {regularArticles.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
                All Articles ({regularArticles.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularArticles.map((article) => (
                <StaticArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Articles Message */}
      {articles.length === 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              No Static Articles Available
            </h2>
            <p style={{ color: 'var(--muted)' }}>
              Check back later for new HTML-only content.
            </p>
          </div>
        </section>
      )}

      {/* Floating Back Button */}
      <Link
        href="/"
        className="fab-nav glass back-btn"
        style={{
          left: '1rem',
          right: 'auto',
          background: 'color-mix(in srgb, var(--card), transparent 20%)',
          border: '1px solid color-mix(in srgb, var(--foreground), transparent 90%)',
          color: 'var(--foreground)',
          padding: '0.75rem 1rem',
          borderRadius: '1rem',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: '0.2s',
          backdropFilter: 'blur(12px)',
          position: 'fixed',
          bottom: '5.5rem',
          zIndex: 40,
        }}
      >
        ← Home
      </Link>
    </div>
  );
}

// Static Article Card Component
function StaticArticleCard({ article, featured = false }: { article: StaticArticle; featured?: boolean }) {
  return (
    <article 
      className={`glass rounded-2xl overflow-hidden group hover:scale-105 transition-all duration-300 ${
        featured ? 'lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center' : 'h-full flex flex-col'
      }`}
    >
      {/* Cover Image */}
      {article.coverImage && (
        <div className={`${featured ? 'order-2' : 'aspect-video'} overflow-hidden`}>
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}
      
      {/* Content */}
      <div className={`${featured ? 'order-1 lg:p-12 p-8' : 'p-6 flex-1 flex flex-col'}`}>
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-4">
          <span 
            className="px-3 py-1 text-xs font-medium rounded-full"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 85%)',
              color: 'var(--accent-1)',
            }}
          >
            {article.category}
          </span>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {new Date(article.publishDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
          <span className="text-sm" style={{ color: 'var(--muted)' }}>
            {article.readingTime} min read
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-bold mb-3 group-hover:text-accent-1 transition-colors ${featured ? 'text-3xl' : 'text-xl'}`} style={{ color: 'var(--foreground)' }}>
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className={`mb-4 ${featured ? 'text-lg' : 'text-sm flex-1'}`} style={{ color: 'var(--muted)' }}>
          {article.excerpt}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
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
