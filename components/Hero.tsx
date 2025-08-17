import React from 'react';

interface HeroProps {
  content: any;
  config: any;
}

const Hero: React.FC<HeroProps> = ({ content, config }) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <p className="text-lg md:text-xl text-theme-secondary mb-4">
            {content.greeting}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
            <span className="gradient-text">{config.personal.name}</span>
          </h1>
          <div className="h-16 md:h-20 flex items-center justify-center mb-8">
            <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-white">
              {content.roles[0]}
            </div>
          </div>
          <p className="text-lg md:text-xl text-theme-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a 
              href="#contact"
              className="btn-primary text-lg px-8 py-4 inline-block text-center no-underline"
            >
              {content.cta.primary}
            </a>
            <a 
              href={`/assets/${config.personal.cv}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass px-8 py-4 text-lg font-semibold text-white border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 rounded-full transition-all duration-300 inline-block text-center no-underline"
            >
              {content.cta.secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;