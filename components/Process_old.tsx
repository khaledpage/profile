import React from 'react';
import config from '@/lib/config';

const iconMap = {
  'Lightbulb': '💡',
  'Search': '🔍',
  'Palette': '🎨',
  'Code': '💻',
  'Rocket': '🚀',
  'Wrench': '🔧',
};

const Process = () => {
  return (
    <section id="process" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{config.process.title}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {config.process.subtitle}
          </p>
        </div>

        {/* Desktop Process Flow */}
        <div className="hidden lg:block relative">
          <div className="grid grid-cols-6 gap-8 relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 z-0">
              <div className="w-full h-full bg-gradient-to-r from-primary via-secondary to-accent opacity-30" />
            </div>

            {config.process.steps.map((step, index) => {
              const iconEmoji = iconMap[step.icon as keyof typeof iconMap] || '⭐';
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className={`relative z-10 ${isEven ? 'mt-0' : 'mt-32'}`}
                >
                  <div className="text-center">
                    <div className="relative mx-auto mb-6">
                      <div className="w-20 h-20 glass rounded-full flex items-center justify-center border-2 border-primary/30 group-hover:border-primary/60 transition-colors duration-300 mx-auto relative">
                        <span className="text-2xl">{iconEmoji}</span>
                        
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    <div className="glass p-6 rounded-xl border border-white/10 hover:border-primary/30 transition-colors duration-300">
                      <h3 className="text-lg font-bold text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    <div className="w-4 h-4 bg-primary rounded-full mx-auto mt-6 relative z-20" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Process Flow */}
        <div className="lg:hidden">
          <div className="space-y-8">
            {config.process.steps.map((step, index) => {
              const iconEmoji = iconMap[step.icon as keyof typeof iconMap] || '⭐';

              return (
                <div key={step.number} className="relative">
                  <div className="flex items-start space-x-6">
                    {/* Timeline Line */}
                    {index < config.process.steps.length - 1 && (
                      <div className="absolute left-10 top-20 w-0.5 h-16 bg-gradient-to-b from-primary to-transparent" />
                    )}

                    {/* Icon and Number */}
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 glass rounded-full flex items-center justify-center border-2 border-primary/30">
                        <span className="text-2xl">{iconEmoji}</span>
                        
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {step.number}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 glass p-6 rounded-xl border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="glass p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold gradient-text mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-300 mb-6">
              Let's discuss your project and see how we can bring your vision to life with this proven process.
            </p>
            <button className="btn-primary px-8 py-3">
              Let's Get Started
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Process;