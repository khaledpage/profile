'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { loadFeaturedArticles, FeaturedArticle, FeaturedArticlesData } from '../lib/staticFeaturedArticles';
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
        const articlesData = await loadFeaturedArticles();
        setFeaturedArticles(articlesData.featuredArticles);
      } catch (error) {
        console.error('Error loading featured articles:', error);
        // Fallback to legacy scenarios if available
        if (text.inspiration?.scenarios) {
          const legacyScenarios = text.inspiration.scenarios.map((scenario: any, index: number) => ({
            id: `legacy-${index}`,
            title: scenario.title,
            description: scenario.description,
            shortDescription: scenario.description,
            benefits: [],
            icon: '',
            actionText: 'Read More',
            category: 'Legacy',
            tags: scenario.tags || [],
            readTime: '5 min',
            difficulty: 'Intermediate',
            impact: 'Medium',
            publishDate: new Date().toISOString(),
            author: 'Khaled Alabsi',
            featured: true,
            order: index,
            htmlContent: `<div class="article-content">
              <h1>${scenario.title}</h1>
              <p>${scenario.description}</p>
            </div>`
          }));
          setFeaturedArticles(legacyScenarios);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, [text]);

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
      <section id="inspiration" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {text.inspiration?.title || 'Loading...'}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
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
      <section id="inspiration" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => handleArticleClick(article)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors transform group-hover:translate-x-1" />
                </div>
                
                {article.shortDescription && (
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
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
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
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
