import { getAllArticles } from '@/utils/articles';
import type { Article, ArticleMetadata } from '@/types/article';
import ArticleCard from '@/components/ui/ArticleCard';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig } from '@/utils/content';
import ArticlesExplorer from '@/components/articles/ArticlesExplorer';

export const metadata: Metadata = {
  title: 'Articles - Khaled Alabsi',
  description: 'Insights and tutorials on web development, design, and technology.',
};

export default async function ArticlesPage() {
  const config = await getSiteConfig();
  let articles = await getAllArticles();
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/data/articles.json`, { cache: 'force-cache' });
      if (res.ok) {
  const list: { slug: string; metadata: ArticleMetadata }[] = await res.json();
  // fetch per-article for content not needed here; use list metadata
  articles = list.map<Article>((a) => ({ slug: a.slug, metadata: a.metadata, content: '', assets: [] }));
      }
    } catch {}
  }

  const featuredArticles = articles.filter(article => article.metadata.featured);
  const regularArticles = articles.filter(article => !article.metadata.featured);

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <ol className="flex items-center justify-center gap-2 text-sm">
              <li>
                <Link href="/" className="hover:text-accent-1 transition-colors" style={{ color: 'var(--muted)' }}>
                  Home
                </Link>
              </li>
              <span style={{ color: 'var(--muted)' }}>/</span>
              <li style={{ color: 'var(--foreground)' }}>Articles</li>
            </ol>
          </nav>
          <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            Articles & Insights
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--muted)' }}>
            Dive deep into web development, design patterns, and technology insights. 
            Learn from practical examples and real-world experiences.
          </p>
        </div>
      </section>

      {/* Articles Explorer with search & filters */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <ArticlesExplorer config={config} />
        </div>
      </section>

  {/* Floating Back Button (consistent with project pages) */}
  <Link href="/" className="fab-nav btn-secondary">← Home</Link>
    </div>
  );
}
