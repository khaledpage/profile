'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types/article';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { metadata, slug } = article;
  
  return (
    <Link href={`/articles/${slug}`} className="group block">
      <article 
        className={`glass rounded-2xl overflow-hidden transition-all duration-300 lift ${
          featured ? 'col-span-full lg:col-span-2' : ''
        }`}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={metadata.coverImage}
            alt={metadata.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {metadata.featured && (
            <div 
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: 'var(--accent-1)',
                color: 'var(--card-contrast)',
              }}
            >
              Featured
            </div>
          )}
          
          <div 
            className="absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-medium"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--background), transparent 20%)',
              color: 'var(--foreground)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {metadata.readingTime} min read
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span 
              className="px-2 py-1 rounded-lg text-xs font-medium"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--accent-2), transparent 70%)',
                color: 'var(--accent-2)',
              }}
            >
              {metadata.category}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {new Date(metadata.publishDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <h3 
            className={`font-bold mb-3 group-hover:text-accent-1 transition-colors ${
              featured ? 'text-2xl' : 'text-xl'
            }`}
            style={{ color: 'var(--foreground)' }}
          >
            {metadata.title}
          </h3>
          
          <p 
            className={`line-clamp-3 mb-4 ${featured ? 'text-base' : 'text-sm'}`}
            style={{ color: 'var(--muted)' }}
          >
            {metadata.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {metadata.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-lg text-xs"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--card), transparent 30%)',
                    color: 'var(--muted)',
                  }}
                >
                  {tag}
                </span>
              ))}
              {metadata.tags.length > 3 && (
                <span 
                  className="text-xs"
                  style={{ color: 'var(--muted)' }}
                >
                  +{metadata.tags.length - 3} more
                </span>
              )}
            </div>
            
            <div 
              className="text-sm font-medium group-hover:translate-x-1 transition-transform"
              style={{ color: 'var(--accent-1)' }}
            >
              Read more →
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
