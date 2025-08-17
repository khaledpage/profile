import React from 'react';

interface MotivationProps {
  content: any;
  config: any;
}

const Motivation = ({ content, config }: MotivationProps) => {
  return (
    <section id="motivation" className="py-20 lg:py-32 relative overflow-hidden">
      <div id="motivation-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="motivation-header" className="text-center mb-16">
          <h2 id="motivation-title" className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{content.title}</span>
          </h2>
          <p id="motivation-subtitle" className="text-xl text-theme-secondary max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div id="motivation-content" className="grid lg:grid-cols-2 gap-16 items-center">
          <div id="motivation-points-section" className="space-y-8">
            <div id="motivation-points-list" className="space-y-6">
              {content.points?.map((point: any, index: number) => (
                <div 
                  key={index} 
                  id={`motivation-point-${index}`}
                  className="glass p-6 rounded-xl border border-white/10 md:hover:border-primary/20 transition-all duration-300 touch-manipulation md:hover:scale-[1.02]"
                  style={{ 
                    touchAction: 'pan-y',
                    willChange: 'auto'
                  }}
                >
                  <div id={`motivation-point-content-${index}`} className="flex items-start space-x-4">
                    <div id={`motivation-point-icon-${index}`} className="text-3xl">💡</div>
                    <div id={`motivation-point-text-${index}`}>
                      <h3 id={`motivation-point-title-${index}`} className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>{point.title}</h3>
                      <p id={`motivation-point-description-${index}`} className="text-theme-secondary leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                </div>
              )) || (
                <div id="no-motivation-points-message" className="text-center text-theme-muted">
                  No motivation points found
                </div>
              )}
            </div>
          </div>

          <div id="motivation-cta-section" className="space-y-8">
            {content.cta && (
              <div 
                id="motivation-cta"
                className="glass p-8 rounded-2xl border border-white/10 md:hover:border-primary/20 transition-all duration-300 touch-manipulation md:hover:scale-[1.02]"
                style={{ 
                  touchAction: 'pan-y',
                  willChange: 'auto'
                }}
              >
                <h3 id="motivation-cta-title" className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>{content.cta.title}</h3>
                <p id="motivation-cta-description" className="text-theme-secondary leading-relaxed mb-6">{content.cta.description}</p>
                <a
                  id="motivation-cta-button"
                  href="#contact"
                  className="btn-primary inline-block touch-manipulation"
                  style={{ touchAction: 'manipulation' }}
                >
                  {content.cta.button}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div id="motivation-background-decorations" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div id="motivation-bg-decoration-1" className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div id="motivation-bg-decoration-2" className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Motivation;
