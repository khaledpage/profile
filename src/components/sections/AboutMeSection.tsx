'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/utils/i18n';
import type { SiteConfig } from '@/types/content';

type Props = {
  config: SiteConfig;
};

export default function AboutMeSection({ config }: Props) {
  const { translations } = useLanguage(config);

  // About content with fallback data
  const aboutContent = {
    en: {
      title: "About Me",
      greeting: "Hi, I'm Khaled Alabsi",
      role: "Full-Stack Developer & Software Engineer",
      description: "I'm passionate about creating innovative digital solutions and turning complex problems into elegant, user-friendly applications.",
      highlights: [
        "5+ years of software development experience",
        "Expert in React, Next.js, and modern web technologies",
        "Strong background in both frontend and backend development",
        "Passionate about clean code and best practices"
      ],
      cta: "Get In Touch"
    },
    de: {
      title: "Über Mich",
      greeting: "Hallo, ich bin Khaled Alabsi",
      role: "Full-Stack Entwickler & Software Engineer",
      description: "Ich bin leidenschaftlich dabei, innovative digitale Lösungen zu schaffen und komplexe Probleme in elegante, benutzerfreundliche Anwendungen zu verwandeln.",
      highlights: [
        "5+ Jahre Erfahrung in der Softwareentwicklung",
        "Experte in React, Next.js und modernen Web-Technologien",
        "Starker Hintergrund in Frontend- und Backend-Entwicklung",
        "Leidenschaftlich für sauberen Code und bewährte Praktiken"
      ],
      cta: "Kontakt Aufnehmen"
    }
  };

  const currentLang = config.i18n?.defaultLocale || 'en';
  const content = aboutContent[currentLang as keyof typeof aboutContent] || aboutContent.en;

  return (
    <section
      id="about-me-section"
      className="relative py-20 px-4"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            id="about-me-title"
            className="text-4xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            {content.title}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="flex justify-center lg:justify-start">
            <div
              id="profile-image-container"
              className="relative w-80 h-80 rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                padding: '4px'
              }}
            >
              <div
                className="relative w-full h-full rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <Image
                  src="/images/project1.jpg"
                  alt="Profile Picture"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h3
                id="about-me-greeting"
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--foreground)' }}
              >
                {content.greeting}
              </h3>
              <p
                id="about-me-role"
                className="text-xl mb-6"
                style={{ color: 'var(--accent-1)' }}
              >
                {content.role}
              </p>
              <p
                id="about-me-description"
                className="text-lg leading-relaxed"
                style={{ color: 'var(--foreground-muted)' }}
              >
                {content.description}
              </p>
            </div>

            {/* Highlights */}
            <div id="about-me-highlights" className="space-y-4">
              {content.highlights.map((highlight, index) => (
                <div
                  key={index}
                  id={`about-highlight-${index}`}
                  className="flex items-center space-x-3"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent-1)' }}
                  />
                  <span
                    className="text-base"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {highlight}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                id="about-me-cta-button"
                className="px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))',
                  color: 'var(--card-contrast)'
                }}
                onClick={() => {
                  const contactSection = document.getElementById('contact-section');
                  contactSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {content.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
