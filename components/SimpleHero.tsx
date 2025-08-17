import React from 'react';
import config from '@/lib/config';

const SimpleHero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <p className="text-lg md:text-xl text-gray-300 mb-4">
            {config.hero.greeting}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
            <span className="gradient-text">{config.hero.name}</span>
          </h1>
          <div className="h-16 md:h-20 flex items-center justify-center mb-8">
            <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-white">
              {config.hero.roles[0]}
            </div>
          </div>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            {config.hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button className="btn-primary text-lg px-8 py-4">
              {config.hero.cta.primary}
            </button>
            <button className="glass px-8 py-4 text-lg font-semibold text-white border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 rounded-full transition-all duration-300">
              {config.hero.cta.secondary}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleHero;
