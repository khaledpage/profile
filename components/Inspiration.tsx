'use client';

import React from 'react';

interface InspirationProps {
  content: any;
}

const Inspiration = ({ content }: InspirationProps) => {
  if (!content) {
    return null;
  }

  const handleActionClick = (actionText: string) => {
    // Scroll to contact section
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inspiration" className="py-20" style={{ background: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 id="inspiration-title" className="text-4xl font-bold mb-4 gradient-text">
            {content.title}
          </h2>
          <p id="inspiration-subtitle" className="text-xl text-theme-secondary mb-4">
            {content.subtitle}
          </p>
          <p id="inspiration-description" className="text-lg text-theme-secondary max-w-3xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {content.scenarios.map((scenario: any, index: number) => (
            <div
              key={index}
              id={`inspiration-scenario-${index}`}
              className="glass p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="text-4xl mb-4 group-hover:animate-bounce">
                {scenario.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
                {scenario.title}
              </h3>

              {/* Description */}
              <p className="text-theme-secondary mb-4 leading-relaxed">
                {scenario.description}
              </p>

              {/* Benefits */}
              <div className="mb-6">
                <ul className="space-y-2">
                  {scenario.benefits.map((benefit: string, benefitIndex: number) => (
                    <li key={benefitIndex} className="flex items-center text-sm">
                      <div 
                        className="w-2 h-2 rounded-full mr-3 flex-shrink-0"
                        style={{ backgroundColor: 'var(--accent)' }}
                      />
                      <span className="text-theme-secondary">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleActionClick(scenario.actionText)}
                className="w-full btn-primary text-sm py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
              >
                {scenario.actionText}
              </button>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        {content.stats && (
          <div className="glass p-8 rounded-2xl mb-12">
            <h3 id="inspiration-stats-title" className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--text)' }}>
              {content.stats.title}
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {content.stats.items.map((stat: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold mb-2 gradient-text">
                    {stat.number}
                  </div>
                  <div className="text-sm text-theme-secondary leading-tight">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center glass p-8 rounded-2xl">
          <h3 id="inspiration-cta-title" className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>
            {content.cta.title}
          </h3>
          <p id="inspiration-cta-description" className="text-theme-secondary mb-6 max-w-2xl mx-auto leading-relaxed">
            {content.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleActionClick(content.cta.primaryButton)}
              className="btn-primary px-8 py-4 text-lg rounded-xl inline-block text-center touch-manipulation"
            >
              {content.cta.primaryButton}
            </button>
            <button
              onClick={() => handleActionClick(content.cta.secondaryButton)}
              className="px-8 py-4 text-lg rounded-xl border-2 transition-all duration-300 hover:scale-105 touch-manipulation"
              style={{ 
                borderColor: 'var(--primary)', 
                color: 'var(--primary)',
                background: 'transparent'
              }}
            >
              {content.cta.secondaryButton}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Inspiration;
