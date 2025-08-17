import React from 'react';

interface MotivationProps {
  content: any;
  config: any;
}

const Motivation = ({ content, config }: MotivationProps) => {
  return (
    <section id="motivation" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{content.title}</span>
          </h2>
          <p className="text-xl text-theme-secondary max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              {content.points?.map((point: any, index: number) => (
                <div key={index} className="glass p-6 rounded-xl border border-white/10">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">💡</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>{point.title}</h3>
                      <p className="text-theme-secondary leading-relaxed">{point.description}</p>
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center text-theme-muted">
                  No motivation points found
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {content.cta && (
              <div className="glass p-8 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>{content.cta.title}</h3>
                <p className="text-theme-secondary leading-relaxed mb-6">{content.cta.description}</p>
                <a
                  href="#contact"
                  className="btn-primary inline-block"
                >
                  {content.cta.button}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Motivation;
