import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleBySlug, getAllArticles } from '@/utils/articles';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import ReadingTheme from '@/components/ui/ReadingTheme';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.metadata.title} - Khaled Alabsi`,
    description: article.metadata.seo.metaDescription,
    keywords: article.metadata.seo.keywords,
    openGraph: {
      title: article.metadata.title,
      description: article.metadata.seo.metaDescription,
      images: [article.metadata.coverImage],
      type: 'article',
      publishedTime: article.metadata.publishDate,
      modifiedTime: article.metadata.lastModified,
      authors: [article.metadata.author],
      tags: article.metadata.tags,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { metadata, content } = article;
  const publishDate = new Date(metadata.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <ReadingTheme>
      <div className="min-h-screen pt-20">
        {/* Article Header */}
        <article className="py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-accent-1 transition-colors" style={{ color: 'var(--muted)' }}>
                    Home
                  </Link>
                </li>
                <span style={{ color: 'var(--muted)' }}>/</span>
                <li>
                  <Link href="/articles" className="hover:text-accent-1 transition-colors" style={{ color: 'var(--muted)' }}>
                    Articles
                  </Link>
                </li>
                <span style={{ color: 'var(--muted)' }}>/</span>
                <li style={{ color: 'var(--foreground)' }}>{metadata.title}</li>
              </ol>
            </nav>

            {/* Floating Back Button */}
            <Link 
              href="/articles" 
              className="fab-nav glass"
              style={{
                left: '1rem',
                right: 'auto',
                backgroundColor: 'color-mix(in srgb, var(--card), transparent 20%)',
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
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(12px)',
                position: 'fixed',
                bottom: '5.5rem',
                zIndex: 40
              }}
            >
              ← Articles
            </Link>

            {/* Article Meta */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span 
                  className="px-3 py-1 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--accent-2), transparent 70%)',
                    color: 'var(--accent-2)',
                  }}
                >
                  {metadata.category}
                </span>
                {metadata.featured && (
                  <span 
                    className="px-3 py-1 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: 'var(--accent-1)',
                      color: 'var(--card-contrast)',
                    }}
                  >
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
                {metadata.title}
              </h1>
              
              <p className="text-xl mb-6" style={{ color: 'var(--muted)' }}>
                {metadata.summary}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    By {metadata.author}
                  </span>
                </div>
                <span style={{ color: 'var(--muted)' }}>•</span>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>
                  {publishDate}
                </span>
                <span style={{ color: 'var(--muted)' }}>•</span>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>
                  {metadata.readingTime} min read
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg text-sm"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--card), transparent 30%)',
                      color: 'var(--muted)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Cover Image */}
            <div className="relative aspect-video mb-12 rounded-2xl overflow-hidden">
              <Image
                src={metadata.coverImage}
                alt={metadata.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Article Content */}
            <div className="prose-container">
              <MarkdownRenderer 
                content={content}
                className="article-content"
                articleSlug={slug}
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-16 pt-8" style={{ borderTop: '1px solid color-mix(in srgb, var(--foreground), transparent 85%)' }}>
              <div className="flex items-center justify-center flex-wrap gap-4">
                <div>
                  <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                    Published on {publishDate}
                  </p>
                  {metadata.lastModified && metadata.lastModified !== metadata.publishDate && (
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>
                      Last updated: {new Date(metadata.lastModified).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </footer>
          </div>
        </article>

        {/* Floating Back Button (consistent with other pages) */}

      </div>
    </ReadingTheme>
  );
}
