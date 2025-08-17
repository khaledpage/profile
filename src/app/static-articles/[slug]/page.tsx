import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteConfig } from '@/utils/content';

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

type StaticArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
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

async function getStaticArticle(slug: string): Promise<StaticArticle | null> {
  const articles = await getStaticArticles();
  return articles.find(article => article.slug === slug) || null;
}

export async function generateStaticParams() {
  const articles = await getStaticArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: StaticArticlePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getStaticArticle(resolvedParams.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} - Static Articles`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function StaticArticlePage({ params }: StaticArticlePageProps) {
  const resolvedParams = await params;
  const article = await getStaticArticle(resolvedParams.slug);
  
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Article Header */}
      <article className="py-12">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="mb-8 text-sm">
            <Link href="/" className="hover:text-accent-1 transition-colors" style={{ color: 'var(--muted)' }}>
              Home
            </Link>
            <span className="mx-2" style={{ color: 'var(--muted)' }}>→</span>
            <Link href="/static-articles" className="hover:text-accent-1 transition-colors" style={{ color: 'var(--muted)' }}>
              Static Articles
            </Link>
            <span className="mx-2" style={{ color: 'var(--muted)' }}>→</span>
            <span style={{ color: 'var(--foreground)' }}>{article.title}</span>
          </nav>

          {/* Article Meta */}
          <div className="flex items-center gap-4 mb-6">
            <span 
              className="px-3 py-1 text-sm font-medium rounded-full"
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
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span className="text-sm" style={{ color: 'var(--muted)' }}>
              {article.readingTime} min read
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            {article.title}
          </h1>

          {/* Article Excerpt */}
          <p className="text-lg md:text-xl mb-8 max-w-4xl" style={{ color: 'var(--muted)' }}>
            {article.excerpt}
          </p>

          {/* Cover Image */}
          {article.coverImage && (
            <div className="mb-12 rounded-2xl overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Static Article Content - iframe embed */}
          <div className="glass rounded-2xl p-8 mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Interactive Article
              </h2>
              <p style={{ color: 'var(--muted)' }}>
                This static article is embedded as an interactive HTML page. 
                It runs entirely in your browser without any backend dependencies.
              </p>
            </div>
            
            {/* Static Article Iframe */}
            <div className="relative border rounded-xl overflow-hidden" style={{ borderColor: 'color-mix(in srgb, var(--foreground), transparent 85%)' }}>
              <iframe
                src={`/articles/${article.slug}/index.html`}
                className="w-full h-96 md:h-[600px] border-0"
                title={article.title}
                allowFullScreen
                style={{ backgroundColor: 'var(--background)' }}
              />
            </div>
            
            {/* Open in new tab link */}
            <div className="mt-4 text-center">
              <Link
                href={`/articles/${article.slug}/index.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--accent-1), transparent 85%)',
                  color: 'var(--accent-1)',
                }}
              >
                Open in Full Screen
                <span>↗</span>
              </Link>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm rounded-full"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)',
                      color: 'var(--muted)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Article Footer */}
          <footer className="pt-8 border-t" style={{ borderColor: 'color-mix(in srgb, var(--foreground), transparent 85%)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  Published on {new Date(article.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex gap-4">
                <Link
                  href="/static-articles"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent-1"
                  style={{ color: 'var(--accent-1)' }}
                >
                  ← All Static Articles
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </article>

      {/* Floating Back Button */}
      <Link
        href="/static-articles"
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
        ← Static Articles
      </Link>
    </div>
  );
}
