import React from 'react';

interface HeroProps {
  content: any;
  config: any;
}

const Hero: React.FC<HeroProps> = ({ content, config }) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div id="hero-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div id="hero-content" className="text-center">
          <p id="hero-greeting" className="text-lg md:text-xl text-theme-secondary mb-4">
            {content.greeting}
          </p>
          <h1 id="hero-name" className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
            <span className="gradient-text">{config.personal.name}</span>
          </h1>
          <div id="hero-role-container" className="h-16 md:h-20 flex items-center justify-center mb-8">
            <div id="hero-role" className="text-2xl md:text-4xl lg:text-5xl font-semibold" style={{ color: 'var(--text)' }}>
              {content.roles[0]}
            </div>
          </div>
          <p id="hero-description" className="text-lg md:text-xl text-theme-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
            {content.description}
          </p>
          <div id="hero-cta-section" className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a 
              id="hero-cta-primary"
              href="#contact"
              className="btn-primary text-lg px-8 py-4 inline-block text-center no-underline touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              {content.cta.primary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;