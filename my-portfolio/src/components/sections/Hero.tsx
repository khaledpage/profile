'use client';

import { motion } from 'framer-motion';

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
}

export default function Hero({
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
}: HeroProps) {
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
            <span className="gradient-text">{title}</span>
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl text-gray-300 mb-6"
          >
            {subtitle}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center items-center gap-4"
          >
            <a
              href={primaryButton.link}
              className="btn-primary interactive-border"
            >
              {primaryButton.text}
            </a>
            <a
              href={secondaryButton.link}
              className="btn-secondary"
            >
              {secondaryButton.text}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
