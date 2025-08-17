import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { metadata, slug } = article;
  
  const publishDate = new Date(metadata.publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Link 
      href={`/articles/${slug}`}
      className="group block rounded-xl overflow-hidden transition-all duration-300 hover:scale-105"
      style={{
        backgroundColor: 'var(--card)',
        border: '1px solid var(--card-border)',
      }}
    >
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={metadata.coverImage}
          alt={metadata.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span 
            className="px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--accent-2), transparent 20%)',
              color: 'var(--accent-2)',
            }}
          >
            {metadata.category}
          </span>
        </div>

        {/* Featured Badge */}
        {metadata.featured && (
          <div className="absolute top-4 right-4">
            <span 
              className="px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm"
              style={{
                backgroundColor: 'var(--accent-1)',
                color: 'var(--card-contrast)',
              }}
            >
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm mb-3" style={{ color: 'var(--foreground-muted)' }}>
          <span>{publishDate}</span>
          <span>•</span>
          <span>{metadata.readingTime} min read</span>
        </div>

        <h3 className="text-xl font-bold mb-3 group-hover:text-accent-1 transition-colors" style={{ color: 'var(--foreground)' }}>
          {metadata.title}
        </h3>

        <p className="mb-4 line-clamp-3" style={{ color: 'var(--foreground-muted)' }}>
          {metadata.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {metadata.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)',
                color: 'var(--foreground-muted)',
              }}
            >
              {tag}
            </span>
          ))}
          {metadata.tags.length > 3 && (
            <span
              className="px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--card), transparent 50%)',
                color: 'var(--foreground-muted)',
              }}
            >
              +{metadata.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Read More Link */}
        <div className="flex items-center gap-2 text-sm font-medium group-hover:text-accent-1 transition-colors" style={{ color: 'var(--foreground)' }}>
          <span>Read Article</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
