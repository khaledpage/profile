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
  
  // Initialize with default language to prevent hydration mismatch
  const [currentLanguage, setCurrentLanguage] = useState(config.ui.language);
  const theme = getTheme(config.ui.theme.active);
  const content = getContent(currentLanguage);

  // Auto-detect browser language
  const detectBrowserLanguage = () => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.toLowerCase();
      // Check if browser language is German
      if (browserLang.startsWith('de')) {
        return 'de';
      }
      // Default to English for all other languages
      return 'en';
    }
    return config.ui.language;
  };

  useEffect(() => {
    setMounted(true);
    
    // Set language based on browser detection after mounting
    const detectedLanguage = detectBrowserLanguage();
    if (detectedLanguage !== currentLanguage) {
      setCurrentLanguage(detectedLanguage);
    }

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
  }, [theme]);

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'en' ? 'de' : 'en');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold gradient-text">Loading...</div>
      </div>
    );
  }

  return (
    <div id="app-container" className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navigation */}
      {config.ui.layout.showNavigation && (
        <Nav 
          content={content} 
          currentLanguage={currentLanguage} 
          onLanguageToggle={toggleLanguage}
        />
      )}

      <main id="main-content">
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
        <footer id="main-footer" className="text-center py-8 mt-20 border-t border-white/10">
          <p className="text-gray-400">
            © 2025 {config.personal.name}. Built with passion and precision.
          </p>
        </footer>
      )}
    </div>
  );
}
