'use client';

import React, { useEffect, useState } from 'react';
import config, { getContent } from '@/lib/config';
import { getTheme } from '@/lib/themes';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Motivation from '@/components/Motivation';
import Process from '@/components/Process';
import Contact from '@/components/Contact';
import Nav from '@/components/Nav';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(config.ui.language);
  const theme = getTheme(config.ui.theme.active);
  const content = getContent(currentLanguage);

  useEffect(() => {
    setMounted(true);

    // Apply theme CSS variables
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });

    // Apply font variables
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);

    // Apply shadow variables for animations
    const primaryColor = theme.colors.primary;
    root.style.setProperty('--primary-shadow', `${primaryColor}40`); // 40 = 25% opacity
    root.style.setProperty('--primary-shadow-strong', `${primaryColor}CC`); // CC = 80% opacity
  }, [theme, currentLanguage]);

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'en' ? 'de' : 'en');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold gradient-text">{content.common.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleLanguage}
          className="glass px-4 py-2 rounded-lg border border-white/10 hover:border-primary/30 transition-all duration-300 text-sm font-medium"
        >
          {currentLanguage === 'en' ? '🇩🇪 Deutsch' : '🇺🇸 English'}
        </button>
      </div>

      {/* Navigation */}
      {config.ui.layout.showNavigation && (
        <Nav content={content} currentLanguage={currentLanguage} />
      )}

      <main>
        {/* Hero Section */}
        {config.ui.sections.hero.enabled && (
          <Hero content={content.hero} config={config} />
        )}

        {/* About Section */}
        {config.ui.sections.about.enabled && (
          <About content={content.about} config={config} />
        )}

        {/* Experience Section */}
        {config.ui.sections.experience.enabled && (
          <Experience content={content.experience} config={config} />
        )}

        {/* Motivation Section */}
        {config.ui.sections.motivation.enabled && (
          <Motivation content={content.motivation} config={config} />
        )}

        {/* Process Section */}
        {config.ui.sections.process.enabled && (
          <Process content={content.process} config={config} />
        )}

        {/* Contact Section */}
        {config.ui.sections.contact.enabled && (
          <Contact content={content.contact} config={config} currentLanguage={currentLanguage} />
        )}
      </main>

      {/* Footer */}
      {config.ui.layout.showFooter && (
        <footer className="text-center py-8 mt-20 border-t border-white/10">
          <p className="text-gray-400">
            © 2024 {config.personal.name}. Built with passion and precision.
          </p>
        </footer>
      )}
    </div>
  );
}
