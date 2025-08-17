import React from 'react';

interface ProcessProps {
  content: any;
  config: any;
}

const Process = ({ content, config }: ProcessProps) => {
  // Icon mapping for process steps
  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'Lightbulb': '💡',
      'Search': '🔍', 
      'Palette': '🎨',
      'Code': '💻',
      'Rocket': '🚀',
      'Wrench': '🔧',
      'Award': '🏆',
      'Target': '🎯',
      'TrendingUp': '📈'
    };
    return iconMap[iconName] || '⚡';
  };

  return (
    <section id="process" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{content.title}</span>
          </h2>
          <p className="text-xl text-theme-secondary max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {content.steps?.map((step: any, index: number) => (
            <div key={index} className="relative">
              <div className="glass p-8 rounded-2xl border border-white/10 hover:border-primary/30 transition-all duration-300 h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
                    <span className="text-2xl">{getIcon(step.icon)}</span>
                  </div>
                  
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>{step.title}</h3>
                  <p className="text-theme-secondary leading-relaxed">{step.description}</p>
                </div>
              </div>
              
              {/* Connecting line */}
              {index < (content.steps?.length || 0) - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30" />
              )}
            </div>
          )) || (
            <div className="col-span-full text-center text-theme-muted">
              No process steps found
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Process;
