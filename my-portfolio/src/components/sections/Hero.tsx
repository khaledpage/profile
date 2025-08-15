'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryButton: {
    text: string;
    link: string;
  };
  secondaryButton: {
    text: string;
    link: string;
  };
  config?: SiteConfig;
}

export default function Hero({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  config
}: HeroProps) {
  const { currentLanguage } = useLanguage(config);
  const [content, setContent] = useState({
    title,
    subtitle,
    description,
    primaryButton,
    secondaryButton,
  });

  useEffect(() => {
    // Load language-specific content
    const loadContent = async () => {
      try {
        const response = await fetch('/api/hero-content?lang=' + currentLanguage);
        if (response.ok) {
          const langContent = await response.json();
          setContent(langContent);
        }
      } catch {
        // Fallback to default content if API fails
        console.warn('Failed to load language content, using defaults');
      }
    };

    if (currentLanguage !== 'de') {
      loadContent();
    } else {
      // Reset to default German content
      setContent({
        title,
        subtitle,
        description,
        primaryButton,
        secondaryButton,
      });
    }
  }, [currentLanguage, title, subtitle, description, primaryButton, secondaryButton]);
  return (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* spotlight gradient */}
      <div className="absolute inset-0 -z-10">
    <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.25),transparent)] blur-3xl" />
    <div className="animated-gradient absolute -inset-40 opacity-50" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
                    <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-6xl font-bold mb-4"
          >
            <span className="gradient-text">{content.title}</span>
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl text-gray-300 mb-6"
          >
            {content.subtitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={content.primaryButton.link}
              className="btn-primary inline-flex items-center justify-center"
            >
              {content.primaryButton.text}
            </a>
            <a
              href={content.secondaryButton.link}
              className="btn-secondary inline-flex items-center justify-center"
            >
              {content.secondaryButton.text}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
