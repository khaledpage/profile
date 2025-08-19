'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { loadFeaturedArticles, FeaturedArticle, FeaturedArticlesData } from '../lib/generatedFeaturedArticles';
import { loadContent } from '../lib/contentLoader';
import { SupportedLanguage } from '../lib/languages';
import ArticleOverlay from './ArticleOverlay';

interface InspirationProps {
  locale: string;
}

export default function Inspiration({ locale }: InspirationProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredArticles, setFeaturedArticles] = useState<FeaturedArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<FeaturedArticle | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  
  // Get text based on locale
  const text = loadContent(locale as SupportedLanguage);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const articlesData = await loadFeaturedArticles(locale);
        setFeaturedArticles(articlesData.featuredArticles);
      } catch (error) {
        console.error('Error loading featured articles:', error);
        // No fallback - articles should always come from the inspiration folders
        setFeaturedArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [locale]);

  const handleArticleClick = (article: FeaturedArticle) => {
    setSelectedArticle(article);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setSelectedArticle(null);
    setIsOverlayOpen(false);
  };

  if (isLoading) {
    return (
      <section id="inspiration" className="py-20 inspiration-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {text.inspiration?.title || 'Loading...'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="inspiration-card animate-pulse">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="inspiration" className="py-20 inspiration-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {text.inspiration?.title || 'Featured Articles'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {text.inspiration?.subtitle || 'Discover insights and solutions that drive innovation.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="inspiration-card"
                onClick={() => handleArticleClick(article)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="inspiration-card-title">
                    {article.title}
                  </h3>
                  <ArrowRight className="inspiration-card-arrow" />
                </div>
                
                {article.shortDescription && (
                  <p className="inspiration-card-subtitle">
                    {article.shortDescription}
                  </p>
                )}
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {article.description}
                </p>
                
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inspiration-tag"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedArticle && (
        <ArticleOverlay
          article={selectedArticle}
          isOpen={isOverlayOpen}
          onClose={closeOverlay}
        />
      )}
    </>
  );
}
