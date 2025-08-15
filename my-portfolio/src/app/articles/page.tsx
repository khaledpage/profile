import { getAllArticles } from '@/utils/articles';
import ArticleCard from '@/components/ui/ArticleCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles - Khaled Alabsi',
  description: 'Insights and tutorials on web development, design, and technology.',
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  const featuredArticles = articles.filter(article => article.metadata.featured);
  const regularArticles = articles.filter(article => !article.metadata.featured);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
            Articles & Insights
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--muted)' }}>
            Dive deep into web development, design patterns, and technology insights. 
            Learn from practical examples and real-world experiences.
          </p>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
            {featuredArticles.length > 0 ? 'More Articles' : 'All Articles'}
          </h2>
          
          {regularArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl" style={{ color: 'var(--muted)' }}>
                No articles available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
